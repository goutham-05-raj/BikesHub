import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const TopBar = ({ title, subtitle, onMenuToggle }) => {
  const { currentUser } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, text: 'New booking request (#4429)', time: '2 mins ago', type: 'order', color: '#00C853' },
    { id: 2, text: 'Vehicle AP-07-XX-1234 requires service', time: '1 hr ago', type: 'alert', color: '#FF4D6D' },
    { id: 3, text: 'Bookit utilization at 85%', time: '3 hrs ago', type: 'info', color: '#0091EA' }
  ];

  const unreadCount = notifications.length;

  return (
    <div className="topbar">
      {/* Mobile Menu Button */}
      <button className="mobile-menu-btn" onClick={onMenuToggle}>
        <span className="icon">≡</span>
      </button>

      {/* Title Area */}
      <div className="topbar-left">
        <h1 className="page-title">{title || 'Dashboard'}</h1>
        {subtitle && <p className="page-subtitle">{subtitle}</p>}
      </div>

      {/* Right Controls */}
      <div className="topbar-right">
        
        {/* Search */}
        <div className="search-wrap">
          <span className="search-icon" style={{ color: '#ADB5BD' }}>⌕</span>
          <input type="text" placeholder="Search orders, bikes..." className="search-input" />
        </div>

        {/* Notifications */}
        <div className="notif-wrap">
          <button 
            className={`notif-btn ${showNotifications ? 'active' : ''}`}
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <span className="icon" style={{ color: '#868E96' }}>🔔</span>
            {unreadCount > 0 && (
              <span className="notif-badge">
                {unreadCount}
                <span className="ping-effect" />
              </span>
            )}
          </button>

          {/* Dropdown overlay */}
          {showNotifications && (
            <div className="notif-dropdown">
              <div className="dd-header">
                <h3>Notifications</h3>
                <button className="clear-btn">Clear All</button>
              </div>
              <div className="dd-list">
                {notifications.map(n => (
                  <div key={n.id} className="notif-item">
                    <div className="n-dot" style={{ background: n.color, boxShadow: `0 0 10px ${n.color}` }} />
                    <div className="n-content">
                      <p className="n-text">{n.text}</p>
                      <span className="n-time">{n.time}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="dd-footer">
                <button>View All Activity</button>
              </div>
            </div>
          )}
        </div>

        {/* User Mini */}
        <div className="user-mini">
          <div className="u-avatar">
            {currentUser?.email?.charAt(0).toUpperCase() || 'A'}
          </div>
        </div>

      </div>

      <style>{`
        .topbar {
          height: var(--topbar-height);
          display: flex; justify-content: space-between; align-items: center;
          padding: 0 40px; margin: 20px 40px 0;
          background: rgba(255, 255, 255, 0.85); /* Bright glass */
          backdrop-filter: blur(30px) saturate(180%);
          border: 1px solid rgba(0,0,0,0.06); border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.03);
          z-index: 50; position: relative;
        }

        .mobile-menu-btn {
          display: none; background: transparent; border: none;
          color: #16162A; font-size: 1.8rem; cursor: pointer; padding: 0 10px 0 0;
        }

        /* Titles */
        .topbar-left { display: flex; flex-direction: column; justify-content: center; }
        .page-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.6rem; font-weight: 900; line-height: 1.1; margin: 0;
          background: linear-gradient(135deg, #16162A 0%, #FF4D6D 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
        .page-subtitle { font-size: 0.85rem; color: #868E96; margin: 2px 0 0; font-weight: 600; font-family: 'Outfit', sans-serif;}

        /* Right side */
        .topbar-right { display: flex; align-items: center; gap: 24px; }

        /* Search */
        .search-wrap { position: relative; display: flex; align-items: center; }
        .search-icon { position: absolute; left: 14px; font-size: 1.2rem; pointer-events: none; }
        .search-input {
          background: #F8F9FA; border: 1px solid rgba(0,0,0,0.05);
          color: #212529; font-size: 0.95rem; font-family: 'Outfit', sans-serif;
          padding: 10px 16px 10px 40px; border-radius: 100px;
          width: 200px; transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          font-weight: 500;
        }
        .search-input::placeholder { color: #ADB5BD; }
        .search-input:focus {
          width: 280px; outline: none; border-color: rgba(255,77,109,0.3);
          background: #ffffff; box-shadow: 0 0 0 3px rgba(255,77,109,0.08);
        }

        /* Notification */
        .notif-wrap { position: relative; }
        .notif-btn {
          background: #F8F9FA; border: 1px solid rgba(0,0,0,0.05);
          width: 44px; height: 44px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; position: relative; transition: all 0.2s;
        }
        .notif-btn:hover, .notif-btn.active {
          background: #fff; border-color: rgba(255,77,109,0.2);
          transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0,0,0,0.05);
        }
        .notif-btn .icon { font-size: 1.2rem; }
        
        .notif-badge {
          position: absolute; top: -2px; right: -2px;
          background: #FF4D6D; color: #fff;
          font-size: 0.65rem; font-weight: 800;
          min-width: 18px; height: 18px; border-radius: 9px;
          display: flex; align-items: center; justify-content: center;
          border: 2px solid #fff;
        }
        .ping-effect {
          position: absolute; inset: 0; border-radius: 50%;
          background: #FF4D6D; animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite; z-index: -1;
        }
        @keyframes ping { 75%, 100% { transform: scale(2); opacity: 0; } }

        /* Notification Dropdown */
        .notif-dropdown {
          position: absolute; top: calc(100% + 14px); right: 0;
          width: 380px; background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(40px) saturate(200%);
          border: 1px solid rgba(0,0,0,0.06); border-radius: 20px;
          box-shadow: 0 20px 50px rgba(0,0,0,0.1);
          animation: dropFade 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          overflow: hidden;
        }
        @keyframes dropFade {
          from { opacity: 0; transform: translateY(-10px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .dd-header {
          display: flex; justify-content: space-between; align-items: center;
          padding: 16px 20px; border-bottom: 1px solid rgba(0,0,0,0.05);
        }
        .dd-header h3 { font-family: 'Playfair Display', serif; font-size: 1.1rem; color: #16162A; margin: 0; font-weight: 800; }
        .clear-btn { background: none; border: none; font-size: 0.75rem; color: var(--accent); font-weight: 700; cursor: pointer; }

        .dd-list { display: flex; flex-direction: column; max-height: 380px; overflow-y: auto; }
        .notif-item {
          display: flex; align-items: flex-start; gap: 14px;
          padding: 16px 20px; border-bottom: 1px solid rgba(0,0,0,0.03);
          transition: background 0.2s; cursor: pointer;
        }
        .notif-item:hover { background: #F8F9FA; }
        .n-dot { width: 8px; height: 8px; border-radius: 50%; margin-top: 6px; flex-shrink: 0; }
        .n-text { font-size: 0.95rem; color: #212529; margin: 0 0 6px; font-weight: 500; line-height: 1.4; }
        .n-time { font-size: 0.72rem; color: #ADB5BD; font-weight: 600; text-transform: uppercase; }

        .dd-footer { padding: 12px; text-align: center; border-top: 1px solid rgba(0,0,0,0.05); background: #F8F9FA; }
        .dd-footer button { background: none; border: none; font-size: 0.8rem; font-weight: 800; color: #868E96; cursor: pointer; transition: color 0.2s; }
        .dd-footer button:hover { color: #16162A; }

        /* User Mini */
        .user-mini { display: flex; align-items: center; gap: 12px; cursor: pointer; }
        .u-avatar {
          width: 44px; height: 44px; border-radius: 12px;
          background: linear-gradient(135deg, #FF4D6D, #FF8C42);
          color: #fff; font-family: 'Playfair Display', serif; font-weight: 900; font-size: 1.3rem;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 15px rgba(255,77,109,0.2);
          transition: transform 0.2s;
        }
        .user-mini:hover .u-avatar { transform: scale(1.05); box-shadow: 0 8px 25px rgba(255,77,109,0.3); }

        /* Mobile */
        @media (max-width: 1024px) {
          .topbar { margin: 20px 20px 0; padding: 0 24px; }
          .mobile-menu-btn { display: block; }
        }
        @media (max-width: 600px) {
          .topbar { margin: 16px 16px 0; padding: 0 16px; border-radius: 16px; }
          .search-wrap { display: none; }
          .page-title { font-size: 1.3rem; }
        }
      `}</style>
    </div>
  );
};

export default TopBar;
