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
    if (serviceAccount.private_key) {
      // Fix potential newline escaping issues from env variables
      serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
    }
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
  console.error('❌ Firebase initialization error details:', error);
  // db remains null; controllers will use static data fallback
}

// Export the database instance (may be null if Firebase isn't configured)
module.exports = db;