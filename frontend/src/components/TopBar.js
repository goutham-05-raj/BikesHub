import React from 'react';

const TopBar = ({ title, subtitle, onMenuToggle }) => {
    return (
        <div className="topbar">
            <div className="topbar-left">
                <button className="topbar-menu-btn" onClick={onMenuToggle}>☰</button>
                <div>
                    <div className="topbar-title">{title || 'BikesZone'}</div>
                    {subtitle && <div className="topbar-subtitle">{subtitle}</div>}
                </div>
            </div>
            <div className="topbar-right">
                <div className="topbar-search">
                    <span className="topbar-search-icon">🔍</span>
                    <input
                        className="topbar-search-input"
                        type="text"
                        placeholder="Search bikes, dealers, orders..."
                    />
                </div>
                <button className="topbar-icon-btn">
                    🔔
                    <span className="topbar-notification-dot"></span>
                </button>
                <button className="topbar-icon-btn">💬</button>
                <div className="topbar-user">
                    <div className="topbar-user-avatar">BZ</div>
                    <div>
                        <div className="topbar-user-name">Dealer Admin</div>
                        <div className="topbar-user-role">Verified Partner</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TopBar;
