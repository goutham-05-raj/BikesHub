import React from 'react';

const StatCard = ({ 
    icon, 
    label, 
    value, 
    trend, 
    trendValue, 
    color = 'blue', 
    bgImage, 
    variant = 'default', // 'default' | 'visual'
    glowColor,
    style = {}
}) => {
    if (variant === 'visual') {
        return (
            <div className={`stat-card visual-stat-card`} style={style}>
                {bgImage && <img src={bgImage} alt="" className="visual-bg" />}
                <div className="visual-overlay"></div>
                <div className="visual-content">
                    <div className="vs-top">
                        <span className="vs-icon">{icon}</span>
                        {trend && (
                            <span className={`vs-trend vs-trend--${trend}`}>
                                {trend === 'up' ? '↑' : '↓'} {trendValue}
                            </span>
                        )}
                    </div>
                    <div>
                        <div className="vs-val">{value}</div>
                        <div className="vs-label">{label}</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`stat-card stat-card--${color}`} style={style}>
            {glowColor && <div className="stat-glow" style={{ background: glowColor }} />}
            {bgImage && <img src={bgImage} alt="" className="stat-card-bg-image" />}
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
