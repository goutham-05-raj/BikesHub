const db = require('../config/database');

// Submit a new fleet deal
exports.submitDeal = async (req, res, next) => {
    try {
        const { name, website, email, phone, address } = req.body;

        if (!name || !email || !address) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields: Fleet Name, Email, and Location'
            });
        }

        if (!db) {
            throw new Error('Firestore not initialized');
        }

        const dealData = {
            fleetName: name,
            portfolioLink: website || '',
            dealEmail: email,
            directLine: phone || '',
            location: address,
            status: 'pending',
            createdAt: new Date().toISOString()
        };

        const docRef = await db.collection('deals').add(dealData);

        res.status(201).json({
            success: true,
            message: 'Deal submitted successfully!',
            dealId: docRef.id
        });

    } catch (error) {
        console.error('Error submitting deal:', error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to submit deal. Please try again later.'
        });
    }
};
