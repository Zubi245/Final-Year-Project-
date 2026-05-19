import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const AUTH_V2_URL = `${API_URL}/auth`;

// Axios instance with credentials
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${AUTH_V2_URL}/refresh-token`, {
            refreshToken
          });
          
          const { accessToken } = response.data;
          localStorage.setItem('accessToken', accessToken);
          
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, logout user
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/#/auth';
      }
    }
    
    return Promise.reject(error);
  }
);

export interface SignupData {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    fullName: string;
    email: string;
    phoneNumber?: string;
    role: 'user' | 'admin';
    emailVerified: boolean;
    phoneVerified: boolean;
    authProvider: 'local' | 'google';
    profilePicture?: string;
    isBlocked: boolean;
  };
  requiresProfileCompletion?: boolean;
}

// Local Signup
export const signup = async (data: SignupData): Promise<AuthResponse> => {
  const response = await axios.post(`${AUTH_V2_URL}/signup`, data);
  
  if (response.data.accessToken) {
    localStorage.setItem('accessToken', response.data.accessToken);
    localStorage.setItem('refreshToken', response.data.refreshToken);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  
  return response.data;
};

// Local Login
export const login = async (data: LoginData): Promise<AuthResponse> => {
  const response = await axios.post(`${AUTH_V2_URL}/login`, data);
  
  if (response.data.accessToken) {
    localStorage.setItem('accessToken', response.data.accessToken);
    localStorage.setItem('refreshToken', response.data.refreshToken);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  
  return response.data;
};

// Google OAuth
export const googleAuth = async (token: string): Promise<AuthResponse> => {
  const response = await axios.post(`${AUTH_V2_URL}/google`, { token });
  
  if (response.data.accessToken) {
    localStorage.setItem('accessToken', response.data.accessToken);
    localStorage.setItem('refreshToken', response.data.refreshToken);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  
  return response.data;
};

// Verify Email
export const verifyEmail = async (token: string): Promise<{ success: boolean; message: string }> => {
  const response = await axios.get(`${AUTH_V2_URL}/verify-email?token=${token}`);
  return response.data;
};

// Resend Verification Email
export const resendVerification = async (): Promise<{ success: boolean; message: string }> => {
  const response = await api.post(`${AUTH_V2_URL}/resend-verification`);
  return response.data;
};

// Forgot Password
export const forgotPassword = async (email: string): Promise<{ success: boolean; message: string }> => {
  const response = await axios.post(`${AUTH_V2_URL}/forgot-password`, { email });
  return response.data;
};

// Reset Password
export const resetPassword = async (token: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
  const response = await axios.post(`${AUTH_V2_URL}/reset-password`, {
    token,
    newPassword
  });
  return response.data;
};

// Logout
export const logout = async (): Promise<void> => {
  try {
    await api.post(`${AUTH_V2_URL}/logout`);
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }
};

// Complete Profile (for Google users)
export const completeProfile = async (phoneNumber: string): Promise<AuthResponse> => {
  const response = await api.post(`${AUTH_V2_URL}/complete-profile`, { phoneNumber });
  
  if (response.data.user) {
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  
  return response.data;
};

// Get Current User
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('accessToken');
};

// Check if user is admin
export const isAdmin = (): boolean => {
  const user = getCurrentUser();
  return user?.role === 'admin';
};
