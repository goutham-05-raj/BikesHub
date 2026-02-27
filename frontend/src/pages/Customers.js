import React, { useState, useEffect } from 'react';
import StatCard from '../components/StatCard';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

const Customers = () => {
    const [filterType, setFilterType] = useState('all');
    const [dealers, setDealers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDealers = async () => {
            try {
                const snapshot = await getDocs(collection(db, 'customers'));
                const dealersList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setDealers(dealersList);
            } catch (error) {
                console.error("Error fetching dealers:", error);
                // Fallback to empty or initial set
            } finally {
                setLoading(false);
            }
        };
        fetchDealers();
    }, []);

    const types = ['all', 'dealer', 'distributor'];
    const filteredDealers = filterType === 'all' ? dealers : dealers.filter(d => d.type === filterType);

    return (
        <div>
            <div className="page-header">
                <div className="page-header-row">
                    <div>
                        <h1>🤝 Dealer Network</h1>
                        <p>Manage your verified dealer and distributor partnerships</p>
                    </div>
                    <button className="btn btn-primary">➕ Invite Dealer</button>
                </div>
            </div>

            <div className="stats-grid">
                <StatCard icon="🤝" label="Total Partners" value="185" trend="up" trendValue="12" color="blue" />
                <StatCard icon="✅" label="Verified" value="168" trend="up" trendValue="8" color="green" />
                <StatCard icon="⏳" label="Pending Approval" value="17" trend="down" trendValue="3" color="orange" />
                <StatCard icon="💰" label="Network Volume" value="₹45Cr" trend="up" trendValue="24%" color="purple" />
            </div>

            <div className="filter-bar">
                {types.map(t => (
                    <button
                        key={t}
                        className={`filter-chip ${filterType === t ? 'active' : ''}`}
                        onClick={() => setFilterType(t)}
                    >
                        {t.charAt(0).toUpperCase() + t.slice(1)}{t !== 'all' ? `s (${dealers.filter(d => d.type === t).length})` : ''}
                    </button>
                ))}
            </div>

            <div className="card">
                <div className="data-table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Dealer Name</th>
                                <th>City</th>
                                <th>Type</th>
                                <th>Orders</th>
                                <th>Trade Volume</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDealers.map(dealer => (
                                <tr key={dealer.id}>
                                    <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{dealer.id}</td>
                                    <td className="table-cell-main">{dealer.name}</td>
                                    <td>{dealer.city}</td>
                                    <td>
                                        <span className={`badge badge--${dealer.type === 'distributor' ? 'primary' : 'neutral'}`}>
                                            {dealer.type}
                                        </span>
                                    </td>
                                    <td className="table-cell-main">{dealer.orders}</td>
                                    <td className="table-cell-main">{dealer.volume}</td>
                                    <td>
                                        <span className={`badge badge--${dealer.status === 'verified' ? 'success' : 'warning'}`}>
                                            <span className="badge-dot"></span>
                                            {dealer.status}
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

export default Customers;
