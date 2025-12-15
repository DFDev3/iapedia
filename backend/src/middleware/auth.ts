import type { Request, Response, NextFunction } from 'express';
import { extractTokenFromHeader, verifyToken } from '../utils/jwt.js';
import type { TokenPayload } from '../utils/jwt.js';

/**
 * Extended Express Request with authenticated user info
 */
export interface AuthRequest extends Request {
  user?: TokenPayload;
}

/**
 * Authentication middleware - verifies JWT token and attaches user to request
 */
export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction): void {
  try {
    const authHeader = req.headers.authorization;
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'No authentication token provided'
      });
      return;
    }

    const payload = verifyToken(token);
    if (!payload) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid or expired token'
      });
      return;
    }

    req.user = payload;
    next();
  } catch (error) {
    res.status(500).json({
      error: 'Authentication error',
      message: 'Failed to authenticate request'
    });
  }
}

/**
 * Optional authentication middleware - attaches user if valid token present, but doesn't require it
 */
export function optionalAuthMiddleware(req: AuthRequest, res: Response, next: NextFunction): void {
  try {
    const authHeader = req.headers.authorization;
    const token = extractTokenFromHeader(authHeader);

    if (token) {
      const payload = verifyToken(token);
      if (payload) {
        req.user = payload;
      }
    }

    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
}

/**
 * Admin-only middleware - requires authentication and ADMIN role
 */
export function adminMiddleware(req: AuthRequest, res: Response, next: NextFunction): void {
  try {
    if (!req.user) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required'
      });
      return;
    }

    if (req.user.role !== 'ADMIN') {
      res.status(403).json({
        error: 'Forbidden',
        message: 'Admin access required'
      });
      return;
    }

    next();
  } catch (error) {
    res.status(500).json({
      error: 'Authorization error',
      message: 'Failed to authorize request'
    });
  }
}
