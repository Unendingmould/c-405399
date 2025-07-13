import bcrypt from 'bcryptjs';

/**
 * Utility functions for password hashing and verification
 */

/**
 * Hash a plain text password
 * @param password - Plain text password to hash
 * @returns Hashed password
 */
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

/**
 * Compare a plain text password with a hashed password
 * @param plainPassword - Plain text password to check
 * @param hashedPassword - Stored hashed password to compare against
 * @returns Boolean indicating if passwords match
 */
export const comparePassword = async (
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(plainPassword, hashedPassword);
};
