import React from 'react';
import { Link, useLocation } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isOpen, onClose }) => {
    const location = useLocation();
    const { user, logout } = useAuth();

    const isActive = (path) => location.pathname === path;

    const handleLogout = async () => {
        try {
            await logout();
            onClose();
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    const mainNav = [
        { path: '/', icon: '🏠', label: 'Marketplace', badge: null },
        { path: '/inventory', icon: '📦', label: 'Inventory', badge: '10' },
        { path: '/orders', icon: '📋', label: 'Orders', badge: '5' },
        { path: '/dealers', icon: '🤝', label: 'Dealer Network', badge: null },
        { path: '/analytics', icon: '📊', label: 'Market Analytics', badge: null },
    ];

    const managementNav = [
        { path: '/messages', icon: '💬', label: 'Messages', badge: '3' },
        { path: '/settings', icon: '⚙️', label: 'Settings', badge: null },
        { path: '/terms', icon: '📄', label: 'Legal & Terms', badge: null },
    ];

    return (
        <>
            <div className={`sidebar-overlay ${isOpen ? 'active' : ''}`} onClick={onClose}></div>
            <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
                {/* Brand */}
                <div className="sidebar-brand">
                    <div className="sidebar-brand-icon">🏍️</div>
                    <div className="sidebar-brand-text">
                        <div className="sidebar-brand-name">BikesZone</div>
                        <div className="sidebar-brand-sub">B2B Marketplace</div>
                    </div>
                </div>

                {/* Main Navigation */}
                <div className="sidebar-section">
                    <div className="sidebar-section-label">Trading</div>
                    <nav className="sidebar-nav">
                        {mainNav.map(item => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`sidebar-link ${isActive(item.path) ? 'active' : ''}`}
                                onClick={onClose}
                            >
                                <span className="sidebar-link-icon">{item.icon}</span>
                                <span className="sidebar-link-text">{item.label}</span>
                                {item.badge && <span className="sidebar-link-badge">{item.badge}</span>}
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* Management */}
                <div className="sidebar-section">
                    <div className="sidebar-section-label">Management</div>
                    <nav className="sidebar-nav">
                        {managementNav.map(item => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`sidebar-link ${isActive(item.path) ? 'active' : ''}`}
                                onClick={onClose}
                            >
                                <span className="sidebar-link-icon">{item.icon}</span>
                                <span className="sidebar-link-text">{item.label}</span>
                                {item.badge && <span className="sidebar-link-badge">{item.badge}</span>}
                            </Link>
                        ))}
                        <button className="sidebar-link" onClick={handleLogout} style={{ width: '100%', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }}>
                            <span className="sidebar-link-icon">🚪</span>
                            <span className="sidebar-link-text">Logout</span>
                        </button>
                    </nav>
                </div>

                {/* User */}
                <div className="sidebar-user">
                    <div className="sidebar-user-avatar">
                        {user?.email?.substring(0, 2).toUpperCase() || 'BZ'}
                    </div>
                    <div className="sidebar-user-info">
                        <div className="sidebar-user-name" style={{ fontSize: '0.8rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {user?.email || 'Dealer Admin'}
                        </div>
                        <div className="sidebar-user-role">Verified Dealer</div>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
