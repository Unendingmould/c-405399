import express from 'express';
import { 
  getProfile, 
  updateProfile, 
  updatePassword,
  deleteAccount,
  profileUpdateValidation,
  passwordUpdateValidation
} from '../controllers/userController';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';

const router = express.Router();

/**
 * All routes in this file require authentication
 */
router.use(authenticate);

/**
 * @route   GET /api/users/profile
 * @desc    Get user profile
 * @access  Private
 */
router.get('/profile', getProfile);

/**
 * @route   PUT /api/users/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put('/profile', validate(profileUpdateValidation), updateProfile);

/**
 * @route   PUT /api/users/password
 * @desc    Update password
 * @access  Private
 */
router.put('/password', validate(passwordUpdateValidation), updatePassword);

/**
 * @route   DELETE /api/users/account
 * @desc    Delete user account (deactivate)
 * @access  Private
 */
router.delete('/account', deleteAccount);

export default router;
