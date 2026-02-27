import React from 'react';

const BookingForm = ({ 
  formData, 
  onChange, 
  errors, 
  onSubmit, 
  isSubmitting,
  selectedBike 
}) => {
  return (
    <form onSubmit={onSubmit}>
      <div className="grid grid-2">
        <div className="form-group">
          <label className="form-label">Full Name *</label>
          <input
            type="text"
            name="customer_name"
            className={`form-control ${errors.customer_name ? 'error' : ''}`}
            value={formData.customer_name}
            onChange={onChange}
            placeholder="Enter your full name"
          />
          {errors.customer_name && (
            <div className="error-message">{errors.customer_name}</div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Email *</label>
          <input
            type="email"
            name="customer_email"
            className={`form-control ${errors.customer_email ? 'error' : ''}`}
            value={formData.customer_email}
            onChange={onChange}
            placeholder="Enter your email"
          />
          {errors.customer_email && (
            <div className="error-message">{errors.customer_email}</div>
          )}
        </div>
      </div>

      <div className="grid grid-2">
        <div className="form-group">
          <label className="form-label">Phone Number *</label>
          <input
            type="tel"
            name="customer_phone"
            className={`form-control ${errors.customer_phone ? 'error' : ''}`}
            value={formData.customer_phone}
            onChange={onChange}
            placeholder="Enter your phone number"
          />
          {errors.customer_phone && (
            <div className="error-message">{errors.customer_phone}</div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">License Number *</label>
          <input
            type="text"
            name="customer_license"
            className={`form-control ${errors.customer_license ? 'error' : ''}`}
            value={formData.customer_license}
            onChange={onChange}
            placeholder="Enter your license number"
          />
          {errors.customer_license && (
            <div className="error-message">{errors.customer_license}</div>
          )}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Address *</label>
        <textarea
          name="customer_address"
          className={`form-control ${errors.customer_address ? 'error' : ''}`}
          value={formData.customer_address}
          onChange={onChange}
          placeholder="Enter your complete address"
          rows="3"
        />
        {errors.customer_address && (
          <div className="error-message">{errors.customer_address}</div>
        )}
      </div>

      <div className="grid grid-2">
        <div className="form-group">
          <label className="form-label">Pickup Date *</label>
          <input
            type="date"
            name="pickup_date"
            className={`form-control ${errors.pickup_date ? 'error' : ''}`}
            value={formData.pickup_date}
            onChange={onChange}
            min={new Date().toISOString().split('T')[0]}
          />
          {errors.pickup_date && (
            <div className="error-message">{errors.pickup_date}</div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Return Date *</label>
          <input
            type="date"
            name="return_date"
            className={`form-control ${errors.return_date ? 'error' : ''}`}
            value={formData.return_date}
            onChange={onChange}
            min={formData.pickup_date || new Date().toISOString().split('T')[0]}
          />
          {errors.return_date && (
            <div className="error-message">{errors.return_date}</div>
          )}
        </div>
      </div>

      <div className="grid grid-2">
        <div className="form-group">
          <label className="form-label">Pickup Location *</label>
          <select
            name="pickup_location"
            className={`form-control form-select ${errors.pickup_location ? 'error' : ''}`}
            value={formData.pickup_location}
            onChange={onChange}
          >
            <option value="">Select pickup location</option>
            <option value="Main Store - City Center">Main Store - City Center</option>
            <option value="Airport Branch">Airport Branch</option>
            <option value="Railway Station Branch">Railway Station Branch</option>
            <option value="Mall Branch">Mall Branch</option>
          </select>
          {errors.pickup_location && (
            <div className="error-message">{errors.pickup_location}</div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Return Location *</label>
          <select
            name="return_location"
            className={`form-control form-select ${errors.return_location ? 'error' : ''}`}
            value={formData.return_location}
            onChange={onChange}
          >
            <option value="">Select return location</option>
            <option value="Main Store - City Center">Main Store - City Center</option>
            <option value="Airport Branch">Airport Branch</option>
            <option value="Railway Station Branch">Railway Station Branch</option>
            <option value="Mall Branch">Mall Branch</option>
          </select>
          {errors.return_location && (
            <div className="error-message">{errors.return_location}</div>
          )}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Special Requests</label>
        <textarea
          name="special_requests"
          className="form-control"
          value={formData.special_requests}
          onChange={onChange}
          placeholder="Any special requirements or requests..."
          rows="3"
        />
      </div>

      <button 
        type="submit" 
        className="btn btn-primary"
        disabled={isSubmitting}
        style={{ width: '100%', marginTop: '1rem' }}
      >
        {isSubmitting ? 'Processing...' : `Book ${selectedBike?.name || 'Bike'}`}
      </button>
    </form>
  );
};

export default BookingForm;