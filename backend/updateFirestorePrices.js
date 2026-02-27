const admin = require('firebase-admin');
const path = require('path');
require('dotenv').config();

const serviceAccount = require('./config/serviceAccountKey.json');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

const bikesUpdates = [
    { name: "Pulsar NS 200", price: 2600 },
    { name: "Continental GT 650", price: 3900 },
    { name: "Royal Enfield Classic 350", price: 2100 },
    { name: "Yamaha MT 15 V2", price: 3000 },
    { name: "KTM Duke 200", price: 15000 },
    { name: "Interceptor 650", price: 4000 },
    { name: "Kawasaki Ninja 300", price: 3600 },
    { name: "Himalayan 450", price: 2100 },
    { name: "Honda CB350", price: 2500 },
    { name: "KTM RC 390", price: 3000 }
];

async function updatePrices() {
    console.log('🚀 Starting Firestore price update...');
    const bikesRef = db.collection('bikes');
    const snapshot = await bikesRef.get();

    if (snapshot.empty) {
        console.log('❌ No bikes found in Firestore.');
        return;
    }

    let updatedCount = 0;
    for (const doc of snapshot.docs) {
        const data = doc.data();
        const update = bikesUpdates.find(u => u.name === data.name);

        if (update) {
            console.log(`Updating ${data.name}: ${data.price || data.bulk_price} -> ${update.price}`);
            await doc.ref.update({
                price: update.price,
                bulk_price: update.price * 10 // Assuming bulk_price is 10x
            });
            updatedCount++;
        }
    }

    console.log(`✅ Successfully updated ${updatedCount} bikes in Firestore.`);
}

updatePrices().catch(console.error);
