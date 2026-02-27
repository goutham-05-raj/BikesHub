import React, { useState, useEffect } from 'react';
import StatCard from '../components/StatCard';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy, onSnapshot } from 'firebase/firestore';

const BookingsManagement = () => {
  const [filterStatus, setFilterStatus] = useState('all');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ordersCollection = collection(db, 'bookings');
    const ordersQuery = query(ordersCollection, orderBy('createdAt', 'desc'));

    // Use onSnapshot for real-time updates
    const unsubscribe = onSnapshot(ordersQuery, (snapshot) => {
      const ordersList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Convert timestamp to string for display if needed
        date: doc.data().createdAt?.toDate().toLocaleDateString() || new Date().toLocaleDateString()
      }));
      setOrders(ordersList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const statuses = ['all', 'pending', 'confirmed', 'shipped', 'delivered'];

  const getStatusBadge = (status) => {
    const map = {
      pending: 'warning', confirmed: 'info', shipped: 'primary', delivered: 'success', cancelled: 'danger'
    };
    return map[status] || 'neutral';
  };

  const filteredOrders = filterStatus === 'all'
    ? orders
    : orders.filter(o => o.status === filterStatus);

  return (
    <div>
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1>📋 Order Management</h1>
            <p>Track and manage all bulk orders across your dealer network</p>
          </div>
          <button className="btn btn-primary">➕ Create Order</button>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard icon="📦" label="Total Orders" value="156" trend="up" trendValue="12%" color="blue" />
        <StatCard icon="⏳" label="Pending Approval" value="8" trend="down" trendValue="2" color="orange" />
        <StatCard icon="🚚" label="In Transit" value="12" trend="up" trendValue="5" color="purple" />
        <StatCard icon="✅" label="Delivered" value="136" trend="up" trendValue="18%" color="green" />
      </div>

      {/* Filters */}
      <div className="filter-bar">
        {statuses.map(s => (
          <button
            key={s}
            className={`filter-chip ${filterStatus === s ? 'active' : ''}`}
            onClick={() => setFilterStatus(s)}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="card">
        <div className="data-table-container">
          {loading ? (
            <div className="loading"><div className="spinner"></div></div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Dealer</th>
                  <th>Bike Model</th>
                  <th>Quantity</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map(order => (
                  <tr key={order.id}>
                    <td className="table-cell-main">{order.booking_id || order.id.substring(0, 8)}</td>
                    <td>{order.businessName || order.dealer}</td>
                    <td>{order.bikeName || order.bike}</td>
                    <td className="table-cell-main">{order.quantity || order.qty} units</td>
                    <td className="table-cell-main">₹{new Intl.NumberFormat('en-IN').format(order.totalAmount || 0)}</td>
                    <td>
                      <span className={`badge badge--${getStatusBadge(order.status)}`}>
                        <span className="badge-dot"></span>
                        {order.status}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{order.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingsManagement;