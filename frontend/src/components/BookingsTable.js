import React from 'react';

const BookingsTable = ({ bookings, onStatusUpdate, isUpdating }) => {
  const getStatusColor = (status) => {
    const colors = {
      pending: 'status-pending',
      confirmed: 'status-confirmed',
      active: 'status-active',
      completed: 'status-completed',
      cancelled: 'status-cancelled'
    };
    return colors[status] || 'status-pending';
  };

  const canUpdateStatus = (currentStatus, newStatus) => {
    const allowedTransitions = {
      pending: ['confirmed', 'cancelled'],
      confirmed: ['active', 'cancelled'],
      active: ['completed'],
      completed: [],
      cancelled: []
    };
    return allowedTransitions[currentStatus]?.includes(newStatus);
  };

  const getAvailableStatusOptions = (currentStatus) => {
    const options = {
      pending: ['confirmed', 'cancelled'],
      confirmed: ['active', 'cancelled'],
      active: ['completed'],
      completed: [],
      cancelled: []
    };
    return options[currentStatus] || [];
  };

  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            <th>Booking ID</th>
            <th>Bike</th>
            <th>Customer</th>
            <th>Dates</th>
            <th>Total Amount</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id}>
              <td>
                <strong>{booking.booking_id}</strong>
              </td>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {booking.bike_image ? (
                    <img 
                      src={booking.bike_image} 
                      alt={booking.bike_name}
                      style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                    />
                  ) : (
                    <span>🏍️</span>
                  )}
                  <span>{booking.bike_name}</span>
                </div>
              </td>
              <td>
                <div>
                  <div>{booking.customer_name}</div>
                  <div style={{ fontSize: '0.8rem', color: '#666' }}>{booking.customer_email}</div>
                </div>
              </td>
              <td>
                <div style={{ fontSize: '0.9rem' }}>
                  <div>{new Date(booking.pickup_date).toLocaleDateString()}</div>
                  <div>to</div>
                  <div>{new Date(booking.return_date).toLocaleDateString()}</div>
                </div>
              </td>
              <td>₹{parseFloat(booking.total_amount).toFixed(2)}</td>
              <td>
                <span className={`status-badge ${getStatusColor(booking.status)}`}>
                  {booking.status}
                </span>
              </td>
              <td>
                <select
                  value=""
                  onChange={(e) => {
                    if (e.target.value) {
                      onStatusUpdate(booking.id, e.target.value);
                    }
                  }}
                  disabled={isUpdating === booking.id || getAvailableStatusOptions(booking.status).length === 0}
                  style={{ 
                    padding: '0.3rem 0.5rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '0.8rem'
                  }}
                >
                  <option value="">Update Status</option>
                  {getAvailableStatusOptions(booking.status).map((status) => (
                    <option key={status} value={status}>
                      Mark as {status}
                    </option>
                  ))}
                </select>
                {isUpdating === booking.id && (
                  <div style={{ display: 'inline-block', marginLeft: '0.5rem' }}>
                    <div className="spinner" style={{ width: '16px', height: '16px' }}></div>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookingsTable;