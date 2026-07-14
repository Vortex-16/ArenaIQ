// Firebase Configuration and Initialization
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAMLvQOlITkUQNxhlzv61Mtxv4qYgZzsiE",
  authDomain: "arenaliq-stadium-83fc7.firebaseapp.com",
  projectId: "arenaliq-stadium-83fc7",
  storageBucket: "arenaliq-stadium-83fc7.firebasestorage.app",
  messagingSenderId: "884483732281",
  appId: "1:884483732281:web:5b37da585da2c2e12e6ee8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and export Auth service
export const auth = getAuth(app);
