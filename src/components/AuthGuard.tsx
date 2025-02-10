import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('AuthGuard - Current user:', user);
    console.log('AuthGuard - Token exists:', !!token);
    
    if (!isLoading && !user && !token) {
      console.log('User is not authenticated, redirecting to sign-in');
      navigate('/sign-in', { replace: true });
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Only redirect if we're sure there's no user and we're not loading
  if (!isLoading && !user) {
    console.log('AuthGuard - Redirecting to sign-in');
    return <Navigate to="/sign-in" replace />;
  }

  return <>{children}</>;
};

export default AuthGuard;