import React from 'react';
import { Link } from 'react-router-dom';

const BikeCard = ({ bike }) => {
  const features = typeof bike.features === 'string' 
    ? JSON.parse(bike.features) 
    : bike.features;

  return (
    <div className="card bike-card">
      <div className="bike-image">
        {bike.image_url ? (
          <img 
            src={bike.image_url} 
            alt={bike.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <span>🏍️</span>
        )}
      </div>
      
      <div className="bike-details">
        <h3 className="bike-name">{bike.name}</h3>
        <span className="bike-category">{bike.category}</span>
        
        <div className="bike-rating" style={{ marginBottom: '1rem' }}>
          {'⭐'.repeat(Math.floor(bike.average_rating || bike.rating))}
          <span style={{ marginLeft: '0.5rem', color: '#666' }}>
            ({bike.review_count || 0} reviews)
          </span>
        </div>
        
        <div className="bike-price">₹{bike.price}/day</div>
        
        {features && features.length > 0 && (
          <ul className="bike-features">
            {features.slice(0, 3).map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        )}
        
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <Link 
            to={`/booking/${bike.id}`} 
            className="btn btn-primary"
            style={{ flex: 1 }}
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BikeCard;