
import axios from 'axios';
import { toast } from "sonner";

// Define the base API URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/auth';

// Apply interceptor to include the Authorization header for all requests
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for handling token expiration
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Check if the error is due to an expired or invalid token
      if (error.response.status === 401) {
        // If the token is expired, remove it and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Show toast notification
        toast.error("Session expired. Please login again.");
        
        // Only redirect if not already on login page
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      } else if (error.response.status === 403) {
        toast.error("You don't have permission to access this resource.");
      } else if (error.response.status === 500) {
        toast.error("Server error. Please try again later.");
      }
    } else if (error.request) {
      // The request was made but no response was received
      toast.error("Network error. Please check your connection.");
    }
    return Promise.reject(error);
  }
);

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface AuthResponse {
  id: string;
  name: string;
  email: string;
  token: string;
}

export const login = async (loginData: LoginRequest): Promise<AuthResponse> => {
  try {
    const response = await axios.post(`${API_URL}/signin`, loginData);
    
    if (response.data && response.data.token) {
      // Store JWT token in local storage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
      return response.data;
    } else {
      throw new Error('Invalid response from server');
    }
  } catch (error: any) {
    console.error('Login error:', error);
    const errorMessage = error.response?.data?.message || 'Failed to login. Please try again.';
    toast.error(errorMessage);
    throw error;
  }
};

export const signup = async (signupData: SignupRequest): Promise<AuthResponse> => {
  try {
    const response = await axios.post(`${API_URL}/signup`, signupData);
    return response.data;
  } catch (error: any) {
    console.error('Signup error:', error);
    const errorMessage = error.response?.data?.message || 'Failed to register. Please try again.';
    toast.error(errorMessage);
    throw error;
  }
};

export const logout = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  toast.success("Logged out successfully");
};

export const getCurrentUser = (): AuthResponse | null => {
  try {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
  } catch (error) {
    console.error('Error parsing user data:', error);
    // Clear invalid data
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }
  return null;
};

export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('token');
  const user = getCurrentUser();
  return !!token && !!user;
};

export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

export const refreshToken = async (): Promise<boolean> => {
  try {
    // Implement token refresh logic if your backend supports it
    // This is a placeholder for now
    return true;
  } catch (error) {
    console.error('Token refresh failed:', error);
    logout();
    return false;
  }
};

export const authHeader = (): { Authorization: string } | Record<string, never> => {
  const token = localStorage.getItem('token');
  
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  return {};
};
