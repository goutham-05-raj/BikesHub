import React from 'react';
import { Link } from 'react-router-dom';

const B2BProductCard = ({ bike }) => {
    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN').format(price);
    };

    return (
        <div className="b2b-card">
            {/* Image */}
            <div className="b2b-card-image">
                {bike.image_url ? (
                    <img src={bike.image_url} alt={bike.name} />
                ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '3rem', opacity: 0.3 }}>🏍️</div>
                )}
                <div className="b2b-card-image-overlay"></div>
                <div className="b2b-card-badge">
                    <span className="b2b-brand-badge">{bike.brand || bike.category}</span>
                    {bike.verified && (
                        <span className="b2b-verified-badge">✓ Verified</span>
                    )}
                </div>
            </div>

            {/* Body */}
            <div className="b2b-card-body">
                <div className="b2b-card-title">{bike.name}</div>
                <div className="b2b-card-engine">{bike.engine_cc || '—'}cc • {bike.category}</div>

                <div className="b2b-card-price-section">
                    <span className="b2b-price-label">Rental Price</span>
                    <span className="b2b-price-value">₹{formatPrice(bike.price)}</span>
                </div>

                <div className="b2b-card-specs-minimal">
                    <div className="b2b-spec-item">
                        <span className="b2b-spec-icon">⭐</span>
                        <span>{bike.rating || '4.0'}</span>
                    </div>
                    <div className="b2b-spec-item">
                        <span className="b2b-spec-icon">🚚</span>
                        <span>{bike.delivery_days || 7} days delivery</span>
                    </div>
                </div>

                <div className="b2b-card-divider"></div>

                <div className="b2b-card-footer">
                    <Link to={`/book/${bike.id}`} className="btn btn-primary">
                        Book Now
                    </Link>
                    <Link to={`/bike/${bike.id}`} className="btn btn-outline">
                        View Details
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default B2BProductCard;
