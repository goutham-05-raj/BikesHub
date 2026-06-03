const db = require('../config/database');

// Submit a new contact message
exports.submitMessage = async (req, res, next) => {
    try {
        const { inquiryType, businessName, email, phone, message } = req.body;

        if (!businessName || !email || !message) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields: Business Name, Email, and Message'
            });
        }

        if (!db) {
            throw new Error('Firestore not initialized');
        }

        const messageData = {
            inquiryType: inquiryType || 'General',
            businessName,
            email,
            phone: phone || '',
            message,
            status: 'unread',
            createdAt: new Date().toISOString()
        };

        const docRef = await db.collection('messages').add(messageData);

        res.status(201).json({
            success: true,
            message: 'Message sent successfully!',
            messageId: docRef.id
        });

    } catch (error) {
        console.error('Error submitting message:', error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to send message. Please try again later.'
        });
    }
};

// Get all messages (for admin dashboard)
exports.getMessages = async (req, res, next) => {
    try {
        if (!db) {
            throw new Error('Firestore not initialized');
        }

        const snapshot = await db.collection('messages').orderBy('createdAt', 'desc').get();
        const messages = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        res.status(200).json({
            success: true,
            data: messages,
            count: messages.length
        });

    } catch (error) {
        console.error('Error fetching messages:', error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch messages.'
        });
    }
};
