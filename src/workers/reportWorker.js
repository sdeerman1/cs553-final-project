import { db } from '../database.js';
import { generateReport } from '../reportGenerator.js';
import { reportQueue } from '../reportQueue.js';

reportQueue.process(async (message) => {
  const { jobId, studentId } = message;
  try {
    await db.updateReportJob(jobId, {
      "status": "processing"
    });

    const report = await generateReport(studentId);
    
    await db.updateReportJob(jobId, {
      "status": "completed",
      "downloadUrl": report.downloadUrl
    });
  } catch (error) {
    await db.updateReportJob(jobId, {
      status: "failed"
    });
  }
});
