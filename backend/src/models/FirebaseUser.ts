import { db } from '../config/firebase';
import { comparePassword, hashPassword } from '../utils/password';

const COLLECTION_NAME = 'users';
const usersCollection = db.collection(COLLECTION_NAME);

/**
 * User document type in Firestore
 */
export interface FirebaseUserData {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
  createdAt: any; // Firestore timestamp
  updatedAt: any; // Firestore timestamp
  lastLogin?: any; // Firestore timestamp
  isActive: boolean;
  twoFactorEnabled: boolean;
  twoFactorSecret?: string;
  refreshToken?: string;
}

/**
 * User data for creating a new user (without system fields)
 */
export interface CreateUserData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: string;
}

/**
 * User data for updating profile (subset of fields)
 */
export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  email?: string;
}

/**
 * Create a new user in Firestore
 * @param userData - User data for creating a new user
 * @returns Created user object (without password)
 */
export const createUser = async (userData: CreateUserData): Promise<Omit<FirebaseUserData, 'password'>> => {
  // Check if email already exists
  const existingUser = await findUserByEmail(userData.email);
  if (existingUser) {
    throw new Error('Email already in use');
  }

  // Hash the password before saving
  const hashedPassword = await hashPassword(userData.password);

  // Prepare user data with defaults
  const now = new Date();
  const newUser: FirebaseUserData = {
    id: '', // Will be replaced with document ID
    email: userData.email,
    password: hashedPassword,
    firstName: userData.firstName,
    lastName: userData.lastName,
    role: userData.role || 'user',
    createdAt: now,
    updatedAt: now,
    isActive: true,
    twoFactorEnabled: false,
  };

  try {
    // Add user to Firestore
    const docRef = await usersCollection.add(newUser);
    
    // Update the document with its ID
    const id = docRef.id;
    await docRef.update({ id });
    
    // Return user without password
    const { password, ...userWithoutPassword } = {
      ...newUser,
      id,
    };
    
    return userWithoutPassword;
  } catch (error) {
    console.error('Error creating user in Firestore:', error);
    throw new Error('Failed to create user');
  }
};

/**
 * Find a user by ID
 * @param id - User ID
 * @returns User object or null if not found
 */
export const findUserById = async (id: string): Promise<FirebaseUserData | null> => {
  try {
    const userDoc = await usersCollection.doc(id).get();
    
    if (!userDoc.exists) {
      return null;
    }
    
    return userDoc.data() as FirebaseUserData;
  } catch (error) {
    console.error('Error finding user by ID:', error);
    return null;
  }
};

/**
 * Find a user by email
 * @param email - User email
 * @returns User object or null if not found
 */
export const findUserByEmail = async (email: string): Promise<FirebaseUserData | null> => {
  try {
    const snapshot = await usersCollection.where('email', '==', email).limit(1).get();
    
    if (snapshot.empty) {
      return null;
    }
    
    return snapshot.docs[0].data() as FirebaseUserData;
  } catch (error) {
    console.error('Error finding user by email:', error);
    return null;
  }
};

/**
 * Update a user profile
 * @param id - User ID
 * @param profileData - Profile data to update
 * @returns Updated user object or null if not found
 */
export const updateUserProfile = async (
  id: string,
  profileData: UpdateProfileData
): Promise<Omit<FirebaseUserData, 'password'> | null> => {
  try {
    const userRef = usersCollection.doc(id);
    const userDoc = await userRef.get();
    
    if (!userDoc.exists) {
      return null;
    }
    
    const updateData = {
      ...profileData,
      updatedAt: new Date(),
    };
    
    await userRef.update(updateData);
    
    // Get updated user data
    const updatedUserDoc = await userRef.get();
    const userData = updatedUserDoc.data() as FirebaseUserData;
    
    // Return without password
    const { password, ...userWithoutPassword } = userData;
    return userWithoutPassword;
  } catch (error) {
    console.error('Error updating user profile:', error);
    return null;
  }
};

/**
 * Update user password
 * @param id - User ID
 * @param newPassword - New password
 * @returns Success status
 */
export const updateUserPassword = async (id: string, newPassword: string): Promise<boolean> => {
  try {
    const userRef = usersCollection.doc(id);
    const userDoc = await userRef.get();
    
    if (!userDoc.exists) {
      return false;
    }
    
    // Hash the new password
    const hashedPassword = await hashPassword(newPassword);
    
    // Update the user document
    await userRef.update({
      password: hashedPassword,
      updatedAt: new Date(),
    });
    
    return true;
  } catch (error) {
    console.error('Error updating user password:', error);
    return false;
  }
};

/**
 * Store refresh token for a user
 * @param userId - User ID
 * @param refreshToken - Refresh token
 * @returns Success status
 */
export const storeRefreshToken = async (userId: string, refreshToken: string): Promise<boolean> => {
  try {
    const userRef = usersCollection.doc(userId);
    const userDoc = await userRef.get();
    
    if (!userDoc.exists) {
      return false;
    }
    
    await userRef.update({
      refreshToken,
      updatedAt: new Date(),
    });
    
    return true;
  } catch (error) {
    console.error('Error storing refresh token:', error);
    return false;
  }
};

/**
 * Validate login credentials
 * @param email - User email
 * @param password - User password
 * @returns User ID and role if valid, null if invalid
 */
export const validateCredentials = async (
  email: string,
  password: string
): Promise<{ userId: string; role: string } | null> => {
  try {
    const user = await findUserByEmail(email);
    
    if (!user || !user.isActive) {
      return null;
    }
    
    // Verify password
    const isPasswordValid = await comparePassword(password, user.password);
    
    if (!isPasswordValid) {
      return null;
    }
    
    // Update last login timestamp
    await usersCollection.doc(user.id).update({
      lastLogin: new Date(),
    });
    
    return {
      userId: user.id,
      role: user.role,
    };
  } catch (error) {
    console.error('Error validating credentials:', error);
    return null;
  }
};

/**
 * Delete a user account
 * @param id - User ID
 * @returns Success status
 */
export const deleteUserAccount = async (id: string): Promise<boolean> => {
  try {
    const userRef = usersCollection.doc(id);
    const userDoc = await userRef.get();
    
    if (!userDoc.exists) {
      return false;
    }
    
    // Delete the user document
    await userRef.delete();
    
    return true;
  } catch (error) {
    console.error('Error deleting user account:', error);
    return false;
  }
};

/**
 * Get user by refresh token
 * @param refreshToken - Refresh token
 * @returns User ID and email if token is valid
 */
export const getUserByRefreshToken = async (
  refreshToken: string
): Promise<{ userId: string; email: string } | null> => {
  try {
    const snapshot = await usersCollection
      .where('refreshToken', '==', refreshToken)
      .limit(1)
      .get();
    
    if (snapshot.empty) {
      return null;
    }
    
    const userData = snapshot.docs[0].data() as FirebaseUserData;
    
    return {
      userId: userData.id,
      email: userData.email,
    };
  } catch (error) {
    console.error('Error getting user by refresh token:', error);
    return null;
  }
};
