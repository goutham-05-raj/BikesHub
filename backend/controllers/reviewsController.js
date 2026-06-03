const admin = require('firebase-admin');
const db = require('../config/database');

// Get reviews for a bike
exports.getReviews = async (req, res, next) => {
  try {
    if (!db) {
      return res.status(400).json({ success: false, message: 'Firestore not configured' });
    }

    const snapshot = await db.collection('reviews')
      .where('bike_id', '==', req.params.bikeId)
      .orderBy('created_at', 'desc')
      .get();

    const reviews = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json({
      success: true,
      data: reviews,
      count: reviews.length
    });

  } catch (error) {
    next(error);
  }
};

// Get all reviews (for admin dashboard)
exports.getAllReviews = async (req, res, next) => {
  try {
    if (!db) {
      return res.status(400).json({ success: false, message: 'Firestore not configured' });
    }

    const snapshot = await db.collection('reviews')
      .orderBy('created_at', 'desc')
      .get();

    const reviews = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json({
      success: true,
      data: reviews,
      count: reviews.length
    });

  } catch (error) {
    next(error);
  }
};

// Add review
exports.addReview = async (req, res, next) => {
  try {
    if (!db) {
      return res.status(400).json({ success: false, message: 'Firestore not configured' });
    }

    const { user_name, rating, comment } = req.body;
    const bike_id = req.params.bikeId;

    const reviewData = {
      bike_id,
      user_name,
      rating,
      comment,
      created_at: admin.firestore.FieldValue.serverTimestamp()
    };

    const docRef = await db.collection('reviews').add(reviewData);
    const newDoc = await docRef.get();

    res.status(201).json({
      success: true,
      data: { id: newDoc.id, ...newDoc.data() },
      message: 'Review added successfully'
    });

  } catch (error) {
    next(error);
  }
};