
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated } from '@/services/authService';
import { toast } from 'sonner';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { clearUser } from '@/store/slices/authSlice';

interface PrivateRouteProps {
  children: React.ReactNode;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const isAuth = isAuthenticated();
  
  useEffect(() => {
    // If not authenticated, clear user from Redux store
    if (!isAuth) {
      dispatch(clearUser());
    }
  }, [isAuth, dispatch]);
  
  if (!isAuth) {
    // Show toast notification only when redirecting from a protected route
    toast.error("Please login to access this page");
    
    // Redirect to login and save the location they were trying to access
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
