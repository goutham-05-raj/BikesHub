import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import brandedLogo from '../assets/logo_branded.png';

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();
  const [hoveredLink, setHoveredLink] = useState(null);

  const handleLogout = async () => {
    try { await logout(); navigate('/'); }
    catch (error) { console.error('Failed to log out', error); }
  };

    const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: '⬡', color: '#FF4D6D' },
    { name: 'Bookit', path: '/inventory', icon: '◈', color: '#0091EA' },
    { name: 'Bookings', path: '/orders', icon: '◎', color: '#00C853' },
    { name: 'Customers', path: '/dealers', icon: '◉', color: '#AA00FF' },
    { name: 'Feedback', path: '/feedback', icon: '💬', color: '#FFD600' },
  ];

  const adminLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: '⬡', color: '#FF4D6D' },
    { name: 'Bookit', path: '/inventory', icon: '◈', color: '#0091EA' },
    { name: 'Bookings', path: '/orders', icon: '◎', color: '#00C853' },
    { name: 'Customers', path: '/dealers', icon: '◉', color: '#AA00FF' },
    { name: 'Manage Dealers', path: '/admin/dealers', icon: '⬢', color: '#FF3D00' },
    { name: 'Live Location', path: '/live-location', icon: '◬', color: '#FFAB00' },
  ];

  const linksToUse = user?.role === 'admin' ? adminLinks : navLinks;

  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'open' : ''}`} onClick={onClose} />
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        
        {/* Brand Area */}
        <div className="sidebar-brand">
          <div className="brand-logo-wrap">
            <img src={brandedLogo} alt="" className="brand-logo" />
            <div className="brand-glow" />
          </div>
          <div className="brand-text">
            <h2>BikesHub</h2>
            <span>COMMAND OS v3</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <div className="nav-label">Main Menu</div>
          {linksToUse.map((link) => {
            const isActive = location.pathname === link.path;
            const isHovered = hoveredLink === link.path;
            return (
              <button
                key={link.name}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => { navigate(link.path); if (window.innerWidth <= 1024) onClose(); }}
                onMouseEnter={() => setHoveredLink(link.path)}
                onMouseLeave={() => setHoveredLink(null)}
              >
                {/* Active Indicator Bar */}
                <div 
                  className="nav-active-bar" 
                  style={{ 
                    background: link.color,
                    boxShadow: isActive ? `0 0 15px ${link.color}` : 'none',
                    opacity: isActive ? 1 : 0
                  }} 
                />
                
                {/* Icon */}
                <span 
                  className="nav-icon" 
                  style={{ color: isActive || isHovered ? link.color : '#ADB5BD' }}
                >
                  {link.icon}
                </span>

                {/* Name */}
                <span className={`nav-name ${link.name === 'Bookit' ? 'shining-bookit' : ''}`}>{link.name}</span>

                {/* Hover Glow */}
                {(isActive || isHovered) && (
                  <div className="nav-hover-glow" style={{ background: link.color }} />
                )}
              </button>
            );
          })}
        </nav>

        {/* User Area */}
        <div className="sidebar-user">
          <div className="user-info">
            <div className="user-avatar">{user?.email?.charAt(0).toUpperCase() || 'A'}</div>
            <div className="user-details">
              <span className="user-email">{user?.email || 'admin@123.com'}</span>
              <span className="user-role">{user?.role || 'System Admin'}</span>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
             Log Out <span className="logout-icon">→</span>
          </button>
        </div>

        <style>{`
          .sidebar-overlay {
            position: fixed; inset: 0; background: rgba(0,0,0,0.4);
            backdrop-filter: blur(8px); z-index: 90; opacity: 0; pointer-events: none;
            transition: opacity 0.4s ease;
          }
          .sidebar-overlay.open { opacity: 1; pointer-events: auto; }

          .sidebar {
            position: fixed; top: 0; left: 0; bottom: 0;
            width: var(--sidebar-width);
            background: rgba(14, 165, 233, 0.15); /* Acid Sky Blue Frost */
            box-shadow: inset 0 0 20px rgba(14, 165, 233, 0.1);
            backdrop-filter: blur(40px) saturate(180%);
            border-right: 1px solid rgba(0,0,0,0.06);
            z-index: 100; display: flex; flex-direction: column;
            transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
            overflow: hidden;
            box-shadow: 10px 0 40px rgba(0,0,0,0.02);
          }
          
          @media (max-width: 1024px) {
            .sidebar { transform: translateX(-100%); }
            .sidebar.open { transform: translateX(0); }
          }

          /* Brand */
          .sidebar-brand {
            padding: 36px 28px;
            display: flex; align-items: center; gap: 18px;
            position: relative;
          }
          .sidebar-brand::after {
            content: ''; position: absolute; bottom: 0; left: 24px; right: 24px;
            height: 1px; background: linear-gradient(90deg, rgba(0,0,0,0.08), transparent);
          }
          .brand-logo-wrap { position: relative; }
          .brand-logo { width: 44px; height: 44px; border-radius: 12px; position: relative; z-index: 2; box-shadow: 0 8px 20px rgba(255,77,109,0.15); }
          .brand-glow {
            position: absolute; inset: -5px; border-radius: 14px;
            background: var(--accent); filter: blur(12px); opacity: 0.15;
          }
          .brand-text h2 {
            font-family: 'Playfair Display', serif;
            font-size: 1.6rem; font-weight: 800; color: #16162A;
            margin: 0; line-height: 1; transition: transform 0.3s;
          }
          .brand-text span {
            font-size: 0.65rem; font-weight: 800; color: var(--accent);
            letter-spacing: 0.15em; text-transform: uppercase;
          }

          /* Nav */
          .sidebar-nav { flex: 1; padding: 32px 16px; display: flex; flex-direction: column; gap: 6px; overflow-y: auto; }
          .nav-label {
            padding: 0 16px; margin-bottom: 8px;
            font-size: 0.72rem; font-weight: 800; color: #ADB5BD;
            text-transform: uppercase; letter-spacing: 0.12em;
          }
          .nav-item {
            position: relative; display: flex; align-items: center; gap: 16px;
            width: 100%; padding: 14px 16px; border: none; background: transparent;
            cursor: pointer; border-radius: 14px; overflow: hidden;
            transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
            text-align: left;
          }
          .nav-item:hover { transform: scale(1.02); }
          
          .nav-active-bar {
            position: absolute; left: 0; top: 15%; bottom: 15%; width: 4px;
            border-radius: 0 4px 4px 0; transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          }
          
          .nav-icon { font-size: 1.25rem; transition: color 0.3s ease; position: relative; z-index: 2; }
          .nav-name { 
            font-family: 'Outfit', sans-serif; font-size: 1.05rem; 
            font-weight: 600; color: #495057; transition: color 0.3s ease; position: relative; z-index: 2;
          }
          
          .nav-item.active .nav-name { color: #16162A; font-weight: 700; }
          .nav-item:hover:not(.active) .nav-name { color: #16162A; }

          .nav-hover-glow {
            position: absolute; inset: 0; opacity: 0.05;
            transition: opacity 0.3s ease; pointer-events: none;
          }
          .nav-item.active .nav-hover-glow { opacity: 0.08; }

          /* User Bottom */
          .sidebar-user {
            padding: 24px; border-top: 1px solid rgba(0,0,0,0.06);
            display: flex; flex-direction: column; gap: 16px;
          }
          .user-info { display: flex; align-items: center; gap: 14px; }
          .user-avatar {
            width: 44px; height: 44px; border-radius: 14px;
            background: linear-gradient(135deg, #FF4D6D, #FF8C42);
            color: #fff; font-family: 'Playfair Display', serif; font-weight: 900; font-size: 1.3rem;
            display: flex; align-items: center; justify-content: center;
            box-shadow: 0 8px 20px rgba(255,77,109,0.25);
          }
          .user-details { display: flex; flex-direction: column; }
          .user-email { font-size: 0.95rem; font-weight: 700; color: #212529; }
          .user-role { font-size: 0.75rem; color: #868E96; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }

          .logout-btn {
            background: rgba(0,0,0,0.03); border: 1px solid rgba(0,0,0,0.05);
            color: #495057; padding: 12px; border-radius: 12px;
            font-size: 0.85rem; font-weight: 700; font-family: 'Outfit', sans-serif;
            cursor: pointer; display: flex; align-items: center; justify-content: space-between;
            transition: all 0.2s ease;
          }
          .logout-btn:hover { background: rgba(255,77,109,0.08); color: #E63946; border-color: rgba(255,77,109,0.2); }
          .logout-icon { transition: transform 0.2s; }
          .logout-btn:hover .logout-icon { transform: translateX(4px); }
        `}</style>
      </div>
    </>
  );
};

export default Sidebar;
