# Design Document: Frontend UX Enhancements

## Overview

This design document specifies the technical architecture for implementing comprehensive UI/UX improvements to the Trip Wise Pakistan travel application. The enhancements focus on production-ready features including loading states, error handling, toast notifications, responsive design, and completing partially implemented features (booking flow, price alerts, offline maps, user profiles, and advanced filtering).

### Design Goals

1. **User Experience Excellence**: Provide immediate feedback for all user actions through loading states, toast notifications, and error messages
2. **Resilience**: Implement error boundaries and graceful error handling to prevent application crashes
3. **Mobile-First**: Ensure seamless experience across all device sizes with responsive design
4. **Performance**: Optimize image loading, implement code splitting, and minimize re-renders
5. **Type Safety**: Maintain strict TypeScript typing throughout all new components
6. **Accessibility**: Ensure WCAG AA compliance for all interactive elements
7. **Consistency**: Use Framer Motion for all animations with consistent timing and easing

### Technology Stack

- **Frontend Framework**: React 19.2 with TypeScript
- **Build Tool**: Vite
- **Mobile Deployment**: Capacitor for Android
- **Animation**: Framer Motion
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **State Management**: React hooks (useState, useContext, useReducer)
- **Data Layer**: mockService.ts with localStorage persistence


## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        App.tsx (Root)                        │
│                    + ErrorBoundary Wrapper                   │
│                    + ToastProvider Context                   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Layout Component                        │
│              (Sidebar Navigation + Main Area)                │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                         Page Routes                          │
│  Home │ Explore │ Checkout │ Payment │ Profile │ etc.       │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Shared Components                         │
│  LoadingSpinner │ SkeletonLoader │ LazyImage │ etc.         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      mockService.ts                          │
│              (Data Access + localStorage)                    │
└─────────────────────────────────────────────────────────────┘
```

### Component Hierarchy


**Core Infrastructure Components:**
- `ErrorBoundary`: Root-level error catcher
- `ToastProvider`: Context provider for toast notifications
- `LoadingProvider`: Optional context for global loading states

**Shared UI Components:**
- `LoadingSpinner`: Circular spinner for actions
- `SkeletonLoader`: Placeholder for list items
- `Toast`: Individual toast notification
- `ToastContainer`: Toast stack manager
- `LazyImage`: Image with lazy loading and fallback
- `FormField`: Reusable form input with validation
- `Modal`: Reusable modal dialog

**Feature Components:**
- `FilterPanel`: Advanced filtering UI for Explore page
- `BookingCard`: Display booking in user profile
- `PriceAlertCard`: Display price alert configuration
- `OfflineMap`: Static map with markers
- `PaymentForm`: Payment method selection and validation
- `BookingConfirmation`: Success page after payment

### State Management Strategy

**Local Component State (useState):**
- Form inputs and validation errors
- UI toggles (modals, dropdowns, filters)
- Loading states for individual components

**Context API:**
- `ToastContext`: Global toast notification queue
- `AuthContext`: Current user session (optional enhancement)

**URL State (React Router):**
- Filter selections (via query parameters)
- Booking flow data (via location.state)

**localStorage:**
- Bookings: `tw_bookings`
- Price Alerts: `tw_price_alerts`
- Filter Preferences: `tw_filter_prefs` (sessionStorage)
- User Profile: `tw_user_profile`


### Data Flow

**Loading State Flow:**
```
User Action → Set Loading State → API Call (mockService) 
→ Success: Update Data + Clear Loading → Display Content
→ Error: Clear Loading + Show Toast → Display Error State
```

**Booking Flow:**
```
Explore Page → Select Spot → Checkout Page (configure trip)
→ Payment Page (enter payment) → mockService.createBooking()
→ Store in localStorage → Success Toast → Confirmation Page
→ Navigate to Profile (view bookings)
```

**Filter Flow:**
```
User Adjusts Filters → Update Filter State → Save to sessionStorage
→ Filter Spots Array → Update Display → Show Result Count
```

**Toast Notification Flow:**
```
Action Trigger → useToast().show() → Add to Toast Queue
→ Render Toast with Animation → Auto-dismiss after 4s
→ Remove from Queue
```


## Components and Interfaces

### 1. Error Boundary Component

**Purpose**: Catch JavaScript errors in child components and display fallback UI

**Location**: `components/ErrorBoundary.tsx`

**Implementation Approach**:
- Class component (required for error boundaries in React)
- Catches errors via `componentDidCatch` lifecycle
- Logs errors to console for debugging
- Displays user-friendly error message with reload button
- Wraps entire App in App.tsx

**Props Interface**:
```typescript
interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode; // Optional custom fallback
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}
```

**Key Methods**:
- `static getDerivedStateFromError(error)`: Update state when error occurs
- `componentDidCatch(error, errorInfo)`: Log error details
- `handleReload()`: Reset error state and reload page


### 2. Toast Notification System

**Purpose**: Provide immediate feedback for user actions

**Location**: 
- `components/Toast.tsx` (individual toast)
- `components/ToastContainer.tsx` (toast manager)
- `contexts/ToastContext.tsx` (context provider)
- `hooks/useToast.ts` (custom hook)

**Toast Types**:
```typescript
type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number; // Default: 4000ms
}

interface ToastContextValue {
  toasts: Toast[];
  showToast: (type: ToastType, message: string, duration?: number) => void;
  removeToast: (id: string) => void;
}
```

**Implementation Details**:
- Context provider manages toast queue (max 5 visible)
- Auto-dismiss with configurable duration
- Manual dismiss via close button
- Stack vertically from top-right
- Framer Motion animations (slide in from right, fade out)
- Color coding: success (green), error (red), info (blue), warning (yellow)

**Usage Pattern**:
```typescript
const { showToast } = useToast();
showToast('success', 'Booking confirmed!');
showToast('error', 'Payment failed. Please try again.');
```


### 3. Loading State Components

**Purpose**: Provide visual feedback during data fetching

**Components**:

**LoadingSpinner** (`components/LoadingSpinner.tsx`):
```typescript
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'; // 16px, 24px, 48px
  color?: string; // Tailwind color class
  fullScreen?: boolean; // Center in viewport
}
```
- Circular spinner with rotation animation
- Used for form submissions and actions

**SkeletonLoader** (`components/SkeletonLoader.tsx`):
```typescript
interface SkeletonLoaderProps {
  type: 'card' | 'list' | 'text';
  count?: number; // Number of skeleton items
}
```
- Mimics content structure during loading
- Pulse animation for shimmer effect
- Card type: Image + text blocks (for spots, hotels, cars)
- List type: Horizontal bars (for booking history)
- Text type: Single line (for inline content)

**Implementation Strategy**:
- Show skeleton loaders immediately on page load
- Replace with actual content when data arrives
- Show spinner for user-initiated actions (button clicks)
- Disable interactive elements during loading


### 4. Lazy Image Component

**Purpose**: Optimize image loading performance

**Location**: `components/LazyImage.tsx`

**Props Interface**:
```typescript
interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string; // Default placeholder
  aspectRatio?: string; // e.g., "16/9", "4/3"
}
```

**Implementation Approach**:
- Use native `loading="lazy"` attribute
- Intersection Observer API for older browsers
- Show placeholder with matching aspect ratio during load
- Display fallback image on error
- Fade-in animation when image loads

**States**:
1. Loading: Show gray placeholder with pulse animation
2. Loaded: Display image with fade-in
3. Error: Show fallback placeholder image


### 5. Filter Panel Component

**Purpose**: Advanced filtering for Explore page

**Location**: `components/FilterPanel.tsx`

**Filter State Interface**:
```typescript
interface FilterState {
  regions: string[]; // Multi-select
  tags: string[]; // Multi-select
  minRating: number; // 0-5
  priceRange: [number, number]; // [min, max]
}

interface FilterPanelProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onClearAll: () => void;
  availableRegions: string[];
  availableTags: string[];
}
```

**UI Layout**:
- Collapsible sections for each filter category
- Checkboxes for regions and tags
- Slider for rating (0-5 stars)
- Dual-handle range slider for price
- "Clear All" button
- Result count display
- Mobile: Drawer/modal overlay
- Desktop: Sidebar panel

**Filter Logic**:
- Apply all filters simultaneously (AND logic)
- Tags use OR logic (match any selected tag)
- Real-time filtering as user adjusts controls
- Persist to sessionStorage on change


### 6. User Profile Page

**Purpose**: Display user information and booking history

**Location**: `pages/Profile.tsx`

**Data Structures**:
```typescript
interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string; // Base64 or URL
  role: 'user' | 'admin';
}

interface Booking {
  id: string;
  userId: string;
  spotId: string;
  spotName: string;
  spotImage: string;
  packageName: string;
  guests: number;
  startDate: string; // ISO date
  days: number;
  totalCost: number;
  status: 'upcoming' | 'completed' | 'cancelled';
  createdAt: number; // Timestamp
}
```

**Page Sections**:
1. **Profile Header**: Avatar, name, email, edit button
2. **Upcoming Bookings**: Cards for future trips
3. **Past Bookings**: Cards for completed trips
4. **Empty States**: Messages when no bookings exist

**Features**:
- Edit profile (name, avatar upload)
- View booking details (modal or separate page)
- Filter bookings by status
- Sort by date (newest first)
- Protected route (redirect to /auth if not logged in)


### 7. Payment Processing Enhancement

**Purpose**: Complete payment flow with validation and simulation

**Location**: `pages/Payment.tsx` (enhancement)

**Payment Method Types**:
```typescript
type PaymentMethod = 'credit_card' | 'debit_card' | 'jazzcash' | 'easypaisa';

interface PaymentFormData {
  method: PaymentMethod;
  // Card payments
  cardNumber?: string;
  cardHolder?: string;
  expiryDate?: string; // MM/YY
  cvv?: string;
  // Mobile wallet
  phoneNumber?: string;
  // Billing
  email: string;
  address: string;
  city: string;
  zipCode: string;
}
```

**Validation Rules**:
- Card number: 16 digits, Luhn algorithm validation
- Expiry: MM/YY format, future date
- CVV: 3 digits
- Phone: 11 digits for Pakistan (03XXXXXXXXX)
- Email: Standard email regex
- All fields required based on payment method

**Payment Simulation**:
- 2-second processing delay
- 90% success rate, 10% random failure
- Generate unique transaction ID on success
- Store booking in localStorage on success


### 8. Booking Confirmation Page

**Purpose**: Display success message and booking details

**Location**: `pages/BookingConfirmation.tsx`

**Props/State**:
```typescript
interface BookingConfirmationProps {
  bookingId: string; // From route params or location.state
}
```

**Page Elements**:
- Success icon with celebration animation
- "Booking Confirmed" heading
- Booking ID and timestamp
- Complete booking details (spot, package, dates, guests, cost)
- Action buttons:
  - "Download Receipt" (simulated)
  - "View My Bookings" (navigate to /profile)
  - "Book Another Trip" (navigate to /explore)

**Animation**:
- Confetti or success animation on mount
- Fade-in for content sections
- Bounce animation for action buttons


### 9. Price Alerts Enhancement

**Purpose**: Allow users to create and manage price alerts

**Location**: `pages/PriceAlerts.tsx` (enhancement)

**Data Structure**:
```typescript
interface PriceAlert {
  id: string;
  userId: string;
  itemType: 'spot' | 'hotel' | 'car';
  itemId: string;
  itemName: string;
  targetPrice: number;
  currentPrice: number;
  email: string;
  createdAt: number;
  active: boolean;
}
```

**Features**:
- Create alert form (item selection, target price, email)
- List of active alerts
- Delete alert functionality
- Email validation
- Success/error toasts for actions
- Empty state when no alerts exist

**mockService Extensions**:
```typescript
createPriceAlert(alert: Omit<PriceAlert, 'id' | 'createdAt'>): Promise<void>
getPriceAlerts(userId: string): Promise<PriceAlert[]>
deletePriceAlert(alertId: string): Promise<void>
```


### 10. Offline Map Integration

**Purpose**: Display tourist spots on static map without internet

**Location**: `pages/MapPage.tsx` (integration with existing OfflineMap component)

**Implementation**:
- Toggle between Google Maps (online) and OfflineMap (offline)
- OfflineMap displays all spots from localStorage
- Calculate marker positions from GPS coordinates
- Click marker to show spot info card
- "Offline Mode" badge indicator
- Static Pakistan map image as background

**Marker Interface**:
```typescript
interface MapMarker {
  id: string;
  name: string;
  lat: number;
  lng: number;
  region: string;
}
```

**Coordinate Mapping**:
- Convert GPS coordinates to pixel positions
- Pakistan bounds: lat (23.5°N - 37.5°N), lng (60.5°E - 77.5°E)
- Map image dimensions: 1200x1600px
- Formula: `x = (lng - minLng) / (maxLng - minLng) * width`


## Data Models

### TypeScript Type Definitions

**New Types** (add to `types.ts`):

```typescript
// Toast System
export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration: number;
}

// Booking System
export interface Booking {
  id: string;
  userId: string;
  spotId: string;
  spotName: string;
  spotImage: string;
  spotRegion: string;
  packageName: string;
  packageDays: number;
  guests: number;
  startDate: string; // ISO 8601
  totalCost: number;
  status: 'upcoming' | 'completed' | 'cancelled';
  transactionId: string;
  createdAt: number; // Unix timestamp
}

// Price Alert System
export interface PriceAlert {
  id: string;
  userId: string;
  itemType: 'spot' | 'hotel' | 'car';
  itemId: string;
  itemName: string;
  targetPrice: number;
  currentPrice: number;
  email: string;
  createdAt: number;
  active: boolean;
}

// Filter System
export interface FilterState {
  regions: string[];
  tags: string[];
  minRating: number;
  priceRange: [number, number];
}

// Payment System
export type PaymentMethod = 'credit_card' | 'debit_card' | 'jazzcash' | 'easypaisa';

export interface PaymentFormData {
  method: PaymentMethod;
  cardNumber?: string;
  cardHolder?: string;
  expiryDate?: string;
  cvv?: string;
  phoneNumber?: string;
  email: string;
  address: string;
  city: string;
  zipCode: string;
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  error?: string;
}

// User Profile Enhancement
export interface UserProfile extends User {
  avatar?: string; // Base64 or URL
  phoneNumber?: string;
  address?: string;
  city?: string;
}
```


### localStorage Schema

**Storage Keys**:
```typescript
const STORAGE_KEYS = {
  BOOKINGS: 'tw_bookings',
  PRICE_ALERTS: 'tw_price_alerts',
  USER_PROFILE: 'tw_user_profile',
  FILTER_PREFS: 'tw_filter_prefs', // sessionStorage
} as const;
```

**Data Structures**:

**Bookings** (`tw_bookings`):
```json
[
  {
    "id": "bk_1234567890",
    "userId": "u1",
    "spotId": "1",
    "spotName": "Hunza Valley",
    "spotImage": "https://...",
    "spotRegion": "Gilgit-Baltistan",
    "packageName": "Standard Explorer",
    "packageDays": 5,
    "guests": 2,
    "startDate": "2024-06-15",
    "totalCost": 80000,
    "status": "upcoming",
    "transactionId": "txn_abc123",
    "createdAt": 1704067200000
  }
]
```

**Price Alerts** (`tw_price_alerts`):
```json
[
  {
    "id": "pa_1234567890",
    "userId": "u1",
    "itemType": "hotel",
    "itemId": "h4",
    "itemName": "Shangrila Resort",
    "targetPrice": 35000,
    "currentPrice": 40000,
    "email": "user@example.com",
    "createdAt": 1704067200000,
    "active": true
  }
]
```

**Filter Preferences** (`tw_filter_prefs` - sessionStorage):
```json
{
  "regions": ["Gilgit-Baltistan", "Khyber Pakhtunkhwa"],
  "tags": ["mountains", "trekking"],
  "minRating": 4.5,
  "priceRange": [10000, 50000]
}
```


### mockService Extensions

**New Functions** (add to `mockService.ts`):

```typescript
// Booking Management
export const createBooking = async (booking: Omit<Booking, 'id' | 'createdAt'>): Promise<Booking> => {
  await delay(800);
  const newBooking: Booking = {
    ...booking,
    id: `bk_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: Date.now(),
  };
  const bookings = JSON.parse(localStorage.getItem(KEYS.BOOKINGS) || '[]');
  bookings.unshift(newBooking);
  localStorage.setItem(KEYS.BOOKINGS, JSON.stringify(bookings));
  return newBooking;
};

export const getUserBookings = async (userId: string): Promise<Booking[]> => {
  await delay(600);
  const bookings = JSON.parse(localStorage.getItem(KEYS.BOOKINGS) || '[]');
  return bookings.filter((b: Booking) => b.userId === userId);
};

// Price Alert Management
export const createPriceAlert = async (alert: Omit<PriceAlert, 'id' | 'createdAt'>): Promise<void> => {
  await delay(500);
  const newAlert: PriceAlert = {
    ...alert,
    id: `pa_${Date.now()}`,
    createdAt: Date.now(),
  };
  const alerts = JSON.parse(localStorage.getItem(KEYS.PRICE_ALERTS) || '[]');
  alerts.push(newAlert);
  localStorage.setItem(KEYS.PRICE_ALERTS, JSON.stringify(alerts));
};

export const getPriceAlerts = async (userId: string): Promise<PriceAlert[]> => {
  await delay(400);
  const alerts = JSON.parse(localStorage.getItem(KEYS.PRICE_ALERTS) || '[]');
  return alerts.filter((a: PriceAlert) => a.userId === userId && a.active);
};

export const deletePriceAlert = async (alertId: string): Promise<void> => {
  await delay(300);
  const alerts = JSON.parse(localStorage.getItem(KEYS.PRICE_ALERTS) || '[]');
  const updated = alerts.filter((a: PriceAlert) => a.id !== alertId);
  localStorage.setItem(KEYS.PRICE_ALERTS, JSON.stringify(updated));
};

// Payment Processing
export const processPayment = async (paymentData: PaymentFormData, amount: number): Promise<PaymentResult> => {
  await delay(2000); // Simulate payment gateway
  const success = Math.random() > 0.1; // 90% success rate
  if (success) {
    return {
      success: true,
      transactionId: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
  } else {
    return {
      success: false,
      error: 'Payment declined. Please check your payment details and try again.',
    };
  }
};

// User Profile Management
export const updateUserProfile = async (userId: string, updates: Partial<UserProfile>): Promise<UserProfile> => {
  await delay(500);
  const users = JSON.parse(localStorage.getItem(KEYS.USERS_DB) || '[]');
  const userIndex = users.findIndex((u: User) => u.id === userId);
  if (userIndex === -1) throw new Error('User not found');
  
  users[userIndex] = { ...users[userIndex], ...updates };
  localStorage.setItem(KEYS.USERS_DB, JSON.stringify(users));
  localStorage.setItem(KEYS.USER, JSON.stringify(users[userIndex]));
  return users[userIndex];
};
```


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property Reflection

After analyzing all acceptance criteria, I identified the following redundancies and consolidations:

**Redundancy Analysis:**
1. Loading indicators (1.1, 1.2, 1.3) can be consolidated into a single property about appropriate loading indicators for context
2. Toast notifications for specific actions (3.2, 3.3) are examples, not separate properties from the general toast behavior
3. Multiple responsive layout properties (4.2, 4.3) can be consolidated into viewport-based layout adaptation
4. Filter properties (10.2-10.5) can be consolidated into a general filtering correctness property
5. Validation properties (13.1-13.7) share common validation behavior patterns
6. Payment validation properties (17.4-17.6) can be consolidated into form validation property

**Consolidated Properties:**
- Loading states → Single property about context-appropriate loading indicators
- Form validation → Single property about field validation with error display
- Filtering → Single property about filter application producing correct results
- Toast notifications → Properties about toast lifecycle, not specific triggers


### Property 1: Loading Indicator Display

*For any* data fetching operation in the application, a loading indicator SHALL be displayed while the operation is in progress, with the indicator type (skeleton loader for lists, spinner for actions) matching the operation context.

**Validates: Requirements 1.1, 1.2, 1.3**

### Property 2: Interactive Element Disabling During Load

*For any* loading state, all interactive elements that could trigger duplicate requests SHALL be disabled until the loading completes.

**Validates: Requirements 1.4**

### Property 3: Loading State Cleanup

*For any* data fetching operation that completes (successfully or with error), the loading indicator SHALL be removed and replaced with either content or an error message.

**Validates: Requirements 1.5**

### Property 4: Loading Timeout Handling

*For any* data fetching operation that exceeds 10 seconds, a timeout message with retry option SHALL be displayed.

**Validates: Requirements 1.6**

### Property 5: Error Boundary Catch

*For any* JavaScript error thrown in a child component, the Error Boundary SHALL catch the error and prevent application crash.

**Validates: Requirements 2.2, 2.6**

### Property 6: Error Boundary Display

*For any* error caught by the Error Boundary, a user-friendly error message SHALL be displayed to the user.

**Validates: Requirements 2.3**

### Property 7: Error Logging

*For any* error caught by the Error Boundary, error details SHALL be logged to the browser console.

**Validates: Requirements 2.5**


### Property 8: API Error Toast Display

*For any* API call that fails, an error toast notification SHALL be displayed with the error message.

**Validates: Requirements 3.4**

### Property 9: Toast Auto-Dismiss

*For any* toast notification displayed, it SHALL automatically dismiss after 4 seconds unless manually dismissed earlier.

**Validates: Requirements 3.5**

### Property 10: Toast Stacking

*For any* set of multiple toast notifications triggered, they SHALL be stacked vertically without overlapping.

**Validates: Requirements 3.7**

### Property 11: Responsive Layout Adaptation

*For any* viewport width, the application SHALL display layouts appropriate for that breakpoint (single-column for <640px, tablet layout for 640-1024px, desktop for >1024px).

**Validates: Requirements 4.2, 4.3**

### Property 12: Touch Target Minimum Size

*For any* interactive element (button, link, input), the touch target size SHALL be at least 44x44 pixels.

**Validates: Requirements 4.4**

### Property 13: Text Overflow Prevention

*For any* text content at any viewport width, horizontal scrolling SHALL not be required to read the text.

**Validates: Requirements 4.5**

### Property 14: Orientation Change Adaptation

*For any* device orientation change, the application layout SHALL adapt to the new orientation.

**Validates: Requirements 4.7**


### Property 15: Image Lazy Loading

*For any* image in a list view (spots, hotels, cars), the image SHALL have lazy loading enabled.

**Validates: Requirements 5.1**

### Property 16: Image Viewport Loading

*For any* lazy-loaded image, the image SHALL begin loading when it enters the viewport.

**Validates: Requirements 5.2**

### Property 17: Image Placeholder Display

*For any* image that is loading, a placeholder with matching aspect ratio SHALL be displayed until the image loads.

**Validates: Requirements 5.3**

### Property 18: Image Fallback Display

*For any* image that fails to load, a fallback placeholder image SHALL be displayed.

**Validates: Requirements 5.4**

### Property 19: Booking Flow Navigation

*For any* checkout completion, clicking "Proceed to Payment" SHALL navigate to the Payment page with all booking details preserved in navigation state.

**Validates: Requirements 6.1**

### Property 20: Payment Summary Display

*For any* payment page render, the booking summary SHALL display spot name, package, guests, dates, and total cost.

**Validates: Requirements 6.2**

### Property 21: Form Validation on Submit

*For any* form submission with missing or invalid required fields, field-specific error messages SHALL be displayed and submission SHALL be prevented.

**Validates: Requirements 6.4, 13.1, 17.4, 17.5, 17.6**


### Property 22: Email Validation

*For any* email input field, invalid email formats SHALL be rejected with validation error messages.

**Validates: Requirements 7.3, 13.2**

### Property 23: Date Validation for Bookings

*For any* trip booking date field, past dates SHALL be rejected with validation error messages.

**Validates: Requirements 13.3**

### Property 24: Numeric Field Validation

*For any* numeric input field, negative values SHALL be rejected with validation error messages.

**Validates: Requirements 13.4**

### Property 25: Validation Error Visual Feedback

*For any* field with validation errors, the field SHALL be highlighted with red borders.

**Validates: Requirements 13.5**

### Property 26: Validation Error Clearing

*For any* field that had validation errors, when the field becomes valid, error indicators SHALL be removed.

**Validates: Requirements 13.6**

### Property 27: Submit Button Disabling During Validation

*For any* form with validation in progress, the submit button SHALL be disabled.

**Validates: Requirements 13.7**

### Property 28: Booking Persistence

*For any* successful payment, a booking record SHALL be created and stored in localStorage.

**Validates: Requirements 6.6**


### Property 29: Booking Success Flow

*For any* booking successfully stored, a success toast notification SHALL be displayed and navigation to the confirmation page SHALL occur.

**Validates: Requirements 6.7**

### Property 30: Payment Failure Handling

*For any* payment that fails, an error toast notification with the failure reason SHALL be displayed.

**Validates: Requirements 6.8**

### Property 31: Price Alert Creation and Storage

*For any* price alert created, the alert SHALL be stored in localStorage with all configuration details.

**Validates: Requirements 7.2**

### Property 32: Price Alert Display

*For any* active price alert belonging to a user, the alert SHALL be displayed in the price alerts list with item name, target price, and email.

**Validates: Requirements 7.4, 7.5**

### Property 33: Price Alert Deletion

*For any* price alert deletion action, the alert SHALL be removed from localStorage and the list.

**Validates: Requirements 7.6**

### Property 34: Price Alert Action Feedback

*For any* price alert creation or deletion, a success toast notification SHALL be displayed.

**Validates: Requirements 7.7**

### Property 35: Offline Map Marker Display

*For any* tourist spot in localStorage, a marker SHALL be displayed on the offline map at the position calculated from its GPS coordinates.

**Validates: Requirements 8.2, 8.4**


### Property 36: Map Marker Interaction

*For any* map marker clicked, spot details SHALL be displayed in an info card.

**Validates: Requirements 8.3**

### Property 37: Offline Map Data Source

*For any* offline map render, all spot data SHALL be loaded from localStorage.

**Validates: Requirements 8.7**

### Property 38: Offline Map Functionality

*For any* offline map usage after initial data load, the map SHALL function without internet connectivity.

**Validates: Requirements 8.8**

### Property 39: User Profile Display

*For any* authenticated user viewing their profile, the profile SHALL display user name, email, and avatar.

**Validates: Requirements 9.2**

### Property 40: Booking History Display

*For any* user with bookings, the profile SHALL display all bookings from localStorage with booking date, destination, package, guests, and total cost.

**Validates: Requirements 9.3, 9.4**

### Property 41: Booking Categorization

*For any* booking displayed in the profile, it SHALL be categorized as "Upcoming" if the start date is in the future, or "Past" if the start date has passed.

**Validates: Requirements 9.5**

### Property 42: Booking Detail Interaction

*For any* booking in the profile, clicking it SHALL display the full booking details.

**Validates: Requirements 9.6**


### Property 43: Profile Authentication Protection

*For any* unauthenticated user attempting to access the profile page, the application SHALL redirect to the Auth page.

**Validates: Requirements 9.7**

### Property 44: Profile Edit Functionality

*For any* user profile, an edit option SHALL be available to modify name and avatar.

**Validates: Requirements 9.8**

### Property 45: Region Filter Application

*For any* region filter selection, only spots in the selected regions SHALL be displayed.

**Validates: Requirements 10.2**

### Property 46: Tag Filter Application

*For any* tag filter selection, only spots matching at least one selected tag SHALL be displayed.

**Validates: Requirements 10.3**

### Property 47: Rating Filter Application

*For any* minimum rating filter set, only spots with rating greater than or equal to the threshold SHALL be displayed.

**Validates: Requirements 10.4**

### Property 48: Price Range Filter Application

*For any* price range filter set, only spots within the price range SHALL be displayed.

**Validates: Requirements 10.5**

### Property 49: Multiple Filter Combination

*For any* combination of filters applied simultaneously, only spots matching all filter criteria SHALL be displayed.

**Validates: Requirements 10.6**


### Property 50: Real-Time Filter Updates

*For any* filter change, the displayed spots list SHALL update immediately without requiring a separate action.

**Validates: Requirements 10.7**

### Property 51: Filter Result Count Display

*For any* filter state, the count of filtered results SHALL be displayed and SHALL match the actual number of displayed spots.

**Validates: Requirements 10.8**

### Property 52: Empty Filter Results

*For any* filter combination that matches no spots, a "No results found" message SHALL be displayed.

**Validates: Requirements 10.10**

### Property 53: Animation Duration Consistency

*For any* micro-interaction animation in the application, the animation duration SHALL be between 200ms and 300ms.

**Validates: Requirements 12.4**

### Property 54: Non-Blocking Animations

*For any* animation in progress, user interactions SHALL remain responsive and not be blocked.

**Validates: Requirements 12.6**

### Property 55: Search Input Debouncing

*For any* rapid typing in search input fields, filtering operations SHALL be debounced to reduce unnecessary computations.

**Validates: Requirements 14.2**

### Property 56: Image Alt Text

*For any* image in the application, an alt text attribute SHALL be present.

**Validates: Requirements 15.1**


### Property 57: Keyboard Accessibility

*For any* interactive element in the application, it SHALL be accessible via keyboard navigation.

**Validates: Requirements 15.2**

### Property 58: Logical Tab Order

*For any* page in the application, tab navigation SHALL follow a logical order through interactive elements.

**Validates: Requirements 15.3**

### Property 59: Semantic HTML Usage

*For any* page structure, semantic HTML elements (nav, main, section, article) SHALL be used appropriately.

**Validates: Requirements 15.4**

### Property 60: Icon Button ARIA Labels

*For any* icon-only button, an ARIA label SHALL be provided for screen readers.

**Validates: Requirements 15.5**

### Property 61: Color Contrast Compliance

*For any* text in the application, the color contrast ratio with its background SHALL meet WCAG AA standards (minimum 4.5:1 for normal text).

**Validates: Requirements 15.6**

### Property 62: Visible Focus Indicators

*For any* element that receives focus, a visible focus indicator SHALL be displayed.

**Validates: Requirements 15.7**

### Property 63: MockService API Latency

*For any* mockService function call, the simulated latency SHALL be between 400ms and 1500ms.

**Validates: Requirements 16.4**


### Property 64: MockService localStorage Usage

*For any* mockService data operation, localStorage SHALL be used for data persistence.

**Validates: Requirements 16.5**

### Property 65: Data Persistence Across Refreshes

*For any* data stored via mockService, the data SHALL persist across page refreshes.

**Validates: Requirements 16.7**

### Property 66: Payment Method Conditional Fields

*For any* payment method selection, the appropriate input fields SHALL be displayed (card fields for card payments, phone field for mobile wallets).

**Validates: Requirements 17.2, 17.3**

### Property 67: Payment Processing Delay

*For any* payment form submission, the mockService SHALL simulate a 2-second processing delay.

**Validates: Requirements 17.7**

### Property 68: Payment Success Rate

*For any* large sample of payment attempts, approximately 90% SHALL succeed and 10% SHALL fail (within statistical variance).

**Validates: Requirements 17.8**

### Property 69: Booking Creation on Payment Success

*For any* successful payment, a booking record with unique ID and timestamp SHALL be created.

**Validates: Requirements 17.9**

### Property 70: Payment Success Navigation

*For any* successful payment, the application SHALL navigate to the booking confirmation page.

**Validates: Requirements 17.10**


### Property 71: Confirmation Page Display

*For any* booking confirmation page render, it SHALL display booking ID, timestamp, "Booking Confirmed" message, and complete booking details (spot, package, dates, guests, total).

**Validates: Requirements 18.2, 18.3**

### Property 72: Filter State Persistence

*For any* filter applied on the Explore page, the filter state SHALL be stored in sessionStorage.

**Validates: Requirements 19.1**

### Property 73: Filter State Restoration

*For any* return to the Explore page within the same session, previously applied filters SHALL be restored from sessionStorage.

**Validates: Requirements 19.2**

### Property 74: Filter State Restoration Timing

*For any* filter restoration, filters SHALL be applied before displaying spots to the user.

**Validates: Requirements 19.4**

### Property 75: Filter UI Synchronization

*For any* restored filter state, the filter UI controls SHALL be updated to reflect the active filters.

**Validates: Requirements 19.5**

### Property 76: Network Error Catching

*For any* network error simulated by mockService, the application SHALL catch the error and prevent unhandled exceptions.

**Validates: Requirements 20.1**

### Property 77: Network Error Toast Display

*For any* caught network error, an error toast notification with a descriptive message SHALL be displayed.

**Validates: Requirements 20.2**


### Property 78: Retry Functionality

*For any* failed request, retry functionality SHALL be available to the user.

**Validates: Requirements 20.3**

### Property 79: Retry Loading State

*For any* retry attempt, a loading state SHALL be displayed during the retry operation.

**Validates: Requirements 20.4**

### Property 80: Retry Success Feedback

*For any* successful retry, a success toast notification SHALL be displayed.

**Validates: Requirements 20.5**

### Property 81: Retry Limit

*For any* sequence of automatic retries, the maximum number of retry attempts SHALL be 3.

**Validates: Requirements 20.6**

### Property 82: Final Retry Failure Display

*For any* request that fails after all retry attempts are exhausted, a persistent error message with manual retry option SHALL be displayed.

**Validates: Requirements 20.7**


## Error Handling

### Error Handling Strategy

The application implements a multi-layered error handling approach:

**1. Error Boundary Layer**
- Root-level ErrorBoundary component catches all React component errors
- Prevents entire application crash
- Displays user-friendly fallback UI
- Logs errors to console for debugging
- Provides reload mechanism for recovery

**2. API Error Handling**
- All mockService calls wrapped in try-catch blocks
- Network errors caught and converted to user-friendly messages
- Toast notifications for transient errors
- Retry mechanism for recoverable failures
- Persistent error messages for permanent failures

**3. Form Validation Errors**
- Real-time validation for email, dates, numeric fields
- Field-level error messages
- Visual feedback (red borders, error text)
- Submit prevention until validation passes
- Error clearing on field correction

**4. Image Loading Errors**
- Fallback placeholder images for failed loads
- Graceful degradation (show content without images)
- No broken image icons visible to users

**5. Data Consistency Errors**
- Validation before localStorage writes
- Data migration for schema changes
- Fallback to empty arrays for missing data
- Type checking with TypeScript


### Error Types and Handling

| Error Type | Detection | Handling | User Feedback |
|------------|-----------|----------|---------------|
| Component Crash | ErrorBoundary | Display fallback UI | Error message + reload button |
| API Failure | try-catch in service calls | Retry logic + toast | Error toast with retry option |
| Network Timeout | setTimeout in mockService | Timeout message | Timeout toast + retry button |
| Validation Error | Form validation logic | Prevent submission | Field-level error messages |
| Image Load Failure | img.onerror event | Display fallback | Placeholder image |
| localStorage Full | try-catch on setItem | Graceful degradation | Warning toast |
| Invalid Route | React Router | 404 handling | Redirect to home |
| Authentication Error | Route guard | Redirect to auth | Info toast |

### Error Recovery Mechanisms

**Automatic Recovery:**
- Retry failed API calls (up to 3 attempts)
- Auto-dismiss transient error toasts
- Clear validation errors on field correction
- Reload images on network restoration

**Manual Recovery:**
- "Reload Page" button in ErrorBoundary
- "Retry" button in error toasts
- "Clear Filters" to reset filter state
- "Try Again" button for failed actions

**Graceful Degradation:**
- Show cached data when API fails
- Display partial content if some images fail
- Allow offline map when online map unavailable
- Continue with default values if preferences fail to load


## Testing Strategy

### Dual Testing Approach

The testing strategy employs both **unit tests** and **property-based tests** to ensure comprehensive coverage:

**Unit Tests:**
- Specific examples and edge cases
- Integration points between components
- Error conditions and boundary cases
- UI component rendering
- User interaction flows

**Property-Based Tests:**
- Universal properties across all inputs
- Comprehensive input coverage through randomization
- Validation of correctness properties defined in this document
- Minimum 100 iterations per property test

Together, unit tests catch concrete bugs while property tests verify general correctness across the input space.

### Testing Framework Selection

**Unit Testing:**
- **Framework**: Vitest (fast, Vite-native)
- **React Testing**: React Testing Library
- **User Interactions**: @testing-library/user-event
- **Mocking**: Vitest mocks for mockService

**Property-Based Testing:**
- **Framework**: fast-check (TypeScript-native PBT library)
- **Integration**: Run via Vitest
- **Configuration**: 100 iterations minimum per property

**E2E Testing (Optional):**
- **Framework**: Playwright
- **Scope**: Critical user flows (booking, payment)


### Property-Based Test Configuration

Each property test must:
1. Run minimum 100 iterations
2. Reference the design document property number
3. Use descriptive test names
4. Include property text in test tag

**Tag Format:**
```typescript
// Feature: frontend-ux-enhancements, Property 1: Loading Indicator Display
test('displays appropriate loading indicators for all data fetching operations', () => {
  fc.assert(
    fc.property(
      fc.record({
        operationType: fc.constantFrom('list', 'action', 'form'),
        // ... generators
      }),
      (testCase) => {
        // Test implementation
      }
    ),
    { numRuns: 100 }
  );
});
```

### Test Coverage by Component

**ErrorBoundary:**
- Unit: Renders fallback on error, logs to console, reload button works
- Property: Catches all child component errors (Property 5)

**Toast System:**
- Unit: Individual toast types render correctly, close button works
- Property: Auto-dismiss timing (Property 9), stacking behavior (Property 10)

**Loading Components:**
- Unit: Spinner and skeleton render correctly
- Property: Appropriate indicator for context (Property 1), cleanup on completion (Property 3)

**LazyImage:**
- Unit: Placeholder renders, fallback on error
- Property: Lazy loading attribute present (Property 15), viewport loading (Property 16)

**FilterPanel:**
- Unit: Filter controls render, clear button works
- Property: Filter application correctness (Properties 45-49), real-time updates (Property 50)

**Payment Flow:**
- Unit: Form renders, validation messages appear
- Property: Form validation (Property 21), payment processing (Properties 67-70)

**User Profile:**
- Unit: Profile sections render, edit modal works
- Property: Booking display (Property 40), categorization (Property 41)

**Booking Flow:**
- Unit: Checkout to payment navigation, confirmation page
- Property: State preservation (Property 19), booking persistence (Property 28)


### Test Data Generators (fast-check)

**For Property-Based Tests:**

```typescript
// User generator
const userArb = fc.record({
  id: fc.uuid(),
  name: fc.string({ minLength: 1, maxLength: 50 }),
  email: fc.emailAddress(),
  role: fc.constantFrom('user', 'admin'),
});

// Spot generator
const spotArb = fc.record({
  id: fc.uuid(),
  name: fc.string({ minLength: 3, maxLength: 100 }),
  region: fc.constantFrom('Gilgit-Baltistan', 'Punjab', 'Sindh', 'Khyber Pakhtunkhwa', 'Balochistan', 'Azad Kashmir'),
  rating: fc.double({ min: 0, max: 5 }),
  tags: fc.array(fc.string(), { minLength: 1, maxLength: 5 }),
  // ... other fields
});

// Booking generator
const bookingArb = fc.record({
  id: fc.uuid(),
  userId: fc.uuid(),
  spotId: fc.uuid(),
  guests: fc.integer({ min: 1, max: 12 }),
  startDate: fc.date({ min: new Date(), max: new Date('2025-12-31') }),
  totalCost: fc.integer({ min: 5000, max: 200000 }),
  // ... other fields
});

// Filter state generator
const filterStateArb = fc.record({
  regions: fc.array(fc.constantFrom('Gilgit-Baltistan', 'Punjab', 'Sindh'), { maxLength: 3 }),
  tags: fc.array(fc.string(), { maxLength: 5 }),
  minRating: fc.double({ min: 0, max: 5 }),
  priceRange: fc.tuple(fc.integer({ min: 0, max: 100000 }), fc.integer({ min: 0, max: 200000 }))
    .filter(([min, max]) => min <= max),
});

// Toast generator
const toastArb = fc.record({
  id: fc.uuid(),
  type: fc.constantFrom('success', 'error', 'info', 'warning'),
  message: fc.string({ minLength: 10, maxLength: 200 }),
  duration: fc.integer({ min: 2000, max: 6000 }),
});
```


### Unit Test Examples

**Example 1: ErrorBoundary Fallback**
```typescript
describe('ErrorBoundary', () => {
  it('displays fallback UI when child component throws error', () => {
    const ThrowError = () => {
      throw new Error('Test error');
    };
    
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );
    
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reload/i })).toBeInTheDocument();
  });
});
```

**Example 2: Toast Auto-Dismiss**
```typescript
describe('Toast', () => {
  it('auto-dismisses after 4 seconds', async () => {
    vi.useFakeTimers();
    const onDismiss = vi.fn();
    
    render(<Toast type="success" message="Test" onDismiss={onDismiss} />);
    
    expect(screen.getByText('Test')).toBeInTheDocument();
    
    vi.advanceTimersByTime(4000);
    
    expect(onDismiss).toHaveBeenCalled();
    vi.useRealTimers();
  });
});
```

**Example 3: Filter Application**
```typescript
describe('FilterPanel', () => {
  it('filters spots by selected region', async () => {
    const spots = [
      { id: '1', name: 'Hunza', region: 'Gilgit-Baltistan', rating: 4.9 },
      { id: '2', name: 'Lahore Fort', region: 'Punjab', rating: 4.8 },
    ];
    
    const { user } = render(<Explore spots={spots} />);
    
    await user.click(screen.getByLabelText('Gilgit-Baltistan'));
    
    expect(screen.getByText('Hunza')).toBeInTheDocument();
    expect(screen.queryByText('Lahore Fort')).not.toBeInTheDocument();
  });
});
```


### Property-Based Test Examples

**Example 1: Form Validation (Property 21)**
```typescript
// Feature: frontend-ux-enhancements, Property 21: Form Validation on Submit
test('prevents submission and shows errors for any invalid form data', () => {
  fc.assert(
    fc.property(
      fc.record({
        cardNumber: fc.string(), // Random strings, mostly invalid
        expiry: fc.string(),
        cvv: fc.string(),
        email: fc.string(),
      }),
      (formData) => {
        const { container } = render(<PaymentForm />);
        
        // Fill form with generated data
        fireEvent.change(screen.getByLabelText(/card number/i), { target: { value: formData.cardNumber } });
        fireEvent.change(screen.getByLabelText(/expiry/i), { target: { value: formData.expiry } });
        fireEvent.change(screen.getByLabelText(/cvv/i), { target: { value: formData.cvv } });
        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: formData.email } });
        
        // Attempt submission
        fireEvent.click(screen.getByRole('button', { name: /pay now/i }));
        
        // If any field is invalid, submission should be prevented
        const hasInvalidFields = !isValidCardNumber(formData.cardNumber) ||
                                 !isValidExpiry(formData.expiry) ||
                                 !isValidCVV(formData.cvv) ||
                                 !isValidEmail(formData.email);
        
        if (hasInvalidFields) {
          // Should show error messages
          expect(container.querySelector('.error-message')).toBeInTheDocument();
          // Should not call payment service
          expect(mockProcessPayment).not.toHaveBeenCalled();
        }
      }
    ),
    { numRuns: 100 }
  );
});
```

**Example 2: Filter Combination (Property 49)**
```typescript
// Feature: frontend-ux-enhancements, Property 49: Multiple Filter Combination
test('displays only spots matching all filter criteria for any filter combination', () => {
  fc.assert(
    fc.property(
      fc.array(spotArb, { minLength: 10, maxLength: 50 }),
      filterStateArb,
      (spots, filters) => {
        render(<Explore initialSpots={spots} />);
        
        // Apply filters
        applyFilters(filters);
        
        // Get displayed spots
        const displayedSpots = screen.getAllByTestId('spot-card');
        
        // Verify each displayed spot matches ALL filter criteria
        displayedSpots.forEach(spotElement => {
          const spotId = spotElement.dataset.spotId;
          const spot = spots.find(s => s.id === spotId);
          
          // Check region filter
          if (filters.regions.length > 0) {
            expect(filters.regions).toContain(spot.region);
          }
          
          // Check tag filter (OR logic)
          if (filters.tags.length > 0) {
            expect(spot.tags.some(tag => filters.tags.includes(tag))).toBe(true);
          }
          
          // Check rating filter
          expect(spot.rating).toBeGreaterThanOrEqual(filters.minRating);
          
          // Check price range
          const spotPrice = calculateSpotPrice(spot);
          expect(spotPrice).toBeGreaterThanOrEqual(filters.priceRange[0]);
          expect(spotPrice).toBeLessThanOrEqual(filters.priceRange[1]);
        });
      }
    ),
    { numRuns: 100 }
  );
});
```


**Example 3: Toast Stacking (Property 10)**
```typescript
// Feature: frontend-ux-enhancements, Property 10: Toast Stacking
test('stacks multiple toasts vertically without overlapping', () => {
  fc.assert(
    fc.property(
      fc.array(toastArb, { minLength: 2, maxLength: 5 }),
      (toasts) => {
        const { container } = render(<ToastProvider><App /></ToastProvider>);
        
        // Trigger all toasts
        toasts.forEach(toast => {
          act(() => {
            showToast(toast.type, toast.message);
          });
        });
        
        // Get all rendered toasts
        const toastElements = container.querySelectorAll('[data-testid="toast"]');
        expect(toastElements.length).toBe(Math.min(toasts.length, 5)); // Max 5 visible
        
        // Check vertical stacking (no overlap)
        for (let i = 0; i < toastElements.length - 1; i++) {
          const currentRect = toastElements[i].getBoundingClientRect();
          const nextRect = toastElements[i + 1].getBoundingClientRect();
          
          // Next toast should be below current toast (no overlap)
          expect(nextRect.top).toBeGreaterThanOrEqual(currentRect.bottom);
        }
      }
    ),
    { numRuns: 100 }
  );
});
```

### Test Execution Strategy

**Development:**
- Run unit tests on file save (watch mode)
- Run property tests before commits
- Fast feedback loop for TDD

**CI/CD Pipeline:**
1. Lint and type check
2. Run all unit tests
3. Run all property tests (100 iterations each)
4. Generate coverage report (target: >80%)
5. Run E2E tests for critical flows
6. Build and deploy on success

**Coverage Goals:**
- Unit test coverage: >80% for all new components
- Property test coverage: All 82 correctness properties
- E2E coverage: Booking flow, payment flow, filter flow


## Implementation Roadmap

### Phase 1: Core Infrastructure (Week 1)
1. ErrorBoundary component
2. Toast notification system (context, components, hook)
3. Loading components (spinner, skeleton)
4. TypeScript type definitions

### Phase 2: Shared Components (Week 1-2)
1. LazyImage component
2. FormField component with validation
3. Modal component
4. mockService extensions

### Phase 3: Feature Completion (Week 2-3)
1. Payment flow enhancement
2. Booking confirmation page
3. User profile page
4. Price alerts enhancement
5. Offline map integration

### Phase 4: Advanced Features (Week 3-4)
1. Filter panel component
2. Filter persistence
3. Advanced search functionality
4. Responsive design refinements

### Phase 5: Polish & Testing (Week 4)
1. Animation consistency
2. Accessibility audit
3. Performance optimization
4. Comprehensive testing (unit + property)

### Phase 6: Documentation & Deployment
1. Component documentation
2. User guide updates
3. Deployment to staging
4. Production release

## Summary

This design document provides a comprehensive technical specification for implementing frontend UX enhancements to the Trip Wise Pakistan application. The design emphasizes:

- **User Experience**: Immediate feedback through loading states, toasts, and error messages
- **Resilience**: Multi-layered error handling with graceful degradation
- **Performance**: Lazy loading, code splitting, and optimized rendering
- **Accessibility**: WCAG AA compliance with keyboard navigation and screen reader support
- **Type Safety**: Strict TypeScript typing throughout
- **Testability**: 82 correctness properties with property-based testing

The architecture builds upon the existing React + TypeScript + Vite stack, extending mockService for new features while maintaining consistency with current patterns. All new components follow mobile-first responsive design principles and use Framer Motion for consistent animations.

Implementation will proceed in phases, with core infrastructure first, followed by feature completion, and concluding with polish and comprehensive testing. The dual testing approach (unit + property-based) ensures both concrete bug detection and general correctness verification across the input space.

