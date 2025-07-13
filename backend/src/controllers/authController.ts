import { Request, Response } from 'express';
import { body } from 'express-validator';
import * as UserModel from '../models/FirebaseUser';
import { hashPassword, comparePassword } from '../utils/password';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/token';

/**
 * Validation rules for registration
 */
export const registerValidation = [
  body('email').isEmail().withMessage('Please enter a valid email address'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/[a-zA-Z]/)
    .withMessage('Password must contain at least one letter')
    .matches(/[0-9]/)
    .withMessage('Password must contain at least one number'),
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required')
];

/**
 * Validation rules for login
 */
export const loginValidation = [
  body('email').isEmail().withMessage('Please enter a valid email address'),
  body('password').notEmpty().withMessage('Password is required')
];

/**
 * Register a new user
 */
export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    // Check if user already exists
    const existingUser = await UserModel.findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        status: 'error',
        message: 'User with this email already exists'
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await UserModel.createUser({
      email,
      password: hashedPassword,
      firstName,
      lastName
      // isActive and twoFactorEnabled are set as defaults in the model
    });

    // Generate tokens
    const accessToken = generateAccessToken({ userId: user.id, email: user.email });
    const refreshToken = generateRefreshToken({ userId: user.id, email: user.email });

    // Store refresh token with user
    UserModel.storeRefreshToken(user.id, refreshToken);

    // Return user data and tokens
    res.status(201).json({
      status: 'success',
      message: 'User registered successfully',
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          createdAt: user.createdAt
        },
        tokens: {
          accessToken,
          refreshToken
        }
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred during registration'
    });
  }
};

/**
 * Login user
 */
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await UserModel.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        status: 'error',
        message: 'Account is disabled. Please contact support.'
      });
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password'
      });
    }

    // Generate tokens
    const accessToken = generateAccessToken({ userId: user.id, email: user.email });
    const refreshToken = generateRefreshToken({ userId: user.id, email: user.email });

    // Store refresh token with user
    UserModel.storeRefreshToken(user.id, refreshToken);

    // Last login timestamp is already updated in validateCredentials method

    // Return user data and tokens
    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName
        },
        tokens: {
          accessToken,
          refreshToken
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred during login'
    });
  }
};

/**
 * Refresh access token using refresh token
 */
export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    // Verify refresh token
    if (!refreshToken) {
      return res.status(400).json({
        status: 'error',
        message: 'Refresh token is required'
      });
    }

    // Find user with this refresh token
    const user = await UserModel.getUserByRefreshToken(refreshToken);
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid refresh token'
      });
    }

    // Verify the token is valid
    const decodedToken = verifyRefreshToken(refreshToken);
    if (!decodedToken) {
      return res.status(401).json({
        status: 'error',
        message: 'Refresh token expired or invalid'
      });
    }

    // Generate new access token
    const newAccessToken = generateAccessToken({ userId: user.userId, email: user.email });

    // Return new access token
    res.status(200).json({
      status: 'success',
      message: 'Token refreshed successfully',
      data: {
        accessToken: newAccessToken
      }
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({
      status: 'error',
      message: 'An error occurred while refreshing token'
    });
  }
};
