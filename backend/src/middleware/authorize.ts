import { Request, Response, NextFunction } from 'express';

/**
 * Middleware for role-based access control
 * @param requiredRole - Role required to access the resource
 */
export const checkRole = (requiredRole: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required'
      });
    }

    if (req.user.role !== requiredRole) {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied. Insufficient permissions'
      });
    }

    next();
  };
};
