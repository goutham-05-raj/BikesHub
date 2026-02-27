const admin = require('firebase-admin');
const path = require('path');
require('dotenv').config();

// Initialize admin if not already initialized
if (admin.apps.length === 0) {
    try {
        const serviceAccount = require("../config/serviceAccountKey.json");
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
    } catch (error) {
        console.error("❌ Error: serviceAccountKey.json not found in backend/config/");
        console.log("Please download your service account key from Firebase Console and save it as backend/config/serviceAccountKey.json");
        process.exit(1);
    }
}

const db = admin.firestore();

const staticBikes = [
    {
        name: "Pulsar NS 200",
        brand: "Bajaj",
        engine_cc: 200,
        price: 1800,
        bulk_price: 142000,
        moq: 10,
        stock: 250,
        delivery_days: 7,
        category: "Sports",
        image_url: "/bikes/ns200.jpeg",
        features: JSON.stringify(["ABS", "Digital Console", "Sporty Look", "200cc"]),
        rating: 4.5,
        review_count: 48,
        available: true,
        verified: true,
        manufacturer: "Bajaj Auto Ltd.",
        created_at: admin.firestore.FieldValue.serverTimestamp()
    },
    {
        name: "Continental GT 650",
        brand: "Royal Enfield",
        engine_cc: 650,
        price: 2500,
        bulk_price: 318000,
        moq: 5,
        stock: 85,
        delivery_days: 12,
        category: "Cruiser",
        image_url: "/bikes/gt650.jpeg",
        features: JSON.stringify(["Twin Engine", "Retro Design", "650cc", "Premium"]),
        rating: 4.6,
        review_count: 62,
        available: true,
        verified: true,
        manufacturer: "Royal Enfield Motors",
        created_at: admin.firestore.FieldValue.serverTimestamp()
    },
    {
        name: "Royal Enfield Classic 350",
        brand: "Royal Enfield",
        engine_cc: 350,
        price: 1500,
        bulk_price: 198000,
        moq: 10,
        stock: 420,
        delivery_days: 5,
        category: "Cruiser",
        image_url: "/bikes/classic350.jpeg",
        features: JSON.stringify(["Thump Sound", "Comfortable Ride", "350cc", "Iconic"]),
        rating: 4.7,
        review_count: 95,
        available: true,
        verified: true,
        manufacturer: "Royal Enfield Motors",
        created_at: admin.firestore.FieldValue.serverTimestamp()
    },
    {
        name: "Yamaha MT 15 V2",
        brand: "Yamaha",
        engine_cc: 155,
        price: 1600,
        bulk_price: 168000,
        moq: 15,
        stock: 180,
        delivery_days: 8,
        category: "Sports",
        image_url: "/bikes/mt15.jpg",
        features: JSON.stringify(["Sporty Design", "Fuel Efficient", "LED Lights", "155cc"]),
        rating: 4.2,
        review_count: 37,
        available: true,
        verified: true,
        manufacturer: "Yamaha Motor India",
        created_at: admin.firestore.FieldValue.serverTimestamp()
    },
    {
        name: "KTM Duke 200",
        brand: "KTM",
        engine_cc: 200,
        price: 1900,
        bulk_price: 192000,
        moq: 8,
        stock: 145,
        delivery_days: 10,
        category: "Sports",
        image_url: "/bikes/duke200.jpg",
        features: JSON.stringify(["Aggressive Look", "Reliable", "Track Ready", "200cc"]),
        rating: 4.3,
        review_count: 54,
        available: true,
        verified: true,
        manufacturer: "KTM India (Bajaj)",
        created_at: admin.firestore.FieldValue.serverTimestamp()
    },
    {
        name: "Interceptor 650",
        brand: "Royal Enfield",
        engine_cc: 650,
        price: 2100,
        bulk_price: 305000,
        moq: 5,
        stock: 92,
        delivery_days: 12,
        category: "Cruiser",
        image_url: "/bikes/interceptor650.jpg",
        features: JSON.stringify(["Powerful Engine", "Highway Cruiser", "650cc", "Chrome"]),
        rating: 4.4,
        review_count: 71,
        available: true,
        verified: true,
        manufacturer: "Royal Enfield Motors",
        created_at: admin.firestore.FieldValue.serverTimestamp()
    },
    {
        name: "Kawasaki Ninja 300",
        brand: "Kawasaki",
        engine_cc: 300,
        price: 2800,
        bulk_price: 335000,
        moq: 5,
        stock: 60,
        delivery_days: 14,
        category: "Sports",
        image_url: "/bikes/ninja300.jpg",
        features: JSON.stringify(["Full Fairing", "Twin Cylinder", "300cc", "Race DNA"]),
        rating: 4.8,
        review_count: 82,
        available: true,
        verified: true,
        manufacturer: "Kawasaki India Pvt Ltd",
        created_at: admin.firestore.FieldValue.serverTimestamp()
    },
    {
        name: "Himalayan 450",
        brand: "Royal Enfield",
        engine_cc: 450,
        price: 2200,
        bulk_price: 285000,
        moq: 8,
        stock: 110,
        delivery_days: 10,
        category: "Adventure",
        image_url: "/bikes/himalayan.jpg",
        features: JSON.stringify(["Off-Road", "Long Range", "450cc", "Adventure Ready"]),
        rating: 4.5,
        review_count: 43,
        available: true,
        verified: true,
        manufacturer: "Royal Enfield Motors",
        created_at: admin.firestore.FieldValue.serverTimestamp()
    },
    {
        name: "Honda CB350",
        brand: "Honda",
        engine_cc: 350,
        price: 1700,
        bulk_price: 205000,
        moq: 10,
        stock: 195,
        delivery_days: 7,
        category: "Cruiser",
        image_url: "/bikes/cb350.jpg",
        features: JSON.stringify(["DLX Pro", "Honda Reliability", "350cc", "Smooth Engine"]),
        rating: 4.3,
        review_count: 38,
        available: true,
        verified: true,
        manufacturer: "Honda Motorcycle India",
        created_at: admin.firestore.FieldValue.serverTimestamp()
    },
    {
        name: "KTM RC 390",
        brand: "KTM",
        engine_cc: 390,
        price: 3200,
        bulk_price: 385000,
        moq: 3,
        stock: 45,
        delivery_days: 14,
        category: "Sports",
        image_url: "/bikes/rc390.jpg",
        features: JSON.stringify(["Race Spec", "Quick Shifter", "390cc", "Aerodynamic"]),
        rating: 4.9,
        review_count: 67,
        available: true,
        verified: true,
        manufacturer: "KTM India (Bajaj)",
        created_at: admin.firestore.FieldValue.serverTimestamp()
    }
];

async function migrate() {
    console.log("🚀 Starting Firestore migration...");

    const bikesCollection = db.collection('bikes');

    for (const bike of staticBikes) {
        console.log(`adding bike: ${bike.name}`);
        await bikesCollection.add(bike);
    }

    console.log("✅ Migration complete! Added ${staticBikes.length} bikes.");
    process.exit(0);
}

migrate().catch(err => {
    console.error("❌ Migration failed:", err);
    process.exit(1);
});
