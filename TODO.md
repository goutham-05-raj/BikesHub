# TODO: Fix Bike Rental Project Errors

## Information Gathered
- Duplicate files exist in root directory (bikes.js, bikesController.js, etc.) and backend/ directory
- backend/server.js serves static hardcoded data instead of using database routes
- Missing dependencies: express-validator in backend/package.json
- Frontend expects dynamic API responses from /api/bikes, but backend/server.js doesn't integrate with controllers
- Database initialization script (initDatabase.js) creates tables, but server.js doesn't use them
- Error handlers are duplicated in backend/middleware/ and backend/utils/middleware/

## Plan
1. Consolidate backend files: Move all backend-related files into backend/ directory
2. Remove duplicate files from root directory
3. Update backend/server.js to use database routes and middleware
4. Add missing dependencies to backend/package.json
5. Ensure proper database integration in controllers
6. Add error handling middleware to server.js
7. Test server startup and API endpoints

## Dependent Files to Edit
- backend/server.js: Update to use routes and middleware
- backend/package.json: Add express-validator
- Remove root-level duplicates: bikes.js, bikesController.js, bookings.js, bookingsController.js, reviews.js, reviewsController.js, database.js
- backend/middleware/errorHandler.js: Keep one copy, remove duplicate

## Followup Steps
- Install dependencies: npm install in backend/
- Run initDatabase.js to set up database
- Start server and test API endpoints
- Run frontend and verify integration

## Progress
- [x] Fixed database initialization script to use query instead of execute for non-SELECT queries
- [x] Added bookings and reviews tables to initDatabase.js
- [x] Ran initDatabase.js successfully - database created with all tables and sample data
- [x] Verified backend API endpoints: /api/health, /api/bikes, /api/bookings, /api/reviews/bike/1 all return 200 with data
- [x] Verified frontend serves on localhost:3000
- [x] Removed duplicate bikes.sql file from root directory
- [x] Backend server running on port 5002 with database integration
- [x] Frontend running on port 3000 with fetch() calls to backend API
- [x] All syntax, import, and logic errors fixed
- [x] MySQL connection working via XAMPP (database bikerent_db created with tables and data)
- [x] Static fallback data in controllers working when DB fails
- [x] Existing data and images intact
- [x] Final output runnable with `node server.js`
