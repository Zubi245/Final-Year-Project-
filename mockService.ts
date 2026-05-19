import { INITIAL_SPOTS, HOTELS as INITIAL_HOTELS, CARS as INITIAL_CARS } from './data';
import { Spot, Hotel, Car, Post, RecommendationRequest, User } from './types';

// Latency simulator
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// --- Local Storage Keys ---
const KEYS = {
  SPOTS: 'tw_spots',
  HOTELS: 'tw_hotels',
  CARS: 'tw_cars',
  POSTS: 'tw_posts',
  USER: 'tw_user_session', // Current logged in user
  USERS_DB: 'tw_users_db', // Simulating a database of users
};

// --- Initialization ---
export const initializeData = () => {
  if (typeof window === 'undefined') return;
  if (!localStorage.getItem(KEYS.SPOTS)) {
    localStorage.setItem(KEYS.SPOTS, JSON.stringify(INITIAL_SPOTS));
  }
  if (!localStorage.getItem(KEYS.HOTELS)) {
    localStorage.setItem(KEYS.HOTELS, JSON.stringify(INITIAL_HOTELS));
  }
  if (!localStorage.getItem(KEYS.CARS)) {
    localStorage.setItem(KEYS.CARS, JSON.stringify(INITIAL_CARS));
  }
  if (!localStorage.getItem(KEYS.POSTS)) {
    const seedPosts: Post[] = [
      { id: '1', userId: 'u1', userName: 'Ali Khan', content: 'Just visited Hunza! The apricots are amazing.', likes: 12, timestamp: Date.now() - 100000, locationTag: 'Hunza Valley' },
      { id: '2', userId: 'u2', userName: 'Sara Ahmed', content: 'Gwadar sunset is unbeatable.', likes: 45, timestamp: Date.now() - 5000000, locationTag: 'Gwadar Port' },
    ];
    localStorage.setItem(KEYS.POSTS, JSON.stringify(seedPosts));
  }
  // Default Admin User
  if (!localStorage.getItem(KEYS.USERS_DB)) {
    const adminUser: User = { id: 'admin1', name: 'Admin User', email: 'admin@tripwise.pk', role: 'admin' };
    localStorage.setItem(KEYS.USERS_DB, JSON.stringify([adminUser]));
  }
};

// --- Auth Services ---
export const login = async (email: string, isAdminAttempt: boolean): Promise<User> => {
  await delay(800);
  const users = JSON.parse(localStorage.getItem(KEYS.USERS_DB) || '[]');
  
  // Mock Logic: If admin attempt, check against specific email, else allow any email for user
  if (isAdminAttempt) {
    const admin = users.find((u: User) => u.email === email && u.role === 'admin');
    if (admin) {
      localStorage.setItem(KEYS.USER, JSON.stringify(admin));
      return admin;
    }
    throw new Error('Invalid Admin credentials (Try: admin@tripwise.pk)');
  }

  // Regular user login (Mock: create if not exists or just login)
  let user = users.find((u: User) => u.email === email && u.role === 'user');
  if (!user) {
    user = { id: Math.random().toString(36), name: email.split('@')[0], email, role: 'user' };
    users.push(user);
    localStorage.setItem(KEYS.USERS_DB, JSON.stringify(users));
  }
  localStorage.setItem(KEYS.USER, JSON.stringify(user));
  return user;
};

export const signup = async (name: string, email: string): Promise<User> => {
  await delay(800);
  const users = JSON.parse(localStorage.getItem(KEYS.USERS_DB) || '[]');
  if (users.find((u: User) => u.email === email)) throw new Error('User already exists');
  
  const newUser: User = { id: Math.random().toString(36), name, email, role: 'user' };
  users.push(newUser);
  localStorage.setItem(KEYS.USERS_DB, JSON.stringify(users));
  localStorage.setItem(KEYS.USER, JSON.stringify(newUser));
  return newUser;
};

export const logout = async () => {
  await delay(200);
  localStorage.removeItem(KEYS.USER);
};

export const getCurrentUser = (): User | null => {
  const u = localStorage.getItem(KEYS.USER);
  return u ? JSON.parse(u) : null;
};

// --- Data Access ---
export const getSpots = async (): Promise<Spot[]> => {
  await delay(500);
  return JSON.parse(localStorage.getItem(KEYS.SPOTS) || '[]');
};

export const getHotels = async (): Promise<Hotel[]> => {
  await delay(600);
  return JSON.parse(localStorage.getItem(KEYS.HOTELS) || '[]');
};

export const updateHotel = async (updatedHotel: Hotel): Promise<void> => {
  await delay(500);
  const hotels = JSON.parse(localStorage.getItem(KEYS.HOTELS) || '[]') as Hotel[];
  const index = hotels.findIndex(h => h.id === updatedHotel.id);
  if (index !== -1) {
    hotels[index] = updatedHotel;
    localStorage.setItem(KEYS.HOTELS, JSON.stringify(hotels));
  }
};

export const getCars = async (): Promise<Car[]> => {
  await delay(600);
  return JSON.parse(localStorage.getItem(KEYS.CARS) || '[]');
};

export const updateCar = async (updatedCar: Car): Promise<void> => {
  await delay(500);
  const cars = JSON.parse(localStorage.getItem(KEYS.CARS) || '[]') as Car[];
  const index = cars.findIndex(c => c.id === updatedCar.id);
  if (index !== -1) {
    cars[index] = updatedCar;
    localStorage.setItem(KEYS.CARS, JSON.stringify(cars));
  }
};

// --- AI Mock Services ---
export const getAIRecommendations = async (req: RecommendationRequest): Promise<Spot[]> => {
  await delay(1500); 
  const allSpots = JSON.parse(localStorage.getItem(KEYS.SPOTS) || '[]') as Spot[];
  
  let candidates = req.region ? allSpots.filter(s => s.region === req.region) : allSpots;
  const scored = candidates.map(spot => {
    let score = 0;
    req.interests.forEach(interest => {
      if (spot.tags.includes(interest.toLowerCase())) score += 5;
      if (spot.description.toLowerCase().includes(interest.toLowerCase())) score += 2;
    });
    return { ...spot, score: score + Math.random() * 2 };
  });

  return scored.sort((a, b) => b.score - a.score).slice(0, 5);
};

export const askAIChat = async (query: string): Promise<string> => {
  await delay(1200);
  const lowerQ = query.toLowerCase();
  
  if (lowerQ.includes('price') || lowerQ.includes('cost')) return "Prices vary by season. Hotels range from PKR 5,000 to 45,000. Car rentals start at PKR 4,000/day. Check the 'Hotels' or 'Transport' tab for current rates.";
  if (lowerQ.includes('weather') || lowerQ.includes('best time')) return "For Northern Areas, May to September is best. For Sindh/Punjab, October to March is ideal.";
  if (lowerQ.includes('food')) return "Don't miss Chapli Kabab in Peshawar, Biryani in Karachi, and Yak meat in Hunza!";
  
  const allSpots = JSON.parse(localStorage.getItem(KEYS.SPOTS) || '[]') as Spot[];
  const found = allSpots.find(s => lowerQ.includes(s.name.toLowerCase()));
  if (found) return `${found.name} is a great choice! It's known for ${found.tags.join(', ')}. ${found.description}`;

  return "I recommend exploring the 'Explore' tab for specific spots. Pakistan has amazing mountains, deserts, and beaches!";
};

export const getCommunityPosts = async (): Promise<Post[]> => {
  await delay(400);
  return JSON.parse(localStorage.getItem(KEYS.POSTS) || '[]');
};

export const createPost = async (post: Omit<Post, 'id' | 'likes' | 'timestamp'>): Promise<void> => {
  await delay(800);
  const posts = await getCommunityPosts();
  const newPost: Post = {
    ...post,
    id: Math.random().toString(36).substr(2, 9),
    likes: 0,
    timestamp: Date.now(),
  };
  localStorage.setItem(KEYS.POSTS, JSON.stringify([newPost, ...posts]));
};
