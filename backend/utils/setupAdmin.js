const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

// Path to your service account key
const serviceAccountPath = path.join(__dirname, '..', 'config', 'serviceAccountKey.json');

if (!fs.existsSync(serviceAccountPath)) {
    console.error('❌ serviceAccountKey.json not found in backend/config/');
    process.exit(1);
}

const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const email = 'admin@bikeszone.com';
const password = 'Password@123';

const createAdmin = async () => {
    try {
        const userRecord = await admin.auth().createUser({
            email,
            password,
            displayName: 'System Admin',
        });
        console.log('✅ Successfully created admin user:', userRecord.uid);
        console.log('📧 Email:', email);
        console.log('🔑 Password:', password);
        process.exit(0);
    } catch (error) {
        if (error.code === 'auth/email-already-exists') {
            console.log('ℹ️ Admin user already exists.');
            process.exit(0);
        }
        console.error('❌ Error creating admin user:', error);
        process.exit(1);
    }
};

createAdmin();
