// Firebase Configuration and Initialization
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const hasFirebaseKeys = firebaseConfig.apiKey && firebaseConfig.projectId;

let appInstance = null;
let authInstance = null;

if (hasFirebaseKeys) {
  try {
    appInstance = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    authInstance = getAuth(appInstance);
  } catch (error) {
    console.error('Failed to initialize Firebase app:', error);
  }
} else {
  console.log('No Firebase API Key found. Operating in local simulation mode.');
}

// Export Auth service or null if keys are missing
export const auth = authInstance;
