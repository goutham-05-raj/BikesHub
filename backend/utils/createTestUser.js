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

const email = 'bookit@123.com';
const password = '123456';

const createTestUser = async () => {
    try {
        const userRecord = await admin.auth().createUser({
            email,
            password,
            displayName: 'Test User',
        });
        console.log('✅ Successfully created test user:', userRecord.uid);
        console.log('📧 Email:', email);
        console.log('🔑 Password:', password);
        process.exit(0);
    } catch (error) {
        if (error.code === 'auth/email-already-exists') {
            console.log('ℹ️ Test user already exists.');

            // Optionally update the password if it exists to ensure it's 123456
            try {
                const user = await admin.auth().getUserByEmail(email);
                await admin.auth().updateUser(user.uid, { password });
                console.log('✅ Updated existing user password to 123456');
            } catch (updateErr) {
                console.error('❌ Error updating password:', updateErr);
            }
            process.exit(0);
        }
        console.error('❌ Error creating test user:', error);
        process.exit(1);
    }
};

createTestUser();
