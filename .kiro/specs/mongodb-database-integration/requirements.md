# Requirements Document

## Introduction

This document specifies the requirements for integrating MongoDB Atlas database to replace the current localStorage-based mock implementation in the Trip Wise Pakistan travel application. The application is a React 19.2 + TypeScript mobile-first web app built with Vite and Capacitor for Android deployment. This integration involves creating a Node.js/Express backend API to connect the frontend to MongoDB Atlas, migrating existing data structures, implementing authentication and security measures, and ensuring seamless transition from the mock service to real database operations.

## Glossary

- **Application**: The Trip Wise Pakistan travel web/mobile application
- **Frontend**: The React 19.2 + TypeScript client application
- **Backend**: The Node.js/Express server application providing REST API
- **MongoDB_Atlas**: Cloud-hosted MongoDB database service
- **Mock_Service**: The mockService.ts module currently simulating database operations with localStorage
- **API_Endpoint**: HTTP endpoint exposed by Backend for Frontend communication
- **Collection**: MongoDB database collection storing documents
- **Schema**: Mongoose schema defining document structure and validation rules
- **JWT_Token**: JSON Web Token used for authentication
- **Migration_Script**: Script to transfer data from localStorage to MongoDB_Atlas
- **Environment_Variable**: Configuration value stored in .env file
- **CORS**: Cross-Origin Resource Sharing mechanism for API access control
- **Hash**: Cryptographic one-way function output (bcrypt for passwords)
- **Rate_Limiter**: Middleware limiting request frequency per client
- **Validation_Error**: Error indicating invalid input data
- **Connection_String**: MongoDB URI containing credentials and cluster information
- **Index**: Database index improving query performance
- **Booking**: Record of user reservation for spot, hotel, or car
- **Price_Alert**: User-configured notification for price changes
- **Post**: Community content created by users
- **Spot**: Tourist destination with details and coordinates
- **Hotel**: Accommodation option with pricing and amenities
- **Car**: Transport rental option with pricing and features
- **User**: Authenticated person with account in the system


## Requirements

### Requirement 1: Backend Server Setup

**User Story:** As a developer, I want to create a Node.js/Express backend server, so that the Frontend can communicate with MongoDB_Atlas through REST APIs.

#### Acceptance Criteria

1. THE Backend SHALL use Node.js version 18 or higher
2. THE Backend SHALL use Express framework for HTTP server
3. THE Backend SHALL listen on port 5000 for HTTP requests
4. WHEN Backend starts, THE Backend SHALL log server status and port number
5. THE Backend SHALL use TypeScript for type safety
6. THE Backend SHALL include error handling middleware for unhandled routes
7. THE Backend SHALL include global error handling middleware for server errors
8. WHEN Backend encounters an unhandled error, THE Backend SHALL return HTTP 500 with error message
9. THE Backend SHALL use environment-based configuration for development and production modes

### Requirement 2: MongoDB Atlas Connection

**User Story:** As a developer, I want to connect the Backend to MongoDB_Atlas, so that data can be persisted in the cloud database.

#### Acceptance Criteria

1. THE Backend SHALL use Mongoose library for MongoDB_Atlas connection
2. THE Backend SHALL read Connection_String from Environment_Variable named MONGODB_URI
3. WHEN Backend starts, THE Backend SHALL attempt connection to MongoDB_Atlas
4. WHEN connection succeeds, THE Backend SHALL log success message
5. IF connection fails, THEN THE Backend SHALL log error details and exit process
6. THE Backend SHALL configure connection timeout of 10 seconds
7. THE Backend SHALL enable automatic reconnection on connection loss
8. THE Backend SHALL use connection pooling with minimum 5 and maximum 10 connections


### Requirement 3: Environment Configuration

**User Story:** As a developer, I want to manage sensitive configuration through environment variables, so that credentials are not exposed in source code.

#### Acceptance Criteria

1. THE Backend SHALL use dotenv library for Environment_Variable management
2. THE Backend SHALL read configuration from .env file in development mode
3. THE Backend SHALL require Environment_Variable MONGODB_URI containing Connection_String
4. THE Backend SHALL require Environment_Variable JWT_SECRET for token signing
5. THE Backend SHALL require Environment_Variable PORT with default value 5000
6. THE Backend SHALL require Environment_Variable NODE_ENV with values development or production
7. IF any required Environment_Variable is missing, THEN THE Backend SHALL log error and exit process
8. THE Backend SHALL include .env.example file documenting required Environment_Variable names
9. THE Backend SHALL exclude .env file from version control via .gitignore

### Requirement 4: CORS Configuration

**User Story:** As a developer, I want to configure CORS properly, so that the Frontend can make API requests from different origins.

#### Acceptance Criteria

1. THE Backend SHALL use cors middleware for Cross-Origin Resource Sharing
2. THE Backend SHALL allow requests from http://localhost:5173 in development mode
3. THE Backend SHALL allow requests from http://localhost:5174 in development mode
4. THE Backend SHALL allow requests from capacitor://localhost for mobile app
5. THE Backend SHALL allow requests from https://localhost for mobile app
6. THE Backend SHALL allow credentials in CORS requests
7. THE Backend SHALL allow HTTP methods GET, POST, PUT, PATCH, DELETE
8. WHERE production mode is active, THE Backend SHALL restrict allowed origins to production domain


### Requirement 5: User Schema and Model

**User Story:** As a developer, I want to define a User schema in MongoDB, so that user accounts can be stored with proper validation.

#### Acceptance Criteria

1. THE Backend SHALL define User Schema with fields: name, email, password, role, avatar, createdAt, updatedAt
2. THE User Schema SHALL require name field as string with minimum length 2 characters
3. THE User Schema SHALL require email field as string with email format validation
4. THE User Schema SHALL enforce unique constraint on email field
5. THE User Schema SHALL require password field as string with minimum length 60 characters (hashed)
6. THE User Schema SHALL require role field as enum with values user or admin
7. THE User Schema SHALL set default value user for role field
8. THE User Schema SHALL define avatar field as optional string
9. THE User Schema SHALL automatically set createdAt and updatedAt timestamps
10. THE Backend SHALL create index on email field for query performance

### Requirement 6: Spot Schema and Model

**User Story:** As a developer, I want to define a Spot schema in MongoDB, so that tourist destinations can be stored with proper structure.

#### Acceptance Criteria

1. THE Backend SHALL define Spot Schema with fields: name, region, description, imageUrl, tags, rating, coordinates, amenities, reviews
2. THE Spot Schema SHALL require name field as string
3. THE Spot Schema SHALL require region field as enum with values: Northern Areas, Punjab, Sindh, Khyber Pakhtunkhwa, Balochistan, Azad Kashmir, Gilgit-Baltistan
4. THE Spot Schema SHALL require description field as string
5. THE Spot Schema SHALL require imageUrl field as string with URL format
6. THE Spot Schema SHALL require tags field as array of strings
7. THE Spot Schema SHALL require rating field as number between 0 and 5
8. THE Spot Schema SHALL require coordinates field as object with lat and lng number fields
9. THE Spot Schema SHALL require amenities field as array of strings
10. THE Spot Schema SHALL require reviews field as number with minimum value 0
11. THE Backend SHALL create index on region field for query performance
12. THE Backend SHALL create index on tags field for query performance
13. THE Backend SHALL create geospatial index on coordinates field for location queries


### Requirement 7: Hotel Schema and Model

**User Story:** As a developer, I want to define a Hotel schema in MongoDB, so that accommodation options can be stored with pricing and amenities.

#### Acceptance Criteria

1. THE Backend SHALL define Hotel Schema with fields: name, location, pricePerNight, rating, imageUrl, amenities
2. THE Hotel Schema SHALL require name field as string
3. THE Hotel Schema SHALL require location field as string
4. THE Hotel Schema SHALL require pricePerNight field as number with minimum value 0
5. THE Hotel Schema SHALL require rating field as number between 0 and 5
6. THE Hotel Schema SHALL require imageUrl field as string with URL format
7. THE Hotel Schema SHALL require amenities field as array of strings
8. THE Backend SHALL create index on location field for query performance
9. THE Backend SHALL create index on pricePerNight field for price range queries

### Requirement 8: Car Schema and Model

**User Story:** As a developer, I want to define a Car schema in MongoDB, so that transport rental options can be stored with features and pricing.

#### Acceptance Criteria

1. THE Backend SHALL define Car Schema with fields: model, type, pricePerDay, imageUrl, features
2. THE Car Schema SHALL require model field as string
3. THE Car Schema SHALL require type field as enum with values: SUV, Sedan, 4x4, Van
4. THE Car Schema SHALL require pricePerDay field as number with minimum value 0
5. THE Car Schema SHALL require imageUrl field as string with URL format
6. THE Car Schema SHALL require features field as array of strings
7. THE Backend SHALL create index on type field for query performance
8. THE Backend SHALL create index on pricePerDay field for price range queries


### Requirement 9: Post Schema and Model

**User Story:** As a developer, I want to define a Post schema in MongoDB, so that community content can be stored with user references.

#### Acceptance Criteria

1. THE Backend SHALL define Post Schema with fields: userId, userName, content, image, likes, timestamp, locationTag
2. THE Post Schema SHALL require userId field as MongoDB ObjectId reference to User Collection
3. THE Post Schema SHALL require userName field as string
4. THE Post Schema SHALL require content field as string with maximum length 1000 characters
5. THE Post Schema SHALL define image field as optional string for base64 encoded images
6. THE Post Schema SHALL require likes field as number with default value 0 and minimum value 0
7. THE Post Schema SHALL require timestamp field as Date with default value current date
8. THE Post Schema SHALL define locationTag field as optional string
9. THE Backend SHALL create index on userId field for user post queries
10. THE Backend SHALL create index on timestamp field for chronological sorting

### Requirement 10: Booking Schema and Model

**User Story:** As a developer, I want to define a Booking schema in MongoDB, so that user reservations can be stored with complete trip details.

#### Acceptance Criteria

1. THE Backend SHALL define Booking Schema with fields: userId, spotId, spotName, packageType, guests, startDate, endDate, totalCost, status, createdAt
2. THE Booking Schema SHALL require userId field as MongoDB ObjectId reference to User Collection
3. THE Booking Schema SHALL require spotId field as MongoDB ObjectId reference to Spot Collection
4. THE Booking Schema SHALL require spotName field as string
5. THE Booking Schema SHALL require packageType field as string
6. THE Booking Schema SHALL require guests field as number with minimum value 1
7. THE Booking Schema SHALL require startDate field as Date
8. THE Booking Schema SHALL require endDate field as Date
9. THE Booking Schema SHALL require totalCost field as number with minimum value 0
10. THE Booking Schema SHALL require status field as enum with values: pending, confirmed, cancelled
11. THE Booking Schema SHALL set default value confirmed for status field
12. THE Booking Schema SHALL require createdAt field as Date with default value current date
13. THE Backend SHALL create index on userId field for user booking queries
14. THE Backend SHALL create index on createdAt field for chronological sorting


### Requirement 11: Price Alert Schema and Model

**User Story:** As a developer, I want to define a Price Alert schema in MongoDB, so that user price notifications can be stored with target prices.

#### Acceptance Criteria

1. THE Backend SHALL define Price_Alert Schema with fields: userId, itemType, itemId, itemName, targetPrice, email, createdAt
2. THE Price_Alert Schema SHALL require userId field as MongoDB ObjectId reference to User Collection
3. THE Price_Alert Schema SHALL require itemType field as enum with values: spot, hotel, car
4. THE Price_Alert Schema SHALL require itemId field as string
5. THE Price_Alert Schema SHALL require itemName field as string
6. THE Price_Alert Schema SHALL require targetPrice field as number with minimum value 0
7. THE Price_Alert Schema SHALL require email field as string with email format validation
8. THE Price_Alert Schema SHALL require createdAt field as Date with default value current date
9. THE Backend SHALL create index on userId field for user alert queries
10. THE Backend SHALL create compound index on itemType and itemId fields for item alert queries

### Requirement 12: Password Hashing

**User Story:** As a developer, I want to hash user passwords securely, so that plain text passwords are never stored in the database.

#### Acceptance Criteria

1. THE Backend SHALL use bcrypt library for password hashing
2. WHEN a User is created, THE Backend SHALL hash the password with salt rounds of 10
3. WHEN a User password is updated, THE Backend SHALL hash the new password with salt rounds of 10
4. THE Backend SHALL store only the Hash in the password field
5. THE Backend SHALL never log or expose password Hash values
6. THE Backend SHALL provide password comparison method using bcrypt compare function
7. WHEN comparing passwords, THE Backend SHALL use constant-time comparison to prevent timing attacks


### Requirement 13: JWT Authentication

**User Story:** As a developer, I want to implement JWT-based authentication, so that API endpoints can verify user identity securely.

#### Acceptance Criteria

1. THE Backend SHALL use jsonwebtoken library for JWT_Token generation and verification
2. WHEN a User logs in successfully, THE Backend SHALL generate JWT_Token containing user ID and role
3. THE JWT_Token SHALL expire after 7 days
4. THE Backend SHALL sign JWT_Token using JWT_SECRET from Environment_Variable
5. THE Backend SHALL provide authentication middleware to verify JWT_Token
6. WHEN authentication middleware receives a request, THE Backend SHALL extract JWT_Token from Authorization header
7. WHEN JWT_Token is valid, THE Backend SHALL attach user information to request object
8. IF JWT_Token is missing, THEN THE Backend SHALL return HTTP 401 with error message "No token provided"
9. IF JWT_Token is invalid or expired, THEN THE Backend SHALL return HTTP 401 with error message "Invalid or expired token"
10. THE Backend SHALL use Bearer token format in Authorization header

### Requirement 14: Authentication Endpoints

**User Story:** As a user, I want to sign up, log in, and log out, so that I can access personalized features.

#### Acceptance Criteria

1. THE Backend SHALL provide POST /api/auth/signup API_Endpoint
2. WHEN /api/auth/signup receives valid name, email, and password, THE Backend SHALL create new User with hashed password
3. WHEN /api/auth/signup creates User successfully, THE Backend SHALL return HTTP 201 with JWT_Token and user data
4. IF /api/auth/signup receives duplicate email, THEN THE Backend SHALL return HTTP 400 with error message "User already exists"
5. THE Backend SHALL provide POST /api/auth/login API_Endpoint
6. WHEN /api/auth/login receives valid email and password, THE Backend SHALL verify credentials
7. WHEN credentials are valid, THE Backend SHALL return HTTP 200 with JWT_Token and user data
8. IF credentials are invalid, THEN THE Backend SHALL return HTTP 401 with error message "Invalid credentials"
9. THE Backend SHALL provide GET /api/auth/me API_Endpoint requiring authentication
10. WHEN /api/auth/me receives valid JWT_Token, THE Backend SHALL return HTTP 200 with current user data
11. THE Backend SHALL provide POST /api/auth/logout API_Endpoint
12. WHEN /api/auth/logout is called, THE Backend SHALL return HTTP 200 with success message


### Requirement 15: Spot Endpoints

**User Story:** As a user, I want to retrieve and search tourist spots, so that I can plan my trip.

#### Acceptance Criteria

1. THE Backend SHALL provide GET /api/spots API_Endpoint
2. WHEN /api/spots is called, THE Backend SHALL return HTTP 200 with array of all Spot documents
3. THE Backend SHALL provide GET /api/spots/:id API_Endpoint
4. WHEN /api/spots/:id is called with valid ID, THE Backend SHALL return HTTP 200 with Spot document
5. IF Spot ID does not exist, THEN THE Backend SHALL return HTTP 404 with error message "Spot not found"
6. THE Backend SHALL provide GET /api/spots/search API_Endpoint with query parameters
7. WHEN /api/spots/search receives region query parameter, THE Backend SHALL filter Spot documents by region
8. WHEN /api/spots/search receives tags query parameter, THE Backend SHALL filter Spot documents by tags array
9. WHEN /api/spots/search receives minRating query parameter, THE Backend SHALL filter Spot documents with rating greater than or equal to value
10. THE Backend SHALL support multiple query parameters simultaneously
11. WHERE admin role is authenticated, THE Backend SHALL provide POST /api/spots API_Endpoint
12. WHERE admin role is authenticated, THE Backend SHALL provide PUT /api/spots/:id API_Endpoint
13. WHERE admin role is authenticated, THE Backend SHALL provide DELETE /api/spots/:id API_Endpoint

### Requirement 16: Hotel Endpoints

**User Story:** As a user, I want to retrieve and search hotels, so that I can find accommodation.

#### Acceptance Criteria

1. THE Backend SHALL provide GET /api/hotels API_Endpoint
2. WHEN /api/hotels is called, THE Backend SHALL return HTTP 200 with array of all Hotel documents
3. THE Backend SHALL provide GET /api/hotels/:id API_Endpoint
4. WHEN /api/hotels/:id is called with valid ID, THE Backend SHALL return HTTP 200 with Hotel document
5. IF Hotel ID does not exist, THEN THE Backend SHALL return HTTP 404 with error message "Hotel not found"
6. THE Backend SHALL provide GET /api/hotels/search API_Endpoint with query parameters
7. WHEN /api/hotels/search receives location query parameter, THE Backend SHALL filter Hotel documents by location
8. WHEN /api/hotels/search receives minPrice and maxPrice query parameters, THE Backend SHALL filter Hotel documents by price range
9. WHERE admin role is authenticated, THE Backend SHALL provide PUT /api/hotels/:id API_Endpoint for price updates
10. WHEN admin updates Hotel price, THE Backend SHALL return HTTP 200 with updated Hotel document


### Requirement 17: Car Endpoints

**User Story:** As a user, I want to retrieve and search rental cars, so that I can arrange transportation.

#### Acceptance Criteria

1. THE Backend SHALL provide GET /api/cars API_Endpoint
2. WHEN /api/cars is called, THE Backend SHALL return HTTP 200 with array of all Car documents
3. THE Backend SHALL provide GET /api/cars/:id API_Endpoint
4. WHEN /api/cars/:id is called with valid ID, THE Backend SHALL return HTTP 200 with Car document
5. IF Car ID does not exist, THEN THE Backend SHALL return HTTP 404 with error message "Car not found"
6. THE Backend SHALL provide GET /api/cars/search API_Endpoint with query parameters
7. WHEN /api/cars/search receives type query parameter, THE Backend SHALL filter Car documents by type
8. WHEN /api/cars/search receives minPrice and maxPrice query parameters, THE Backend SHALL filter Car documents by price range
9. WHERE admin role is authenticated, THE Backend SHALL provide PUT /api/cars/:id API_Endpoint for price updates
10. WHEN admin updates Car price, THE Backend SHALL return HTTP 200 with updated Car document

### Requirement 18: Post Endpoints

**User Story:** As a user, I want to create and view community posts, so that I can share experiences and read others' stories.

#### Acceptance Criteria

1. THE Backend SHALL provide GET /api/posts API_Endpoint
2. WHEN /api/posts is called, THE Backend SHALL return HTTP 200 with array of Post documents sorted by timestamp descending
3. THE Backend SHALL provide POST /api/posts API_Endpoint requiring authentication
4. WHEN authenticated user creates Post, THE Backend SHALL set userId from JWT_Token
5. WHEN Post is created successfully, THE Backend SHALL return HTTP 201 with created Post document
6. THE Backend SHALL provide PUT /api/posts/:id/like API_Endpoint requiring authentication
7. WHEN user likes a Post, THE Backend SHALL increment likes field by 1
8. WHEN like is successful, THE Backend SHALL return HTTP 200 with updated Post document
9. THE Backend SHALL provide DELETE /api/posts/:id API_Endpoint requiring authentication
10. WHEN user deletes own Post, THE Backend SHALL remove Post document
11. IF user attempts to delete another user's Post, THEN THE Backend SHALL return HTTP 403 with error message "Unauthorized"


### Requirement 19: Booking Endpoints

**User Story:** As a user, I want to create and view my bookings, so that I can manage my trip reservations.

#### Acceptance Criteria

1. THE Backend SHALL provide POST /api/bookings API_Endpoint requiring authentication
2. WHEN authenticated user creates Booking, THE Backend SHALL set userId from JWT_Token
3. WHEN Booking is created successfully, THE Backend SHALL return HTTP 201 with created Booking document
4. THE Backend SHALL validate startDate is before endDate
5. IF startDate is after or equal to endDate, THEN THE Backend SHALL return HTTP 400 with error message "Invalid date range"
6. THE Backend SHALL provide GET /api/bookings API_Endpoint requiring authentication
7. WHEN authenticated user requests bookings, THE Backend SHALL return HTTP 200 with array of user's Booking documents sorted by createdAt descending
8. THE Backend SHALL provide GET /api/bookings/:id API_Endpoint requiring authentication
9. WHEN user requests specific Booking, THE Backend SHALL verify Booking belongs to user
10. IF Booking does not belong to user, THEN THE Backend SHALL return HTTP 403 with error message "Unauthorized"
11. THE Backend SHALL provide PATCH /api/bookings/:id/cancel API_Endpoint requiring authentication
12. WHEN user cancels Booking, THE Backend SHALL update status field to cancelled
13. WHEN cancellation is successful, THE Backend SHALL return HTTP 200 with updated Booking document

### Requirement 20: Price Alert Endpoints

**User Story:** As a user, I want to create and manage price alerts, so that I can be notified of price changes.

#### Acceptance Criteria

1. THE Backend SHALL provide POST /api/price-alerts API_Endpoint requiring authentication
2. WHEN authenticated user creates Price_Alert, THE Backend SHALL set userId from JWT_Token
3. WHEN Price_Alert is created successfully, THE Backend SHALL return HTTP 201 with created Price_Alert document
4. THE Backend SHALL validate email format before creating Price_Alert
5. IF email format is invalid, THEN THE Backend SHALL return HTTP 400 with error message "Invalid email format"
6. THE Backend SHALL provide GET /api/price-alerts API_Endpoint requiring authentication
7. WHEN authenticated user requests price alerts, THE Backend SHALL return HTTP 200 with array of user's Price_Alert documents
8. THE Backend SHALL provide DELETE /api/price-alerts/:id API_Endpoint requiring authentication
9. WHEN user deletes Price_Alert, THE Backend SHALL verify Price_Alert belongs to user
10. IF Price_Alert does not belong to user, THEN THE Backend SHALL return HTTP 403 with error message "Unauthorized"
11. WHEN deletion is successful, THE Backend SHALL return HTTP 200 with success message


### Requirement 21: User Profile Endpoints

**User Story:** As a user, I want to view and update my profile, so that I can manage my account information.

#### Acceptance Criteria

1. THE Backend SHALL provide GET /api/users/profile API_Endpoint requiring authentication
2. WHEN authenticated user requests profile, THE Backend SHALL return HTTP 200 with user data excluding password Hash
3. THE Backend SHALL provide PUT /api/users/profile API_Endpoint requiring authentication
4. WHEN user updates profile, THE Backend SHALL allow updating name and avatar fields only
5. WHEN profile update is successful, THE Backend SHALL return HTTP 200 with updated user data
6. THE Backend SHALL prevent updating email and role fields through profile endpoint
7. IF user attempts to update email or role, THEN THE Backend SHALL ignore those fields
8. THE Backend SHALL provide PUT /api/users/password API_Endpoint requiring authentication
9. WHEN user changes password, THE Backend SHALL require currentPassword and newPassword fields
10. WHEN currentPassword is correct, THE Backend SHALL hash and save newPassword
11. IF currentPassword is incorrect, THEN THE Backend SHALL return HTTP 401 with error message "Current password is incorrect"

### Requirement 22: Input Validation

**User Story:** As a developer, I want to validate all API inputs, so that invalid data is rejected before processing.

#### Acceptance Criteria

1. THE Backend SHALL use express-validator library for input validation
2. THE Backend SHALL validate all required fields are present in request body
3. WHEN required field is missing, THE Backend SHALL return HTTP 400 with Validation_Error listing missing fields
4. THE Backend SHALL validate email format for all email fields
5. THE Backend SHALL validate string length constraints defined in schemas
6. THE Backend SHALL validate numeric ranges defined in schemas
7. THE Backend SHALL validate enum values match allowed options
8. THE Backend SHALL validate MongoDB ObjectId format for ID parameters
9. WHEN validation fails, THE Backend SHALL return HTTP 400 with array of Validation_Error messages
10. THE Backend SHALL sanitize string inputs to prevent injection attacks


### Requirement 23: Rate Limiting

**User Story:** As a developer, I want to implement rate limiting, so that the API is protected from abuse and excessive requests.

#### Acceptance Criteria

1. THE Backend SHALL use express-rate-limit library for Rate_Limiter implementation
2. THE Backend SHALL apply Rate_Limiter to all API_Endpoint routes
3. THE Rate_Limiter SHALL allow maximum 100 requests per 15 minutes per IP address
4. WHEN rate limit is exceeded, THE Backend SHALL return HTTP 429 with error message "Too many requests"
5. THE Backend SHALL apply stricter Rate_Limiter to authentication endpoints
6. THE authentication Rate_Limiter SHALL allow maximum 5 login attempts per 15 minutes per IP address
7. THE Backend SHALL include Retry-After header in HTTP 429 responses
8. WHERE production mode is active, THE Backend SHALL use Redis for distributed rate limiting

### Requirement 24: Error Response Format

**User Story:** As a frontend developer, I want consistent error response format, so that I can handle errors uniformly.

#### Acceptance Criteria

1. THE Backend SHALL return error responses with consistent JSON structure
2. THE error response SHALL include success field with value false
3. THE error response SHALL include message field with error description
4. THE error response SHALL include errors field as array for validation errors
5. WHERE applicable, THE error response SHALL include statusCode field
6. THE Backend SHALL use appropriate HTTP status codes for different error types
7. THE Backend SHALL return HTTP 400 for validation errors
8. THE Backend SHALL return HTTP 401 for authentication errors
9. THE Backend SHALL return HTTP 403 for authorization errors
10. THE Backend SHALL return HTTP 404 for resource not found errors
11. THE Backend SHALL return HTTP 500 for server errors


### Requirement 25: Data Migration Script

**User Story:** As a developer, I want to migrate existing localStorage data to MongoDB_Atlas, so that current data is preserved during transition.

#### Acceptance Criteria

1. THE Backend SHALL provide Migration_Script to transfer data from localStorage to MongoDB_Atlas
2. THE Migration_Script SHALL read initial data from data.ts file
3. THE Migration_Script SHALL connect to MongoDB_Atlas using Connection_String
4. WHEN Migration_Script runs, THE Backend SHALL insert Spot documents from INITIAL_SPOTS array
5. WHEN Migration_Script runs, THE Backend SHALL insert Hotel documents from HOTELS array
6. WHEN Migration_Script runs, THE Backend SHALL insert Car documents from CARS array
7. THE Migration_Script SHALL create default admin User with email admin@tripwise.pk
8. THE Migration_Script SHALL hash default admin password before insertion
9. THE Migration_Script SHALL check for existing data before insertion to prevent duplicates
10. WHEN migration completes successfully, THE Migration_Script SHALL log count of inserted documents
11. IF migration fails, THEN THE Migration_Script SHALL log error details and exit
12. THE Migration_Script SHALL be executable via npm script command

### Requirement 26: Frontend API Service

**User Story:** As a frontend developer, I want to replace mockService with real API calls, so that the application uses the MongoDB backend.

#### Acceptance Criteria

1. THE Frontend SHALL create new apiService.ts module for API communication
2. THE apiService SHALL use axios library for HTTP requests
3. THE apiService SHALL configure base URL from environment variable VITE_API_URL
4. THE apiService SHALL include JWT_Token in Authorization header for authenticated requests
5. THE apiService SHALL store JWT_Token in localStorage after successful login
6. THE apiService SHALL remove JWT_Token from localStorage on logout
7. THE apiService SHALL implement request interceptor to attach JWT_Token automatically
8. THE apiService SHALL implement response interceptor to handle HTTP 401 errors
9. WHEN HTTP 401 error occurs, THE apiService SHALL clear JWT_Token and redirect to login page
10. THE apiService SHALL provide methods matching all Mock_Service functions
11. THE apiService SHALL handle network errors and return user-friendly error messages


### Requirement 27: Frontend Authentication Integration

**User Story:** As a user, I want the frontend to use real authentication, so that my account is securely managed.

#### Acceptance Criteria

1. THE Frontend SHALL update Auth.tsx to use apiService for login and signup
2. WHEN user submits login form, THE Frontend SHALL call apiService.login with email and password
3. WHEN login succeeds, THE Frontend SHALL store JWT_Token and user data
4. WHEN login fails, THE Frontend SHALL display error message from API response
5. WHEN user submits signup form, THE Frontend SHALL call apiService.signup with name, email, and password
6. WHEN signup succeeds, THE Frontend SHALL store JWT_Token and user data
7. THE Frontend SHALL update getCurrentUser to retrieve user from JWT_Token
8. WHEN user logs out, THE Frontend SHALL call apiService.logout and clear stored data
9. THE Frontend SHALL maintain backward compatibility with existing authentication flow

### Requirement 28: Frontend Data Fetching Integration

**User Story:** As a user, I want the frontend to load data from the database, so that I see real-time information.

#### Acceptance Criteria

1. THE Frontend SHALL update all components using getSpots to call apiService.getSpots
2. THE Frontend SHALL update all components using getHotels to call apiService.getHotels
3. THE Frontend SHALL update all components using getCars to call apiService.getCars
4. THE Frontend SHALL update Community page to call apiService.getPosts
5. THE Frontend SHALL update all data fetching to handle loading states
6. THE Frontend SHALL update all data fetching to handle error states
7. WHEN API call fails, THE Frontend SHALL display error message to user
8. THE Frontend SHALL implement retry mechanism for failed requests
9. THE Frontend SHALL cache API responses where appropriate to reduce requests


### Requirement 29: Frontend Booking Integration

**User Story:** As a user, I want to create bookings through the API, so that my reservations are stored in the database.

#### Acceptance Criteria

1. THE Frontend SHALL update Payment.tsx to call apiService.createBooking
2. WHEN payment succeeds, THE Frontend SHALL send booking data to API
3. WHEN booking creation succeeds, THE Frontend SHALL navigate to confirmation page
4. IF booking creation fails, THEN THE Frontend SHALL display error message
5. THE Frontend SHALL create or update User Profile page to call apiService.getBookings
6. THE Frontend SHALL display user bookings with details from API response
7. THE Frontend SHALL provide cancel booking functionality calling apiService.cancelBooking

### Requirement 30: Frontend Price Alert Integration

**User Story:** As a user, I want to manage price alerts through the API, so that my alerts are stored in the database.

#### Acceptance Criteria

1. THE Frontend SHALL update PriceAlerts.tsx to call apiService.createPriceAlert
2. WHEN user creates price alert, THE Frontend SHALL send alert data to API
3. WHEN alert creation succeeds, THE Frontend SHALL display success message
4. THE Frontend SHALL call apiService.getPriceAlerts to load user alerts
5. THE Frontend SHALL display list of alerts from API response
6. WHEN user deletes alert, THE Frontend SHALL call apiService.deletePriceAlert
7. WHEN deletion succeeds, THE Frontend SHALL remove alert from display

### Requirement 31: Frontend Community Integration

**User Story:** As a user, I want to create and interact with posts through the API, so that my content is stored in the database.

#### Acceptance Criteria

1. THE Frontend SHALL update Community.tsx to call apiService.createPost
2. WHEN user creates post, THE Frontend SHALL send post data to API
3. WHEN post creation succeeds, THE Frontend SHALL add new post to display
4. THE Frontend SHALL call apiService.getPosts to load community posts
5. WHEN user likes a post, THE Frontend SHALL call apiService.likePost
6. WHEN like succeeds, THE Frontend SHALL update post likes count in display
7. WHERE user owns a post, THE Frontend SHALL provide delete functionality calling apiService.deletePost


### Requirement 32: Environment Configuration Frontend

**User Story:** As a developer, I want to configure API URL through environment variables, so that different environments use correct endpoints.

#### Acceptance Criteria

1. THE Frontend SHALL read API base URL from environment variable VITE_API_URL
2. THE Frontend SHALL use http://localhost:5000 as default API URL in development
3. THE Frontend SHALL create .env.example file documenting VITE_API_URL variable
4. THE Frontend SHALL exclude .env file from version control via .gitignore
5. WHERE production build is created, THE Frontend SHALL use production API URL from environment

### Requirement 33: Backend Logging

**User Story:** As a developer, I want comprehensive logging, so that I can debug issues and monitor application health.

#### Acceptance Criteria

1. THE Backend SHALL use morgan library for HTTP request logging
2. THE Backend SHALL log all incoming requests with method, URL, status code, and response time
3. THE Backend SHALL log database connection events
4. THE Backend SHALL log authentication events (login, logout, token verification failures)
5. THE Backend SHALL log validation errors with request details
6. THE Backend SHALL log server errors with stack traces
7. WHERE production mode is active, THE Backend SHALL log to file in addition to console
8. THE Backend SHALL not log sensitive information (passwords, tokens, hashes)


### Requirement 34: API Testing

**User Story:** As a developer, I want to test API endpoints, so that I can verify functionality and catch bugs early.

#### Acceptance Criteria

1. THE Backend SHALL use Jest and Supertest libraries for API testing
2. THE Backend SHALL provide test suite for authentication endpoints
3. THE Backend SHALL provide test suite for Spot endpoints
4. THE Backend SHALL provide test suite for Hotel endpoints
5. THE Backend SHALL provide test suite for Car endpoints
6. THE Backend SHALL provide test suite for Post endpoints
7. THE Backend SHALL provide test suite for Booking endpoints
8. THE Backend SHALL provide test suite for Price_Alert endpoints
9. THE Backend SHALL use test database separate from development database
10. THE Backend SHALL clear test database before each test suite
11. THE Backend SHALL test successful responses with valid inputs
12. THE Backend SHALL test error responses with invalid inputs
13. THE Backend SHALL test authentication and authorization logic
14. THE Backend SHALL achieve minimum 80% code coverage

### Requirement 35: Database Connection Testing

**User Story:** As a developer, I want to test database connectivity, so that I can verify MongoDB_Atlas connection works correctly.

#### Acceptance Criteria

1. THE Backend SHALL provide connection test script
2. WHEN connection test runs, THE Backend SHALL attempt connection to MongoDB_Atlas
3. WHEN connection succeeds, THE Backend SHALL log success message with database name
4. IF connection fails, THEN THE Backend SHALL log error details
5. THE connection test SHALL verify read and write operations
6. THE connection test SHALL be executable via npm script command


### Requirement 36: Admin Authorization Middleware

**User Story:** As a developer, I want to restrict admin endpoints, so that only admin users can modify data.

#### Acceptance Criteria

1. THE Backend SHALL provide admin authorization middleware
2. THE admin middleware SHALL verify user role is admin
3. WHEN user role is admin, THE Backend SHALL allow request to proceed
4. IF user role is not admin, THEN THE Backend SHALL return HTTP 403 with error message "Admin access required"
5. THE Backend SHALL apply admin middleware to POST, PUT, DELETE endpoints for Spot, Hotel, and Car resources
6. THE Backend SHALL allow GET endpoints without admin authorization

### Requirement 37: Graceful Shutdown

**User Story:** As a developer, I want the server to shut down gracefully, so that active connections are closed properly.

#### Acceptance Criteria

1. THE Backend SHALL listen for SIGTERM and SIGINT signals
2. WHEN shutdown signal is received, THE Backend SHALL stop accepting new connections
3. WHEN shutdown signal is received, THE Backend SHALL close MongoDB_Atlas connection
4. WHEN shutdown signal is received, THE Backend SHALL wait for active requests to complete with timeout of 10 seconds
5. WHEN all connections are closed, THE Backend SHALL exit process with code 0
6. IF timeout is reached, THEN THE Backend SHALL force exit with code 1

### Requirement 38: Health Check Endpoint

**User Story:** As a developer, I want a health check endpoint, so that I can monitor server and database status.

#### Acceptance Criteria

1. THE Backend SHALL provide GET /api/health API_Endpoint
2. WHEN /api/health is called, THE Backend SHALL check MongoDB_Atlas connection status
3. WHEN database connection is active, THE Backend SHALL return HTTP 200 with status "healthy"
4. IF database connection is inactive, THEN THE Backend SHALL return HTTP 503 with status "unhealthy"
5. THE health check response SHALL include uptime in seconds
6. THE health check response SHALL include timestamp
7. THE health check endpoint SHALL not require authentication


### Requirement 39: API Documentation

**User Story:** As a developer, I want API documentation, so that I understand how to use each endpoint.

#### Acceptance Criteria

1. THE Backend SHALL provide API documentation in README.md file
2. THE documentation SHALL list all API_Endpoint routes with HTTP methods
3. THE documentation SHALL describe request body structure for POST and PUT endpoints
4. THE documentation SHALL describe query parameters for GET endpoints
5. THE documentation SHALL describe response structure for each endpoint
6. THE documentation SHALL provide example requests and responses
7. THE documentation SHALL document authentication requirements
8. THE documentation SHALL document error response formats
9. WHERE Swagger/OpenAPI is implemented, THE Backend SHALL provide interactive API documentation at /api/docs

### Requirement 40: Backward Compatibility Mode

**User Story:** As a developer, I want to maintain mockService temporarily, so that I can gradually migrate components to the API.

#### Acceptance Criteria

1. THE Frontend SHALL keep mockService.ts file during transition period
2. THE Frontend SHALL create feature flag USE_API in environment variables
3. WHEN USE_API is true, THE Frontend SHALL use apiService for data operations
4. WHEN USE_API is false, THE Frontend SHALL use mockService for data operations
5. THE Frontend SHALL provide wrapper functions that route to apiService or mockService based on flag
6. THE Frontend SHALL document migration status for each component
7. WHEN all components are migrated, THE Frontend SHALL remove mockService and feature flag

### Requirement 41: Security Headers

**User Story:** As a developer, I want to implement security headers, so that the API is protected from common web vulnerabilities.

#### Acceptance Criteria

1. THE Backend SHALL use helmet library for security headers
2. THE Backend SHALL set X-Content-Type-Options header to nosniff
3. THE Backend SHALL set X-Frame-Options header to DENY
4. THE Backend SHALL set X-XSS-Protection header to 1; mode=block
5. THE Backend SHALL set Strict-Transport-Security header in production mode
6. THE Backend SHALL disable X-Powered-By header
7. THE Backend SHALL set Content-Security-Policy header with appropriate directives


### Requirement 42: Request Body Size Limiting

**User Story:** As a developer, I want to limit request body size, so that the server is protected from large payload attacks.

#### Acceptance Criteria

1. THE Backend SHALL use express.json middleware with size limit
2. THE Backend SHALL set maximum request body size to 10MB
3. WHEN request body exceeds size limit, THE Backend SHALL return HTTP 413 with error message "Request body too large"
4. THE Backend SHALL apply size limit to all API_Endpoint routes
5. WHERE image uploads are supported, THE Backend SHALL use separate size limit of 5MB for image fields

### Requirement 43: Database Backup Strategy

**User Story:** As a developer, I want to document database backup strategy, so that data can be recovered in case of failure.

#### Acceptance Criteria

1. THE Backend documentation SHALL describe MongoDB_Atlas automatic backup features
2. THE documentation SHALL describe point-in-time recovery capabilities
3. THE documentation SHALL provide instructions for manual backup using mongodump
4. THE documentation SHALL provide instructions for restore using mongorestore
5. THE documentation SHALL recommend backup frequency of daily for production
6. THE documentation SHALL recommend testing restore procedure monthly

### Requirement 44: Performance Monitoring

**User Story:** As a developer, I want to monitor API performance, so that I can identify and fix slow endpoints.

#### Acceptance Criteria

1. THE Backend SHALL log response time for each request
2. THE Backend SHALL identify requests taking longer than 1000ms
3. WHEN request exceeds 1000ms, THE Backend SHALL log warning with endpoint and duration
4. THE Backend SHALL provide endpoint to retrieve performance metrics
5. WHERE production mode is active, THE Backend SHALL integrate with monitoring service (optional)


### Requirement 45: AI Recommendation Integration

**User Story:** As a user, I want AI recommendations to work with the database, so that suggestions are based on real data.

#### Acceptance Criteria

1. THE Backend SHALL provide POST /api/ai/recommendations API_Endpoint
2. WHEN /api/ai/recommendations receives recommendation request, THE Backend SHALL query Spot Collection
3. THE Backend SHALL filter Spot documents by region if specified in request
4. THE Backend SHALL score Spot documents based on matching tags from interests array
5. THE Backend SHALL return top 5 highest scoring Spot documents
6. THE Backend SHALL provide POST /api/ai/chat API_Endpoint
7. WHEN /api/ai/chat receives query, THE Backend SHALL search Spot Collection for matching keywords
8. THE Backend SHALL return contextual response based on query and Spot data
9. THE Frontend SHALL update AIPlanner.tsx to use apiService for AI features

### Requirement 46: Search Optimization

**User Story:** As a user, I want fast search results, so that I can quickly find destinations.

#### Acceptance Criteria

1. THE Backend SHALL create text index on Spot name and description fields
2. THE Backend SHALL provide GET /api/spots/search/text API_Endpoint
3. WHEN text search is performed, THE Backend SHALL use MongoDB text search with index
4. THE Backend SHALL return results sorted by text search relevance score
5. THE Backend SHALL limit text search results to 20 documents
6. THE Backend SHALL support partial word matching in text search

### Requirement 47: Pagination Support

**User Story:** As a developer, I want to implement pagination, so that large result sets are handled efficiently.

#### Acceptance Criteria

1. THE Backend SHALL support page and limit query parameters on list endpoints
2. THE Backend SHALL set default page value to 1
3. THE Backend SHALL set default limit value to 20
4. THE Backend SHALL set maximum limit value to 100
5. WHEN pagination parameters are provided, THE Backend SHALL return paginated results
6. THE Backend SHALL include pagination metadata in response (total, page, limit, totalPages)
7. THE Backend SHALL apply pagination to GET /api/spots, /api/hotels, /api/cars, /api/posts endpoints


### Requirement 48: Mobile App Compatibility

**User Story:** As a mobile app user, I want the API to work with Capacitor, so that I can use the app on Android.

#### Acceptance Criteria

1. THE Backend SHALL accept requests from capacitor://localhost origin
2. THE Backend SHALL accept requests from https://localhost origin
3. THE Frontend SHALL configure axios to work with Capacitor HTTP plugin
4. THE Frontend SHALL handle network errors gracefully on mobile devices
5. THE Frontend SHALL store JWT_Token using Capacitor Preferences plugin on mobile
6. THE Frontend SHALL provide offline detection and user feedback
7. WHEN network is unavailable, THE Frontend SHALL display offline message

### Requirement 49: Data Seeding

**User Story:** As a developer, I want to seed the database with initial data, so that the application has content for testing and demonstration.

#### Acceptance Criteria

1. THE Backend SHALL provide seed script separate from Migration_Script
2. THE seed script SHALL insert all Spot documents from data.ts
3. THE seed script SHALL insert all Hotel documents from data.ts
4. THE seed script SHALL insert all Car documents from data.ts
5. THE seed script SHALL create admin user with credentials from environment variables
6. THE seed script SHALL create sample regular users for testing
7. THE seed script SHALL create sample Post documents
8. THE seed script SHALL check for existing data and skip if already seeded
9. THE seed script SHALL be executable via npm script command
10. THE seed script SHALL log progress and completion status

### Requirement 50: Production Deployment Readiness

**User Story:** As a developer, I want the backend to be production-ready, so that it can be deployed to a hosting service.

#### Acceptance Criteria

1. THE Backend SHALL include package.json with all dependencies and versions
2. THE Backend SHALL include start script for production mode
3. THE Backend SHALL include build script for TypeScript compilation
4. THE Backend SHALL include .gitignore excluding node_modules and .env files
5. THE Backend SHALL include README.md with setup and deployment instructions
6. THE Backend SHALL use process.env.NODE_ENV to detect production mode
7. WHERE production mode is active, THE Backend SHALL disable verbose logging
8. WHERE production mode is active, THE Backend SHALL enable compression middleware
9. THE Backend SHALL be deployable to services like Heroku, Railway, or Render
10. THE documentation SHALL provide deployment instructions for at least one hosting service
