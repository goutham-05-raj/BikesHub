const express = require('express');
const router = express.Router();
const bookingsController = require('../controllers/bookingsController');

const verifyToken = require('../middleware/authMiddleware');

router.use(verifyToken); // Apply to all routes in this router

router.get('/', bookingsController.getBookings);
router.get('/:id', bookingsController.getBooking);
router.post('/', bookingsController.createBooking);
router.put('/:id/status', bookingsController.updateBookingStatus);
router.post('/:id/cancel', bookingsController.cancelBooking);
router.post('/record-payment', bookingsController.recordPayment);

module.exports = router;