const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const bikesRouter = require('./routes/bikes');
const bookingsRouter = require('./routes/bookings');
const reviewsRouter = require('./routes/reviews');

app.use('/api/bikes', bikesRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/reviews', reviewsRouter);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Bike Rental API is running!',
    timestamp: new Date().toISOString()
  });
});



// Error handling middleware
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

const PORT = process.env.PORT || 5002;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health: http://localhost:${PORT}/api/health`);
  console.log(`Bikes: http://localhost:${PORT}/api/bikes`);
  console.log(`Bookings: http://localhost:${PORT}/api/bookings`);
  console.log(`Reviews: http://localhost:${PORT}/api/reviews`);
});
