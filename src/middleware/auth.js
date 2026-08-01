import jwt from 'jsonwebtoken';
import { config } from '../config.js';

// The imports above are supplied so students can use jwt and config.jwtSecret.
export function authenticateToken(req, res, next) {
  const jwtSecret = config.jwtSecret;
  if (!jwtSecret) {
    throw new Error("FATAL ERROR: JWT_SECRET is not defined in environment variables.");
  }
  
  const authorization = req.get("authorization");

  if (!authorization?.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "Unauthorized",
      message: "Send a Bearer token in the Authorization header."
    });
  }

  const token = authorization.slice("Bearer ".length);

  try {
    req.user = jwt.verify(token, jwtSecret);
    next();
  } catch {
    res.status(401).json({
      error: "Authentication required",
      message: "The access token is missing, invalid, or expired."
    });
  }
}

export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: "Forbidden",
        message: `This action requires one of these roles: ${allowedRoles.join(", ")}.`
      });
    }
    next();
  };
}

void jwt;
void config;
