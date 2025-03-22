
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthForm } from '@/components/auth/AuthForm';
import { PageContainer } from '@/components/layout/PageContainer';
import { Navbar } from '@/components/layout/Navbar';
import { useToast } from '@/hooks/use-toast';
import { setUser } from '@/store/slices/authSlice';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { login, isAuthenticated } from '@/services/authService';

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  
  // Check if the user is already logged in
  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleLogin = async (formData: any) => {
    setIsLoading(true);
    
    try {
      // Call the login API
      const userData = await login({
        email: formData.email,
        password: formData.password
      });
      
      // Save user in Redux state
      dispatch(setUser({
        id: userData.id,
        name: userData.name,
        email: userData.email
      }));
      
      toast({
        title: "Success!",
        description: "You are now logged in.",
        variant: "default",
      });
      
      // Redirect to the page they tried to access or dashboard
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from);
    } catch (error: any) {
      console.error('Login failed:', error);
      
      toast({
        title: "Login failed",
        description: error.response?.data?.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <PageContainer className="flex items-center justify-center pt-10 pb-20">
        <div className="w-full max-w-md">
          <AuthForm 
            type="login" 
            onSubmit={handleLogin}
            isLoading={isLoading}
          />
        </div>
      </PageContainer>
    </>
  );
};

export default Login;
