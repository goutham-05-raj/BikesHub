const admin = require('firebase-admin');
const path = require('path');
process.env.GOOGLE_APPLICATION_CREDENTIALS = path.resolve(__dirname, './config/serviceAccountKey.json');
const serviceAccount = require('./config/serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: serviceAccount.project_id
});
const db = admin.firestore();

async function run() {
    try {
        console.log("Adding document...");
        const res = await db.collection('bookings').add({
            test: "yes",
            created_at: admin.firestore.FieldValue.serverTimestamp()
        });
        console.log("Success! Document ID:", res.id);
    } catch (e) {
        console.error("Firestore write failed:", e);
    }
}
run();
