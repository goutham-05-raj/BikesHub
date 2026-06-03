import React, { useState, useEffect } from 'react';
import B2BProductCard from '../components/B2BProductCard';
import StatCard from '../components/StatCard';
import LiveClock from '../components/LiveClock';
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

  const activeBikes = bikes.filter(bike => bike.status !== 'archived');

  // Dynamic Categories from actual data
  const categories = ['All', ...new Set(activeBikes.map(bike => bike.category).filter(Boolean))];

  const filteredBikes = activeBikes
    .filter(bike => activeCategory === 'All' || bike.category === activeCategory)
    .filter(bike => {
      if (!searchTerm) return true;
      const search = searchTerm.toLowerCase();
      const nameMatch = bike.name && bike.name.toLowerCase().includes(search);
      const brandMatch = bike.brand && bike.brand.toLowerCase().includes(search);
      const categoryMatch = bike.category && bike.category.toLowerCase().includes(search);
      return nameMatch || brandMatch || categoryMatch;
    })
    .sort((a, b) => {
      const priceA = a.bulk_price || a.price || 0;
      const priceB = b.bulk_price || b.price || 0;
      switch (sortBy) {
        case 'price-low': return priceA - priceB;
        case 'price-high': return priceB - priceA;
        case 'rating': return (b.rating || 0) - (a.rating || 0);
        case 'moq': return (a.moq || 1) - (b.moq || 1);
        case 'stock': return (b.stock || 0) - (a.stock || 0);
        default: return (a.name || '').localeCompare(b.name || '');
      }
    });

  const totalStock = activeBikes.reduce((sum, b) => sum + (b.stock || 0), 0);
  const totalCategories = categories.length - 1; // Subtract 'All'
  const totalBrands = [...new Set(activeBikes.map(b => b.brand).filter(Boolean))].length;

  return (
    <div className="bikes-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1 className="cin-page-title">Available <em className="shining-bookit">Bookit</em></h1>
            <p className="cin-page-subtitle">Premium B2B inventory ready for deployment</p>
          </div>
          <button className="cin-btn-primary">📅 Plan My Trip</button>
        </div>
      </div>

      {/* Market Stats Bar */}
      <div className="market-stats-row">
        <StatCard 
          label="Total Bikes"
          value={activeBikes.length}
          icon="🏍️"
          glowColor="rgba(255,77,109,0.1)"
        />
        <StatCard 
          label="Categories"
          value={totalCategories}
          icon="🏷️"
          glowColor="rgba(0,145,234,0.1)"
        />
        <StatCard 
          label="Brands"
          value={totalBrands}
          icon="🏢"
          glowColor="rgba(0,200,83,0.1)"
        />
        <StatCard 
          label="Total Stock Units"
          value={totalStock}
          icon="📦"
          glowColor="rgba(255,171,0,0.1)"
        />
      </div>

      {/* Search + Filters + Live Clock */}
      <div className="search-clock-row">
        <div className="search-filter-controls">
          <div className="search-input-wrap cin-search">
            <span className="cin-search-icon">⌕</span>
            <input
              className="cin-search-input"
              type="text"
              placeholder="Search by bike name, brand..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="cin-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="name">Sort: Name</option>
            <option value="price-low">Price: Low → High</option>
            <option value="price-high">Price: High → Low</option>
            <option value="rating">Best Rating</option>
            <option value="moq">Lowest MOQ</option>
            <option value="stock">Most Stock</option>
          </select>
        </div>
        <LiveClock />
      </div>

      {/* Category Filters */}
      <div className="cin-filter-bar">
        {categories.map(cat => (
          <button
            key={cat}
            className={`cin-filter-chip ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat} {cat !== 'All' && <span className="cat-count">{bikes.filter(b => b.category === cat).length}</span>}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="loading"><div className="cin-spinner"></div></div>
      ) : filteredBikes.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🔍</div>
          <h3>No bikes match your search</h3>
          <p>Try adjusting your filters or search terms</p>
        </div>
      ) : (
        <>
          <p className="results-count">
            Showing {filteredBikes.length} of {activeBikes.length} listings
          </p>
          <div className="b2b-product-grid">
            {filteredBikes.map(bike => (
              <B2BProductCard key={bike.id} bike={bike} />
            ))}
          </div>
        </>
      )}

      <style>{`
        .bikes-page {
          animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        /* Header */
        .page-header { margin-bottom: 32px; }
        .page-header-row { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 20px; }
        .cin-page-title {
          font-family: 'Playfair Display', serif;
          font-size: 3.2rem; font-weight: 900; color: #16162A;
          margin: 0; line-height: 1.1; letter-spacing: -0.02em;
        }
        .cin-page-title em { font-style: italic; background: linear-gradient(135deg, #FF4D6D, #FF8C42); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .cin-page-subtitle { font-size: 1.05rem; color: #868E96; margin: 8px 0 0; font-weight: 500; }
        
        .cin-btn-primary {
          background: linear-gradient(135deg, #16162A, #2A2A40); color: #fff;
          border: none; padding: 14px 28px; border-radius: 100px; font-family: 'Outfit', sans-serif;
          font-weight: 700; font-size: 0.95rem; cursor: pointer;
          box-shadow: 0 10px 20px rgba(0,0,0,0.1); transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .cin-btn-primary:hover { transform: translateY(-3px); box-shadow: 0 15px 30px rgba(0,0,0,0.15); }

        /* Market Stats Row */
        .market-stats-row {
          display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px;
          margin-bottom: 32px;
        }

        /* Search & Controls */
        .search-clock-row {
          display: flex; justify-content: space-between; align-items: center;
          gap: 2rem; margin-bottom: 24px; flex-wrap: wrap;
        }
        .search-filter-controls { display: flex; gap: 16px; flex: 1; align-items: center; }
        
        .cin-search { position: relative; flex: 1; min-width: 250px; max-width: 400px; }
        .cin-search-icon { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); font-size: 1.2rem; color: #ADB5BD; }
        .cin-search-input {
          width: 100%; background: #ffffff; border: 1px solid rgba(0,0,0,0.06);
          padding: 14px 16px 14px 44px; border-radius: 100px;
          font-family: 'Outfit', sans-serif; font-size: 1rem; color: #212529; font-weight: 500;
          box-shadow: 0 5px 15px rgba(0,0,0,0.02); transition: all 0.3s ease;
        }
        .cin-search-input:focus { outline: none; border-color: rgba(255,77,109,0.3); box-shadow: 0 5px 20px rgba(255,77,109,0.1); }
        
        .cin-select {
          background: #ffffff; border: 1px solid rgba(0,0,0,0.06);
          padding: 14px 20px; border-radius: 100px;
          font-family: 'Outfit', sans-serif; font-size: 0.95rem; color: #212529; font-weight: 600;
          box-shadow: 0 5px 15px rgba(0,0,0,0.02); cursor: pointer; width: 180px;
        }

        /* Filter Chips */
        .cin-filter-bar {
          display: flex; gap: 12px; overflow-x: auto; padding-bottom: 12px; margin-bottom: 24px;
          -webkit-overflow-scrolling: touch;
        }
        .cin-filter-bar::-webkit-scrollbar { height: 0; }
        .cin-filter-chip {
          background: #ffffff; border: 1px solid rgba(0,0,0,0.06); color: #495057;
          padding: 10px 20px; border-radius: 100px; font-weight: 600; font-size: 0.9rem;
          cursor: pointer; transition: all 0.2s; white-space: nowrap;
          box-shadow: 0 4px 10px rgba(0,0,0,0.02); display: flex; align-items: center; gap: 8px;
        }
        .cin-filter-chip:hover { background: #F8F9FA; border-color: rgba(0,0,0,0.15); }
        .cin-filter-chip.active {
          background: #16162A; color: #fff; border-color: #16162A;
          box-shadow: 0 8px 20px rgba(22,22,42,0.2);
        }
        .cat-count {
          background: rgba(0,0,0,0.06); padding: 2px 8px; border-radius: 10px; font-size: 0.75rem; font-weight: 800;
        }
        .cin-filter-chip.active .cat-count { background: rgba(255,255,255,0.2); }

        .results-count { font-size: 0.9rem; color: #868E96; font-weight: 600; margin-bottom: 20px; letter-spacing: 0.02em; }

        .cin-spinner {
          width: 32px; height: 32px; border-radius: 50%;
          border: 3px solid rgba(255,77,109,0.2);
          border-top-color: #FF4D6D;
          animation: spin 0.8s linear infinite; margin: 40px auto;
        }

        /* Empty State */
        .empty-state { text-align: center; padding: 60px 20px; background: #ffffff; border-radius: 24px; border: 1px dashed rgba(0,0,0,0.1); margin-top: 20px;}
        .empty-state-icon { font-size: 3rem; margin-bottom: 16px; opacity: 0.5; }
        .empty-state h3 { font-family: 'Playfair Display', serif; font-size: 1.6rem; color: #16162A; margin: 0 0 8px; }
        .empty-state p { color: #868E96; margin: 0; }

        @media (max-width: 992px) {
          .search-clock-row { flex-direction: column; align-items: flex-start; }
          .search-filter-controls { width: 100%; flex-wrap: wrap; }
          .cin-search { min-width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default Bikes;