import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const PROFILE_URL = `${API_URL}/profile`;

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

export interface UserProfile {
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
  createdAt: string;
  updatedAt: string;
}

// Get Profile
export const getProfile = async (): Promise<UserProfile> => {
  const response = await api.get(`${PROFILE_URL}`);
  return response.data.data;
};

// Update Profile
export const updateProfile = async (data: {
  fullName?: string;
  phoneNumber?: string;
}): Promise<UserProfile> => {
  const response = await api.put(`${PROFILE_URL}`, data);
  
  // Update local storage
  if (response.data.data) {
    localStorage.setItem('user', JSON.stringify(response.data.data));
  }
  
  return response.data.data;
};

// Update Profile Picture
export const updateProfilePicture = async (file: File): Promise<UserProfile> => {
  const formData = new FormData();
  formData.append('profilePicture', file);
  
  const response = await api.post(`${PROFILE_URL}/picture`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  
  // Update local storage
  if (response.data.data) {
    localStorage.setItem('user', JSON.stringify(response.data.data));
  }
  
  return response.data.data;
};

// Change Password (for local users)
export const changePassword = async (
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean; message: string }> => {
  const response = await api.post(`${PROFILE_URL}/change-password`, {
    currentPassword,
    newPassword
  });
  return response.data;
};

// Set Password (for Google users to add password)
export const setPassword = async (
  newPassword: string
): Promise<{ success: boolean; message: string }> => {
  const response = await api.post(`${PROFILE_URL}/set-password`, {
    newPassword
  });
  return response.data;
};
