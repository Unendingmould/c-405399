import express from 'express';
import { register, login, refreshToken, registerValidation, loginValidation } from '../controllers/authController';
import { validate } from '../middleware/validate';

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', validate(registerValidation), register);

/**
 * @route   POST /api/auth/login
 * @desc    Login user and return tokens
 * @access  Public
 */
router.post('/login', validate(loginValidation), login);

/**
 * @route   POST /api/auth/refresh-token
 * @desc    Refresh access token using refresh token
 * @access  Public
 */
router.post('/refresh-token', refreshToken);

export default router;
