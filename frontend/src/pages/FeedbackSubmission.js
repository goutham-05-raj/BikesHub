import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config/api';

const FeedbackSubmission = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        category: 'Experience',
        rating: 5,
        comment: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch(`${API_BASE_URL}/api/feedback`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user?.uid || 'unknown',
                    userEmail: user?.email || 'unknown@guest.com',
                    ...formData
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setSubmitted(true);
                setFormData({ category: 'Experience', rating: 5, comment: '' });
            } else {
                throw new Error(data.message || 'Failed to submit feedback');
            }
        } catch (error) {
            console.error('Error submitting feedback:', error);
            alert(`Submission Error: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!user) {
        return <div style={{ padding: '2rem', textAlign: 'center' }}>Please wait, validating session...</div>;
    }

    if (submitted) {
        return (
            <div className="feedback-redirect-overlay">
                <style>{`
                    .feedback-redirect-overlay {
                        position: fixed; inset: 0; background: #0F172A; z-index: 9999;
                        display: flex; flex-direction: column; align-items: center; justify-content: center;
                        color: #fff; font-family: 'Outfit', sans-serif;
                    }
                    .secure-ring-feedback {
                        width: 100px; height: 100px; border: 4px solid rgba(255, 77, 109, 0.1);
                        border-top: 4px solid #FF4D6D; border-radius: 50%; animation: spin 0.8s linear infinite;
                        margin-bottom: 2rem; position: relative;
                        display: flex; align-items: center; justify-content: center;
                    }
                    @keyframes spin { to { transform: rotate(360deg); } }
                    .redirect-text { font-size: 1.8rem; font-weight: 900; margin-bottom: 0.5rem; text-align: center; }
                    .redirect-subtext { color: #94A3B8; font-size: 1.1rem; }
                    .nav-buttons { display: flex; gap: 1rem; margin-top: 3rem; }
                    .nav-btn {
                        padding: 1rem 2rem; border-radius: 12px; font-weight: 700; cursor: pointer; transition: 0.3s;
                        text-decoration: none; display: inline-block;
                    }
                    .btn-history { background: #FF4D6D; color: #fff; border: none; }
                    .btn-more { background: rgba(255,255,255,0.1); color: #fff; border: 1px solid rgba(255,255,255,0.2); }
                    .nav-btn:hover { transform: translateY(-3px); box-shadow: 0 10px 20px rgba(0,0,0,0.2); }
                `}</style>
                <div className="secure-ring-feedback">
                    <span style={{ fontSize: '2.5rem' }}>✨</span>
                </div>
                <div className="redirect-text">Feedback Transmitted!</div>
                <div className="redirect-subtext">Optimizing your experience based on your input...</div>
                
                <div className="nav-buttons">
                    <button className="nav-btn btn-history" onClick={() => navigate('/feedback-history')}>View My Feedback</button>
                    <button className="nav-btn btn-more" onClick={() => setSubmitted(false)}>Submit More</button>
                </div>
            </div>
        );
    }

    return (
        <div className="feedback-page-wrapper">
            <style>{`
                .feedback-card {
                    background: rgba(255, 255, 255, 0.9);
                    backdrop-filter: blur(20px);
                    border-radius: 30px;
                    border: 1px solid rgba(0,0,0,0.05);
                    padding: 2.5rem;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.05);
                }
                .rating-stars {
                    display: flex;
                    gap: 0.5rem;
                    margin: 1rem 0;
                }
                .star {
                    font-size: 2rem;
                    cursor: pointer;
                    color: #ddd;
                    transition: color 0.2s;
                }
                .star.active { color: #FFD600; }
                .submit-btn {
                    background: #FF4D6D;
                    color: white;
                    border: none;
                    padding: 1.2rem;
                    border-radius: 15px;
                    font-weight: 800;
                    width: 100%;
                    cursor: pointer;
                    transition: all 0.3s;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                }
                .submit-btn:hover { transform: translateY(-3px); box-shadow: 0 10px 20px rgba(255,77,109,0.3); }
                .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
            `}</style>

            <div className="feedback-card">
                <h2 style={{ color: '#16162A', marginBottom: '0.5rem' }}>Share Your Experience</h2>
                <p style={{ color: '#6c757d', marginBottom: '2rem' }}>We value your thoughts on how we can improve.</p>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', fontWeight: 700, marginBottom: '0.5rem', color: '#495057' }}>Category</label>
                        <select 
                            className="form-select" 
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            style={{ borderRadius: '12px', padding: '0.8rem' }}
                        >
                            <option>Experience</option>
                            <option>App Performance</option>
                            <option>Inventory Quality</option>
                            <option>Customer Support</option>
                            <option>Other</option>
                        </select>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', fontWeight: 700, marginBottom: '0.5rem', color: '#495057' }}>Rating</label>
                        <div className="rating-stars">
                            {[1, 2, 3, 4, 5].map(star => (
                                <span 
                                    key={star} 
                                    className={`star ${formData.rating >= star ? 'active' : ''}`}
                                    onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                                >
                                    ★
                                </span>
                            ))}
                        </div>
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        <label style={{ display: 'block', fontWeight: 700, marginBottom: '0.5rem', color: '#495057' }}>Your Feedback</label>
                        <textarea 
                            className="form-control"
                            name="comment"
                            value={formData.comment}
                            onChange={handleChange}
                            placeholder="Tell us what you think..."
                            required
                            rows={4}
                            style={{ borderRadius: '12px', padding: '1rem' }}
                        ></textarea>
                    </div>

                    <button type="submit" className="submit-btn" disabled={isSubmitting}>
                        {isSubmitting ? 'Transmitting...' : '🚀 Send Feedback'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default FeedbackSubmission;
