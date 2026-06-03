import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../config/api';
import LiveClock from '../components/LiveClock';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const BookingsManagement = () => {
  const [filterStatus, setFilterStatus] = useState('all');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      try {
        const idToken = await user.getIdToken();
        const response = await fetch(`${API_BASE_URL}/api/bookings`, {
          headers: {
            'Authorization': `Bearer ${idToken}`
          }
        });

        if (!response.ok) throw new Error('Failed to fetch orders');

        const data = await response.json();
        const ordersList = data.data.map(order => ({
          ...order,
          status: (order.status || 'pending').toLowerCase(),
          date: new Date(order.created_at || order.createdAt || Date.now()).toLocaleDateString()
        }));

        setOrders(ordersList);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const handleCancel = async (id) => {
    if (id === 'DEMO-999') {
      alert('Demo bookings cannot be cancelled via API, but I have removed it from your view.');
      setOrders(prev => prev.filter(o => o.id !== id));
      return;
    }

    if (!window.confirm('Are you sure you want to cancel this booking? This will release the bike back to inventory.')) return;
    
    try {
        const idToken = await user.getIdToken();
        const response = await fetch(`${API_BASE_URL}/api/bookings/${id}/cancel`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${idToken}`
          }
        });

        if (response.ok) {
            setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'cancelled' } : o));
            alert('Booking cancelled successfully.');
        } else {
            const err = await response.text();
            alert(`Failed to cancel: ${err}`);
        }
    } catch (error) {
        console.error("Cancel error:", error);
        alert('An error occurred during cancellation.');
    }
  };

  const filterOptions = [
    { id: 'all', label: 'All Orders' },
    { id: 'pending', label: 'Pending' },
    { id: 'confirmed', label: 'Confirmed' },
    { id: 'shipped', label: 'Shipped' },
    { id: 'delivered', label: 'Delivered' },
  ];

  const filteredOrders = filterStatus === 'all'
    ? orders
    : orders.filter(o => o.status === filterStatus);

  const getBadgeClass = (status) => {
    switch (status) {
      case 'pending': return 'badge--warning';
      case 'confirmed':
      case 'shipped':
      case 'in-transit': return 'badge--primary';
      case 'delivered': return 'badge--success';
      case 'cancelled': return 'badge--danger';
      default: return 'badge--neutral';
    }
  };

  return (
    <div className="orders-page" style={{ minHeight: '100vh', padding: '2rem' }}>
      <style>{`
        /* ── Modern SaaS Admin Panel Styles ── */
        .orders-page .page-header { 
          display: flex; 
          justify-content: space-between; 
          align-items: center; 
          margin-bottom: 2rem; 
        }
        .orders-page .page-header h1 { 
          color: #ef4444; 
          font-size: 2.25rem; 
          font-weight: 800; 
          letter-spacing: -0.04em;
          margin-bottom: 0.25rem;
          text-transform: uppercase;
          font-family: 'Outfit', sans-serif;
        }
        .orders-page .page-header p { color: #6B7280; font-size: 0.875rem; }

        /* Metric Cards */
        .orders-page .stats-grid { 
          display: grid; 
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); 
          gap: 1.5rem; 
          margin-bottom: 2rem; 
        }
        .orders-page .metric-card {
          background: #FFFFFF;
          border: 1px solid #E5E7EB;
          border-radius: 12px;
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
          transition: all 0.2s ease;
          position: relative;
          overflow: hidden;
        }
        .orders-page .metric-card:hover { transform: translateY(-2px); box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
        .orders-page .metric-card::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 4px;
        }
        .orders-page .metric-card.primary::before { background: #3B82F6; }
        .orders-page .metric-card.success::before { background: #10B981; }
        .orders-page .metric-card.warning::before { background: #f471b5; }
        .orders-page .metric-card.info::before { background: #6366F1; }

        .orders-page .metric-label { color: #6B7280; font-size: 0.875rem; font-weight: 500; }
        .orders-page .metric-value { color: #111827; font-size: 1.5rem; font-weight: 700; }

        /* Filters */
        .orders-page .filter-bar { 
          display: flex; 
          gap: 0.5rem; 
          margin-bottom: 1.5rem; 
          background: rgba(255, 255, 255, 0.4); 
          padding: 0.25rem; 
          border-radius: 10px; 
          border: 1px solid rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          width: fit-content;
        }
        .orders-page .filter-chip {
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 500;
          color: #6B7280;
          cursor: pointer;
          transition: all 0.2s;
          border: 1px solid transparent;
        }
        .orders-page .filter-chip:hover { color: #111827; background: #F9FAFB; }
        .orders-page .filter-chip.active {
          background: #EFF6FF;
          color: #3B82F6;
          border-color: #DBEAFE;
        }

        /* Table Styles */
        .orders-page .table-container {
          background: #FFFFFF;
          border: 1px solid #E5E7EB;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
          overflow: hidden;
        }
        .orders-page .data-table { width: 100%; border-collapse: collapse; }
        .orders-page .data-table thead tr { background: #F9FAFB; border-bottom: 1px solid #E5E7EB; }
        .orders-page .data-table th {
          text-align: left;
          padding: 0.75rem 1rem;
          font-size: 0.75rem;
          font-weight: 600;
          color: #4B5563;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .orders-page .data-table td {
          padding: 1rem;
          font-size: 0.875rem;
          color: #111827;
          border-bottom: 1px solid #F3F4F6;
        }
        .orders-page .data-table tbody tr:hover td { background: #F9FAFB; }
        .orders-page .table-cell-main { font-weight: 600; color: #111827; }

        /* Status Badges */
        .orders-page .badge {
          display: inline-flex;
          align-items: center;
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: capitalize;
        }
        .orders-page .badge--warning { background: #feeefb; color: #db2777; border: 1px solid #f9a8d4; } /* Magenta */
        .orders-page .badge--primary { background: #EEF2FF; color: #4338CA; border: 1px solid #C7D2FE; } /* Indigo */
        .orders-page .badge--success { background: #ECFDF5; color: #047857; border: 1px solid #A7F3D0; } /* Green */
        .orders-page .badge--danger { background: #FEF2F2; color: #B91C1C; border: 1px solid #FECACA; } /* Red */
        .orders-page .badge--neutral { background: #F3F4F6; color: #374151; border: 1px solid #E5E7EB; }

        .orders-page .btn-track {
          background: #3B82F6;
          color: #FFFFFF;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.8rem;
          border: none;
          cursor: pointer;
          transition: background 0.2s;
          box-shadow: 0 1px 2px rgba(0,0,0,0.05);
        }
        .orders-page .btn-track:hover { background: #2563EB; }
      `}</style>

      <div className="page-header">
        <div>
          <h1>Order Management</h1>
          <p>Track and manage your dealer network supply chain</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <LiveClock />
        </div>
      </div>

      <div className="stats-grid">
        <div className="metric-card info">
          <span className="metric-label">Total Active Orders</span>
          <span className="metric-value">{orders.length}</span>
        </div>
        <div className="metric-card primary">
          <span className="metric-label">In Transit / Confirmed</span>
          <span className="metric-value">{orders.filter(o => o.status === 'confirmed' || o.status === 'shipped').length}</span>
        </div>
        <div className="metric-card success">
          <span className="metric-label">Delivered Totals</span>
          <span className="metric-value">{orders.filter(o => o.status === 'delivered').length}</span>
        </div>
        <div className="metric-card warning">
          <span className="metric-label">Pending Approval</span>
          <span className="metric-value">{orders.filter(o => o.status === 'pending').length}</span>
        </div>
      </div>

      <div className="filter-bar">
        {filterOptions.map(opt => (
          <div
            key={opt.id}
            className={`filter-chip ${filterStatus === opt.id ? 'active' : ''}`}
            onClick={() => setFilterStatus(opt.id)}
          >
            {opt.label}
          </div>
        ))}
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer / Dealer</th>
              <th>Bike Model</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" style={{ textAlign: 'center', padding: '3rem' }}>Loading Orders...</td></tr>
            ) : filteredOrders.length === 0 ? (
              <tr><td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: '#6B7280' }}>No orders found.</td></tr>
            ) : (
              filteredOrders.map(order => (
                <tr key={order.id}>
                  <td className="table-cell-main">#{order.id.slice(-6).toUpperCase()}</td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{order.customerName || 'Standard User'}</div>
                    <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>{order.businessName || 'Regular Dealer'}</div>
                  </td>
                  <td>{order.bikeName}</td>
                  <td style={{ color: '#6B7280' }}>{order.date}</td>
                  <td style={{ fontWeight: 600 }}>₹{order.totalAmount?.toLocaleString()}</td>
                  <td>
                    <span className={`badge ${getBadgeClass(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          className="btn-track"
                          onClick={() => navigate(`/live-location?bookingId=${order.id}`)}
                        >
                          Track
                        </button>
                        {(order.status !== 'delivered' && order.status !== 'cancelled') && (
                          <button
                            onClick={() => handleCancel(order.id)}
                            style={{
                              background: 'transparent',
                              color: '#ef4444',
                              padding: '0.5rem 0.75rem',
                              borderRadius: '8px',
                              fontWeight: 700,
                              fontSize: '0.8rem',
                              border: '1px solid rgba(239, 68, 68, 0.2)',
                              cursor: 'pointer',
                              transition: 'all 0.2s'
                            }}
                            onMouseOver={(e) => e.target.style.background = 'rgba(239, 68, 68, 0.05)'}
                            onMouseOut={(e) => e.target.style.background = 'transparent'}
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingsManagement;