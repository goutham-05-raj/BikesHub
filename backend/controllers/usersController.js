const admin = require('firebase-admin');

/**
 * POST /api/users/register
 * Body: { uid, email, name, phone, role }
 * Stores the user profile document in Firestore after Firebase Auth user is created on the frontend.
 */
exports.registerUser = async (req, res) => {
  try {
    const { uid, email, name, phone, role } = req.body;

    if (!uid || !email) {
      return res.status(400).json({
        success: false,
        message: 'uid and email are required.'
      });
    }

    const db = admin.firestore();

    const userProfile = {
      uid,
      email: email.trim().toLowerCase(),
      name: name ? name.trim() : '',
      phone: phone ? phone.trim() : '',
      role: role || 'user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Use uid as the document key for fast lookups
    await db.collection('users').doc(uid).set(userProfile);

    // Also index by email for admin lookups
    await db.collection('usersByEmail').doc(userProfile.email).set(userProfile);

    console.log(`✅ New user registered: ${email} (${uid})`);

    return res.status(201).json({
      success: true,
      message: 'User registered successfully.',
      data: userProfile
    });
  } catch (error) {
    console.error('❌ Error registering user:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to register user.'
    });
  }
};

/**
 * GET /api/users/:uid
 * Returns the Firestore profile for a given uid.
 */
exports.getUser = async (req, res) => {
  try {
    const db = admin.firestore();
    const doc = await db.collection('users').doc(req.params.uid).get();

    if (!doc.exists) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    return res.json({ success: true, data: doc.data() });
  } catch (error) {
    console.error('Error fetching user:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET /api/users  (admin only — lists all users)
 */
exports.getAllUsers = async (req, res) => {
  try {
    const db = admin.firestore();
    const snapshot = await db.collection('users').orderBy('createdAt', 'desc').get();
    const users = snapshot.docs.map(doc => doc.data());
    return res.json({ success: true, data: users, count: users.length });
  } catch (error) {
    console.error('Error listing users:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
