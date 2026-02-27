const admin = require('firebase-admin');
const db = require('../config/database');
const generateBookingId = require('../utils/generateBookingId');

// Get all bookings
exports.getBookings = async (req, res, next) => {
  try {
    if (!db) {
      return res.status(400).json({ success: false, message: 'Firestore not configured' });
    }

    const snapshot = await db.collection('bookings').orderBy('created_at', 'desc').get();
    const bookings = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json({
      success: true,
      data: bookings,
      count: bookings.length
    });

  } catch (error) {
    next(error);
  }
};

// Create booking
exports.createBooking = async (req, res, next) => {
  try {
    if (!db) {
      return res.status(400).json({ success: false, message: 'Firestore not configured' });
    }

    const bookingData = {
      ...req.body,
      booking_id: generateBookingId(),
      status: 'Pending',
      created_at: admin.firestore.FieldValue.serverTimestamp()
    };

    const docRef = await db.collection('bookings').add(bookingData);
    const newDoc = await docRef.get();

    res.status(201).json({
      success: true,
      data: { id: newDoc.id, ...newDoc.data() },
      message: 'Booking created successfully'
    });

  } catch (error) {
    next(error);
  }
};

// Update booking status
exports.updateBookingStatus = async (req, res, next) => {
  try {
    if (!db) {
      return res.status(400).json({ success: false, message: 'Firestore not configured' });
    }

    const { status } = req.body;
    await db.collection('bookings').doc(req.params.id).update({
      status,
      updated_at: admin.firestore.FieldValue.serverTimestamp()
    });

    res.json({
      success: true,
      message: 'Booking status updated successfully'
    });

  } catch (error) {
    next(error);
  }
};