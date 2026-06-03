import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API_BASE_URL from '../config/api';

const UserFeedbackDashboard = () => {
    const { user } = useAuth();
    const [feedback, setFeedback] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeedback = async () => {
            if (!user?.email) return;
            try {
                const response = await fetch(`${API_BASE_URL}/api/feedback/user/${user.email}`);
                const data = await response.json();
                if (data.success) {
                    setFeedback(data.data);
                }
            } catch (error) {
                console.error('Error fetching feedback:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFeedback();
    }, [user]);

    if (loading) return <div style={{ padding: '2rem', color: '#666' }}>Fetching your feedback history...</div>;

    return (
        <div className="user-feedback-dashboard">
            <style>{`
                .history-card {
                    background: #fff;
                    border-radius: 20px;
                    padding: 1.5rem;
                    margin-bottom: 1rem;
                    border: 1px solid rgba(0,0,0,0.05);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.02);
                }
                .status-badge {
                    padding: 0.2rem 0.6rem;
                    border-radius: 8px;
                    font-size: 0.7rem;
                    font-weight: 800;
                    text-transform: uppercase;
                }
                .status-pending { background: #FFF9C4; color: #FBC02D; }
                .status-reviewed { background: #E8F5E9; color: #2E7D32; }
            `}</style>

            <h2 style={{ color: '#16162A', marginBottom: '1.5rem' }}>Feedback History</h2>

            {feedback.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem', background: '#f8f9fa', borderRadius: '20px' }}>
                    <span style={{ fontSize: '3rem' }}>📋</span>
                    <p style={{ color: '#6c757d', marginTop: '1rem' }}>You haven't submitted any feedback yet.</p>
                </div>
            ) : (
                <div className="feedback-list">
                    {feedback.map(item => (
                        <div key={item.id} className="history-card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <span style={{ color: '#FF4D6D', fontWeight: 800 }}>{item.category}</span>
                                    <span className={`status-badge status-${item.status}`}>{item.status}</span>
                                </div>
                                <span style={{ color: '#ADB5BD', fontSize: '0.85rem' }}>{new Date(item.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div style={{ marginBottom: '0.5rem', color: '#FFD600' }}>{'★'.repeat(item.rating)}{'☆'.repeat(5-item.rating)}</div>
                            <p style={{ margin: 0, color: '#495057', fontStyle: 'italic' }}>"{item.comment}"</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserFeedbackDashboard;
