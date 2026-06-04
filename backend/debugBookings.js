const admin = require('firebase-admin');
require('dotenv').config({ path: 'j:/BIKEPROJECT/backend/.env' });

if (admin.apps.length === 0) {
    const serviceAccount = require("./config/ServiceAccountKey.json");
    admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
}

const db = admin.firestore();

async function debug() {
    console.log("Checking bookings date fields...\n");
    const snapshot = await db.collection('bookings').get();

    snapshot.docs.forEach(doc => {
        const d = doc.data();
        const ca = d.created_at;
        const caType = ca ? (typeof ca.toDate === 'function' ? 'Timestamp' : typeof ca) : 'null';
        const caVal = ca ? (typeof ca.toDate === 'function' ? ca.toDate().toISOString() : ca) : 'N/A';

        const ca2 = d.createdAt;
        const ca2Type = ca2 ? (typeof ca2.toDate === 'function' ? 'Timestamp' : typeof ca2) : 'null';
        const ca2Val = ca2 ? (typeof ca2.toDate === 'function' ? ca2.toDate().toISOString() : ca2) : 'N/A';

        console.log(`ID: ${doc.id}`);
        console.log(`  bikeName: ${d.bikeName || d.name || '?'}`);
        console.log(`  created_at: [${caType}] ${caVal}`);
        console.log(`  createdAt:  [${ca2Type}] ${ca2Val}`);
        console.log('');
    });

    process.exit(0);
}

debug().catch(err => { console.error(err); process.exit(1); });
