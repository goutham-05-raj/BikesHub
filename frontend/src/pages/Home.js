import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import B2BProductCard from '../components/B2BProductCard';
import StatCard from '../components/StatCard';
import API_BASE_URL from '../config/api';
import { useEffect } from 'react';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [hubs] = useState([
    { id: 1, name: "Vijayawada Central", bikes: 45, status: "High Demand", trend: "+12%", color: "#FF4D6D" },
    { id: 2, name: "Guntur Hub", bikes: 32, status: "Active", trend: "+5%", color: "#0091EA" },
    { id: 3, name: "Vizag Coastal", bikes: 88, status: "Peak", trend: "+18%", color: "#00C853" },
    { id: 4, name: "Tirupati Route", bikes: 24, status: "Stable", trend: "+2%", color: "#FFAB00" },
  ]);

  const [featuredBikes, setFeaturedBikes] = useState([]);
  const [loadingBikes, setLoadingBikes] = useState(true);

  useEffect(() => {
    const fetchFeaturedBikes = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/bikes`);
        const data = await response.json();
        if (data.success) {
          setFeaturedBikes(data.data.slice(0, 3));
        }
      } catch (error) {
        console.error("Error fetching featured bikes:", error);
      } finally {
        setLoadingBikes(false);
      }
    };
    fetchFeaturedBikes();
  }, []);

  const stats = [
    { label: "Active Rentals", value: "1,248", icon: "⬡", color: "#FF4D6D" },
    { label: "Bookit Utilization", value: "84%", icon: "◈", color: "#0091EA" },
    { label: "Today's Revenue", value: "₹4.2L", icon: "◎", color: "#00C853" },
    { label: "Pending Service", value: "12", icon: "◉", color: "#FFAB00" },
  ];

  return (
    <div className="home-dash">

      {/* Header section */}
      <div className="dash-header">
        <div className="dash-title-area">
          <div className="dash-eyebrow">
            <span className="live-pulse" /> NETWORK OVERVIEW
          </div>
          <h1 className="dash-headline">Bookit <em className="shining-bookit">Command</em></h1>
        </div>
        <div className="dash-actions">
          <button className="dash-btn dash-btn--outline">Download Report</button>
          <button className="dash-btn dash-btn--primary" onClick={() => navigate('/inventory')}>
            Manage Bookit <span className="arrow">→</span>
          </button>
        </div>
      </div>

      {/* Top Stats */}
      <div className="stat-grid">
        {stats.map((s, i) => (
          <StatCard 
            key={i}
            label={s.label}
            value={s.value}
            icon={s.icon}
            glowColor={s.color}
          />
        ))}
      </div>

      <div className="dash-split">
        {/* Active Hubs */}
        <div className="dash-panel hub-panel">
          <div className="panel-header">
            <h2 className="panel-title">Regional Hubs</h2>
            <button className="panel-link">View Map</button>
          </div>
          <div className="hub-list">
            {hubs.map(hub => (
              <div key={hub.id} className="hub-row">
                <div className="hub-info">
                  <div className="hub-dot" style={{ background: hub.color, boxShadow: `0 0 10px ${hub.color}80` }} />
                  <div>
                    <div className="hub-name">{hub.name}</div>
                    <div className="hub-status">{hub.status}</div>
                  </div>
                </div>
                <div className="hub-metrics">
                  <div className="hub-bikes">
                    <span className="hub-num">{hub.bikes}</span>
                    <span className="hub-unit">Units</span>
                  </div>
                  <div className="hub-trend" style={{ color: hub.color, background: `${hub.color}15` }}>{hub.trend}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Center */}
        <div className="dash-panel action-panel">
          <div className="panel-header">
            <h2 className="panel-title">Quick Actions</h2>
          </div>
          <div className="action-grid">
            <div className="action-card" onClick={() => navigate('/orders')}>
              <div className="ac-icon" style={{ borderColor: '#FF4D6D', color: '#FF4D6D', background: 'rgba(255,77,109,0.05)' }}>📋</div>
              <div className="ac-name">Approve Orders</div>
              <div className="ac-desc">5 pending verifications</div>
            </div>
            <div className="action-card" onClick={() => navigate('/inventory')}>
              <div className="ac-icon" style={{ borderColor: '#0091EA', color: '#0091EA', background: 'rgba(0,145,234,0.05)' }}>🏍️</div>
              <div className="ac-name">Add Vehicle</div>
              <div className="ac-desc">Update Bookit inventory</div>
            </div>
            {user?.role === 'admin' && (
              <div className="action-card" onClick={() => navigate('/live-location')}>
                <div className="ac-icon" style={{ borderColor: '#00C853', color: '#00C853', background: 'rgba(0,200,83,0.05)' }}>📡</div>
                <div className="ac-name">Live Location</div>
                <div className="ac-desc">Admin GPS monitoring</div>
              </div>
            )}
            <div className="action-card" onClick={() => navigate('/messages')}>
              <div className="ac-icon" style={{ borderColor: '#FFAB00', color: '#FFAB00', background: 'rgba(255,171,0,0.05)' }}>💬</div>
              <div className="ac-name">Dealer Comms</div>
              <div className="ac-desc">3 unread messages</div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative full-width banner */}
      <div className="dash-banner">
        <div className="bn-content">
          <div className="bn-tag">SYSTEM UPDATE</div>
          <h3 className="bn-title">BikesHub OS v3.1 is Live</h3>
          <p className="bn-desc">Experience the new bright cinematic command center. Faster routing, cleaner data, better visibility.</p>
        </div>
        <div className="bn-visual" />
      </div>


      {/* ── STYLES ── */}
      <style>{`
        .home-dash {
          display: flex;
          flex-direction: column;
          gap: 32px;
          animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Header */
        .dash-header { display: flex; justify-content: space-between; align-items: flex-end; }
        .dash-eyebrow {
          display: flex; align-items: center; gap: 8px;
          font-size: 0.75rem; font-weight: 800; letter-spacing: 0.2em;
          color: var(--text-muted); text-transform: uppercase; margin-bottom: 12px;
        }
        .live-pulse {
          width: 8px; height: 8px; border-radius: 50%; background: #FF4D6D;
          box-shadow: 0 0 10px #FF4D6D; animation: pulse 2s infinite;
        }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
        
        .dash-headline {
          font-family: 'Playfair Display', serif;
          font-size: 4rem; font-weight: 900; margin: 0;
          color: #16162A; letter-spacing: -0.02em; line-height: 1;
        }
        .dash-headline em {
          font-style: italic;
          background: var(--accent-gradient);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }

        .dash-actions { display: flex; gap: 16px; }
        .dash-btn {
          padding: 14px 28px; border-radius: 14px; font-weight: 800; font-size: 0.95rem;
          font-family: 'Outfit', sans-serif; cursor: pointer; transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .dash-btn--outline {
          background: #fff; border: 1px solid rgba(0,0,0,0.1);
          color: #495057; box-shadow: 0 4px 10px rgba(0,0,0,0.02);
        }
        .dash-btn--outline:hover { background: #F8F9FA; color: #16162A; border-color: rgba(0,0,0,0.2); transform: translateY(-2px); }
        
        .dash-btn--primary {
          background: var(--accent-gradient); color: #fff; border: none;
          box-shadow: 0 10px 30px rgba(255,77,109,0.25); display: flex; align-items: center; gap: 8px;
        }
        .dash-btn--primary:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(255,77,109,0.35); filter: brightness(1.05); }
        .dash-btn .arrow { transition: transform 0.2s; font-size: 1.2rem; }
        .dash-btn--primary:hover .arrow { transform: translateX(6px); }

        /* Split Panels */
        .dash-split { display: grid; grid-template-columns: 1fr 1fr; gap: 28px; }
        
        .dash-panel {
          background: rgba(14, 165, 233, 0.05); backdrop-filter: blur(30px);
          border: 1px solid rgba(14, 165, 233, 0.15); border-radius: 28px;
          padding: 36px; box-shadow: 0 15px 40px rgba(14, 165, 233, 0.02);
        }
        .panel-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 28px; }
        .panel-title { font-family: 'Playfair Display', serif; font-size: 1.6rem; font-weight: 900; color: #16162A; margin: 0; }
        .panel-link { background: none; border: none; font-size: 0.9rem; font-weight: 800; color: var(--accent); cursor: pointer; transition: color 0.2s; }
        .panel-link:hover { color: #16162A; }

        /* Hub List */
        .hub-list { display: flex; flex-direction: column; gap: 16px; }
        .hub-row {
          display: flex; justify-content: space-between; align-items: center;
          padding: 20px; background: #F8F9FA;
          border: 1px solid rgba(0,0,0,0.03); border-radius: 20px;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .hub-row:hover { background: #fff; transform: translateX(4px); box-shadow: 0 10px 20px rgba(0,0,0,0.03); border-color: rgba(0,0,0,0.08); }
        .hub-info { display: flex; align-items: center; gap: 20px; }
        .hub-dot { width: 12px; height: 12px; border-radius: 50%; }
        .hub-name { font-size: 1.05rem; font-weight: 800; color: #16162A; margin-bottom: 2px; }
        .hub-status { font-size: 0.75rem; color: #868E96; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; }
        
        .hub-metrics { display: flex; align-items: center; gap: 28px; text-align: right; }
        .hub-bikes { display: flex; flex-direction: column; }
        .hub-num { font-size: 1.3rem; font-weight: 900; color: #16162A; line-height: 1; }
        .hub-unit { font-size: 0.7rem; color: #ADB5BD; font-weight: 800; text-transform: uppercase; margin-top: 4px; }
        .hub-trend { font-size: 0.9rem; font-weight: 800; padding: 6px 12px; border-radius: 10px; }

        /* Action Grid */
        .action-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .action-card {
          padding: 24px; background: #F8F9FA;
          border: 1px solid rgba(0,0,0,0.04); border-radius: 20px;
          cursor: pointer; transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .action-card:hover {
          background: #fff; border-color: rgba(0,0,0,0.1);
          transform: translateY(-4px); box-shadow: 0 15px 30px rgba(0,0,0,0.04);
        }
        .ac-icon {
          width: 44px; height: 44px; border-radius: 12px; border: 1px solid;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.4rem; margin-bottom: 16px;
        }
        .ac-name { font-size: 1.05rem; font-weight: 800; color: #16162A; margin-bottom: 6px; }
        .ac-desc { font-size: 0.8rem; color: #868E96; font-weight: 600; }

        /* Fleet Grid */
        .dash-fleet { margin-top: 10px; }
        .fleet-grid { 
            display: grid; 
            grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); 
            gap: 28px; 
            padding-bottom: 20px;
        }
        .loading-shimmer {
            padding: 60px;
            background: #F8F9FA;
            border-radius: 28px;
            text-align: center;
            color: #ADB5BD;
            font-weight: 800;
            letter-spacing: 0.1em;
            text-transform: uppercase;
        }

        /* Banner */
        .dash-banner {
          position: relative; overflow: hidden;
          background: linear-gradient(135deg, rgba(255,77,109,0.08) 0%, rgba(255,140,66,0.05) 100%);
          border: 1px solid rgba(255,77,109,0.15); border-radius: 28px;
          padding: 40px 48px; display: flex; align-items: center; justify-content: space-between;
        }
        .bn-content { position: relative; z-index: 2; max-width: 550px; }
        .bn-tag {
          display: inline-block; font-size: 0.75rem; font-weight: 900;
          color: #FF4D6D; background: rgba(255,77,109,0.1);
          padding: 6px 14px; border-radius: 100px; letter-spacing: 0.15em; margin-bottom: 16px;
        }
        .bn-title { font-family: 'Playfair Display', serif; font-size: 2.2rem; font-weight: 900; color: #16162A; margin: 0 0 10px; }
        .bn-desc { font-size: 1.05rem; color: #495057; line-height: 1.6; margin: 0; font-weight: 500; }
        
        .bn-visual {
          position: absolute; right: -50px; top: -50px;
          width: 350px; height: 350px; border-radius: 50%;
          background: radial-gradient(circle, rgba(255,140,66,0.15) 0%, transparent 70%);
          filter: blur(30px); pointer-events: none;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .dash-split { grid-template-columns: 1fr; }
        }
        @media (max-width: 768px) {
          .dash-header { flex-direction: column; align-items: flex-start; gap: 24px; }
          .dash-headline { font-size: 3rem; }
          .action-grid { grid-template-columns: 1fr; }
          .dash-banner { padding: 32px; }
        }
      `}</style>
    </div>
  );
};

export default Home;