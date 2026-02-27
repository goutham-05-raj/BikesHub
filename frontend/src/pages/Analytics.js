import React, { useState, useEffect } from 'react';
import StatCard from '../components/StatCard';
import { db } from '../firebase';
import { collection, getDocs, query } from 'firebase/firestore';

const Analytics = () => {
    const [bikes, setBikes] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const bikesSnap = await getDocs(collection(db, 'bikes'));
                const ordersSnap = await getDocs(collection(db, 'bookings'));

                setBikes(bikesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
                setOrders(ordersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            } catch (error) {
                console.error("Error fetching analytics data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Dynamic Stats
    const totalVolume = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const totalUnits = orders.reduce((sum, o) => sum + (o.quantity || 0), 0);
    const activeDealersCount = [...new Set(orders.map(o => o.businessName))].length;

    const volumeData = [120, 185, 210, 280, 320, 350, 310, 380, 290, 260, 340, 420]; // Keep for chart dummy or map if data exists
    const maxVolume = Math.max(...volumeData);

    const categoryData = [
        { name: 'Sports', percentage: 38, color: 'var(--accent)' },
        { name: 'Cruiser', percentage: 32, color: '#10b981' },
        { name: 'Adventure', percentage: 18, color: '#f59e0b' },
        { name: 'Commuter', percentage: 12, color: '#8b5cf6' },
    ];

    const topModels = bikes.slice(0, 5).map(b => ({
        name: b.name,
        orders: Math.floor(Math.random() * 500) + 100, // Dummy orders for now
        revenue: '₹' + (Math.random() * 10).toFixed(1) + 'Cr'
    }));

    const dealerGrowth = [
        { month: 'Sep', dealers: 120 },
        { month: 'Oct', dealers: 135 },
        { month: 'Nov', dealers: 148 },
        { month: 'Dec', dealers: 160 },
        { month: 'Jan', dealers: 172 },
        { month: 'Feb', dealers: 185 },
    ];

    return (
        <div>
            <div className="page-header">
                <div className="page-header-row">
                    <div>
                        <h1>📊 Market Analytics</h1>
                        <p>Real-time market intelligence and trading insights for BikesZone</p>
                    </div>
                    <button className="btn btn-outline">📥 Export Report</button>
                </div>
            </div>

            <div className="stats-grid">
                <StatCard icon="💰" label="Total Trade Volume" value={`₹${(totalVolume / 10000000).toFixed(2)}Cr`} trend="up" trendValue="24.5%" color="blue" />
                <StatCard icon="📦" label="Total Orders" value={orders.length.toLocaleString()} trend="up" trendValue="18.3%" color="green" />
                <StatCard icon="🤝" label="Active Dealers" value={activeDealersCount} trend="up" trendValue="12" color="orange" />
                <StatCard icon="🏍️" label="Models Listed" value={bikes.length} trend="up" trendValue="8" color="purple" />
            </div>

            <div className="dashboard-grid dashboard-grid--2">
                {/* Trade Volume Chart */}
                <div className="card">
                    <div className="card-header">
                        <h3>📈 Monthly Trade Volume</h3>
                        <span className="badge badge--primary">2025–2026</span>
                    </div>
                    <div className="card-body">
                        <div className="chart-bars">
                            {months.map((month, i) => (
                                <div className="chart-bar-wrapper" key={month}>
                                    <div className="chart-bar-value">{volumeData[i]}</div>
                                    <div
                                        className="chart-bar"
                                        style={{ height: `${(volumeData[i] / maxVolume) * 100}%` }}
                                    ></div>
                                    <div className="chart-bar-label">{month}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Category Distribution */}
                <div className="card">
                    <div className="card-header">
                        <h3>📊 Category Distribution</h3>
                    </div>
                    <div className="card-body">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            {categoryData.map((cat, i) => (
                                <div key={i}>
                                    <div className="utilization-label">
                                        <span className="utilization-label-text">{cat.name}</span>
                                        <span className="utilization-label-value">{cat.percentage}%</span>
                                    </div>
                                    <div className="progress-bar">
                                        <div
                                            className="progress-bar-fill"
                                            style={{ width: `${cat.percentage}%`, background: cat.color }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div style={{ marginTop: '2rem' }}>
                            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>Dealer Network Growth</h4>
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end', height: '80px' }}>
                                {dealerGrowth.map((d, i) => (
                                    <div key={i} style={{ flex: 1, textAlign: 'center' }}>
                                        <div style={{ background: 'var(--accent-gradient)', borderRadius: '4px 4px 0 0', height: `${(d.dealers / 200) * 100}%`, minHeight: '10px', transition: 'all 0.5s ease', opacity: 0.8 }}></div>
                                        <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', marginTop: '4px' }}>{d.month}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Top Models */}
            <div className="card" style={{ marginTop: '1.25rem' }}>
                <div className="card-header">
                    <h3>🏆 Top Performing Models</h3>
                    <span className="badge badge--neutral">Last 6 months</span>
                </div>
                <div className="data-table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Rank</th>
                                <th>Model</th>
                                <th>Total Orders</th>
                                <th>Revenue</th>
                                <th>Trend</th>
                            </tr>
                        </thead>
                        <tbody>
                            {topModels.map((model, i) => (
                                <tr key={i}>
                                    <td className="table-cell-main">#{i + 1}</td>
                                    <td className="table-cell-main">{model.name}</td>
                                    <td>{model.orders} orders</td>
                                    <td className="table-cell-main">{model.revenue}</td>
                                    <td>
                                        <span className="badge badge--success">
                                            <span className="badge-dot"></span>
                                            Rising
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
