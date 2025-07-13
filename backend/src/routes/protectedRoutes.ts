import express from 'express';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();

/**
 * @route   GET /api/protected/profile
 * @desc    Get user profile data
 * @access  Private
 */
router.get('/profile', authenticate, (req, res) => {
  // Since this is protected by the authenticate middleware,
  // we can access the user data from req.user
  res.status(200).json({
    status: 'success',
    message: 'Profile data retrieved successfully',
    data: {
      userId: req.user?.userId,
      email: req.user?.email,
      // In a real application, you would fetch additional profile data from the database
    }
  });
});

/**
 * @route   GET /api/protected/admin
 * @desc    Admin only route
 * @access  Private (Admin only)
 */
router.get('/admin', authenticate, authorize(['admin']), (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Admin route accessed successfully',
    data: {
      adminData: 'This is sensitive admin data',
    }
  });
});

export default router;
