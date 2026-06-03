const admin = require('firebase-admin');
const path = require('path');
const serviceAccount = require('../config/serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const email = 'admin@3535.com';
const password = 'goutham35';

const ensureAdmin = async () => {
    try {
        const user = await admin.auth().getUserByEmail(email);
        await admin.auth().updateUser(user.uid, { password });
        console.log(`✅ Admin password updated to: ${password}`);
        process.exit(0);
    } catch (err) {
        if (err.code === 'auth/user-not-found') {
            await admin.auth().createUser({
                email,
                password,
                displayName: 'Market Admin'
            });
            console.log(`✅ Admin user created with password: ${password}`);
            process.exit(0);
        } else {
            console.error('❌ Error ensuring admin:', err);
            process.exit(1);
        }
    }
};

ensureAdmin();
