// app/(root)/lib/auth/auth-context.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { router } from 'expo-router';
import { SecureStorageService } from '../storage/secure-store';

interface AuthState {
  isAuthenticated: boolean;
  userId: string | null;
  phoneNumber: string | null;
}

interface AuthContextType extends AuthState {
  signIn: (phoneNumber: string, pin: string) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
}

const secureStorage = new SecureStorageService();
const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_ID: 'user_id',
  CALL_SETTINGS: 'call_settings'
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    userId: null,
    phoneNumber: null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const userId = await secureStorage.load(STORAGE_KEYS.USER_ID);
      const phoneNumber = await secureStorage.load('phoneNumber');
      
      setState({
        isAuthenticated: !!userId,
        userId,
        phoneNumber
      });
      
      if (!userId) {
        router.replace('/(root)/sign-in');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      router.replace('/(root)/sign-in');
    } finally {
      setLoading(false);
    }
  }

  async function signIn(phoneNumber: string, pin: string) {
    setLoading(true);
    try {
      const mockUserId = 'user_' + Math.random().toString(36).substring(2, 11);
      
      await secureStorage.save(STORAGE_KEYS.USER_ID, mockUserId);
      await secureStorage.save('phoneNumber', phoneNumber);
      
      setState({
        isAuthenticated: true,
        userId: mockUserId,
        phoneNumber
      });
    } finally {
      setLoading(false);
    }
  }

  async function signOut() {
    setLoading(true);
    try {
      await secureStorage.remove(STORAGE_KEYS.USER_ID);
      await secureStorage.remove('phoneNumber');
      
      setState({
        isAuthenticated: false,
        userId: null,
        phoneNumber: null
      });
      
      router.replace('/(root)/sign-in');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthContext.Provider value={{ ...state, signIn, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}