import React, { useState, useEffect } from 'react';
import B2BProductCard from '../components/B2BProductCard';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

const Bikes = () => {
  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    fetchBikes();
  }, []);

  const fetchBikes = async () => {
    try {
      const bikesCollection = collection(db, 'bikes');
      const bikesQuery = query(bikesCollection);
      const snapshot = await getDocs(bikesQuery);
      const bikesList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setBikes(bikesList);
    } catch (error) {
      console.error('Error fetching bikes:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['All', 'Sports', 'Cruiser', 'Adventure', 'Commuter'];

  const filteredBikes = bikes
    .filter(bike => activeCategory === 'All' || bike.category === activeCategory)
    .filter(bike =>
      searchTerm === '' ||
      bike.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (bike.brand && bike.brand.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low': return (a.bulk_price || a.price) - (b.bulk_price || b.price);
        case 'price-high': return (b.bulk_price || b.price) - (a.bulk_price || a.price);
        case 'rating': return (b.rating || 0) - (a.rating || 0);
        case 'moq': return (a.moq || 5) - (b.moq || 5);
        case 'stock': return (b.stock || 0) - (a.stock || 0);
        default: return a.name.localeCompare(b.name);
      }
    });

  const totalStock = bikes.reduce((sum, b) => sum + (b.stock || 0), 0);
  const avgMOQ = bikes.length > 0 ? Math.round(bikes.reduce((sum, b) => sum + (b.moq || 5), 0) / bikes.length) : 0;
  const totalBrands = [...new Set(bikes.map(b => b.brand))].length;

  return (
    <div className="page-pale-black" style={{ margin: '-1.75rem', padding: '1.75rem', minHeight: '100vh' }}>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1>🏍️ Available Bikes</h1>
            <p>Choose from our fleet of premium bikes for your next ride</p>
          </div>
          <button className="btn btn-primary">📅 Plan My Trip</button>
        </div>
      </div>

      {/* Market Stats Bar */}
      <div className="market-stats-bar">
        <div className="market-stat">
          <div className="market-stat-value">{bikes.length}</div>
          <div className="market-stat-label">Bikes Available</div>
        </div>
        <div className="market-stat">
          <div className="market-stat-value">{totalBrands}</div>
          <div className="market-stat-label">Categories</div>
        </div>
        <div className="market-stat">
          <div className="market-stat-value">⭐ 4.5+</div>
          <div className="market-stat-label">Top Rated</div>
        </div>
        <div className="market-stat">
          <div className="market-stat-value">⚡ Fast</div>
          <div className="market-stat-label">Instant Booking</div>
        </div>
      </div>

      {/* Search + Filters */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <input
            className="form-input"
            type="text"
            placeholder="🔍 Search by bike name, brand..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="form-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{ width: '180px' }}
        >
          <option value="name">Sort: Name</option>
          <option value="price-low">Price: Low → High</option>
          <option value="price-high">Price: High → Low</option>
          <option value="rating">Best Rating</option>
          <option value="moq">Lowest MOQ</option>
          <option value="stock">Most Stock</option>
        </select>
      </div>

      {/* Category Filters */}
      <div className="filter-bar">
        {categories.map(cat => (
          <button
            key={cat}
            className={`filter-chip ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat} {cat !== 'All' && `(${bikes.filter(b => b.category === cat).length})`}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="loading"><div className="spinner"></div></div>
      ) : filteredBikes.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🔍</div>
          <h3>No bikes match your search</h3>
          <p>Try adjusting your filters or search terms</p>
        </div>
      ) : (
        <>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '1rem' }}>
            Showing {filteredBikes.length} of {bikes.length} listings
          </p>
          <div className="b2b-product-grid">
            {filteredBikes.map(bike => (
              <B2BProductCard key={bike.id} bike={bike} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Bikes;