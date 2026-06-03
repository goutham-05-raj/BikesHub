const admin = require('firebase-admin');
const serviceAccount = require('../config/serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const users = [
    { email: 'user1@35.com', password: 'user12345', displayName: 'User One' },
    { email: 'user2@35.com', password: 'user23456', displayName: 'User Two' },
];

const ensureUser = async ({ email, password, displayName }) => {
    try {
        const existing = await admin.auth().getUserByEmail(email);
        await admin.auth().updateUser(existing.uid, { password, displayName });
        console.log(`✅ Updated: ${email} → password set to: ${password}`);
    } catch (err) {
        if (err.code === 'auth/user-not-found') {
            await admin.auth().createUser({ email, password, displayName });
            console.log(`✅ Created: ${email} → password: ${password}`);
        } else {
            console.error(`❌ Error with ${email}:`, err.message);
        }
    }
};

(async () => {
    for (const u of users) {
        await ensureUser(u);
    }
    console.log('\n🔒 Done. Only these accounts can log in (Sign Up is disabled in the app).');
    process.exit(0);
})();
