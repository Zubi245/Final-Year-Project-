const API_BASE_URL = 'http://localhost:5000';

// Mock API service for data initialization
export function initializeData() {
  // Initialize any required data on app startup
  if (!localStorage.getItem('appInitialized')) {
    localStorage.setItem('appInitialized', 'true');
    console.log('App data initialized');
  }
}

/**
 * Chat with TripWise AI
 * @param message - User's message
 * @returns AI response text
 */
export async function chatWithTripWise(message: string): Promise<string> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/ai/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.success || !data.reply) {
      throw new Error('Invalid response from AI service');
    }

    return data.reply;
  } catch (error) {
    console.error('TripWise AI Error:', error);
    throw error;
  }
}

// ─── Tourist Spots API ────────────────────────────────────────────────────────

/**
 * Get all tourist spots
 */
export async function getSpots() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/spots`);
    if (!response.ok) throw new Error('Failed to fetch spots');
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching spots:', error);
    return [];
  }
}

/**
 * Get single spot by ID
 */
export async function getSpot(id: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/spots/${id}`);
    if (!response.ok) throw new Error('Failed to fetch spot');
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching spot:', error);
    return null;
  }
}

// ─── Hotels API ───────────────────────────────────────────────────────────────

/**
 * Get all hotels
 */
export async function getHotels() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/hotels`);
    if (!response.ok) throw new Error('Failed to fetch hotels');
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching hotels:', error);
    return [];
  }
}

/**
 * Get single hotel by ID
 */
export async function getHotel(id: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/hotels/${id}`);
    if (!response.ok) throw new Error('Failed to fetch hotel');
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching hotel:', error);
    return null;
  }
}

// ─── Cars API ─────────────────────────────────────────────────────────────────

/**
 * Get all cars
 */
export async function getCars() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/cars`);
    if (!response.ok) throw new Error('Failed to fetch cars');
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching cars:', error);
    return [];
  }
}

/**
 * Get single car by ID
 */
export async function getCar(id: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/cars/${id}`);
    if (!response.ok) throw new Error('Failed to fetch car');
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching car:', error);
    return null;
  }
}
