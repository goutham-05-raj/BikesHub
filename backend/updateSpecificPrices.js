const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin
const serviceAccount = require('./config/serviceAccountKey.json');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

const updates = [
    { name: "Kawasaki Ninja 300", price: 10000 }
];

async function updatePrices() {
    console.log("Starting Kawasaki price update...");

    for (const update of updates) {
        try {
            const bikesRef = db.collection('bikes');
            const snapshot = await bikesRef.where('name', '==', update.name).get();

            if (snapshot.empty) {
                console.log(`No matching bike found for: ${update.name}`);
                continue;
            }

            const batch = db.batch();
            snapshot.docs.forEach(doc => {
                console.log(`Updating ${update.name} (ID: ${doc.id}) to ₹${update.price}`);
                batch.update(doc.ref, {
                    price: update.price,
                    bulk_price: update.price * 50
                });
            });

            await batch.commit();
            console.log(`Successfully updated ${update.name}`);
        } catch (error) {
            console.error(`Error updating ${update.name}:`, error);
        }
    }

    console.log("Update process completed.");
    process.exit(0);
}

updatePrices();
