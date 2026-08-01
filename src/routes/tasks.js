import { Router } from 'express';
import { db } from '../database.js';
import {
  authenticateToken,
  requireRole
} from "../middleware/auth.js";

export const tasksRouter = Router();

tasksRouter.get(
    "/",
    authenticateToken,
    requireRole("student", "instructor"),
    (req, res) => {
      res.json({
        userId: req.user.sub,
        tasks: []
      });
    }
);

tasksRouter.get('/:id',
    authenticateToken,
    requireRole("student", "instructor"),
    async (req, res, next) => {

      try {
        const taskId = req.params.id;
        const userId = req.user.sub;
        const role = req.user.role;

        const result = await db.query(
          `SELECT  id, 
            title, 
            course, 
            student_id AS "studentId",
            completed
          FROM tasks
          WHERE id = ?`,
          [taskId]
        );
        const task = result.rows[0];
        console.log(task);

        if (!task) {
          return res.status(404).json({ error: "Task not found" });
        }
        if (role === "student" && task.studentId !== userId) {
          return res.status(403).json({
            error: "Forbidden",
            message: "You do not have permission to access this task."
          })
        }
        task.completed = Boolean(task.completed);

        return res.status(200).json(task);
      } catch (error) {
        return next(error);
      }
});

tasksRouter.delete(
    "/:id",
    authenticateToken,
    requireRole("instructor"),
    async (req, res, next) => {
      try {
        const result = await db.run(
            "DELETE FROM tasks WHERE id = ?",
            [req.params.id]
        );

        if (result.changes === 0) {
          return res.status(404).json({ error: "Not Found" });
        }

        return res.status(204).end();
      } catch (error) {
        return next(error);
      }
    }
);
