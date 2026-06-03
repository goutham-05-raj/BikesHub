import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const MessagesDashboard = () => {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [feedback, setFeedback] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('messages');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [msgRes, revRes] = await Promise.all([
                    fetch('http://localhost:5002/api/messages'),
                    fetch('http://localhost:5002/api/reviews/all')
                ]);

                const msgData = await msgRes.json();
                const revData = await revRes.json();
                const feedData = await feedRes.json();

                if (msgData.success) setMessages(msgData.data);
                if (revData.success) setReviews(revData.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div style={{ padding: '2rem', color: '#fff' }}>Loading intelligence...</div>;

    return (
        <div className="messages-dashboard-premium">
            <style>{`
                .messages-dashboard-premium {
                    color: #fff;
                    animation: fadeIn 0.8s ease-out;
                }
                .dashboard-tabs {
                    display: flex;
                    gap: 1.5rem;
                    margin-bottom: 2.5rem;
                    border-bottom: 1px solid rgba(255,255,255,0.05);
                    padding-bottom: 1rem;
                }
                .tab-btn {
                    background: transparent;
                    border: none;
                    color: #94a3b8;
                    font-size: 1.1rem;
                    font-weight: 800;
                    cursor: pointer;
                    padding: 0.5rem 1rem;
                    transition: all 0.3s ease;
                    position: relative;
                }
                .tab-btn.active {
                    color: #6366F1;
                }
                .tab-btn.active::after {
                    content: '';
                    position: absolute;
                    bottom: -1rem;
                    left: 0;
                    right: 0;
                    height: 3px;
                    background: #6366F1;
                    border-radius: 10px;
                }
                .data-card {
                    background: rgba(30, 41, 59, 0.4);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 25px;
                    padding: 2rem;
                    margin-bottom: 1.5rem;
                    transition: all 0.3s ease;
                }
                .data-card:hover {
                    background: rgba(30, 41, 59, 0.6);
                    border-color: rgba(99, 102, 241, 0.3);
                    transform: translateY(-5px);
                }
                .badge-unread {
                    background: #ef4444;
                    color: #fff;
                    padding: 0.25rem 0.75rem;
                    border-radius: 100px;
                    font-size: 0.7rem;
                    font-weight: 900;
                    text-transform: uppercase;
                }
                .badge-date {
                    color: #64748b;
                    font-size: 0.85rem;
                }
                .review-rating {
                    color: #eab308;
                    font-size: 1.1rem;
                }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>

            <div className="dashboard-tabs">
                <button
                    className={`tab-btn ${activeTab === 'messages' ? 'active' : ''}`}
                    onClick={() => setActiveTab('messages')}
                >
                    Business Messages ({messages.length})
                </button>
                <button
                    className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
                    onClick={() => setActiveTab('reviews')}
                >
                    Fleet Reviews ({reviews.length})
                </button>
            </div>

            <div className="tab-content">
                {activeTab === 'messages' && (
                    <div className="messages-list">
                        {messages.length === 0 ? (
                            <p style={{ color: '#94a3b8' }}>No strategic messages found.</p>
                        ) : (
                            messages.map(msg => (
                                <div key={msg.id} className="data-card">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'center' }}>
                                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                            <span style={{ fontSize: '1.2rem', fontWeight: 900 }}>{msg.businessName}</span>
                                            <span style={{ background: 'rgba(99, 102, 241, 0.1)', color: '#6366F1', padding: '0.2rem 0.8rem', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 800 }}>{msg.inquiryType}</span>
                                            {msg.status === 'unread' && <span className="badge-unread">New</span>}
                                        </div>
                                        <span className="badge-date">{new Date(msg.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <p style={{ color: '#cbd5e1', lineHeight: 1.6, marginBottom: '1.5rem' }}>"{msg.message}"</p>
                                    <div style={{ display: 'flex', gap: '2rem', color: '#94a3b8', fontSize: '0.9rem' }}>
                                        <span>📧 {msg.email}</span>
                                        {msg.phone && <span>📞 {msg.phone}</span>}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {activeTab === 'reviews' && (
                    <div className="reviews-list">
                        {reviews.length === 0 ? (
                            <p style={{ color: '#94a3b8' }}>No vehicle reviews available.</p>
                        ) : (
                            reviews.map(rev => (
                                <div key={rev.id} className="data-card">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                            <span style={{ fontSize: '1.2rem', fontWeight: 900 }}>{rev.user_name}</span>
                                            <div className="review-rating">{'⭐'.repeat(rev.rating)}</div>
                                        </div>
                                        <span className="badge-date">{rev.created_at?.seconds ? new Date(rev.created_at.seconds * 1000).toLocaleDateString() : 'Recent'}</span>
                                    </div>
                                    <div style={{ background: 'rgba(0,0,0,0.1)', padding: '0.5rem 1rem', borderRadius: '10px', display: 'inline-block', marginBottom: '1rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                                        <span style={{ color: '#6366F1', fontWeight: 800 }}>Asset ID:</span> <span style={{ color: '#94a3b8' }}>{rev.bike_id}</span>
                                    </div>
                                    <p style={{ color: '#cbd5e1', lineHeight: 1.6 }}>"{rev.comment}"</p>
                                </div>
                            ))
                        )}
                    </div>
                )}


            </div>
        </div>
    );
};

export default MessagesDashboard;
