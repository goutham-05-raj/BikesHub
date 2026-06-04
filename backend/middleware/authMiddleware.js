const admin = require('firebase-admin');

/**
 * Middleware to verify Firebase JWT tokens in API requests.
 * Extracts the token from the "Authorization: Bearer <token>" header,
 * verifies it using Firebase Admin SDK, and attaches the decoded
 * user payload to the request object (req.user).
 */
const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        // Ensure the Authorization header is present and properly formatted
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'No token provided or invalid format.'
            });
        }

        // Extract the token
        const idToken = authHeader.split('Bearer ')[1];

        // Verify token with Firebase Admin SDK
        // (Make sure admin is initialized elsewhere, e.g., in config/database.js)
        const decodedToken = await admin.auth().verifyIdToken(idToken);

        // Inject validated user payload into request object for downstream use
        req.user = decodedToken;
        next();
    } catch (error) {
        console.error('Error verifying auth token:', error);

        // Distinguish between an expired token and a malformed token
        if (error.code === 'auth/id-token-expired') {
        return res.status(401).json({
            error: 'Unauthorized',
            message: 'Token has expired. Please log in again.',
            code: error.code
        });
        }

        return res.status(401).json({
            error: 'Unauthorized',
            message: 'Invalid token.',
            code: error.code || 'auth/invalid-token'
        });
    }
};

module.exports = verifyToken;
