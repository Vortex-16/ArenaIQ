// Firebase Real Authentication Service
import { auth } from './firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut 
} from 'firebase/auth';

export const authService = {
  /**
   * Signs in a user via Firebase Auth.
   * Automatically attempts Sign Up if user does not exist.
   * @param {string} email 
   * @param {string} password 
   */
  signIn: async (email, password) => {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();
      const role = email.toLowerCase() === 'staff@fifa.com' ? 'staff' : 'fan';
      return {
        email: userCredential.user.email,
        role,
        token
      };
    } catch (error) {
      console.warn('Login error, attempting auto-registration:', error.code || error.message);
      
      // Handle missing user by registering them on the fly
      if (
        error.code === 'auth/user-not-found' || 
        error.code === 'auth/invalid-credential' || 
        error.message.includes('INVALID_LOGIN_CREDENTIALS')
      ) {
        try {
          return await authService.signUp(email, password);
        } catch (signupError) {
          throw new Error(signupError.message || 'Failed to authenticate credentials.');
        }
      }
      
      // Standardize common Firebase messages for UI
      if (error.code === 'auth/wrong-password') {
        throw new Error('Incorrect password. Please try again.');
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('Invalid email format.');
      } else if (error.code === 'auth/weak-password') {
        throw new Error('Password should be at least 6 characters.');
      }
      
      throw error;
    }
  },

  /**
   * Registers a new user via Firebase Auth
   */
  signUp: async (email, password) => {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const token = await userCredential.user.getIdToken();
    const role = email.toLowerCase() === 'staff@fifa.com' ? 'staff' : 'fan';
    
    return {
      email: userCredential.user.email,
      role,
      token
    };
  },

  /**
   * Signs out the user
   */
  signOut: async () => {
    await firebaseSignOut(auth);
  },

  /**
   * Returns current active user object from Firebase auth instance
   */
  getCurrentUser: async () => {
    const user = auth.currentUser;
    if (!user) return null;
    
    const token = await user.getIdToken();
    const role = user.email.toLowerCase() === 'staff@fifa.com' ? 'staff' : 'fan';
    
    return {
      email: user.email,
      role,
      token
    };
  }
};
