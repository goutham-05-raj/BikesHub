const admin = require('firebase-admin');
require('dotenv').config();

let db = null;

try {
  // Firebase requires a service account key (JSON)
  // You download this from Project Settings > Service Accounts in Firebase Console
  const serviceAccount = require("./serviceAccountKey.json");

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: serviceAccount.project_id
  });

  db = admin.firestore();
  console.log('✅ Firebase connected successfully');
} catch (error) {
  console.log('⚠️  Firebase not configured — using static data fallback');
  console.log('   To connect Firebase, add serviceAccountKey.json to backend/config/');
  // db remains null; controllers will use static data fallback
}

// Export the database instance (may be null if Firebase isn't configured)
module.exports = db;