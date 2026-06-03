import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

const ManageDealers = () => {
    const [dealers, setDealers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const { user } = useAuth();

    const mockDealers = [
        { id: 'DLR-001', name: 'Premium Motors', city: 'Mumbai', type: 'dealer', orders: 45, volume: '₹1.2Cr', status: 'verified', joinDate: '2023-10-12' },
        { id: 'DLR-002', name: 'Elite Wheels', city: 'Pune', type: 'distributor', orders: 128, volume: '₹8.4Cr', status: 'verified', joinDate: '2023-08-05' },
        { id: 'DLR-003', name: 'Speed Hub', city: 'Bangalore', type: 'dealer', orders: 12, volume: '₹0.3Cr', status: 'pending', joinDate: '2024-01-20' },
        { id: 'DLR-004', name: 'Vanguard Bikes', city: 'Delhi', type: 'dealer', orders: 89, volume: '₹4.5Cr', status: 'verified', joinDate: '2023-11-30' },
        { id: 'DLR-005', name: 'Apex Distributors', city: 'Hyderabad', type: 'distributor', orders: 210, volume: '₹15Cr', status: 'verified', joinDate: '2023-05-15' },
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

    const toggleStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === 'verified' ? 'pending' : 'verified';
        try {
            const dealerRef = doc(db, 'customers', id);
            await updateDoc(dealerRef, { status: newStatus });
            setDealers(dealers.map(d => d.id === id ? { ...d, status: newStatus } : d));
        } catch (e) {
            // If firestore fails (mock mode), just update local state
            setDealers(dealers.map(d => d.id === id ? { ...d, status: newStatus } : d));
        }
    };

    const filteredDealers = dealers.filter(d => 
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        d.city.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="manage-dealers-page">
            <div className="page-header">
                <div className="header-content">
                    <h1 className="cin-title">Manage <em>Dealers</em></h1>
                    <p className="cin-subtitle">Admin Command Center — Fleet Partner Management</p>
                </div>
                <div className="header-actions">
                    <div className="search-box">
                        <span className="search-icon">🔍</span>
                        <input 
                            type="text" 
                            placeholder="Search partners..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button className="add-btn">Add New Partner</button>
                </div>
            </div>

            <div className="stats-strip">
                <div className="mini-stat">
                    <span className="ms-label">Active Partners</span>
                    <span className="ms-val">{dealers.length}</span>
                </div>
                <div className="mini-stat">
                    <span className="ms-label">Pending Approval</span>
                    <span className="ms-val" style={{ color: '#FFAB00' }}>{dealers.filter(d => d.status === 'pending').length}</span>
                </div>
                <div className="mini-stat">
                    <span className="ms-label">Network Tier</span>
                    <span className="ms-val" style={{ color: '#0EA5E9' }}>Enterprise</span>
                </div>
            </div>

            <div className="dealers-grid">
                {loading ? (
                    <div className="loading-state">
                        <div className="cin-spinner"></div>
                        <p>Accessing Partner Records...</p>
                    </div>
                ) : filteredDealers.map(dealer => (
                    <div key={dealer.id} className="dealer-card">
                        <div className="card-top">
                            <div className="dealer-avatar">{dealer.name.charAt(0)}</div>
                            <div className="dealer-meta">
                                <h3>{dealer.name}</h3>
                                <span>{dealer.city}</span>
                            </div>
                            <div className={`status-badge ${dealer.status}`}>
                                {dealer.status}
                            </div>
                        </div>
                        
                        <div className="card-metrics">
                            <div className="metric">
                                <span className="m-label">Type</span>
                                <span className="m-val">{dealer.type}</span>
                            </div>
                            <div className="metric">
                                <span className="m-label">Volume</span>
                                <span className="m-val">{dealer.volume}</span>
                            </div>
                        </div>

                        <div className="card-actions">
                            <button className="action-btn edit">Edit Profile</button>
                            <button 
                                className={`action-btn status ${dealer.status === 'verified' ? 'revoke' : 'verify'}`}
                                onClick={() => toggleStatus(dealer.id, dealer.status)}
                            >
                                {dealer.status === 'verified' ? 'Revoke Access' : 'Verify Partner'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <style>{`
                .manage-dealers-page { animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } }

                .page-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 40px; gap: 20px; flex-wrap: wrap; }
                .cin-title { font-family: 'Playfair Display', serif; font-size: 3.5rem; font-weight: 900; color: #16162A; margin: 0; line-height: 1; }
                .cin-title em { font-style: italic; background: linear-gradient(135deg, #FF4D6D, #FF8C42); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
                .cin-subtitle { font-size: 1.1rem; color: #868E96; font-weight: 600; margin-top: 10px; opacity: 0.8; }

                .header-actions { display: flex; gap: 16px; align-items: center; }
                .search-box { 
                    position: relative; background: rgba(255,255,255,0.1); border: 1px solid rgba(0,0,0,0.05); 
                    border-radius: 100px; padding: 10px 20px; display: flex; align-items: center; gap: 10px; width: 300px;
                    backdrop-filter: blur(10px);
                }
                .search-box input { background: none; border: none; outline: none; color: #16162A; font-weight: 600; width: 100%; }
                .add-btn { background: #16162A; color: #fff; border: none; padding: 12px 24px; border-radius: 100px; font-weight: 700; cursor: pointer; transition: 0.3s; }
                .add-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(0,0,0,0.1); }

                .stats-strip { display: flex; gap: 40px; margin-bottom: 40px; padding-left: 5px; }
                .mini-stat { display: flex; flex-direction: column; gap: 4px; }
                .ms-label { font-size: 0.75rem; font-weight: 800; color: #ADB5BD; text-transform: uppercase; letter-spacing: 0.1em; }
                .ms-val { font-family: 'Playfair Display', serif; font-size: 1.8rem; font-weight: 900; color: #16162A; }

                .dealers-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 24px; }
                .dealer-card {
                    background: rgba(14, 165, 233, 0.08); backdrop-filter: blur(35px);
                    border: 1px solid rgba(14, 165, 233, 0.2); border-radius: 28px;
                    padding: 28px; transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .dealer-card:hover { transform: translateY(-8px); border-color: rgba(14, 165, 233, 0.4); box-shadow: 0 20px 40px rgba(14, 165, 233, 0.1); }

                .card-top { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; position: relative; }
                .dealer-avatar { 
                    width: 54px; height: 54px; border-radius: 16px; 
                    background: linear-gradient(135deg, #0EA5E9, #00C853); color: #fff;
                    display: flex; align-items: center; justify-content: center; font-size: 1.5rem; font-weight: 900;
                }
                .dealer-meta h3 { font-size: 1.25rem; font-weight: 800; color: #16162A; margin: 0; }
                .dealer-meta span { font-size: 0.85rem; color: #868E96; font-weight: 600; }

                .status-badge { 
                    position: absolute; top: 0; right: 0; padding: 4px 12px; border-radius: 100px; 
                    font-size: 0.7rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em;
                }
                .status-badge.verified { background: rgba(0,200,83,0.1); color: #00C853; }
                .status-badge.pending { background: rgba(255,171,0,0.1); color: #FFAB00; }

                .card-metrics { display: flex; border-top: 1px solid rgba(0,0,0,0.05); padding-top: 20px; margin-bottom: 24px; gap: 32px; }
                .metric { display: flex; flex-direction: column; gap: 4px; }
                .m-label { font-size: 0.7rem; font-weight: 800; color: #ADB5BD; text-transform: uppercase; }
                .m-val { font-size: 1.05rem; font-weight: 700; color: #16162A; }

                .card-actions { display: flex; gap: 12px; }
                .action-btn { 
                    flex: 1; padding: 12px; border-radius: 14px; border: none; 
                    font-weight: 800; font-size: 0.85rem; cursor: pointer; transition: 0.3s;
                }
                .action-btn.edit { background: rgba(0,0,0,0.04); color: #495057; }
                .action-btn.edit:hover { background: rgba(0,0,0,0.08); }
                .action-btn.status.verify { background: #0EA5E9; color: #fff; }
                .action-btn.status.revoke { background: rgba(255,77,109,0.1); color: #FF4D6D; }
                .action-btn.status:hover { filter: brightness(1.1); }

                .loading-state { grid-column: 1 / -1; padding: 100px 0; text-align: center; }
                .cin-spinner { width: 44px; height: 44px; border: 4px solid rgba(14, 165, 233, 0.1); border-top-color: #0EA5E9; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 20px; }
                @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
};

export default ManageDealers;
