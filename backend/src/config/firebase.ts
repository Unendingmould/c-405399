import * as admin from 'firebase-admin';
import config from './index';
import path from 'path';

/**
 * Initialize Firebase Admin SDK
 * For local development, we use a service account key file
 * In production, we rely on environment variables or Google Cloud credentials
 */
const initializeFirebase = () => {
  // Check if Firebase is already initialized
  if (admin.apps.length === 0) {
    try {
      // Initialize the app
      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        // Optional: specify database URL if using Realtime Database
        databaseURL: config.firebase.databaseURL,
      });
      
      console.log('✅ Firebase Admin SDK initialized successfully');
    } catch (error) {
      console.error('❌ Error initializing Firebase Admin SDK:', error);
      throw error;
    }
  }
  
  return admin;
};

// Initialize and export Firebase instances
const firebase = initializeFirebase();
export const db = firebase.firestore();
export const auth = firebase.auth();
export const storage = firebase.storage();

export default firebase;
