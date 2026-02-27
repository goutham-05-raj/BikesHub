const db = require('../config/database');

// Static bikes data as fallback — B2B Marketplace format
const staticBikes = [
  {
    id: 1,
    name: "Pulsar NS 200",
    brand: "Bajaj",
    engine_cc: 200,
    price: 2600,
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
    manufacturer: "Bajaj Auto Ltd."
  },
  {
    id: 2,
    name: "Continental GT 650",
    brand: "Royal Enfield",
    engine_cc: 650,
    price: 3900,
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
    manufacturer: "Royal Enfield Motors"
  },
  {
    id: 3,
    name: "Royal Enfield Classic 350",
    brand: "Royal Enfield",
    engine_cc: 350,
    price: 2100,
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
    manufacturer: "Royal Enfield Motors"
  },
  {
    id: 4,
    name: "Yamaha MT 15 V2",
    brand: "Yamaha",
    engine_cc: 155,
    price: 3000,
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
    manufacturer: "Yamaha Motor India"
  },
  {
    id: 5,
    name: "KTM Duke 200",
    brand: "KTM",
    engine_cc: 200,
    price: 3600,
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
    manufacturer: "KTM India (Bajaj)"
  },
  {
    id: 6,
    name: "Interceptor 650",
    brand: "Royal Enfield",
    engine_cc: 650,
    price: 4000,
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
    manufacturer: "Royal Enfield Motors"
  },
  {
    id: 7,
    name: "Kawasaki Ninja 300",
    brand: "Kawasaki",
    engine_cc: 300,
    price: 10000,
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
    manufacturer: "Kawasaki India Pvt Ltd"
  },
  {
    id: 8,
    name: "Himalayan 450",
    brand: "Royal Enfield",
    engine_cc: 450,
    price: 2100,
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
    manufacturer: "Royal Enfield Motors"
  },
  {
    id: 9,
    name: "Honda CB350",
    brand: "Honda",
    engine_cc: 350,
    price: 2500,
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
    manufacturer: "Honda Motorcycle India"
  },
  {
    id: 10,
    name: "KTM RC 390",
    brand: "KTM",
    engine_cc: 390,
    price: 3000,
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
    manufacturer: "KTM India (Bajaj)"
  }
];

// Get all bikes
exports.getBikes = async (req, res, next) => {
  try {
    const { category, search } = req.query;

    if (!db) {
      throw new Error('Firestore not initialized');
    }

    let query = db.collection('bikes');

    if (category) {
      query = query.where('category', '==', category);
    }

    const snapshot = await query.get();
    let bikes = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    if (search) {
      const searchLower = search.toLowerCase();
      bikes = bikes.filter(bike =>
        bike.name.toLowerCase().includes(searchLower) ||
        (bike.features && Array.isArray(JSON.parse(bike.features)) &&
          JSON.parse(bike.features).some(f => f.toLowerCase().includes(searchLower)))
      );
    }

    res.json({
      success: true,
      data: bikes,
      count: bikes.length
    });

  } catch (error) {
    // Fallback to static data if Firestore fails or is not configured
    console.log('Using static data fallback:', error.message);

    let filteredBikes = staticBikes;

    if (req.query.category) {
      filteredBikes = filteredBikes.filter(bike => bike.category === req.query.category);
    }

    if (req.query.search) {
      const searchLower = req.query.search.toLowerCase();
      filteredBikes = filteredBikes.filter(bike =>
        bike.name.toLowerCase().includes(searchLower) ||
        JSON.parse(bike.features).some(feature => feature.toLowerCase().includes(searchLower))
      );
    }

    res.json({
      success: true,
      data: filteredBikes,
      count: filteredBikes.length
    });
  }
};

// Get single bike
exports.getBike = async (req, res, next) => {
  try {
    if (!db) {
      throw new Error('Firestore not initialized');
    }

    const bikeDoc = await db.collection('bikes').doc(req.params.id).get();

    if (!bikeDoc.exists) {
      // Try to find in static data if not in Firestore (common for initial setup)
      const bikeId = parseInt(req.params.id);
      const bike = staticBikes.find(b => b.id === bikeId);

      if (!bike) {
        return res.status(404).json({
          success: false,
          message: 'Bike not found'
        });
      }

      return res.json({
        success: true,
        data: bike
      });
    }

    res.json({
      success: true,
      data: { id: bikeDoc.id, ...bikeDoc.data() }
    });

  } catch (error) {
    // Fallback to static data if Firestore fails
    console.log('Using static data fallback:', error.message);

    const bikeId = parseInt(req.params.id);
    const bike = staticBikes.find(b => b.id === bikeId);

    if (!bike) {
      return res.status(404).json({
        success: false,
        message: 'Bike not found'
      });
    }

    res.json({
      success: true,
      data: bike
    });
  }
};
