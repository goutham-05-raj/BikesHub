const admin = require('firebase-admin');
const db = require('../config/database');
const generateBookingId = require('../utils/generateBookingId');

// Speed & Distance for reconciliation (mirrored from frontend)
const routeInfo = {
    nandyal: { distance: 78, speed: 45 },
    kadapa: { distance: 180, speed: 70 },
    vijayawada: { distance: 349, speed: 95 },
    vizag: { distance: 704, speed: 135 },
    visakhapatnam: { distance: 704, speed: 135 },
    guntur: { distance: 430, speed: 50 },
    tirupati: { distance: 551, speed: 75 },
    nellore: { distance: 809, speed: 125 },
    rajamundry: { distance: 312, speed: 100 },
    kakinada: { distance: 720, speed: 125 },
    ananthapur: { distance: 445, speed: 90 },
    ongole: { distance: 1000, speed: 100 },
};

// Helper to check if a booking should be marked as delivered and bike made available
const reconcileBookingStatus = async (bookingDoc) => {
    if (!bookingDoc || !bookingDoc.exists) return null;
    const data = bookingDoc.data();
    if (!data || !data.status || (data.status.toLowerCase() !== 'confirmed' && data.status.toLowerCase() !== 'shipped' && data.status.toLowerCase() !== 'in-transit')) {
        return data; 
    }

    if (!data.created_at || typeof data.created_at.toDate !== 'function') {
        console.warn(`[Reconcile] Booking ${bookingDoc.id} has invalid created_at:`, data.created_at);
        return data;
    }
    const createdTime = data.created_at.toDate().getTime();
    const destKey = (data.location || '').toLowerCase();
    const info = routeInfo[destKey];
    const speed = info ? info.speed : 65;
    const dist = info ? info.distance : 150;
    
    const totalSimulatedDurationMs = (dist / speed) * 3600 * 1000 / 60;
    
    if (Date.now() - createdTime >= totalSimulatedDurationMs) {
        // Auto-complete trip
        await bookingDoc.ref.update({
            status: 'delivered',
            updated_at: admin.firestore.FieldValue.serverTimestamp()
        });
        
        // Make bike available again
        if (data.bikeId) {
            await db.collection('bikes').doc(data.bikeId).update({
                status: 'available'
            });
        }
        return { ...data, status: 'delivered' };
    }
    return data;
};

// Get all bookings
exports.getBookings = async (req, res, next) => {
  try {
    if (!db) {
      return res.status(400).json({ success: false, message: 'Firestore not configured' });
    }

    const snapshot = await db.collection('bookings').orderBy('created_at', 'desc').get();
    
    const bookings = await Promise.all(snapshot.docs.map(async doc => {
      const reconciledData = await reconcileBookingStatus(doc);
      
      return {
        id: doc.id,
        ...reconciledData,
        created_at: reconciledData.created_at ? (typeof reconciledData.created_at.toDate === 'function' ? reconciledData.created_at.toDate().toISOString() : reconciledData.created_at) : null,
        updated_at: reconciledData.updated_at ? (typeof reconciledData.updated_at.toDate === 'function' ? reconciledData.updated_at.toDate().toISOString() : reconciledData.updated_at) : null
      };
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

// Get single booking
exports.getBooking = async (req, res, next) => {
  try {
    if (!db) {
      return res.status(400).json({ success: false, message: 'Firestore not configured' });
    }

    const bookingDoc = await db.collection('bookings').doc(req.params.id).get();
    
    if (!bookingDoc.exists) {
        return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    const reconciledData = await reconcileBookingStatus(bookingDoc);
    
    res.json({
      success: true,
      data: {
        id: bookingDoc.id,
        ...reconciledData,
        created_at: reconciledData.created_at ? (typeof reconciledData.created_at.toDate === 'function' ? reconciledData.created_at.toDate().toISOString() : reconciledData.created_at) : null,
        updated_at: reconciledData.updated_at ? (typeof reconciledData.updated_at.toDate === 'function' ? reconciledData.updated_at.toDate().toISOString() : reconciledData.updated_at) : null
      }
    });

  } catch (error) {
    console.error("Single booking fetch error:", error);
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
    
    if (req.body.bikeId) {
        await db.collection('bikes').doc(req.body.bikeId).update({
            status: 'booked'
        });
    }

    const newDoc = await docRef.get();

    res.status(201).json({
      success: true,
      data: { id: newDoc.id, ...newDoc.data() },
      message: 'Booking created successfully'
    });

  } catch (error) {
    console.error("Booking creation crash details:", error);
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

// Cancel booking
exports.cancelBooking = async (req, res, next) => {
  try {
    if (!db) {
      return res.status(400).json({ success: false, message: 'Firestore not configured' });
    }

    const bookingRef = db.collection('bookings').doc(req.params.id);
    const bookingDoc = await bookingRef.get();

    if (!bookingDoc.exists) {
        return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    const data = bookingDoc.data();
    
    if (data.status && data.status.toLowerCase() === 'delivered') {
        return res.status(400).json({ success: false, message: 'Cannot cancel a delivered booking' });
    }

    await bookingRef.update({
        status: 'cancelled',
        updated_at: admin.firestore.FieldValue.serverTimestamp()
    });

    if (data.bikeId) {
        await db.collection('bikes').doc(data.bikeId).update({
            status: 'available'
        });
    }

    res.json({
      success: true,
      message: 'Booking cancelled successfully'
    });

  } catch (error) {
    next(error);
  }
};

// Record payment
exports.recordPayment = async (req, res, next) => {
  try {
    res.json({
      success: true,
      message: 'Payment record initialized'
    });
  } catch (error) {
    next(error);
  }
};