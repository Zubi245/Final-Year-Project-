# Implementation Plan: MongoDB Database Integration

## Overview

This implementation plan converts the MongoDB database integration design into actionable coding tasks. The plan follows a phased approach: backend infrastructure setup, database models and schemas, authentication system, API endpoints by resource, frontend integration, data migration, and testing. Each task builds incrementally on previous work, with checkpoints to ensure stability before proceeding.

The implementation uses TypeScript for both backend (Node.js/Express) and frontend (React), MongoDB Atlas for cloud database storage, and JWT for authentication. External services (payment, email, AI) are excluded from this phase and will use mock/simulated implementations.

## Tasks

- [ ] 1. Backend infrastructure setup
  - [ ] 1.1 Initialize backend project structure
    - Create `backend/` directory with TypeScript configuration
    - Set up package.json with dependencies: express, mongoose, bcrypt, jsonwebtoken, cors, helmet, express-rate-limit, express-validator, morgan, dotenv
    - Configure tsconfig.json for Node.js with strict type checking
    - Create folder structure: src/{config,models,middleware,routes,controllers,utils,types}, scripts/, tests/
    - Set up .gitignore to exclude node_modules, .env, dist/
    - _Requirements: 1.1, 1.5, 50.1, 50.4_

  - [ ]* 1.2 Write unit tests for backend infrastructure
    - Test environment variable validation
    - Test server startup and shutdown
    - _Requirements: 1.1, 1.5_

- [ ] 2. Database connection and configuration
  - [ ] 2.1 Implement MongoDB Atlas connection
    - Create src/config/database.ts with connectDatabase function
    - Use Mongoose to connect with connection string from MONGODB_URI environment variable
    - Configure connection options: timeout 10s, pool size 5-10, auto-reconnect
    - Add connection event handlers for success, error, and disconnection
    - Implement graceful shutdown on SIGTERM/SIGINT signals
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 37.1, 37.2, 37.3, 37.4, 37.5, 37.6_

  - [ ] 2.2 Create environment configuration
    - Create .env.example with required variables: MONGODB_URI, JWT_SECRET, PORT, NODE_ENV, ADMIN_PASSWORD
    - Implement environment variable validation on startup
    - Exit process if required variables are missing
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9_


  - [ ]* 2.3 Write connection test script
    - Create scripts/testConnection.ts to verify MongoDB connection
    - Test read and write operations
    - Add npm script: "test-connection"
    - _Requirements: 35.1, 35.2, 35.3, 35.4, 35.5, 35.6_

- [ ] 3. Database models and schemas
  - [ ] 3.1 Implement User model
    - Create src/models/User.ts with IUser interface and schema
    - Define fields: name (string, min 2), email (unique, lowercase, email format), password (string, min 60), role (enum: user/admin, default user), avatar (optional string), timestamps
    - Add email index for query performance
    - Implement pre-save hook to hash password with bcrypt (10 salt rounds)
    - Add comparePassword method for password verification
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8, 5.9, 5.10, 12.1, 12.2, 12.3, 12.4, 12.5, 12.6, 12.7_

  - [ ]* 3.2 Write property test for User model
    - **Property 2: User Name Validation**
    - **Validates: Requirements 5.2**
    - Use fast-check to generate strings with length < 2
    - Verify user creation fails with validation error

  - [ ]* 3.3 Write property test for User email validation
    - **Property 3: User Email Format Validation**
    - **Validates: Requirements 5.3**
    - Use fast-check to generate invalid email strings
    - Verify user creation fails with validation error

  - [ ]* 3.4 Write property test for password hashing
    - **Property 5: Password Hashing**
    - **Validates: Requirements 5.5, 12.2, 12.3**
    - Verify stored password is 60-char bcrypt hash, not plain text

  - [ ] 3.5 Implement Spot model
    - Create src/models/Spot.ts with ISpot interface and schema
    - Define fields: name, region (enum), description, imageUrl (URL validation), tags (array), rating (0-5), coordinates (lat/lng with range validation), amenities (array), reviews (number, min 0), timestamps
    - Add indexes: region, tags, coordinates (2dsphere), text index on name and description
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8, 6.9, 6.10, 6.11, 6.12, 6.13_

  - [ ]* 3.6 Write property test for Spot schema validation
    - **Property 10: Spot Schema Validation**
    - **Validates: Requirements 6.1-6.11**
    - Verify all required fields present and valid

  - [ ] 3.7 Implement Hotel model
    - Create src/models/Hotel.ts with IHotel interface and schema
    - Define fields: name, location, pricePerNight (min 0), rating (0-5), imageUrl (URL validation), amenities (array), timestamps
    - Add indexes: location, pricePerNight
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 7.8, 7.9_

  - [ ]* 3.8 Write property test for Hotel schema validation
    - **Property 11: Hotel Schema Validation**
    - **Validates: Requirements 7.1-7.7**
    - Verify all required fields present and valid

  - [ ] 3.9 Implement Car model
    - Create src/models/Car.ts with ICar interface and schema
    - Define fields: model, type (enum: SUV/Sedan/4x4/Van), pricePerDay (min 0), imageUrl (URL validation), features (array), timestamps
    - Add indexes: type, pricePerDay
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 8.8_

  - [ ]* 3.10 Write property test for Car schema validation
    - **Property 12: Car Schema Validation**
    - **Validates: Requirements 8.1-8.6**
    - Verify all required fields present and valid

  - [ ] 3.11 Implement Post model
    - Create src/models/Post.ts with IPost interface and schema
    - Define fields: userId (ObjectId ref to User), userName, content (max 1000 chars), image (optional base64), likes (default 0, min 0), timestamp (default now), locationTag (optional)
    - Add indexes: userId, timestamp (descending)
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7, 9.8, 9.9, 9.10_

  - [ ]* 3.12 Write property test for Post schema validation
    - **Property 13: Post Schema Validation**
    - **Validates: Requirements 9.1-9.7**
    - Verify all required fields present and valid

  - [ ] 3.13 Implement Booking model
    - Create src/models/Booking.ts with IBooking interface and schema
    - Define fields: userId (ObjectId ref), spotId (ObjectId ref), spotName, packageType, guests (min 1), startDate, endDate, totalCost (min 0), status (enum: pending/confirmed/cancelled, default confirmed), createdAt (default now)
    - Add custom validator: endDate must be after startDate
    - Add indexes: userId, createdAt (descending)
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7, 10.8, 10.9, 10.10, 10.11, 10.12, 10.13, 10.14_

  - [ ]* 3.14 Write property test for Booking date validation
    - **Property 14: Booking Date Validation**
    - **Validates: Requirements 10.8, 19.4, 19.5**
    - Verify endDate must be after startDate

  - [ ] 3.15 Implement PriceAlert model
    - Create src/models/PriceAlert.ts with IPriceAlert interface and schema
    - Define fields: userId (ObjectId ref), itemType (enum: spot/hotel/car), itemId, itemName, targetPrice (min 0), email (email validation), createdAt (default now)
    - Add indexes: userId, compound index on itemType and itemId
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6, 11.7, 11.8, 11.9, 11.10_

  - [ ]* 3.16 Write property test for PriceAlert schema validation
    - **Property 16: Price Alert Schema Validation**
    - **Validates: Requirements 11.1-11.8, 20.4, 20.5**
    - Verify all required fields present and valid

  - [ ] 3.17 Implement Review model (NEW)
    - Create src/models/Review.ts with IReview interface and schema
    - Define fields: userId (ObjectId ref), itemType (enum: spot/hotel/car), itemId (ObjectId with dynamic ref), rating (1-5), comment (optional, max 500 chars), timestamps
    - Add indexes: userId, compound on itemType and itemId, createdAt (descending)
    - Add unique compound index on userId, itemType, itemId to prevent duplicate reviews
    - _Requirements: Design document Review Model section_

  - [ ]* 3.18 Write unit tests for Review model
    - Test duplicate review prevention
    - Test rating range validation
    - _Requirements: Design document Review Model section_

- [ ] 4. Checkpoint - Verify models
  - Ensure all models compile without errors, run test-connection script, ask the user if questions arise.


- [ ] 5. Authentication and security middleware
  - [ ] 5.1 Implement JWT utilities
    - Create src/utils/jwt.ts with generateToken and verifyToken functions
    - generateToken: create JWT with user id, email, role, expires in 7 days
    - verifyToken: verify and decode JWT using JWT_SECRET
    - _Requirements: 13.1, 13.2, 13.3, 13.4_

  - [ ]* 5.2 Write property test for JWT token generation
    - **Property 8: JWT Token Generation**
    - **Validates: Requirements 13.2, 14.5**
    - Verify token contains user ID, email, and role

  - [ ] 5.3 Implement authentication middleware
    - Create src/middleware/auth.ts with authenticate function
    - Extract token from Authorization header (Bearer format)
    - Verify token and attach user info to req.user
    - Return 401 if token missing, invalid, or expired
    - Define AuthRequest interface extending Express Request
    - _Requirements: 13.5, 13.6, 13.7, 13.8, 13.9, 13.10_

  - [ ]* 5.4 Write property test for JWT authentication
    - **Property 9: JWT Token Authentication**
    - **Validates: Requirements 13.5-13.9**
    - Verify valid tokens accepted, invalid tokens rejected with 401

  - [ ] 5.5 Implement admin authorization middleware
    - Create src/middleware/admin.ts with requireAdmin function
    - Check if req.user.role === 'admin'
    - Return 403 if not admin
    - _Requirements: 36.1, 36.2, 36.3, 36.4_

  - [ ]* 5.6 Write unit tests for admin middleware
    - Test admin access allowed
    - Test non-admin access denied with 403
    - _Requirements: 36.1-36.5_

  - [ ] 5.7 Implement validation middleware
    - Create src/middleware/validation.ts with validate function
    - Use express-validator for input validation
    - Create validation chains for common patterns: email, ObjectId, string length, numeric ranges, enum values
    - Return 400 with validation errors array if validation fails
    - _Requirements: 22.1, 22.2, 22.3, 22.4, 22.5, 22.6, 22.7, 22.8, 22.9, 22.10_

  - [ ]* 5.8 Write unit tests for validation middleware
    - Test email format validation
    - Test string length validation
    - Test numeric range validation
    - _Requirements: 22.1-22.10_

  - [ ] 5.9 Implement error handler middleware
    - Create src/middleware/errorHandler.ts with errorHandler function
    - Handle Mongoose validation errors (400)
    - Handle Mongoose duplicate key errors (409)
    - Handle Mongoose cast errors (400)
    - Handle JWT errors (401)
    - Return consistent error response format: {success: false, message, errors?, statusCode}
    - Hide stack traces in production
    - _Requirements: 1.7, 1.8, 24.1, 24.2, 24.3, 24.4, 24.5, 24.6, 24.7, 24.8, 24.9, 24.10, 24.11_

  - [ ]* 5.10 Write unit tests for error handler
    - Test validation error formatting
    - Test duplicate key error handling
    - Test JWT error handling
    - _Requirements: 24.1-24.11_

  - [ ] 5.11 Implement security headers and rate limiting
    - Configure helmet middleware for security headers
    - Configure CORS with allowed origins: localhost:5173, localhost:5174, capacitor://localhost, https://localhost, production URL
    - Implement rate limiter: 100 requests per 15 min for general API
    - Implement stricter rate limiter: 5 attempts per 15 min for auth endpoints
    - Configure request body size limit: 10MB
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 23.1, 23.2, 23.3, 23.4, 23.5, 23.6, 23.7, 23.8, 41.1, 41.2, 41.3, 41.4, 41.5, 41.6, 41.7, 42.1, 42.2, 42.3, 42.4, 42.5_

  - [ ]* 5.12 Write unit tests for security middleware
    - Test CORS configuration
    - Test rate limiting
    - Test request body size limiting
    - _Requirements: 4.1-4.8, 23.1-23.8, 42.1-42.5_

- [ ] 6. Authentication endpoints
  - [ ] 6.1 Implement authentication controller
    - Create src/controllers/auth.controller.ts
    - Implement signup: validate input, check duplicate email, create user with hashed password, generate JWT, return 201 with token and user
    - Implement login: validate credentials, compare password, generate JWT, return 200 with token and user
    - Implement getCurrentUser: return authenticated user data (exclude password)
    - Implement logout: return 200 with success message
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5, 14.6, 14.7, 14.8, 14.9, 14.10, 14.11, 14.12_

  - [ ] 6.2 Create authentication routes
    - Create src/routes/auth.routes.ts
    - POST /api/auth/signup with validation
    - POST /api/auth/login with validation and stricter rate limiting
    - GET /api/auth/me with authentication middleware
    - POST /api/auth/logout
    - _Requirements: 14.1, 14.5, 14.9, 14.11_

  - [ ]* 6.3 Write property test for user signup
    - **Property 17: User Signup Success**
    - **Validates: Requirements 14.1-14.3**
    - Verify valid signup creates user and returns JWT

  - [ ]* 6.4 Write property test for user login
    - **Property 18: User Login Success**
    - **Validates: Requirements 14.5-14.7**
    - Verify correct credentials return JWT

  - [ ]* 6.5 Write unit tests for authentication endpoints
    - Test signup with duplicate email returns 400
    - Test login with invalid credentials returns 401
    - Test getCurrentUser without token returns 401
    - Test logout returns 200
    - _Requirements: 14.1-14.12_

- [ ] 7. Spot endpoints
  - [ ] 7.1 Implement Spot controller
    - Create src/controllers/spot.controller.ts
    - Implement getSpots: return all spots with pagination
    - Implement getSpot: return single spot by ID, 404 if not found
    - Implement searchSpots: filter by region, tags, minRating
    - Implement searchSpotsText: full-text search on name and description
    - Implement createSpot: admin only, create new spot, return 201
    - Implement updateSpot: admin only, update spot, return 200
    - Implement deleteSpot: admin only, delete spot, return 200
    - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5, 15.6, 15.7, 15.8, 15.9, 15.10, 15.11, 15.12, 15.13, 46.1, 46.2, 46.3, 46.4, 46.5, 46.6_

  - [ ] 7.2 Create Spot routes
    - Create src/routes/spot.routes.ts
    - GET /api/spots with pagination support
    - GET /api/spots/:id with ObjectId validation
    - GET /api/spots/search with query parameter validation
    - GET /api/spots/search/text with query parameter validation
    - POST /api/spots with authentication and admin middleware
    - PUT /api/spots/:id with authentication and admin middleware
    - DELETE /api/spots/:id with authentication and admin middleware
    - _Requirements: 15.1-15.13, 46.1-46.6_

  - [ ]* 7.3 Write property test for Spot search filtering
    - **Property 21: Spot Search Filtering**
    - **Validates: Requirements 15.7-15.10**
    - Verify search results match all specified criteria

  - [ ]* 7.4 Write unit tests for Spot endpoints
    - Test getSpots returns array
    - Test getSpot with invalid ID returns 404
    - Test createSpot without admin returns 403
    - Test searchSpots with filters
    - _Requirements: 15.1-15.13_

- [ ] 8. Hotel endpoints
  - [ ] 8.1 Implement Hotel controller
    - Create src/controllers/hotel.controller.ts
    - Implement getHotels: return all hotels with pagination
    - Implement getHotel: return single hotel by ID, 404 if not found
    - Implement searchHotels: filter by location, minPrice, maxPrice
    - Implement updateHotelPrice: admin only, update pricePerNight, return 200
    - _Requirements: 16.1, 16.2, 16.3, 16.4, 16.5, 16.6, 16.7, 16.8, 16.9, 16.10_

  - [ ] 8.2 Create Hotel routes
    - Create src/routes/hotel.routes.ts
    - GET /api/hotels with pagination support
    - GET /api/hotels/:id with ObjectId validation
    - GET /api/hotels/search with query parameter validation
    - PUT /api/hotels/:id with authentication and admin middleware
    - _Requirements: 16.1-16.10_

  - [ ]* 8.3 Write property test for Hotel search filtering
    - **Property 22: Hotel Search Filtering**
    - **Validates: Requirements 16.7, 16.8**
    - Verify search results match price range and location

  - [ ]* 8.4 Write unit tests for Hotel endpoints
    - Test getHotels returns array
    - Test searchHotels with price range
    - Test updateHotelPrice without admin returns 403
    - _Requirements: 16.1-16.10_


- [ ] 9. Car endpoints
  - [ ] 9.1 Implement Car controller
    - Create src/controllers/car.controller.ts
    - Implement getCars: return all cars with pagination
    - Implement getCar: return single car by ID, 404 if not found
    - Implement searchCars: filter by type, minPrice, maxPrice
    - Implement updateCarPrice: admin only, update pricePerDay, return 200
    - _Requirements: 17.1, 17.2, 17.3, 17.4, 17.5, 17.6, 17.7, 17.8, 17.9, 17.10_

  - [ ] 9.2 Create Car routes
    - Create src/routes/car.routes.ts
    - GET /api/cars with pagination support
    - GET /api/cars/:id with ObjectId validation
    - GET /api/cars/search with query parameter validation
    - PUT /api/cars/:id with authentication and admin middleware
    - _Requirements: 17.1-17.10_

  - [ ]* 9.3 Write property test for Car search filtering
    - **Property 23: Car Search Filtering**
    - **Validates: Requirements 17.7, 17.8**
    - Verify search results match type and price range

  - [ ]* 9.4 Write unit tests for Car endpoints
    - Test getCars returns array
    - Test searchCars with type filter
    - Test updateCarPrice without admin returns 403
    - _Requirements: 17.1-17.10_

- [ ] 10. Post endpoints
  - [ ] 10.1 Implement Post controller
    - Create src/controllers/post.controller.ts
    - Implement getPosts: return all posts sorted by timestamp descending with pagination
    - Implement createPost: set userId from JWT token, create post, return 201
    - Implement likePost: increment likes by 1, return 200
    - Implement deletePost: verify ownership, delete post, return 200 or 403
    - _Requirements: 18.1, 18.2, 18.3, 18.4, 18.5, 18.6, 18.7, 18.8, 18.9, 18.10, 18.11_

  - [ ] 10.2 Create Post routes
    - Create src/routes/post.routes.ts
    - GET /api/posts with pagination support
    - POST /api/posts with authentication and validation
    - PUT /api/posts/:id/like with authentication
    - DELETE /api/posts/:id with authentication
    - _Requirements: 18.1-18.11_

  - [ ]* 10.3 Write property test for Post creation authorization
    - **Property 24: Post Creation Authorization**
    - **Validates: Requirements 18.4**
    - Verify userId set from JWT token, not request body

  - [ ]* 10.4 Write property test for Post ownership authorization
    - **Property 25: Post Ownership Authorization**
    - **Validates: Requirements 18.10, 18.11**
    - Verify only owner can delete post

  - [ ]* 10.5 Write unit tests for Post endpoints
    - Test createPost without authentication returns 401
    - Test deletePost by non-owner returns 403
    - Test likePost increments likes
    - _Requirements: 18.1-18.11_

- [ ] 11. Booking endpoints
  - [ ] 11.1 Implement Booking controller
    - Create src/controllers/booking.controller.ts
    - Implement getBookings: return user's bookings sorted by createdAt descending
    - Implement getBooking: verify ownership, return booking or 403
    - Implement createBooking: set userId from JWT token, validate date range, create booking, return 201
    - Implement cancelBooking: verify ownership, update status to cancelled, return 200 or 403
    - _Requirements: 19.1, 19.2, 19.3, 19.4, 19.5, 19.6, 19.7, 19.8, 19.9, 19.10, 19.11, 19.12, 19.13_

  - [ ] 11.2 Create Booking routes
    - Create src/routes/booking.routes.ts
    - GET /api/bookings with authentication
    - GET /api/bookings/:id with authentication
    - POST /api/bookings with authentication and validation
    - PATCH /api/bookings/:id/cancel with authentication
    - _Requirements: 19.1-19.13_

  - [ ]* 11.3 Write property test for Booking ownership authorization
    - **Property 26: Booking Ownership Authorization**
    - **Validates: Requirements 19.9, 19.10, 19.12**
    - Verify only owner can access/cancel booking

  - [ ]* 11.4 Write unit tests for Booking endpoints
    - Test createBooking with invalid date range returns 400
    - Test getBooking by non-owner returns 403
    - Test cancelBooking updates status
    - _Requirements: 19.1-19.13_

- [ ] 12. Price Alert endpoints
  - [ ] 12.1 Implement PriceAlert controller
    - Create src/controllers/priceAlert.controller.ts
    - Implement getPriceAlerts: return user's price alerts
    - Implement createPriceAlert: set userId from JWT token, validate email, create alert, return 201
    - Implement deletePriceAlert: verify ownership, delete alert, return 200 or 403
    - _Requirements: 20.1, 20.2, 20.3, 20.4, 20.5, 20.6, 20.7, 20.8, 20.9, 20.10, 20.11_

  - [ ] 12.2 Create PriceAlert routes
    - Create src/routes/priceAlert.routes.ts
    - GET /api/price-alerts with authentication
    - POST /api/price-alerts with authentication and validation
    - DELETE /api/price-alerts/:id with authentication
    - _Requirements: 20.1-20.11_

  - [ ]* 12.3 Write property test for PriceAlert ownership authorization
    - **Property 27: Price Alert Ownership Authorization**
    - **Validates: Requirements 20.9, 20.10**
    - Verify only owner can delete alert

  - [ ]* 12.4 Write unit tests for PriceAlert endpoints
    - Test createPriceAlert with invalid email returns 400
    - Test deletePriceAlert by non-owner returns 403
    - _Requirements: 20.1-20.11_

- [ ] 13. Review endpoints (NEW)
  - [ ] 13.1 Implement Review controller
    - Create src/controllers/review.controller.ts
    - Implement getReviews: filter by itemType and itemId query parameters
    - Implement createReview: set userId from JWT token, create review, return 201 or 400 if duplicate
    - Implement updateReview: verify ownership, update review, return 200 or 403
    - Implement deleteReview: verify ownership, delete review, return 200 or 403
    - _Requirements: Design document Review endpoints section_

  - [ ] 13.2 Create Review routes
    - Create src/routes/review.routes.ts
    - GET /api/reviews with query parameter validation
    - POST /api/reviews with authentication and validation
    - PUT /api/reviews/:id with authentication and validation
    - DELETE /api/reviews/:id with authentication
    - _Requirements: Design document Review endpoints section_

  - [ ]* 13.3 Write unit tests for Review endpoints
    - Test createReview with duplicate returns 400
    - Test updateReview by non-owner returns 403
    - Test deleteReview by non-owner returns 403
    - _Requirements: Design document Review endpoints section_

- [ ] 14. User profile endpoints
  - [ ] 14.1 Implement User controller
    - Create src/controllers/user.controller.ts
    - Implement getProfile: return authenticated user data (exclude password)
    - Implement updateProfile: allow updating name and avatar only, ignore email and role, return 200
    - Implement changePassword: verify currentPassword, hash and save newPassword, return 200 or 401
    - _Requirements: 21.1, 21.2, 21.3, 21.4, 21.5, 21.6, 21.7, 21.8, 21.9, 21.10, 21.11_

  - [ ] 14.2 Create User routes
    - Create src/routes/user.routes.ts
    - GET /api/users/profile with authentication
    - PUT /api/users/profile with authentication and validation
    - PUT /api/users/password with authentication and validation
    - _Requirements: 21.1-21.11_

  - [ ]* 14.3 Write unit tests for User profile endpoints
    - Test updateProfile ignores email and role changes
    - Test changePassword with incorrect current password returns 401
    - _Requirements: 21.1-21.11_

- [ ] 15. AI endpoints (mock implementation)
  - [ ] 15.1 Implement AI controller
    - Create src/controllers/ai.controller.ts
    - Implement getRecommendations: query Spot collection, filter by region if specified, score by matching interest tags, return top 5
    - Implement chatWithAI: search Spot collection for keywords, return contextual response based on query
    - _Requirements: 45.1, 45.2, 45.3, 45.4, 45.5, 45.6, 45.7, 45.8, 45.9_

  - [ ] 15.2 Create AI routes
    - Create src/routes/ai.routes.ts
    - POST /api/ai/recommendations with validation
    - POST /api/ai/chat with validation
    - _Requirements: 45.1-45.9_

  - [ ]* 15.3 Write property test for AI recommendations filtering
    - **Property 32: AI Recommendations Filtering**
    - **Validates: Requirements 45.1-45.5**
    - Verify recommendations match region and scored by interests

  - [ ]* 15.4 Write unit tests for AI endpoints
    - Test getRecommendations returns max 5 spots
    - Test chatWithAI returns string response
    - _Requirements: 45.1-45.9_


- [ ] 16. Health check and logging
  - [ ] 16.1 Implement health check endpoint
    - Create health check route: GET /api/health
    - Check MongoDB connection status
    - Return 200 with status "healthy" if connected, 503 with "unhealthy" if disconnected
    - Include uptime and timestamp in response
    - _Requirements: 38.1, 38.2, 38.3, 38.4, 38.5, 38.6, 38.7_

  - [ ] 16.2 Configure logging
    - Add morgan middleware for HTTP request logging
    - Log database connection events
    - Log authentication events (login, logout, token failures)
    - Log validation errors with request details
    - Log server errors with stack traces
    - Configure file logging for production mode
    - Never log sensitive information (passwords, tokens, hashes)
    - _Requirements: 33.1, 33.2, 33.3, 33.4, 33.5, 33.6, 33.7, 33.8_

  - [ ]* 16.3 Write unit tests for health check
    - Test health check returns 200 when database connected
    - Test health check returns 503 when database disconnected
    - _Requirements: 38.1-38.7_

- [ ] 17. Main server setup
  - [ ] 17.1 Implement Express server
    - Create src/server.ts as main entry point
    - Initialize Express app
    - Apply middleware in order: helmet, cors, morgan, rate limiting, body parser, routes
    - Mount all route modules: auth, spots, hotels, cars, posts, bookings, price-alerts, reviews, users, ai, health
    - Add 404 handler for unmatched routes
    - Add global error handler
    - Connect to database before starting server
    - Listen on PORT from environment (default 5000)
    - Log server status and port on startup
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.6, 1.9_

  - [ ] 17.2 Add production optimizations
    - Enable compression middleware in production
    - Disable verbose logging in production
    - Configure production-specific CORS origins
    - _Requirements: 50.6, 50.7, 50.8_

  - [ ]* 17.3 Write integration tests for server
    - Test server starts successfully
    - Test 404 handler for invalid routes
    - Test global error handler
    - _Requirements: 1.1-1.9_

- [ ] 18. Checkpoint - Backend API complete
  - Ensure all tests pass, start backend server, test health check endpoint, ask the user if questions arise.

- [ ] 19. Data migration and seeding
  - [ ] 19.1 Create migration script
    - Create scripts/migrate.ts
    - Connect to MongoDB Atlas
    - Check if data already exists (skip if spotCount > 0)
    - Read initial data from src/data.ts (INITIAL_SPOTS, HOTELS, CARS)
    - Insert spots, hotels, cars using insertMany
    - Create admin user with email admin@tripwise.pk and password from ADMIN_PASSWORD env var
    - Log count of inserted documents
    - Handle errors and exit with appropriate code
    - Add npm script: "migrate"
    - _Requirements: 25.1, 25.2, 25.3, 25.4, 25.5, 25.6, 25.7, 25.8, 25.9, 25.10, 25.11, 25.12_

  - [ ] 19.2 Create seed script
    - Create scripts/seed.ts
    - Clear existing data from all collections
    - Insert spots, hotels, cars from data.ts
    - Create admin user and sample regular users
    - Create sample posts and bookings
    - Check for existing data and skip if already seeded
    - Log progress and completion status
    - Add npm script: "seed"
    - _Requirements: 49.1, 49.2, 49.3, 49.4, 49.5, 49.6, 49.7, 49.8, 49.9, 49.10_

  - [ ]* 19.3 Write unit tests for migration script
    - Test migration skips if data exists
    - Test migration creates admin user
    - _Requirements: 25.1-25.12_

- [ ] 20. Frontend API service
  - [ ] 20.1 Create API service module
    - Create src/services/apiService.ts
    - Configure axios instance with baseURL from VITE_API_URL (default http://localhost:5000)
    - Set timeout to 10 seconds
    - Add request interceptor to attach JWT token from localStorage
    - Add response interceptor to handle 401 errors (clear token, redirect to /auth)
    - _Requirements: 26.1, 26.2, 26.3, 26.4, 26.5, 26.6, 26.7, 26.8, 26.9, 26.10, 26.11_

  - [ ] 20.2 Implement authentication methods
    - Implement login(email, password): POST /api/auth/login, store token and user in localStorage
    - Implement signup(name, email, password): POST /api/auth/signup, store token and user in localStorage
    - Implement logout(): POST /api/auth/logout, remove token and user from localStorage
    - Implement getCurrentUser(): GET /api/auth/me
    - _Requirements: 26.1-26.11_

  - [ ] 20.3 Implement resource methods
    - Implement getSpots(), getSpot(id), searchSpots(params)
    - Implement getHotels(), getHotel(id), searchHotels(params)
    - Implement getCars(), getCar(id), searchCars(params)
    - Implement getPosts(), createPost(data), likePost(id), deletePost(id)
    - Implement getBookings(), createBooking(data), cancelBooking(id)
    - Implement getPriceAlerts(), createPriceAlert(data), deletePriceAlert(id)
    - Implement getReviews(itemType, itemId), createReview(data), updateReview(id, data), deleteReview(id)
    - Implement getAIRecommendations(request), chatWithAI(query)
    - _Requirements: 26.1-26.11_

  - [ ]* 20.4 Write unit tests for API service
    - Test request interceptor attaches token
    - Test response interceptor handles 401
    - Test all API methods call correct endpoints
    - _Requirements: 26.1-26.11_

- [ ] 21. Frontend authentication integration
  - [ ] 21.1 Update Auth context
    - Update src/contexts/AuthContext.tsx
    - Replace mock login/signup with apiService calls
    - Store JWT token and user data in localStorage
    - Load user from localStorage on mount
    - Clear token and user on logout
    - _Requirements: 27.1, 27.2, 27.3, 27.4, 27.5, 27.6, 27.7, 27.8, 27.9_

  - [ ] 21.2 Update Auth page
    - Update pages/Auth.tsx to use apiService
    - Handle loading states during login/signup
    - Display error messages from API responses
    - _Requirements: 27.1-27.9_

  - [ ]* 21.3 Write integration tests for Auth
    - Test login flow with valid credentials
    - Test signup flow with valid data
    - Test error handling for invalid credentials
    - _Requirements: 27.1-27.9_

- [ ] 22. Frontend data fetching integration
  - [ ] 22.1 Update Explore page
    - Update pages/Explore.tsx to use apiService.getSpots()
    - Add loading state while fetching
    - Add error state with retry functionality
    - Handle empty results
    - _Requirements: 28.1, 28.5, 28.6, 28.7, 28.8_

  - [ ] 22.2 Update Hotels page
    - Update pages/Hotels.tsx to use apiService.getHotels()
    - Add loading and error states
    - _Requirements: 28.2, 28.5, 28.6, 28.7_

  - [ ] 22.3 Update Transport page
    - Update pages/Transport.tsx to use apiService.getCars()
    - Add loading and error states
    - _Requirements: 28.3, 28.5, 28.6, 28.7_

  - [ ] 22.4 Update Community page
    - Update pages/Community.tsx to use apiService.getPosts()
    - Add loading and error states
    - _Requirements: 28.4, 28.5, 28.6, 28.7_

  - [ ] 22.5 Update SpotDetails component
    - Update components/SpotDetails.tsx to use apiService.getSpot(id)
    - Add loading and error states
    - _Requirements: 28.1, 28.5, 28.6, 28.7_

  - [ ]* 22.6 Write integration tests for data fetching
    - Test Explore page loads spots
    - Test error handling when API fails
    - _Requirements: 28.1-28.9_

- [ ] 23. Frontend booking integration
  - [ ] 23.1 Update Payment page
    - Update pages/Payment.tsx to use apiService.createBooking()
    - Send booking data to API after payment simulation
    - Navigate to confirmation on success
    - Display error message on failure
    - _Requirements: 29.1, 29.2, 29.3, 29.4_

  - [ ] 23.2 Create or update User Profile page
    - Create/update pages/Profile.tsx to display user bookings
    - Use apiService.getBookings() to fetch bookings
    - Display booking details from API response
    - Add cancel booking functionality using apiService.cancelBooking(id)
    - _Requirements: 29.5, 29.6, 29.7_

  - [ ]* 23.3 Write integration tests for booking
    - Test booking creation flow
    - Test booking cancellation
    - _Requirements: 29.1-29.7_


- [ ] 24. Frontend price alert integration
  - [ ] 24.1 Update PriceAlerts page
    - Update pages/PriceAlerts.tsx to use apiService
    - Use apiService.createPriceAlert(data) for creating alerts
    - Use apiService.getPriceAlerts() to load user alerts
    - Use apiService.deletePriceAlert(id) for deleting alerts
    - Display success/error messages
    - Add loading and error states
    - _Requirements: 30.1, 30.2, 30.3, 30.4, 30.5, 30.6, 30.7_

  - [ ]* 24.2 Write integration tests for price alerts
    - Test alert creation
    - Test alert deletion
    - _Requirements: 30.1-30.7_

- [ ] 25. Frontend community integration
  - [ ] 25.1 Update Community page for post creation
    - Update pages/Community.tsx to use apiService.createPost(data)
    - Send post data to API
    - Add new post to display on success
    - Display error message on failure
    - _Requirements: 31.1, 31.2, 31.3_

  - [ ] 25.2 Update Community page for post interactions
    - Use apiService.getPosts() to load posts
    - Use apiService.likePost(id) when user likes a post
    - Update likes count in display on success
    - Add delete functionality for own posts using apiService.deletePost(id)
    - _Requirements: 31.4, 31.5, 31.6, 31.7_

  - [ ]* 25.3 Write integration tests for community
    - Test post creation
    - Test post liking
    - Test post deletion
    - _Requirements: 31.1-31.7_

- [ ] 26. Frontend AI integration
  - [ ] 26.1 Update AIPlanner page
    - Update pages/AIPlanner.tsx to use apiService
    - Use apiService.getAIRecommendations(request) for recommendations
    - Use apiService.chatWithAI(query) for chat functionality
    - Add loading and error states
    - _Requirements: 45.9_

  - [ ]* 26.2 Write integration tests for AI features
    - Test AI recommendations
    - Test AI chat
    - _Requirements: 45.9_

- [ ] 27. Frontend environment configuration
  - [ ] 27.1 Create environment files
    - Create .env.example with VITE_API_URL
    - Create .env with VITE_API_URL=http://localhost:5000
    - Update .gitignore to exclude .env
    - _Requirements: 32.1, 32.2, 32.3, 32.4_

  - [ ] 27.2 Configure production environment
    - Document production API URL configuration
    - _Requirements: 32.5_

- [ ] 28. Mobile app compatibility
  - [ ] 28.1 Configure Capacitor HTTP
    - Update apiService.ts to work with Capacitor HTTP plugin
    - Handle network errors gracefully on mobile
    - _Requirements: 48.1, 48.2, 48.3, 48.4_

  - [ ] 28.2 Implement token storage for mobile
    - Use Capacitor Preferences plugin for JWT token storage on mobile
    - Detect platform and use appropriate storage (localStorage for web, Preferences for mobile)
    - _Requirements: 48.5_

  - [ ] 28.3 Add offline detection
    - Implement network status detection
    - Display offline message when network unavailable
    - _Requirements: 48.6, 48.7_

  - [ ]* 28.4 Write tests for mobile compatibility
    - Test Capacitor HTTP integration
    - Test offline detection
    - _Requirements: 48.1-48.7_

- [ ] 29. Error handling and loading states
  - [ ] 29.1 Create reusable error component
    - Create components/ErrorMessage.tsx
    - Display error message with optional retry button
    - _Requirements: 28.6, 28.7_

  - [ ] 29.2 Create reusable loading component
    - Create components/LoadingSpinner.tsx
    - Display loading spinner with message
    - _Requirements: 28.5_

  - [ ] 29.3 Implement error handling pattern
    - Update all components to use try-catch with loading and error states
    - Display ErrorMessage component on errors
    - Display LoadingSpinner component while loading
    - _Requirements: 28.5, 28.6, 28.7, 28.8_

  - [ ]* 29.4 Write unit tests for error and loading components
    - Test ErrorMessage displays message and retry button
    - Test LoadingSpinner displays correctly
    - _Requirements: 28.5-28.7_

- [ ] 30. Checkpoint - Frontend integration complete
  - Ensure all frontend components use apiService, test all user flows end-to-end, ask the user if questions arise.

- [ ] 31. Documentation
  - [ ] 31.1 Create backend README
    - Document setup instructions
    - Document environment variables
    - Document API endpoints with examples
    - Document deployment instructions for at least one hosting service
    - _Requirements: 39.1, 39.2, 39.3, 39.4, 39.5, 39.6, 39.7, 39.8, 50.5, 50.9, 50.10_

  - [ ] 31.2 Document database backup strategy
    - Document MongoDB Atlas automatic backup features
    - Document point-in-time recovery capabilities
    - Provide instructions for manual backup using mongodump
    - Provide instructions for restore using mongorestore
    - Recommend backup frequency and testing procedures
    - _Requirements: 43.1, 43.2, 43.3, 43.4, 43.5, 43.6_

  - [ ] 31.3 Create API documentation
    - Document all endpoints with HTTP methods
    - Document request body structures
    - Document query parameters
    - Document response structures
    - Provide example requests and responses
    - Document authentication requirements
    - Document error response formats
    - _Requirements: 39.1-39.9_

- [ ] 32. Performance monitoring
  - [ ] 32.1 Implement performance logging
    - Log response time for each request
    - Identify and log requests taking longer than 1000ms
    - _Requirements: 44.1, 44.2, 44.3, 44.4_

  - [ ]* 32.2 Write tests for performance monitoring
    - Test slow request logging
    - _Requirements: 44.1-44.4_

- [ ] 33. Final testing and validation
  - [ ]* 33.1 Run all unit tests
    - Execute all unit tests for backend and frontend
    - Ensure minimum 80% code coverage
    - _Requirements: 34.1-34.14_

  - [ ]* 33.2 Run all property-based tests
    - Execute all property tests with minimum 100 iterations
    - Verify all properties pass
    - _Requirements: Design document Property-Based Testing section_

  - [ ]* 33.3 Run integration tests
    - Test authentication flow end-to-end
    - Test booking flow end-to-end
    - Test community features end-to-end
    - _Requirements: 34.1-34.14_

  - [ ] 33.4 Manual testing checklist
    - Test user signup and login
    - Test spot/hotel/car browsing and search
    - Test booking creation and cancellation
    - Test post creation, liking, and deletion
    - Test price alert creation and deletion
    - Test AI recommendations and chat
    - Test admin endpoints (create/update/delete spots)
    - Test error handling (invalid inputs, unauthorized access)
    - Test mobile app on Android device
    - _Requirements: All requirements_

- [ ] 34. Deployment preparation
  - [ ] 34.1 Prepare backend for deployment
    - Ensure all environment variables documented
    - Test production build: npm run build
    - Test production start: npm start
    - Verify compression and security headers in production mode
    - _Requirements: 50.1, 50.2, 50.3, 50.6, 50.7, 50.8, 50.9_

  - [ ] 34.2 Prepare frontend for deployment
    - Update VITE_API_URL for production
    - Test production build: npm run build
    - Verify API calls work with production backend
    - _Requirements: 32.5_

  - [ ] 34.3 Database preparation
    - Run migration script on production database
    - Verify data integrity
    - Set up automated backups
    - _Requirements: 25.1-25.12, 43.1-43.6_

- [ ] 35. Final checkpoint - Complete system verification
  - Ensure all tests pass, verify end-to-end functionality, confirm deployment readiness, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP delivery
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation and provide opportunities for user feedback
- Property tests validate universal correctness properties with randomized inputs
- Unit tests validate specific examples, edge cases, and error conditions
- The implementation excludes external payment gateway, email service, and real AI integration (using mock/simulated implementations instead)
- Backend uses TypeScript, Node.js, Express, MongoDB Atlas, Mongoose, JWT, bcrypt
- Frontend uses TypeScript, React 19.2, Vite, Axios
- Mobile compatibility uses Capacitor for Android deployment
