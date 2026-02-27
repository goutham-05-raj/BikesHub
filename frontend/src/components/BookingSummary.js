import React from 'react';

const BookingSummary = ({ selectedBike, formData, totalAmount }) => {
  const calculateRentalDays = () => {
    if (!formData.pickup_date || !formData.return_date) return 0;
    const pickup = new Date(formData.pickup_date);
    const returnDate = new Date(formData.return_date);
    const diffTime = Math.abs(returnDate - pickup);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
  };

  const rentalDays = calculateRentalDays();
  const baseAmount = (selectedBike?.price || 0) * rentalDays;
  const insurance = baseAmount * 0.10; // 10% insurance
  const tax = (baseAmount + insurance) * 0.08; // 8% tax

  return (
    <div className="booking-summary">
      <h3 style={{ marginBottom: '1.5rem', color: 'var(--primary-color)' }}>
        Booking Summary
      </h3>

      {selectedBike && (
        <div style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #eee' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div 
              style={{
                width: '60px',
                height: '60px',
                background: 'var(--light-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '8px'
              }}
            >
              🏍️
            </div>
            <div>
              <h4 style={{ margin: 0, color: 'var(--primary-color)' }}>{selectedBike.name}</h4>
              <p style={{ margin: 0, color: 'var(--gray-color)', fontSize: '0.9rem' }}>
                {selectedBike.category}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="summary-item">
        <span>Rental Days:</span>
        <span>{rentalDays} day{rentalDays !== 1 ? 's' : ''}</span>
      </div>

      <div className="summary-item">
        <span>Base Rate:</span>
        <span>₹{baseAmount.toFixed(2)}</span>
      </div>

      <div className="summary-item">
        <span>Insurance (10%):</span>
        <span>₹{insurance.toFixed(2)}</span>
      </div>

      <div className="summary-item">
        <span>Tax (8%):</span>
        <span>₹{tax.toFixed(2)}</span>
      </div>

      <div className="summary-item summary-total">
        <span>Total Amount:</span>
        <span>₹{totalAmount.toFixed(2)}</span>
      </div>

      {formData.pickup_date && formData.return_date && (
        <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(52, 152, 219, 0.1)', borderRadius: '8px' }}>
          <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--dark-color)' }}>
            <strong>Pickup:</strong> {new Date(formData.pickup_date).toLocaleDateString()} at {formData.pickup_location}
          </p>
          <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: 'var(--dark-color)' }}>
            <strong>Return:</strong> {new Date(formData.return_date).toLocaleDateString()} at {formData.return_location}
          </p>
        </div>
      )}
    </div>
  );
};

export default BookingSummary;