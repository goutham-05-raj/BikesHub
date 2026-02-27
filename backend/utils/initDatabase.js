const mysql = require('mysql2');
require('dotenv').config({ encoding: 'utf16le' });

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
});

const initDatabase = async () => {
  try {
    // Create database
    await connection.promise().query('CREATE DATABASE IF NOT EXISTS bikerent_db');
    console.log('Database created or already exists');

    // Use database
    await connection.promise().query('USE bikerent_db');

    // Create bikes table
    await connection.promise().query(`
      CREATE TABLE IF NOT EXISTS bikes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        category ENUM('Sports', 'Cruiser', 'Commuter') NOT NULL,
        image_url VARCHAR(500),
        features JSON,
        available BOOLEAN DEFAULT TRUE,
        rating DECIMAL(3,2) DEFAULT 0.0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create bookings table
    await connection.promise().query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        booking_id VARCHAR(20) UNIQUE NOT NULL,
        bike_id INT NOT NULL,
        customer_name VARCHAR(255) NOT NULL,
        customer_email VARCHAR(255) NOT NULL,
        customer_phone VARCHAR(20) NOT NULL,
        customer_address TEXT,
        customer_license VARCHAR(50),
        pickup_date DATE NOT NULL,
        return_date DATE NOT NULL,
        pickup_location VARCHAR(255),
        return_location VARCHAR(255),
        special_requests TEXT,
        total_amount DECIMAL(10,2) NOT NULL,
        status ENUM('pending', 'confirmed', 'active', 'completed', 'cancelled') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (bike_id) REFERENCES bikes(id) ON DELETE CASCADE
      )
    `);

    // Create reviews table
    await connection.promise().query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id INT AUTO_INCREMENT PRIMARY KEY,
        bike_id INT NOT NULL,
        user_name VARCHAR(255) NOT NULL,
        rating DECIMAL(3,2) NOT NULL,
        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (bike_id) REFERENCES bikes(id) ON DELETE CASCADE
      )
    `);

    // Insert sample bikes - FIXED CATEGORIES
    const sampleBikes = [
      {
        name: 'NS 200',
        price: 2600,
        category: 'Sports',
        image_url: '/bikes/ns200.jpeg',
        features: JSON.stringify(['ABS', 'Digital Console', 'Sporty Look', '200cc']),
        rating: 4.5
      },
      {
        name: 'GT 650',
        price: 3900,
        category: 'Cruiser',
        image_url: '/bikes/gt650.jpeg',
        features: JSON.stringify(['Fuel Efficient', 'Comfortable Seat', '650cc']),
        rating: 4.2
      },
      {
        name: 'Royal Enfield Classic 350',
        price: 2100,
        category: 'Cruiser',
        image_url: '/bikes/classic350.jpeg',
        features: JSON.stringify(['Thump Sound', 'Comfortable Ride', '350cc', 'Cruiser']),
        rating: 4.7
      },
      {
        name: 'MT 15',
        price: 3000,
        category: 'Sports',
        image_url: '/bikes/mt15.jpg',
        features: JSON.stringify(['Sporty Design', 'Fuel Efficient', 'Comfortable', '155cc']),
        rating: 4.0
      },
      {
        name: 'DUKE 200',
        price: 3600,
        category: 'Sports',
        image_url: '/bikes/duke200.jpg',
        features: JSON.stringify(['Aggressive Look', 'Reliable', 'Easy to Ride', '200cc']),
        rating: 4.3
      },
      {
        name: 'INTERCEPTOR 650',
        price: 4000,
        category: 'Cruiser',
        image_url: '/bikes/interceptor650.jpg',
        features: JSON.stringify(['Powerful Engine', 'Comfortable', '650cc']),
        rating: 4.1
      },
      {
        name: 'Kawasaki Ninja 300',
        price: 10000,
        category: 'Sports',
        image_url: '/bikes/ninja300.jpg',
        features: JSON.stringify(['Full Fairing', 'Twin Cylinder', '300cc', 'Race DNA']),
        rating: 4.8
      },
      {
        name: 'Himalayan 450',
        price: 2100,
        category: 'Sports', // Assuming Sports for now, or could be others based on existing schema
        image_url: '/bikes/himalayan.jpg',
        features: JSON.stringify(['Off-Road', 'Long Range', '450cc', 'Adventure Ready']),
        rating: 4.5
      },
      {
        name: 'Honda CB350',
        price: 2500,
        category: 'Cruiser',
        image_url: '/bikes/cb350.jpg',
        features: JSON.stringify(['DLX Pro', 'Honda Reliability', '350cc', 'Smooth Engine']),
        rating: 4.3
      },
      {
        name: 'KTM RC 390',
        price: 3000,
        category: 'Sports',
        image_url: '/bikes/rc390.jpg',
        features: JSON.stringify(['Race Spec', 'Quick Shifter', '390cc', 'Aerodynamic']),
        rating: 4.9
      }
    ];

    for (const bike of sampleBikes) {
      await connection.promise().execute(
        'INSERT IGNORE INTO bikes (name, price, category, image_url, features, rating) VALUES (?, ?, ?, ?, ?, ?)',
        [bike.name, bike.price, bike.category, bike.image_url, bike.features, bike.rating]
      );
    }

    console.log('Sample data inserted successfully');
    console.log('Database initialization completed!');

  } catch (error) {
    console.error('Database initialization failed:', error);
    console.log('Tip: Use the static server.js version instead to avoid MySQL issues');
  } finally {
    connection.end();
  }
};

initDatabase();