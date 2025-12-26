export type Region = 'Northern Areas' | 'Punjab' | 'Sindh' | 'Khyber Pakhtunkhwa' | 'Balochistan' | 'Azad Kashmir' | 'Gilgit-Baltistan';

export interface Spot {
  id: string;
  name: string;
  region: Region;
  description: string;
  imageUrl: string;
  tags: string[];
  rating: number;
  coordinates: { lat: number; lng: number };
  amenities: string[];
  reviews: number;
}

export interface Hotel {
  id: string;
  name: string;
  location: string;
  pricePerNight: number;
  rating: number;
  imageUrl: string;
  amenities: string[];
}

export interface Car {
  id: string;
  model: string;
  type: 'SUV' | 'Sedan' | '4x4' | 'Van';
  pricePerDay: number;
  imageUrl: string;
  features: string[];
}

export interface Post {
  id: string;
  userId: string;
  userName: string;
  content: string;
  image?: string; // base64
  likes: number;
  timestamp: number;
  locationTag?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatar?: string;
}

export interface RecommendationRequest {
  duration: number;
  budget: 'budget' | 'standard' | 'luxury';
  interests: string[];
  region?: Region;
}
