const admin = require('firebase-admin');
require('dotenv').config();

let db = null;

try {
  // Firebase requires a service account key (JSON)
  // Loaded from env variable FIREBASE_SERVICE_ACCOUNT_JSON in production,
  // or local serviceAccountKey.json in development.
  let serviceAccount;
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
  } else {
    serviceAccount = require("./serviceAccountKey.json");
  }

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: serviceAccount.project_id
  });

  db = admin.firestore();
  console.log('✅ Firebase connected successfully');
} catch (error) {
  console.log('⚠️  Firebase not configured — using static data fallback');
  console.log('   To connect Firebase, add serviceAccountKey.json to backend/config/ or configure FIREBASE_SERVICE_ACCOUNT_JSON env variable');
  // db remains null; controllers will use static data fallback
}

// Export the database instance (may be null if Firebase isn't configured)
module.exports = db;