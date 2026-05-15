import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const ADMIN_URL = `${API_URL}/admin`;

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

export interface User {
  _id: string;
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

export interface UsersResponse {
  success: boolean;
  data: User[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface DashboardStats {
  success: boolean;
  stats: {
    totalUsers: number;
    totalAdmins: number;
    totalRegularUsers: number;
    verifiedUsers: number;
    blockedUsers: number;
    googleUsers: number;
    localUsers: number;
    recentUsers: number;
  };
}

// Get All Users
export const getAllUsers = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  authProvider?: string;
  emailVerified?: string;
}): Promise<UsersResponse> => {
  const response = await api.get(`${ADMIN_URL}/users`, { params });
  return response.data;
};

// Get User By ID
export const getUserById = async (id: string): Promise<User> => {
  const response = await api.get(`${ADMIN_URL}/users/${id}`);
  return response.data.data;
};

// Update User
export const updateUser = async (
  id: string,
  data: {
    fullName?: string;
    phoneNumber?: string;
    emailVerified?: boolean;
    phoneVerified?: boolean;
  }
): Promise<User> => {
  const response = await api.put(`${ADMIN_URL}/users/${id}`, data);
  return response.data.data;
};

// Block User
export const blockUser = async (id: string): Promise<{ success: boolean; message: string }> => {
  const response = await api.post(`${ADMIN_URL}/users/${id}/block`);
  return response.data;
};

// Unblock User
export const unblockUser = async (id: string): Promise<{ success: boolean; message: string }> => {
  const response = await api.post(`${ADMIN_URL}/users/${id}/unblock`);
  return response.data;
};

// Delete User
export const deleteUser = async (id: string): Promise<{ success: boolean; message: string }> => {
  const response = await api.delete(`${ADMIN_URL}/users/${id}`);
  return response.data;
};

// Change User Role
export const changeUserRole = async (
  id: string,
  role: 'user' | 'admin'
): Promise<User> => {
  const response = await api.patch(`${ADMIN_URL}/users/${id}/role`, { role });
  return response.data.data;
};

// Get Dashboard Stats
export const getDashboardStats = async (): Promise<DashboardStats> => {
  const response = await api.get(`${ADMIN_URL}/stats`);
  return response.data;
};
