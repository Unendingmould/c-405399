import { Request, Response } from 'express';
import { body } from 'express-validator';
import * as UserModel from '../models/FirebaseUser';
import { hashPassword, comparePassword } from '../utils/password';

/**
 * Validation rules for profile update
 */
export const profileUpdateValidation = [
  body('firstName').optional().trim().notEmpty().withMessage('First name cannot be empty'),
  body('lastName').optional().trim().notEmpty().withMessage('Last name cannot be empty'),
  body('email').optional().isEmail().withMessage('Please enter a valid email address')
];

/**
 * Validation rules for password update
 */
export const passwordUpdateValidation = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters long')
    .matches(/[a-zA-Z]/)
    .withMessage('New password must contain at least one letter')
    .matches(/[0-9]/)
    .withMessage('New password must contain at least one number'),
  body('confirmNewPassword')
    .notEmpty()
    .withMessage('Password confirmation is required')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Password confirmation does not match new password');
      }
      return true;
    })
];

/**
 * Get current user profile
 */
export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required'
      });
    }

    // Find user by ID
    const user = await UserModel.findUserById(userId);
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    // Return user profile data
    res.status(200).json({
      status: 'success',
      data: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
        twoFactorEnabled: user.twoFactorEnabled
      }
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while fetching user profile'
    });
  }
};

/**
 * Update user profile
 */
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required'
      });
    }

    const { firstName, lastName, email } = req.body;
    
    // Find user by ID
    let user = await UserModel.findUserById(userId);
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }
    
    // If email is being updated, check if it's already taken by another user
    if (email && email !== user.email) {
      const existingUser = await UserModel.findUserByEmail(email);
      if (existingUser && existingUser.id !== userId) {
        return res.status(409).json({
          status: 'error',
          message: 'Email is already in use by another account'
        });
      }
    }

    // Update user
    const updatedUser = await UserModel.updateUserProfile(userId, {
      firstName,
      lastName,
      email
    });

    if (!updatedUser) {
      return res.status(500).json({
        status: 'error',
        message: 'Failed to update user profile'
      });
    }

    // Return updated profile
    res.status(200).json({
      status: 'success',
      message: 'Profile updated successfully',
      data: {
        id: updatedUser.id,
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        updatedAt: updatedUser.updatedAt
      }
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while updating profile'
    });
  }
};

/**
 * Update user password
 */
export const updatePassword = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required'
      });
    }

    const { currentPassword, newPassword } = req.body;
    
    // Find user by ID
    const user = await UserModel.findUserById(userId);
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }
    
    // Verify current password
    const isPasswordValid = await comparePassword(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        status: 'error',
        message: 'Current password is incorrect'
      });
    }
    
    // Update password (already hashes inside the method)
    const success = await UserModel.updateUserPassword(userId, newPassword);
    if (!success) {
      return res.status(500).json({
        status: 'error',
        message: 'Failed to update password'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Password updated successfully'
    });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while updating password'
    });
  }
};

/**
 * Delete user account
 */
export const deleteAccount = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication required'
      });
    }

    // In a real application, you would either:
    // 1. Soft delete by setting a flag (isActive = false)
    // 2. Hard delete by removing from database
    
    // Delete the user account
    const success = await UserModel.deleteUserAccount(userId);
    
    if (!success) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Account deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while deleting account'
    });
  }
};
