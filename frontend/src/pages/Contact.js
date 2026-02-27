import React from 'react';

const Contact = () => {
  return (
    <div>
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1>💬 Business Support</h1>
            <p>Get in touch with our B2B partnership and support team</p>
          </div>
        </div>
      </div>

      <div className="contact-grid">
        {/* Contact Form */}
        <div className="card">
          <div className="card-header">
            <h3>📧 Send us a Message</h3>
          </div>
          <div className="card-body">
            <form onSubmit={(e) => { e.preventDefault(); alert('Message sent! Our team will respond within 24 hours.'); }}>
              <div className="form-group">
                <label className="form-label">Inquiry Type</label>
                <select className="form-select">
                  <option>Partnership Inquiry</option>
                  <option>Dealer Support</option>
                  <option>Manufacturer Onboarding</option>
                  <option>Technical Support</option>
                  <option>Billing & Payments</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Business Name</label>
                <input className="form-input" type="text" placeholder="Your company name" required />
              </div>
              <div className="form-group">
                <label className="form-label">Contact Email</label>
                <input className="form-input" type="email" placeholder="business@example.com" required />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input className="form-input" type="tel" placeholder="+91 XXXXX XXXXX" />
              </div>
              <div className="form-group">
                <label className="form-label">Message</label>
                <textarea className="form-textarea" placeholder="Describe your inquiry in detail..." required></textarea>
              </div>
              <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
                📨 Send Message
              </button>
            </form>
          </div>
        </div>

        {/* Contact Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="card">
            <div className="card-header"><h3>📞 Contact Information</h3></div>
            <div className="card-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.25rem' }}>Email</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--accent-light)' }}>partnerships@bikeszone.in</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.25rem' }}>Phone</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>+91 1800-BIKES-00</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.25rem' }}>Headquarters</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>Mumbai, Maharashtra, India</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.25rem' }}>Business Hours</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>Mon–Sat, 9:00 AM – 7:00 PM IST</div>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header"><h3>🚀 Quick Links</h3></div>
            <div className="card-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {[
                  { icon: '🤝', label: 'Become a Dealer', desc: 'Join our network of 180+ verified dealers' },
                  { icon: '🏭', label: 'List as Manufacturer', desc: 'Connect directly with bulk buyers' },
                  { icon: '📋', label: 'API Documentation', desc: 'Integrate with BikesZone platform' },
                  { icon: '❓', label: 'FAQ', desc: 'Common questions answered' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: '0.75rem', padding: '0.75rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-surface)', cursor: 'pointer', transition: 'all 0.2s ease' }}>
                    <span style={{ fontSize: '1.25rem' }}>{item.icon}</span>
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>{item.label}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;