// Firebase Real Authentication Service with Local Fallback
import { auth } from './firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut 
} from 'firebase/auth';

// Helper to base64 encode for simulated tokens
const base64UrlEncode = (str) => {
  try {
    return btoa(JSON.stringify(str))
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
  } catch (e) {
    return '';
  }
};

// State flag to track if we fell back to simulation
let useLocalFallback = !auth;

export const authService = {
  /**
   * Check if we are running in simulated fallback mode
   */
  isFallbackActive: () => useLocalFallback,

  /**
   * Signs in a user. Fallback is activated if Firebase returns config errors.
   */
  signIn: async (email, password) => {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    // If fallback is already active, run simulated sign in
    if (useLocalFallback) {
      return authService.localSignIn(email, password);
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
      console.warn('Firebase auth attempt failed:', error.code || error.message);
      
      // Check if Firebase Auth email/pass sign-in is disabled/not configured in console
      if (
        error.code === 'auth/configuration-not-found' || 
        error.code === 'auth/operation-not-allowed' ||
        error.message.includes('CONFIGURATION_NOT_FOUND') ||
        error.message.includes('OPERATION_NOT_ALLOWED')
      ) {
        console.info('Switching to local JWT Authentication fallback (Firebase Console Auth not enabled).');
        useLocalFallback = true;
        return authService.localSignIn(email, password);
      }

      // Handle missing user by registering them on the fly (Real Firebase path)
      if (
        error.code === 'auth/user-not-found' || 
        error.code === 'auth/invalid-credential' || 
        error.message.includes('INVALID_LOGIN_CREDENTIALS')
      ) {
        try {
          return await authService.signUp(email, password);
        } catch (signupError) {
          if (
            signupError.code === 'auth/configuration-not-found' || 
            signupError.code === 'auth/operation-not-allowed'
          ) {
            useLocalFallback = true;
            return authService.localSignIn(email, password);
          }
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

    if (useLocalFallback) {
      return authService.localSignIn(email, password);
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();
      const role = email.toLowerCase() === 'staff@fifa.com' ? 'staff' : 'fan';
      
      return {
        email: userCredential.user.email,
        role,
        token
      };
    } catch (error) {
      if (
        error.code === 'auth/configuration-not-found' || 
        error.code === 'auth/operation-not-allowed'
      ) {
        useLocalFallback = true;
        return authService.localSignIn(email, password);
      }
      throw error;
    }
  },

  /**
   * Signs out the user
   */
  signOut: async () => {
    if (!useLocalFallback) {
      try {
        await firebaseSignOut(auth);
      } catch (e) {
        // Ignored
      }
    }
    sessionStorage.removeItem('arena_jwt_fallback');
  },

  /**
   * Helper: Performs simulated JWT sign in as fallback
   */
  localSignIn: async (email, password) => {
    // Generate simulated token
    const role = email.toLowerCase() === 'staff@fifa.com' ? 'staff' : 'fan';
    const header = { alg: 'HS256', typ: 'JWT' };
    const payload = {
      email: email.toLowerCase(),
      role,
      exp: Date.now() + 3600 * 1000
    };
    const signature = 'fallback_signature_' + Math.random().toString(36).substring(2);
    const token = `${base64UrlEncode(header)}.${base64UrlEncode(payload)}.${base64UrlEncode(signature)}`;
    
    sessionStorage.setItem('arena_jwt_fallback', JSON.stringify({ email: email.toLowerCase(), role, token }));
    return { email: email.toLowerCase(), role, token };
  },

  /**
   * Returns current active user object from Firebase auth instance or local fallback storage
   */
  getCurrentUser: async () => {
    if (useLocalFallback) {
      const saved = sessionStorage.getItem('arena_jwt_fallback');
      return saved ? JSON.parse(saved) : null;
    }

    const user = auth.currentUser;
    if (!user) {
      // Check fallback storage just in case
      const saved = sessionStorage.getItem('arena_jwt_fallback');
      if (saved) {
        useLocalFallback = true;
        return JSON.parse(saved);
      }
      return null;
    }
    
    const token = await user.getIdToken();
    const role = user.email.toLowerCase() === 'staff@fifa.com' ? 'staff' : 'fan';
    
    return {
      email: user.email,
      role,
      token
    };
  }
};
