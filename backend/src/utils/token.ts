import jwt, { SignOptions } from 'jsonwebtoken';
import config from '../config';

/**
 * Utility functions for JWT token generation and verification
 */

export interface TokenPayload {
  userId: string;
  email: string;
}

/**
 * Generate an access token for a user
 * @param payload - User data to include in the token
 * @returns JWT access token
 */
export const generateAccessToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, String(config.jwt.secret), {
    expiresIn: config.jwt.expiresIn,
  } as SignOptions);
};

/**
 * Generate a refresh token for a user
 * @param payload - User data to include in the token
 * @returns JWT refresh token
 */
export const generateRefreshToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, String(config.jwt.refreshTokenSecret), {
    expiresIn: config.jwt.refreshTokenExpiresIn,
  } as SignOptions);
};

/**
 * Verify an access token
 * @param token - JWT token to verify
 * @returns Decoded token payload or null if invalid
 */
export const verifyAccessToken = (token: string): TokenPayload | null => {
  try {
    return jwt.verify(token, String(config.jwt.secret)) as TokenPayload;
  } catch (error) {
    return null;
  }
};

/**
 * Verify a refresh token
 * @param token - JWT refresh token to verify
 * @returns Decoded token payload or null if invalid
 */
export const verifyRefreshToken = (token: string): TokenPayload | null => {
  try {
    return jwt.verify(token, String(config.jwt.refreshTokenSecret)) as TokenPayload;
  } catch (error) {
    return null;
  }
};
