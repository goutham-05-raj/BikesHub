const admin = require('firebase-admin');
const path = require('path');
require('dotenv').config({ path: 'j:/BIKEPROJECT/backend/.env' });

if (admin.apps.length === 0) {
    try {
        const serviceAccount = require("j:/BIKEPROJECT/backend/config/serviceAccountKey.json");
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
    } catch (error) {
        console.error("❌ Error: serviceAccountKey.json not found");
        process.exit(1);
    }
}

const db = admin.firestore();

async function check() {
    console.log("🔍 Checking Firestore 'bikes' collection...");
    const bikes = await db.collection('bikes').get();

    if (bikes.empty) {
        console.log("❌ NO BIKES FOUND IN FIRESTORE!");
    } else {
        console.log(`✅ Found ${bikes.size} bikes.`);
        bikes.forEach(doc => {
            const data = doc.data();
            console.log(`- [${doc.id}] ${data.name} (Price: ${data.price}, Category: ${data.category})`);
        });
    }
    process.exit(0);
}

check().catch(err => {
    console.error("❌ Check failed:", err);
    process.exit(1);
});
