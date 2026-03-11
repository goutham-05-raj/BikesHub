# 🏍️ BikesHub - B2B Bike Rental & Fleet Management

BikesHub is a comprehensive B2B marketplace and fleet management platform designed for bike rentals, dealerships, and B2B transactions. It features a robust frontend for users and dealers, and a powerful backend for managing inventory, bookings, and real-time tracking.

## 🚀 Key Features

- **B2B Marketplace:** Browse and manage bulk bike orders with specialized pricing and MOQ (Minimum Order Quantity) support.
- **Live Fleet Tracking:** Real-time location tracking using Leaflet maps for active rentals and delivery monitoring.
- **Advanced Dashboard:** Analytics for dealers and administrators to monitor rental performance and customer feedback.
- **Booking Management:** Complete lifecycle management for bike rentals and B2B orders.
- **Integrated Feedback System:** Review and feedback mechanisms for both bikes and general platform services.
- **Responsive UI:** Modern, premium design built with a focus on user experience and B2B efficiency.

## 🛠️ Tech Stack

**Frontend:**
- React.js (v18+)
- Firebase (Authentication & Web SDK)
- Leaflet (Maps and Live Tracking)
- React Router DOM (Navigation)

**Backend:**
- Node.js & Express
- MySQL (Core Relational Data)
- Firebase Admin SDK (Cloud Firestore & Authentication)
- Express Validator (API Security)

## 📁 Project Structure

```text
BIKEPROJECT/
├── frontend/             # React application
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Main application views (Bikes, Booking, Analytics, etc.)
│   │   └── firebase.js   # Client-side Firebase config
├── backend/              # Node.js Express API
│   ├── config/           # Database and Firebase configurations
│   ├── controllers/      # Business logic handlers
│   ├── routes/           # API Endpoint definitions
│   ├── middleware/       # Auth and error handling filters
│   └── server.js         # API Entry point
```

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v16+)
- MySQL
- Firebase Project

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   Create a `.env` file in the `backend` folder:
   ```env
   PORT=5002
   DATABASE_URL=your_mysql_url
   # Add other relevant MySQL/Firebase variables
   ```
4. Place your `serviceAccountKey.json` in `backend/config/`.
5. Start the server:
   ```bash
   npm start
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure Firebase:
   Update your Firebase configuration in the client-side files or `.env`.
4. Run the development server:
   ```bash
   npm start
   ```

## 📡 API Endpoints

- `GET /api/bikes` - List all available bikes.
- `GET /api/bookings` - Retrieve user bookings.
- `POST /api/feedback` - Submit platform or bike feedback.
- `GET /api/health` - API health check status.

---

*Developed with ❤️ for the biking community and B2B dealers.*
