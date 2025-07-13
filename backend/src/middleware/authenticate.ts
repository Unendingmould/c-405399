import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';

/**
 * Authentication middleware
 * Validates JWT token from Authorization header
 */
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required'
      });
    }
    
    // Check if format is correct (Bearer token)
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid token format'
      });
    }
    
    const token = parts[1];
    
    // Verify token
    const decoded = jwt.verify(token, config.auth.jwtSecret) as {
      userId: string;
      email: string;
      role: string;
    };
    
    // Attach user info to request
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role
    };
    
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid or expired token'
      });
    }
    
    next(error);
  }
};
