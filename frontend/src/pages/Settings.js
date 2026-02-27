import React, { useState } from 'react';

const Settings = () => {
    const [activeSection, setActiveSection] = useState('company');
    const [notifications, setNotifications] = useState({
        emailBookings: true,
        emailReturns: true,
        emailMarketing: false,
        pushNewBooking: true,
        pushStatusChange: true,
        pushMaintenanceAlert: true,
    });

    const [companyData, setCompanyData] = useState({
        name: 'RideFleet Pvt. Ltd.',
        email: 'admin@ridefleet.com',
        phone: '+91 9876543210',
        address: '123 Bike Street, City Center, Bangalore, Karnataka 560001',
        gst: 'GSTIN29XXXXXXXXXXXZ',
        website: 'www.ridefleet.com',
    });

    const toggleNotification = (key) => {
        setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleCompanyChange = (e) => {
        const { name, value } = e.target;
        setCompanyData(prev => ({ ...prev, [name]: value }));
    };

    const sections = [
        { key: 'company', icon: '🏢', label: 'Company Profile' },
        { key: 'notifications', icon: '🔔', label: 'Notifications' },
        { key: 'hours', icon: '🕒', label: 'Business Hours' },
        { key: 'pricing', icon: '💰', label: 'Pricing Rules' },
        { key: 'security', icon: '🔒', label: 'Security' },
    ];

    return (
        <div>
            <div className="settings-grid">
                {/* Settings Nav */}
                <div className="card" style={{ height: 'fit-content' }}>
                    <div className="card-body">
                        <nav className="settings-nav">
                            {sections.map(section => (
                                <button
                                    key={section.key}
                                    className={`settings-nav-item ${activeSection === section.key ? 'active' : ''}`}
                                    onClick={() => setActiveSection(section.key)}
                                >
                                    <span>{section.icon}</span>
                                    <span>{section.label}</span>
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* Settings Content */}
                <div>
                    {/* Company Profile */}
                    {activeSection === 'company' && (
                        <div className="card">
                            <div className="card-header">
                                <h3>Company Profile</h3>
                                <button className="btn btn-primary btn-sm">Save Changes</button>
                            </div>
                            <div className="card-body">
                                <div className="settings-section">
                                    <h3>Business Information</h3>
                                    <p>Update your company details and contact information</p>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label className="form-label">Company Name</label>
                                            <input className="form-control" name="name" value={companyData.name} onChange={handleCompanyChange} />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Website</label>
                                            <input className="form-control" name="website" value={companyData.website} onChange={handleCompanyChange} />
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label className="form-label">Email Address</label>
                                            <input className="form-control" name="email" value={companyData.email} onChange={handleCompanyChange} />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Phone Number</label>
                                            <input className="form-control" name="phone" value={companyData.phone} onChange={handleCompanyChange} />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Business Address</label>
                                        <textarea className="form-control" name="address" value={companyData.address} onChange={handleCompanyChange} rows={2} />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">GST Number</label>
                                        <input className="form-control" name="gst" value={companyData.gst} onChange={handleCompanyChange} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Notifications */}
                    {activeSection === 'notifications' && (
                        <div className="card">
                            <div className="card-header">
                                <h3>Notification Preferences</h3>
                                <button className="btn btn-primary btn-sm">Save Changes</button>
                            </div>
                            <div className="card-body">
                                <div className="settings-section">
                                    <h3>Email Notifications</h3>
                                    <p>Configure which notifications you receive via email</p>

                                    <div className="toggle-switch">
                                        <div>
                                            <div className="toggle-switch-label">New Booking Alerts</div>
                                            <div className="toggle-switch-desc">Get notified when a new booking is made</div>
                                        </div>
                                        <button className={`toggle ${notifications.emailBookings ? 'active' : ''}`} onClick={() => toggleNotification('emailBookings')} />
                                    </div>

                                    <div className="toggle-switch">
                                        <div>
                                            <div className="toggle-switch-label">Return Reminders</div>
                                            <div className="toggle-switch-desc">Alerts when bikes are due for return</div>
                                        </div>
                                        <button className={`toggle ${notifications.emailReturns ? 'active' : ''}`} onClick={() => toggleNotification('emailReturns')} />
                                    </div>

                                    <div className="toggle-switch">
                                        <div>
                                            <div className="toggle-switch-label">Marketing Emails</div>
                                            <div className="toggle-switch-desc">Promotional content and feature updates</div>
                                        </div>
                                        <button className={`toggle ${notifications.emailMarketing ? 'active' : ''}`} onClick={() => toggleNotification('emailMarketing')} />
                                    </div>
                                </div>

                                <div className="settings-section" style={{ marginTop: '1.5rem' }}>
                                    <h3>Push Notifications</h3>
                                    <p>In-app notification preferences</p>

                                    <div className="toggle-switch">
                                        <div>
                                            <div className="toggle-switch-label">New Booking</div>
                                            <div className="toggle-switch-desc">Push notification for each new booking</div>
                                        </div>
                                        <button className={`toggle ${notifications.pushNewBooking ? 'active' : ''}`} onClick={() => toggleNotification('pushNewBooking')} />
                                    </div>

                                    <div className="toggle-switch">
                                        <div>
                                            <div className="toggle-switch-label">Status Changes</div>
                                            <div className="toggle-switch-desc">When booking status is updated</div>
                                        </div>
                                        <button className={`toggle ${notifications.pushStatusChange ? 'active' : ''}`} onClick={() => toggleNotification('pushStatusChange')} />
                                    </div>

                                    <div className="toggle-switch">
                                        <div>
                                            <div className="toggle-switch-label">Maintenance Alerts</div>
                                            <div className="toggle-switch-desc">Reminders for scheduled bike maintenance</div>
                                        </div>
                                        <button className={`toggle ${notifications.pushMaintenanceAlert ? 'active' : ''}`} onClick={() => toggleNotification('pushMaintenanceAlert')} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Business Hours */}
                    {activeSection === 'hours' && (
                        <div className="card">
                            <div className="card-header">
                                <h3>Business Hours</h3>
                                <button className="btn btn-primary btn-sm">Save Changes</button>
                            </div>
                            <div className="card-body">
                                <div className="settings-section">
                                    <h3>Operating Schedule</h3>
                                    <p>Set your business operating hours for each day of the week</p>

                                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, i) => (
                                        <div key={day} style={{
                                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                            padding: '0.75rem 0',
                                            borderBottom: i < 6 ? '1px solid var(--border-light)' : 'none',
                                        }}>
                                            <span style={{ fontWeight: 600, fontSize: '0.85rem', width: '120px' }}>{day}</span>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <input type="time" className="form-control" defaultValue={i < 5 ? '08:00' : '09:00'} style={{ width: '130px', padding: '0.4rem 0.6rem' }} />
                                                <span style={{ color: 'var(--text-muted)' }}>to</span>
                                                <input type="time" className="form-control" defaultValue={i < 5 ? '20:00' : i === 5 ? '18:00' : '16:00'} style={{ width: '130px', padding: '0.4rem 0.6rem' }} />
                                            </div>
                                            <button className={`toggle ${i < 7 ? 'active' : ''}`}></button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Pricing Rules */}
                    {activeSection === 'pricing' && (
                        <div className="card">
                            <div className="card-header">
                                <h3>Pricing Rules</h3>
                                <button className="btn btn-primary btn-sm">Save Changes</button>
                            </div>
                            <div className="card-body">
                                <div className="settings-section">
                                    <h3>Rate Configuration</h3>
                                    <p>Configure pricing, fees, and discount rules</p>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label className="form-label">Insurance Rate (%)</label>
                                            <input className="form-control" type="number" defaultValue={10} />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Tax Rate (%)</label>
                                            <input className="form-control" type="number" defaultValue={8} />
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label className="form-label">Security Deposit (₹)</label>
                                            <input className="form-control" type="number" defaultValue={2000} />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Late Return Penalty (₹/hr)</label>
                                            <input className="form-control" type="number" defaultValue={100} />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Weekly Discount (%)</label>
                                        <input className="form-control" type="number" defaultValue={15} />
                                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Applied automatically for bookings of 7+ days</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Security */}
                    {activeSection === 'security' && (
                        <div className="card">
                            <div className="card-header">
                                <h3>Security Settings</h3>
                            </div>
                            <div className="card-body">
                                <div className="settings-section">
                                    <h3>Password</h3>
                                    <p>Update your admin password</p>

                                    <div className="form-group">
                                        <label className="form-label">Current Password</label>
                                        <input className="form-control" type="password" placeholder="Enter current password" />
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label className="form-label">New Password</label>
                                            <input className="form-control" type="password" placeholder="Enter new password" />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Confirm New Password</label>
                                            <input className="form-control" type="password" placeholder="Confirm new password" />
                                        </div>
                                    </div>
                                    <button className="btn btn-primary">Update Password</button>
                                </div>

                                <div className="settings-section" style={{ marginTop: '2rem' }}>
                                    <h3>Two-Factor Authentication</h3>
                                    <p>Add an extra layer of security to your account</p>
                                    <div className="toggle-switch" style={{ borderBottom: 'none' }}>
                                        <div>
                                            <div className="toggle-switch-label">Enable 2FA</div>
                                            <div className="toggle-switch-desc">Require a verification code when signing in</div>
                                        </div>
                                        <button className="toggle"></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Settings;
