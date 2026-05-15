import axios from 'axios';
import { Spot, Hotel, Car, Post, User, RecommendationRequest } from './types';

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor - attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth data and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

// ============================================
// Authentication Services
// ============================================

export const signup = async (name: string, email: string, password: string): Promise<User> => {
  const response = await api.post('/auth/signup', { name, email, password });
  const { token, user } = response.data;
  
  // Store token and user in localStorage
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
  
  return user;
};

export const login = async (email: string, password: string): Promise<User> => {
  const response = await api.post('/auth/login', { email, password });
  const { token, user } = response.data;
  
  // Store token and user in localStorage
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
  
  return user;
};

export const logout = async (): Promise<void> => {
  await api.post('/auth/logout');
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

export const initializeData = () => {
  // No-op for API service - data is on the server
};

// ============================================
// Spot Services
// ============================================

export const getSpots = async (): Promise<Spot[]> => {
  const response = await api.get('/spots');
  return response.data.data;
};

export const getSpot = async (id: string): Promise<Spot> => {
  const response = await api.get(`/spots/${id}`);
  return response.data.data;
};

export const searchSpots = async (params: {
  region?: string;
  tags?: string[];
  minRating?: number;
}): Promise<Spot[]> => {
  const queryParams = new URLSearchParams();
  if (params.region) queryParams.append('region', params.region);
  if (params.tags) queryParams.append('tags', params.tags.join(','));
  if (params.minRating) queryParams.append('minRating', params.minRating.toString());
  
  const response = await api.get(`/spots/search?${queryParams.toString()}`);
  return response.data.data;
};

// ============================================
// Hotel Services
// ============================================

export const getHotels = async (): Promise<Hotel[]> => {
  const response = await api.get('/hotels');
  return response.data.data;
};

export const getHotel = async (id: string): Promise<Hotel> => {
  const response = await api.get(`/hotels/${id}`);
  return response.data.data;
};

export const updateHotel = async (updatedHotel: Hotel): Promise<void> => {
  await api.put(`/hotels/${updatedHotel.id}`, updatedHotel);
};

export const searchHotels = async (params: {
  location?: string;
  minPrice?: number;
  maxPrice?: number;
}): Promise<Hotel[]> => {
  const queryParams = new URLSearchParams();
  if (params.location) queryParams.append('location', params.location);
  if (params.minPrice) queryParams.append('minPrice', params.minPrice.toString());
  if (params.maxPrice) queryParams.append('maxPrice', params.maxPrice.toString());
  
  const response = await api.get(`/hotels/search?${queryParams.toString()}`);
  return response.data.data;
};

// ============================================
// Car Services
// ============================================

export const getCars = async (): Promise<Car[]> => {
  const response = await api.get('/cars');
  return response.data.data;
};

export const getCar = async (id: string): Promise<Car> => {
  const response = await api.get(`/cars/${id}`);
  return response.data.data;
};

export const updateCar = async (updatedCar: Car): Promise<void> => {
  await api.put(`/cars/${updatedCar.id}`, updatedCar);
};

export const searchCars = async (params: {
  type?: string;
  minPrice?: number;
  maxPrice?: number;
}): Promise<Car[]> => {
  const queryParams = new URLSearchParams();
  if (params.type) queryParams.append('type', params.type);
  if (params.minPrice) queryParams.append('minPrice', params.minPrice.toString());
  if (params.maxPrice) queryParams.append('maxPrice', params.maxPrice.toString());
  
  const response = await api.get(`/cars/search?${queryParams.toString()}`);
  return response.data.data;
};

// ============================================
// Post Services (Community)
// ============================================

export const getCommunityPosts = async (): Promise<Post[]> => {
  const response = await api.get('/posts');
  return response.data.data;
};

export const createPost = async (post: Omit<Post, 'id' | 'likes' | 'timestamp'>): Promise<void> => {
  await api.post('/posts', {
    content: post.content,
    image: post.image,
    locationTag: post.locationTag
  });
};

export const likePost = async (postId: string): Promise<void> => {
  await api.put(`/posts/${postId}/like`);
};

export const deletePost = async (postId: string): Promise<void> => {
  await api.delete(`/posts/${postId}`);
};

// ============================================
// AI Services
// ============================================

export const getAIRecommendations = async (req: RecommendationRequest): Promise<Spot[]> => {
  const response = await api.post('/ai/recommendations', req);
  return response.data.data;
};

export const askAIChat = async (query: string): Promise<string> => {
  const response = await api.post('/ai/chat', { query });
  return response.data.response;
};

// ============================================
// Booking Services
// ============================================

export interface BookingData {
  spotId: string;
  spotName: string;
  packageType: string;
  guests: number;
  startDate: string;
  endDate: string;
  totalCost: number;
}

export interface Booking {
  id: string;
  userId: string;
  spotId: string;
  spotName: string;
  packageType: string;
  guests: number;
  startDate: string;
  endDate: string;
  totalCost: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}

export const getBookings = async (): Promise<Booking[]> => {
  const response = await api.get('/bookings');
  return response.data.data;
};

export const createBooking = async (data: BookingData): Promise<Booking> => {
  const response = await api.post('/bookings', data);
  return response.data.data;
};

export const cancelBooking = async (bookingId: string): Promise<Booking> => {
  const response = await api.patch(`/bookings/${bookingId}/cancel`);
  return response.data.data;
};

// ============================================
// Price Alert Services
// ============================================

export interface PriceAlertData {
  itemType: 'spot' | 'hotel' | 'car';
  itemId: string;
  itemName: string;
  targetPrice: number;
  email: string;
}

export interface PriceAlert {
  id: string;
  userId: string;
  itemType: 'spot' | 'hotel' | 'car';
  itemId: string;
  itemName: string;
  targetPrice: number;
  email: string;
  createdAt: string;
}

export const getPriceAlerts = async (): Promise<PriceAlert[]> => {
  const response = await api.get('/price-alerts');
  return response.data.data;
};

export const createPriceAlert = async (data: PriceAlertData): Promise<PriceAlert> => {
  const response = await api.post('/price-alerts', data);
  return response.data.data;
};

export const deletePriceAlert = async (alertId: string): Promise<void> => {
  await api.delete(`/price-alerts/${alertId}`);
};

export default api;

// ============================================
// Admin Image Upload Services
// ============================================

export const createSpotWithImage = async (formData: FormData): Promise<Spot> => {
  const response = await api.post('/spots', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data.data;
};

export const updateSpotWithImage = async (id: string, formData: FormData): Promise<Spot> => {
  const response = await api.put(`/spots/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data.data;
};

export const deleteSpot = async (id: string): Promise<void> => {
  await api.delete(`/spots/${id}`);
};

export const createHotelWithImage = async (formData: FormData): Promise<Hotel> => {
  const response = await api.post('/hotels', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data.data;
};

export const updateHotelWithImage = async (id: string, formData: FormData): Promise<Hotel> => {
  const response = await api.put(`/hotels/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data.data;
};

export const deleteHotel = async (id: string): Promise<void> => {
  await api.delete(`/hotels/${id}`);
};

export const createCarWithImage = async (formData: FormData): Promise<Car> => {
  const response = await api.post('/cars', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data.data;
};

export const updateCarWithImage = async (id: string, formData: FormData): Promise<Car> => {
  const response = await api.put(`/cars/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data.data;
};

export const deleteCar = async (id: string): Promise<void> => {
  await api.delete(`/cars/${id}`);
};
