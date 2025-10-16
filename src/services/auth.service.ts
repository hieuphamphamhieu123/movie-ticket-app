import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth, db } from './firebase.config';

// Types
export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  phone: string;
}

export interface LoginData {
  email: string;
  password: string;
}

const TOKEN_KEY = 'userToken';
const USER_KEY = 'userData';

// Helper functions
const saveToStorage = async (key: string, value: any) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error saving to storage:', error);
  }
};

const getFromStorage = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error('Error getting from storage:', error);
    return null;
  }
};

const removeFromStorage = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from storage:', error);
  }
};

// Auth Service
export const authService = {
  // Register new user
  register: async (data: RegisterData): Promise<{ user: User; token: string }> => {
    try {
      // Create Firebase user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      const firebaseUser = userCredential.user;

      // Create user document in Firestore
      const userData: User = {
        id: firebaseUser.uid,
        email: data.email,
        name: data.name,
        phone: data.phone,
      };

      await setDoc(doc(db, 'users', firebaseUser.uid), {
        ...userData,
        createdAt: new Date().toISOString(),
      });

      // Get token
      const token = await firebaseUser.getIdToken();

      // Save to AsyncStorage
      await saveToStorage(TOKEN_KEY, token);
      await saveToStorage(USER_KEY, userData);

      return { user: userData, token };
    } catch (error: any) {
      console.error('Register error:', error);
      throw new Error(error.message || 'Registration failed');
    }
  },

  // Login user
  login: async (data: LoginData): Promise<{ user: User; token: string }> => {
    try {
      // Sign in with Firebase
      const userCredential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      const firebaseUser = userCredential.user;

      // Get user data from Firestore
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      
      if (!userDoc.exists()) {
        throw new Error('User data not found');
      }

      const userData = userDoc.data() as User;

      // Get token
      const token = await firebaseUser.getIdToken();

      // Save to AsyncStorage
      await saveToStorage(TOKEN_KEY, token);
      await saveToStorage(USER_KEY, userData);

      return { user: userData, token };
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.message || 'Login failed');
    }
  },

  // Logout user
  logout: async (): Promise<void> => {
    try {
      await signOut(auth);
      await removeFromStorage(TOKEN_KEY);
      await removeFromStorage(USER_KEY);
    } catch (error: any) {
      console.error('Logout error:', error);
      throw new Error(error.message || 'Logout failed');
    }
  },

  // Get current user
  getCurrentUser: async (): Promise<User | null> => {
    try {
      const firebaseUser = auth.currentUser;
      
      if (!firebaseUser) {
        return null;
      }

      // Try to get from storage first
      const cachedUser = await getFromStorage(USER_KEY);
      if (cachedUser) {
        return cachedUser;
      }

      // If not in storage, fetch from Firestore
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data() as User;
        await saveToStorage(USER_KEY, userData);
        return userData;
      }

      return null;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  },

  // Token management
  saveToken: async (token: string): Promise<void> => {
    await saveToStorage(TOKEN_KEY, token);
  },

  getToken: async (): Promise<string | null> => {
    return await getFromStorage(TOKEN_KEY);
  },

  removeToken: async (): Promise<void> => {
    await removeFromStorage(TOKEN_KEY);
  },

  // Check if user is authenticated
  isAuthenticated: async (): Promise<boolean> => {
    const token = await getFromStorage(TOKEN_KEY);
    return !!token && !!auth.currentUser;
  },
};