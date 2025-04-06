import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  _id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const url = import.meta.env.VITE_BACKEND_URL;

  const checkAuth = async () => {
    try {
      console.log('Checking authentication status...');
      const token = localStorage.getItem('token');
      const userDataString = localStorage.getItem('user');

      console.log('Stored token:', token);
      console.log('Stored user data:', userDataString);

      if (token && userDataString && userDataString !== "undefined") {
        const userData: User = JSON.parse(userDataString);
        console.log('Valid user data found:', userData);
        setUser(userData);
        return true;
      } else {
        console.log('No valid authentication data found');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return false;
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      console.log('Attempting sign in for:', email);

      const response = await fetch(`${url}/api/v1/auth/sign-in`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log('Sign in response:', data);

      if (!response.ok) throw new Error(data.message || 'Sign in failed');

      if (!data.token) {
        throw new Error('No token received from server');
      }

      console.log('Setting authentication data...');
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      setUser(data.user);
      console.log('Authentication successful, navigating to app...');
      
      await Promise.resolve();
      navigate('/app', { replace: true });
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${url}/api/v1/auth/sign-up`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Sign up failed');

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      await Promise.resolve(); 
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      await fetch(`${url}/api/v1/auth/sign-out`, { method: 'POST' });
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      setIsLoading(false);
      navigate('/', { replace: true });
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};