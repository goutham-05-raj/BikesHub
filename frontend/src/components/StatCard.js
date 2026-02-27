import React from 'react';

const StatCard = ({ icon, label, value, trend, trendValue, color = 'blue' }) => {
    return (
        <div className={`stat-card stat-card--${color}`}>
            <div className="stat-card-header">
                <div className={`stat-card-icon stat-card-icon--${color}`}>
                    {icon}
                </div>
                {trend && (
                    <div className={`stat-card-trend stat-card-trend--${trend}`}>
                        {trend === 'up' ? '↑' : '↓'} {trendValue}
                    </div>
                )}
            </div>
            <div className="stat-card-value">{value}</div>
            <div className="stat-card-label">{label}</div>
        </div>
    );
};

export default StatCard;
