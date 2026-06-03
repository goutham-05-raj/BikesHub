import React, { useState, useEffect } from 'react';
import StatCard from '../components/StatCard';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

const Customers = () => {
    const [filterType, setFilterType] = useState('all');
    const [dealers, setDealers] = useState([]);
    const [loading, setLoading] = useState(true);

    const mockDealers = [
        { id: 'DLR-001', name: 'Premium Motors', city: 'Mumbai', type: 'dealer', orders: 45, volume: '₹1.2Cr', status: 'verified' },
        { id: 'DLR-002', name: 'Elite Wheels', city: 'Pune', type: 'distributor', orders: 128, volume: '₹8.4Cr', status: 'verified' },
        { id: 'DLR-003', name: 'Speed Hub', city: 'Bangalore', type: 'dealer', orders: 12, volume: '₹0.3Cr', status: 'pending' },
        { id: 'DLR-004', name: 'Vanguard Bikes', city: 'Delhi', type: 'dealer', orders: 89, volume: '₹4.5Cr', status: 'verified' },
        { id: 'DLR-005', name: 'Apex Distributors', city: 'Hyderabad', type: 'distributor', orders: 210, volume: '₹15Cr', status: 'verified' },
    ];

    useEffect(() => {
        const fetchDealers = async () => {
            try {
                const snapshot = await getDocs(collection(db, 'customers'));
                if (snapshot.empty) setDealers(mockDealers);
                else setDealers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            } catch (error) {
                console.error("Error fetching dealers:", error);
                setDealers(mockDealers);
            } finally {
                setLoading(false);
            }
        };
        fetchDealers();
    }, []);

    const types = ['all', 'dealer', 'distributor'];
    const filteredDealers = filterType === 'all' ? dealers : dealers.filter(d => d.type === filterType);

    return (
        <div className="customers-page">
            <div className="page-header">
                <div className="page-header-row">
                    <div>
                        <h1 className="cin-page-title">Dealer <em>Network</em></h1>
                        <p className="cin-page-subtitle">Real-time management of your global distribution partnerships</p>
                    </div>
                    <button className="cin-btn-primary">➕ Invite Partner</button>
                </div>
            </div>

            <div className="market-stats-row" style={{ marginBottom: '32px' }}>
                <StatCard 
                    label="Total Partners"
                    value={dealers.length}
                    icon="👥"
                    glowColor="rgba(255,77,109,0.1)"
                />
                <StatCard 
                    label="Verified Fleet"
                    value={dealers.filter(d => d.status === 'verified').length}
                    icon="✔️"
                    glowColor="rgba(0,200,83,0.1)"
                />
                
                <StatCard 
                    variant="visual"
                    label="Pending Approval"
                    value={dealers.filter(d => d.status === 'pending').length}
                    icon="⏳"
                    trend="down"
                    trendValue="3"
                    bgImage="/assets/3d/pending_user.jpeg"
                />

                <StatCard 
                    variant="visual"
                    label="Network Volume"
                    value="₹45.2Cr"
                    icon="💰"
                    trend="up"
                    trendValue="24%"
                    bgImage="/assets/3d/network_user.webp"
                />
            </div>

            <div className="cin-filter-bar" style={{ marginBottom: '24px' }}>
                {types.map(t => (
                    <button
                        key={t}
                        className={`cin-filter-chip ${filterType === t ? 'active' : ''}`}
                        onClick={() => setFilterType(t)}
                        style={{ textTransform: 'capitalize' }}
                    >
                        {t}s
                    </button>
                ))}
            </div>

            <div className="premium-table-card">
                <table className="cin-data-table">
                    <thead>
                        <tr>
                            <th>Dealer Name</th>
                            <th>City</th>
                            <th>Type</th>
                            <th>Trade</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="5" className="loading-cell"><div className="cin-spinner"></div></td></tr>
                        ) : filteredDealers.map(dealer => (
                            <tr key={dealer.id}>
                                <td className="cin-td-name">{dealer.name}</td>
                                <td className="cin-td-city">{dealer.city}</td>
                                <td>
                                    <span className="cin-badge-pill" style={{ 
                                        color: dealer.type === 'distributor' ? '#0091EA' : '#868E96',
                                        background: dealer.type === 'distributor' ? 'rgba(0,145,234,0.1)' : 'rgba(0,0,0,0.05)'
                                    }}>
                                        {dealer.type}
                                    </span>
                                </td>
                                <td>
                                    <span className="cin-badge-pill" style={{ color: '#FF4D6D', background: 'rgba(255,77,109,0.1)', fontWeight: 800 }}>
                                        {dealer.volume}
                                    </span>
                                </td>
                                <td>
                                    <span className="cin-badge-status" style={{ 
                                        color: dealer.status === 'verified' ? '#00C853' : '#FFAB00',
                                    }}>
                                        <span className="status-dot" style={{ background: dealer.status === 'verified' ? '#00C853' : '#FFAB00' }}></span>
                                        {dealer.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <style>{`
                .customers-page { animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
                @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

                /* Header (matches Bikes.js) */
                .page-header { margin-bottom: 32px; }
                .page-header-row { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 20px; }
                .cin-page-title {
                    font-family: 'Playfair Display', serif;
                    font-size: 3.2rem; font-weight: 900; color: #16162A;
                    margin: 0; line-height: 1.1; letter-spacing: -0.02em;
                }
                .cin-page-title em { font-style: italic; background: linear-gradient(135deg, #FF4D6D, #FF8C42); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
                .cin-page-subtitle { font-size: 1.05rem; color: #868E96; margin: 8px 0 0; font-weight: 500; }
                
                .cin-btn-primary {
                    background: linear-gradient(135deg, #16162A, #2A2A40); color: #fff;
                    border: none; padding: 14px 28px; border-radius: 100px; font-family: 'Outfit', sans-serif;
                    font-weight: 700; font-size: 0.95rem; cursor: pointer;
                    box-shadow: 0 10px 20px rgba(0,0,0,0.1); transition: all 0.3s;
                }
                .cin-btn-primary:hover { transform: translateY(-3px); box-shadow: 0 15px 30px rgba(0,0,0,0.15); }

                /* Market Stats (matches Bikes.js) */
                .market-stats-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; }

                /* Filter Chips */
                .cin-filter-bar { display: flex; gap: 12px; overflow-x: auto; padding-bottom: 12px; -webkit-overflow-scrolling: touch; }
                .cin-filter-bar::-webkit-scrollbar { height: 0; }
                .cin-filter-chip {
                    background: #ffffff; border: 1px solid rgba(0,0,0,0.06); color: #495057;
                    padding: 10px 20px; border-radius: 100px; font-weight: 600; font-size: 0.9rem;
                    cursor: pointer; transition: all 0.2s; white-space: nowrap; box-shadow: 0 4px 10px rgba(0,0,0,0.02);
                }
                .cin-filter-chip:hover { background: #F8F9FA; border-color: rgba(0,0,0,0.15); }
                .cin-filter-chip.active { background: #16162A; color: #fff; border-color: #16162A; box-shadow: 0 8px 20px rgba(22,22,42,0.2); }

                /* Premium Table */
                .premium-table-card {
                    background: rgba(255,255,255,0.95); backdrop-filter: blur(20px);
                    border: 1px solid rgba(0,0,0,0.05); border-radius: 24px;
                    padding: 24px; box-shadow: 0 10px 40px rgba(0,0,0,0.03);
                    overflow-x: auto;
                }
                .cin-data-table { width: 100%; border-collapse: collapse; text-align: left; }
                .cin-data-table th { padding: 16px; font-size: 0.75rem; font-weight: 800; color: #ADB5BD; text-transform: uppercase; letter-spacing: 0.1em; border-bottom: 1px solid rgba(0,0,0,0.05); }
                .cin-data-table td { padding: 20px 16px; border-bottom: 1px solid rgba(0,0,0,0.03); color: #495057; font-weight: 500; vertical-align: middle; }
                .cin-data-table tr:hover td { background: rgba(0,0,0,0.01); }
                .cin-td-name { font-size: 1.05rem; font-weight: 800; color: #16162A; }
                
                .cin-badge-pill { padding: 6px 14px; border-radius: 100px; font-size: 0.8rem; font-weight: 700; text-transform: capitalize; }
                .cin-badge-status { display: inline-flex; align-items: center; gap: 8px; font-size: 0.85rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; }
                .status-dot { width: 8px; height: 8px; border-radius: 50%; box-shadow: 0 0 10px currentColor; }

                .loading-cell { text-align: center; padding: 60px !important; }
                .cin-spinner { width: 32px; height: 32px; border-radius: 50%; border: 3px solid rgba(255,77,109,0.2); border-top-color: #FF4D6D; animation: spin 0.8s linear infinite; margin: 0 auto; }
            `}</style>
        </div>
    );
};

export default Customers;
