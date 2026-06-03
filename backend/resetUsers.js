const admin = require('firebase-admin');
const serviceAccount = require('./config/ServiceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const desiredUsers = [
  { email: 'admin@123.com',  password: 'admin123' },
  { email: 'user@123.com',  password: 'user123'  },
  { email: 'user@234.com',  password: 'user234'  },
  { email: 'user@345.com',  password: 'user345'  },
];

async function resetUsers() {
  try {
    // List all users
    let uidsToDelete = [];
    let nextPageToken;
    do {
      const listUsersResult = await admin.auth().listUsers(1000, nextPageToken);
      uidsToDelete = uidsToDelete.concat(listUsersResult.users.map(u => u.uid));
      nextPageToken = listUsersResult.pageToken;
    } while (nextPageToken);
    
    if (uidsToDelete.length > 0) {
      console.log(`Deleting ${uidsToDelete.length} existing users...`);
      // deleteUsers can take up to 1000 uids at a time
      for (let i = 0; i < uidsToDelete.length; i += 1000) {
          const chunk = uidsToDelete.slice(i, i + 1000);
          await admin.auth().deleteUsers(chunk);
      }
    }

    console.log('Creating exact requested users...');
    for (const u of desiredUsers) {
      await admin.auth().createUser({
        email: u.email,
        password: u.password,
        emailVerified: true
      });
      console.log(`Successfully created ${u.email}`);
      
      // Also write them into the firestore 'users' collection with their roles
      const isAd = u.email.includes('admin');
      const role = isAd ? 'admin' : 'user';
      await admin.firestore().collection('users').doc(u.email).set({
         email: u.email,
         role: role,
         createdAt: new Date().toISOString()
      });
    }
    
    console.log('Reset complete!');
    process.exit(0);
  } catch (err) {
    console.error("Error during reset:", err);
    process.exit(1);
  }
}

resetUsers();
