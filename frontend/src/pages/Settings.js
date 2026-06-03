import React, { useState } from 'react';
import API_BASE_URL from '../config/api';

const Settings = () => {
    const [activeSection, setActiveSection] = useState('company');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [notifications, setNotifications] = useState({
        emailBookings: true,
        emailReturns: true,
        emailMarketing: false,
        pushNewBooking: true,
        pushStatusChange: true,
        pushMaintenanceAlert: true,
    });

    const [companyData, setCompanyData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        gst: '',
        website: '',
    });

    const toggleNotification = (key) => {
        setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleCompanyChange = (e) => {
        const { name, value } = e.target;
        setCompanyData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmitDeal = async () => {
        if (!companyData.name || !companyData.email || !companyData.address) {
            alert('Please fill in the Fleet Name, Email, and Location to proceed.');
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/deals`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(companyData),
            });

            if (response.ok) {
                setShowSuccess(true);
                setCompanyData({ name: '', email: '', phone: '', address: '', gst: '', website: '' });
                setTimeout(() => setShowSuccess(false), 5000);
            } else {
                throw new Error('Failed to submit deal');
            }
        } catch (error) {
            console.error('Submission error:', error);
            alert('Submission failed. Please check if the server is running.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const sections = [
        { key: 'company', icon: '🤝', label: 'Make a Deal' },
        { key: 'notifications', icon: '🔔', label: 'Global Alerts' },
        { key: 'hours', icon: '🕒', label: 'Business Hours' },
        { key: 'pricing', icon: '💰', label: 'Trade Rules' },
        { key: 'security', icon: '🔒', label: 'Security' },
    ];

    return (
        <div className="settings-premium-indigo">
            <style>{`
                .settings-premium-indigo {
                    position: relative;
                    min-height: 100%;
                    color: #fff;
                    font-family: 'Outfit', sans-serif;
                    animation: fadeIn 0.8s ease-out;
                }

                /* Success Overlay */
                .deal-success-overlay {
                    position: fixed;
                    inset: 0;
                    background: rgba(15, 23, 42, 0.9);
                    backdrop-filter: blur(20px);
                    z-index: 10000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    animation: fadeIn 0.5s ease;
                }

                .deal-success-card {
                    background: linear-gradient(135deg, #1e293b, #0f172a);
                    border: 1px solid rgba(99, 102, 241, 0.3);
                    border-radius: 40px;
                    padding: 4rem;
                    text-align: center;
                    box-shadow: 0 0 50px rgba(99, 102, 241, 0.2);
                    animation: popUp 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    max-width: 500px;
                }

                .success-check-premium {
                    font-size: 5rem;
                    margin-bottom: 2rem;
                    display: block;
                    animation: bounceIn 0.8s ease;
                }

                /* Background Decor */
                .settings-bg-bike {
                    position: fixed;
                    bottom: -100px;
                    right: -100px;
                    width: 500px;
                    opacity: 0.05;
                    pointer-events: none;
                    filter: grayscale(1) blur(1px);
                    z-index: 0;
                }

                .settings-grid {
                    display: grid;
                    grid-template-columns: 280px 1fr;
                    gap: 2.5rem;
                    position: relative;
                    z-index: 1;
                }

                /* Sidebar Nav */
                .settings-sidebar-card {
                    background: rgba(15, 23, 42, 0.4);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 30px;
                    padding: 1.5rem;
                    height: fit-content;
                }

                .settings-nav-item {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding: 1rem 1.25rem;
                    border-radius: 18px;
                    color: #94a3b8;
                    font-weight: 700;
                    margin-bottom: 0.75rem;
                    transition: all 0.3s ease;
                    cursor: pointer;
                    background: transparent;
                    border: none;
                    width: 100%;
                    text-align: left;
                }

                .settings-nav-item:hover {
                    color: #fff;
                    background: rgba(255, 255, 255, 0.05);
                }

                .settings-nav-item.active {
                    background: linear-gradient(135deg, #6366F1, #8B5CF6);
                    color: #fff;
                    box-shadow: 0 10px 20px rgba(99, 102, 241, 0.2);
                }

                /* Main Content Cards */
                .settings-content-card {
                    background: rgba(30, 41, 59, 0.4);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 35px;
                    overflow: hidden;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
                }

                .settings-card-header {
                    padding: 2.5rem;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .settings-card-header h2 {
                    font-size: 2rem;
                    font-weight: 900;
                    margin: 0;
                    background: linear-gradient(135deg, #fff 0%, #a5b4fc 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                .settings-body {
                    padding: 2.5rem;
                }

                .save-btn-premium {
                    background: #6366F1;
                    color: #fff;
                    border: none;
                    padding: 0.8rem 2rem;
                    border-radius: 15px;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .save-btn-premium:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(99, 102, 241, 0.5);
                    filter: brightness(1.1);
                }

                .save-btn-premium:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                /* Form Styles */
                .form-label-premium {
                    color: #6366F1;
                    font-weight: 800;
                    font-size: 0.75rem;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    margin-bottom: 0.75rem;
                    display: block;
                }

                .input-premium {
                    background: rgba(15, 23, 42, 0.3) !important;
                    border: 1px solid rgba(255, 255, 255, 0.1) !important;
                    color: #fff !important;
                    border-radius: 16px !important;
                    padding: 1rem !important;
                    width: 100%;
                    font-weight: 500;
                    transition: all 0.3s ease;
                }

                .input-premium:focus {
                    border-color: #6366F1 !important;
                    background: rgba(15, 23, 42, 0.5) !important;
                    outline: none;
                    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
                }

                /* 24H Clock Display */
                .clock-display-24h {
                    background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1));
                    border: 1px solid rgba(99, 102, 241, 0.2);
                    border-radius: 30px;
                    padding: 3rem;
                    text-align: center;
                    position: relative;
                    overflow: hidden;
                }

                .clock-glow {
                    position: absolute;
                    inset: 0;
                    background: radial-gradient(circle at center, rgba(99, 102, 241, 0.1) 0%, transparent 70%);
                }

                .time-status-pill {
                    background: #87ceeb;
                    color: #fff;
                    padding: 0.5rem 1.5rem;
                    border-radius: 50px;
                    font-weight: 900;
                    text-transform: uppercase;
                    font-size: 0.9rem;
                    display: inline-block;
                    margin-bottom: 1.5rem;
                    box-shadow: 0 0 20px rgba(34, 197, 94, 0.3);
                    border: 2px solid rgba(255, 255, 255, 0.2);
                }

                .deal-info-box {
                    background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1));
                    border: 1px dashed rgba(99, 102, 241, 0.4);
                    border-radius: 20px;
                    padding: 1.5rem;
                    margin-bottom: 2rem;
                    display: flex;
                    gap: 1.5rem;
                    align-items: center;
                }

                .deal-info-icon {
                    font-size: 2.5rem;
                    filter: drop-shadow(0 0 10px rgba(99, 102, 241, 0.5));
                }

                .deal-info-text h4 {
                    margin: 0 0 0.5rem 0;
                    color: #fff;
                    font-size: 1.1rem;
                    font-weight: 800;
                }

                .deal-info-text p {
                    margin: 0;
                    color: #94a3b8;
                    font-size: 0.9rem;
                    line-height: 1.5;
                }

                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes popUp { from { opacity: 0; transform: scale(0.8); } to { opacity: 1; transform: scale(1); } }
                @keyframes bounceIn { 
                    0% { transform: scale(0.3); opacity: 0; }
                    50% { transform: scale(1.05); opacity: 1; }
                    70% { transform: scale(0.9); }
                    100% { transform: scale(1); }
                }
            `}</style>

            {showSuccess && (
                <div className="deal-success-overlay">
                    <div className="deal-success-card">
                        <span className="success-check-premium">🌟</span>
                        <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '1rem' }}>Partnership Initiated!</h2>
                        <p style={{ color: '#94a3b8', fontSize: '1.1rem', lineHeight: 1.6 }}>
                            Your fleet proposal has been securely transmitted to the BikesZone strategic trade desk.
                            Our team will analyze the location potential and reach out shortly.
                        </p>
                        <button
                            className="save-btn-premium"
                            style={{ margin: '2rem auto 0' }}
                            onClick={() => setShowSuccess(false)}
                        >
                            Complete
                        </button>
                    </div>
                </div>
            )}

            <img src="/assets/3d/3d_motorbike_1772291087296.png" className="settings-bg-bike" alt="" />

            <div className="settings-grid">
                {/* Navigation Sidebar */}
                <div className="settings-sidebar-card">
                    <div style={{ marginBottom: '2rem', padding: '0 1rem' }}>
                        <div style={{ fontSize: '0.8rem', color: '#6366F1', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Preference Engine</div>
                    </div>
                    <nav>
                        {sections.map(section => (
                            <button
                                key={section.key}
                                className={`settings-nav-item ${activeSection === section.key ? 'active' : ''}`}
                                onClick={() => setActiveSection(section.key)}
                            >
                                <span style={{ fontSize: '1.2rem' }}>{section.icon}</span>
                                <span>{section.label}</span>
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Main View Area */}
                <div className="settings-content-card">
                    {/* Make a Deal Section */}
                    {activeSection === 'company' && (
                        <>
                            <div className="settings-card-header">
                                <h2>Make a Deal</h2>
                                <button
                                    className="save-btn-premium"
                                    onClick={handleSubmitDeal}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Transmitting...' : 'Submit Deal'} 🤝
                                </button>
                            </div>
                            <div className="settings-body">
                                <div className="deal-info-box">
                                    <div className="deal-info-icon">🛵</div>
                                    <div className="deal-info-text">
                                        <h4>Explore Your Location</h4>
                                        <p>
                                            Ready to scale the network? Provide your vehicles to explore in specific locations.
                                            Enter your fleet details below to initiate a strategic partnership deal with BikesZone.
                                        </p>
                                    </div>
                                </div>

                                <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                    <div className="form-group">
                                        <label className="form-label-premium">Fleet/Entity Name</label>
                                        <input className="input-premium" name="name" placeholder="Enter your business or fleet name" value={companyData.name} onChange={handleCompanyChange} />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label-premium">Portfolio Link</label>
                                        <input className="input-premium" name="website" placeholder="www.yourportfolio.com" value={companyData.website} onChange={handleCompanyChange} />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label-premium">Deal Contact Email</label>
                                        <input className="input-premium" name="email" placeholder="deal@yourfleet.com" value={companyData.email} onChange={handleCompanyChange} />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label-premium">Direct Line</label>
                                        <input className="input-premium" name="phone" placeholder="+91 XXXXX XXXXX" value={companyData.phone} onChange={handleCompanyChange} />
                                    </div>
                                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                        <label className="form-label-premium">Exploration Location / Address</label>
                                        <textarea className="input-premium" name="address" placeholder="Specify the location where you want to provide your vehicles" value={companyData.address} onChange={handleCompanyChange} rows={3} />
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Business Hours Section - 24/7 Enablement */}
                    {activeSection === 'hours' && (
                        <>
                            <div className="settings-card-header">
                                <h2>Business Operations</h2>
                                <div className="time-status-pill">Active Live</div>
                            </div>
                            <div className="settings-body">
                                <div className="clock-display-24h">
                                    <div className="clock-glow"></div>
                                    <div style={{ position: 'relative', zIndex: 1 }}>
                                        <div style={{ fontSize: '1.5rem', fontWeight: 500, color: '#94a3b8', marginBottom: '0.5rem' }}>Trading Status</div>
                                        <div style={{ fontSize: '5rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1, marginBottom: '1rem' }}>
                                            24 <span style={{ color: '#6366F1' }}>HRS</span>
                                        </div>
                                        <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#6366F1', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
                                            Always Open for Business
                                        </div>
                                        <p style={{ marginTop: '2rem', color: '#94a3b8', fontSize: '1.05rem', lineHeight: 1.6 }}>
                                            Your marketplace is strictly configured for <strong>non-stop operations</strong>. <br />
                                            All incoming bookings will be processed instantly regardless of the local time zone.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Notifications Section */}
                    {activeSection === 'notifications' && (
                        <>
                            <div className="settings-card-header">
                                <h2>Global Alerts</h2>
                                <button className="save-btn-premium">Update Rules</button>
                            </div>
                            <div className="settings-body">
                                <p style={{ color: '#94a3b8', marginBottom: '2.5rem', fontSize: '1.1rem' }}>Configure how the platform communicates critical trade events.</p>

                                <div style={{ display: 'grid', gap: '1rem' }}>
                                    {[
                                        { label: 'Booking Confirmation', desc: 'Instant pings for all dealer fleet orders', key: 'emailBookings' },
                                        { label: 'Asset Return Sync', desc: 'Sync alerts when bikes re-enter the inventory', key: 'emailReturns' },
                                        { label: 'Smart Maintenance', desc: 'Automated health alerts for the entire fleet', key: 'pushMaintenanceAlert' },
                                    ].map(item => (
                                        <div key={item.key} style={{
                                            background: 'rgba(255,255,255,0.03)',
                                            padding: '1.5rem',
                                            borderRadius: '24px',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            border: '1px solid rgba(255,255,255,0.05)'
                                        }}>
                                            <div>
                                                <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>{item.label}</div>
                                                <div style={{ color: '#64748b' }}>{item.desc}</div>
                                            </div>
                                            <div
                                                onClick={() => toggleNotification(item.key)}
                                                style={{
                                                    width: '60px',
                                                    height: '32px',
                                                    background: notifications[item.key] ? '#6366F1' : '#1e293b',
                                                    borderRadius: '50px',
                                                    position: 'relative',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.4s ease'
                                                }}
                                            >
                                                <div style={{
                                                    width: '24px',
                                                    height: '24px',
                                                    background: '#fff',
                                                    borderRadius: '50%',
                                                    position: 'absolute',
                                                    top: '4px',
                                                    left: notifications[item.key] ? '32px' : '4px',
                                                    transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                                                }}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    {/* Placeholder for other sections */}
                    {(activeSection === 'pricing' || activeSection === 'security') && (
                        <div className="settings-body" style={{ textAlign: 'center', padding: '10rem 0' }}>
                            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🛡️</div>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 900 }}>Module Under Strategic Lock</h3>
                            <p style={{ color: '#94a3b8' }}>This section is currently being optimized for enterprise security protocols.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Settings;
