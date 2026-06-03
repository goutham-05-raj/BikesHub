const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

// ⚡ Initialize Firebase Admin FIRST so autoResetUsers and /api/reset-now work
require('./config/database');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const bikesRouter = require('./routes/bikes');
const bookingsRouter = require('./routes/bookings');
const reviewsRouter = require('./routes/reviews');
const dealsRouter = require('./routes/deals');
const messagesRouter = require('./routes/messages');
const statsRouter = require('./routes/stats');
const feedbackRouter = require('./routes/feedback');
const usersRouter = require('./routes/users');

app.use('/api/bikes', bikesRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/api/deals', dealsRouter);
app.use('/api/messages', messagesRouter);
app.use('/api/stats', statsRouter);
app.use('/api/feedback', feedbackRouter);
app.use('/api/users', usersRouter);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Bike Rental API is running!',
    timestamp: new Date().toISOString()
  });
});

// Trigger database/users reset directly from browser
app.get('/api/reset-now', async (req, res) => {
  try {
    const admin = require('firebase-admin');
    if (!admin.apps.length) {
      return res.status(500).json({ success: false, error: 'Firebase not initialized' });
    }
    
    const desiredUsers = [
      { email: 'admin@123.com',  password: 'admin123' },
      { email: 'user@123.com',  password: 'user123'  },
      { email: 'user@234.com',  password: 'user234'  },
      { email: 'user@345.com',  password: 'user345'  },
    ];

    let uidsToDelete = [];
    let nextPageToken;
    do {
      const listUsersResult = await admin.auth().listUsers(1000, nextPageToken);
      uidsToDelete = uidsToDelete.concat(listUsersResult.users.map(u => u.uid));
      nextPageToken = listUsersResult.pageToken;
    } while (nextPageToken);

    let logs = [];
    if (uidsToDelete.length > 0) {
      logs.push(`Deleted ${uidsToDelete.length} existing users from Firebase Auth.`);
      for (let i = 0; i < uidsToDelete.length; i += 1000) {
        const chunk = uidsToDelete.slice(i, i + 1000);
        await admin.auth().deleteUsers(chunk);
      }
    }

    logs.push('Creating exact requested users...');
    for (const u of desiredUsers) {
      await admin.auth().createUser({
        email: u.email,
        password: u.password,
        emailVerified: true
      });
      logs.push(`Created user ${u.email} with password '${u.password}'`);
      
      const isAd = u.email.includes('admin');
      const role = isAd ? 'admin' : 'user';
      await admin.firestore().collection('users').doc(u.email).set({
         email: u.email,
         role: role,
         createdAt: new Date().toISOString()
      });
      logs.push(`Set role '${role}' in Firestore`);
    }
    
    res.json({ success: true, message: 'Accounts successfully updated!', logs });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});



// Error handling middleware
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

async function autoResetUsers() {
  const admin = require('firebase-admin');
  try {
    if (!admin.apps.length) {
      console.log('⚠️ Firebase not initialized — skipping automatic user reset');
      return;
    }
    console.log('⚡ Starting automatic auth users reset...');
    const desiredUsers = [
      { email: 'admin@123.com',  password: 'admin123' },
      { email: 'user@123.com',  password: 'user123'  },
      { email: 'user@234.com',  password: 'user234'  },
      { email: 'user@345.com',  password: 'user345'  },
    ];

    let uidsToDelete = [];
    let nextPageToken;
    do {
      const listUsersResult = await admin.auth().listUsers(1000, nextPageToken);
      uidsToDelete = uidsToDelete.concat(listUsersResult.users.map(u => u.uid));
      nextPageToken = listUsersResult.pageToken;
    } while (nextPageToken);

    if (uidsToDelete.length > 0) {
      console.log(`🧹 Deleting ${uidsToDelete.length} existing users from Firebase...`);
      for (let i = 0; i < uidsToDelete.length; i += 1000) {
        const chunk = uidsToDelete.slice(i, i + 1000);
        await admin.auth().deleteUsers(chunk);
      }
    }

    console.log('✨ Creating exact requested users...');
    for (const u of desiredUsers) {
      await admin.auth().createUser({
        email: u.email,
        password: u.password,
        emailVerified: true
      });
      console.log(`✅ Successfully created Firebase user: ${u.email}`);
      
      const isAd = u.email.includes('admin');
      const role = isAd ? 'admin' : 'user';
      await admin.firestore().collection('users').doc(u.email).set({
         email: u.email,
         role: role,
         createdAt: new Date().toISOString()
      });
      console.log(`📝 Wrote role '${role}' to Firestore for ${u.email}`);
    }
    console.log('🎉 Automatic users reset complete!');
  } catch (error) {
    console.error('❌ Error during automatic users reset:', error);
  }
}

const PORT = process.env.PORT || 5002;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health: http://localhost:${PORT}/api/health`);
  console.log(`Bikes: http://localhost:${PORT}/api/bikes`);
  console.log(`Bookings: http://localhost:${PORT}/api/bookings`);
  console.log(`Reviews: http://localhost:${PORT}/api/reviews`);
  
  // Run autoResetUsers asynchronously on startup
  autoResetUsers();
});
