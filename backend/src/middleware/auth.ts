import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, TokenPayload } from '../utils/token';

// Extend Express Request type to include user data
declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

/**
 * Authentication middleware to validate JWT token
 * Attaches the decoded user data to the request object if token is valid
 */
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required. No token provided.',
      });
    }

    // Extract token from header
    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decodedToken = verifyAccessToken(token);
    if (!decodedToken) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid or expired token.',
      });
    }

    // Attach user data to request
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(401).json({
      status: 'error',
      message: 'Authentication failed.',
    });
  }
};

/**
 * Authorization middleware to check user roles
 * Must be used after the authenticate middleware
 */
export const authorize = (roles: string[] = []) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // If no roles are required, proceed
    if (roles.length === 0) {
      return next();
    }

    // Check if user exists on request (set by authenticate middleware)
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required.',
      });
    }

    // In a real application, you'd check the user's role from the database or token
    // For now, we'll just implement a placeholder
    // This will be expanded in later phases when we have user roles
    
    // For demonstration, let's assume all authenticated users have 'user' role
    const userRole = 'user';
    
    if (roles.includes(userRole)) {
      next();
    } else {
      res.status(403).json({
        status: 'error',
        message: 'Insufficient permissions.',
      });
    }
  };
};
