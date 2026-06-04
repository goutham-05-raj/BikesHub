import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const B2BProductCard = ({ bike }) => {
    const { user } = useAuth();
    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN').format(price);
    };

    return (
        <div className="b2b-card" style={{ 
            background: '#FDFDFD', 
            border: '1px solid #EDEDED', 
            boxShadow: '0 20px 48px rgba(0,0,0,0.04)', 
            borderRadius: '28px', 
            position: 'relative', 
            overflow: 'hidden', 
            padding: '8px', 
            transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)' 
        }}>
            
            {/* Image Section with Studio Backdrop */}
            <div className="b2b-card-image" style={{ 
                borderRadius: '22px', 
                overflow: 'hidden', 
                position: 'relative', 
                background: 'linear-gradient(135deg, #F8F9FA 0%, #E9ECEF 100%)', 
                height: '240px',
                border: '1px solid rgba(0,0,0,0.03)'
            }}>
                {bike.image_url ? (
                    <img src={bike.image_url} alt={bike.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                    <div className="b2b-image-placeholder" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', fontSize: '4rem', opacity: 0.1 }}>🏍️</div>
                )}
                <div className="b2b-card-image-overlay" style={{ position: 'absolute', inset: 0 }}></div>
                <div className="b2b-card-badge" style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 10, display: 'flex', gap: '8px' }}>
                    <span className="b2b-brand-badge" style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', color: '#16162A', fontWeight: 800, padding: '6px 12px', borderRadius: '100px', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{bike.brand || bike.category}</span>
                    {bike.verified && (
                        <span className="b2b-verified-badge" style={{ background: '#00C853', color: '#fff', fontWeight: 800, padding: '6px 12px', borderRadius: '100px', fontSize: '0.75rem', textTransform: 'uppercase' }}>✓ Verified</span>
                    )}

                </div>
            </div>

            {/* Body */}
            <div className="b2b-card-body" style={{ position: 'relative', zIndex: 10, padding: '24px 18px 18px' }}>
                <div className="b2b-card-title" style={{ fontFamily: "'Playfair Display', serif", color: '#16162A', fontWeight: 900, fontSize: '1.6rem', lineHeight: 1.1, marginBottom: '8px' }}>{bike.name}</div>
                <div className="b2b-card-engine" style={{ color: '#FF4D6D', fontWeight: 800, fontSize: '0.9rem', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{bike.engine_cc || '—'}cc • {bike.category}</div>

                <div className="b2b-card-price-section" style={{ 
                    background: '#F1F3F5', 
                    padding: '18px', 
                    borderRadius: '20px', 
                    border: '1px solid rgba(0,0,0,0.02)', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '4px' 
                }}>
                    <span className="b2b-price-label" style={{ color: '#868E96', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Daily Rental Protocol</span>
                    <span className="b2b-price-value" style={{ color: '#16162A', fontWeight: 900, fontSize: '1.9rem', fontFamily: "'Outfit', sans-serif" }}>₹{formatPrice(bike.price)}</span>
                </div>

                <div className="b2b-card-specs-minimal" style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid rgba(0,0,0,0.06)', marginBottom: '16px' }}>
                    <div className="b2b-spec-item" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#495057', fontSize: '0.95rem', fontWeight: 600 }}>
                        <span className="b2b-spec-icon" style={{ opacity: 0.7 }}>⭐</span>
                        <span>{bike.rating || '4.0'}</span>
                    </div>
                    <div className="b2b-spec-item" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#495057', fontSize: '0.95rem', fontWeight: 600 }}>
                        <span className="b2b-spec-icon" style={{ opacity: 0.7 }}>🚚</span>
                        <span>{bike.delivery_days || 7} Days</span>
                    </div>
                </div>

                <div className="b2b-card-footer" style={{ display: 'flex', gap: '12px' }}>
                        <Link to={`/book/${bike.id}`} style={{ flex: 1, textAlign: 'center', background: 'linear-gradient(135deg, #16162A, #2A2A40)', color: '#fff', border: 'none', padding: '14px', borderRadius: '14px', fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: '1rem', textDecoration: 'none', transition: 'transform 0.2s', boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }}>
                            Book Now
                        </Link>
                    <Link to={`/bike/${bike.id}`} style={{ padding: '14px', borderRadius: '14px', background: 'rgba(255,77,109,0.1)', color: '#FF4D6D', textDecoration: 'none', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}>
                        👁️
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default B2BProductCard;
