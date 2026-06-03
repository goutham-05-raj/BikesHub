const db = require('../config/database');

/**
 * Submit new feedback from a user
 * @route POST /api/feedback
 */
exports.submitFeedback = async (req, res, next) => {
    try {
        console.log('Incoming feedback submission:', req.body);
        const { userId, userEmail, category, rating, comment } = req.body;

        if (!userEmail || rating === undefined || !comment) {
            console.warn('Feedback validation failed:', { userEmail, rating, comment });
            return res.status(400).json({
                success: false,
                message: 'Please provide required fields: email, rating, and comment'
            });
        }

        if (!db) {
            throw new Error('Firestore not initialized');
        }

        const feedbackData = {
            userId: userId || 'anonymous',
            userEmail,
            category: category || 'General',
            rating: parseInt(rating),
            comment,
            status: 'pending',
            createdAt: new Date().toISOString()
        };

        const docRef = await db.collection('feedback').add(feedbackData);

        res.status(201).json({
            success: true,
            message: 'Feedback submitted successfully!',
            feedbackId: docRef.id
        });

    } catch (error) {
        console.error('Error submitting feedback:', error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to submit feedback. Please try again later.'
        });
    }
};

/**
 * Get feedback history for a specific user
 * @route GET /api/feedback/user/:email
 */
exports.getUserFeedback = async (req, res, next) => {
    try {
        const { email } = req.params;

        if (!db) {
            throw new Error('Firestore not initialized');
        }

        const snapshot = await db.collection('feedback')
            .where('userEmail', '==', email)
            .orderBy('createdAt', 'desc')
            .get();

        const feedback = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        res.status(200).json({
            success: true,
            data: feedback,
            count: feedback.length
        });

    } catch (error) {
        console.error('Error fetching user feedback:', error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch feedback history.'
        });
    }
};

/**
 * Get all feedback (Admin only)
 * @route GET /api/feedback/all
 */
exports.getAllFeedback = async (req, res, next) => {
    try {
        if (!db) {
            throw new Error('Firestore not initialized');
        }

        const snapshot = await db.collection('feedback').orderBy('createdAt', 'desc').get();
        const feedback = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        res.status(200).json({
            success: true,
            data: feedback,
            count: feedback.length
        });

    } catch (error) {
        console.error('Error fetching all feedback:', error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch feedback.'
        });
    }
};
