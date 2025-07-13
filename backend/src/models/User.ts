/**
 * User model
 * 
 * In a real application, this would connect to a database.
 * For now, we'll use an in-memory store for demonstration purposes.
 * This will be replaced with actual database models in Phase 1.3.
 */

export interface User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
  isActive: boolean;
  twoFactorEnabled: boolean;
  twoFactorSecret?: string;
  refreshToken?: string;
}

// In-memory store for users
const users: User[] = [];

/**
 * Find a user by email
 * @param email - Email to search for
 * @returns User or undefined if not found
 */
export const findByEmail = (email: string): User | undefined => {
  return users.find(user => user.email.toLowerCase() === email.toLowerCase());
};

/**
 * Find a user by ID
 * @param id - User ID to search for
 * @returns User or undefined if not found
 */
export const findById = (id: string): User | undefined => {
  return users.find(user => user.id === id);
};

/**
 * Create a new user
 * @param userData - User data to create
 * @returns Created user
 */
export const create = (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): User => {
  const newUser: User = {
    ...userData,
    id: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  users.push(newUser);
  return newUser;
};

/**
 * Update a user
 * @param id - ID of user to update
 * @param userData - Updated user data
 * @returns Updated user or undefined if not found
 */
export const update = (id: string, userData: Partial<User>): User | undefined => {
  const index = users.findIndex(user => user.id === id);
  if (index === -1) return undefined;
  
  users[index] = {
    ...users[index],
    ...userData,
    updatedAt: new Date(),
  };
  
  return users[index];
};

/**
 * Store refresh token for a user
 * @param userId - User ID
 * @param refreshToken - Refresh token to store
 * @returns Updated user or undefined if not found
 */
export const storeRefreshToken = (userId: string, refreshToken: string): User | undefined => {
  return update(userId, { refreshToken });
};

/**
 * Find user by refresh token
 * @param refreshToken - Refresh token to search for
 * @returns User or undefined if not found
 */
export const findByRefreshToken = (refreshToken: string): User | undefined => {
  return users.find(user => user.refreshToken === refreshToken);
};
