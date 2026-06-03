import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import API_BASE_URL from '../config/api';

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    inquiryType: 'Partnership Inquiry',
    businessName: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({
          inquiryType: 'Partnership Inquiry',
          businessName: '',
          email: '',
          phone: '',
          message: ''
        });
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to send message. Please ensure the backend is running.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="celebration-overlay">
        <style>{`
            .celebration-overlay {
              position: fixed;
              inset: 0;
              background: rgba(135, 206, 235, 0.95); /* Match sky-pink theme */
              backdrop-filter: blur(8px);
              z-index: 9999;
              display: flex;
              align-items: center;
              justify-content: center;
              animation: fadeInOverlay 0.6s forwards;
              overflow: hidden;
            }
            .celebration-card {
              background: #fff;
              padding: 3.5rem 2.5rem;
              border-radius: 40px;
              text-align: center;
              max-width: 550px;
              width: 90%;
              border: 1px solid rgba(135, 206, 235, 0.3);
              box-shadow: 0 25px 50px -12px rgba(135, 206, 235, 0.5);
              position: relative;
              animation: cardPop 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
            }
            .success-badge-contact {
              width: 110px;
              height: 110px;
              background: linear-gradient(135deg, #BF00FF, #87CEEB);
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              margin: 0 auto 2rem;
              box-shadow: 0 15px 35px rgba(191, 0, 255, 0.3);
              animation: badgeScale 0.6s ease-out 0.4s backwards;
            }
            .congrats-title-contact {
              font-size: 2.4rem;
              font-weight: 900;
              margin-bottom: 1rem;
              color: #1B2D3A;
              animation: titleFade 0.8s ease-out 0.6s backwards;
            }
            .highlight-banner-contact {
              background: rgba(135, 206, 235, 0.15);
              color: #0077BE;
              padding: 0.8rem 1.5rem;
              border-radius: 18px;
              font-size: 1.25rem;
              font-weight: 800;
              display: inline-block;
              margin-bottom: 2.5rem;
              border: 1px solid rgba(135, 206, 235, 0.3);
              animation: bannerSlide 0.8s ease-out 0.8s backwards;
            }
            .success-details-contact {
              color: #1B2D3A;
              opacity: 0.8;
              font-size: 1.05rem;
              line-height: 1.6;
              margin-bottom: 2.5rem;
              animation: fadeIn 0.8s ease-out 1s backwards;
            }
            .confetti {
              position: absolute;
              width: 8px;
              height: 8px;
              top: -20px;
              animation: fall 3s linear infinite;
            }
            @keyframes fall {
              to { transform: translateY(100vh) rotate(360deg); }
            }
            @keyframes fadeInOverlay { from { opacity: 0; } to { opacity: 1; } }
            @keyframes cardPop { from { transform: scale(0.5) translateY(50px); opacity: 0; } to { transform: scale(1) translateY(0); opacity: 1; } }
            @keyframes badgeScale { from { transform: scale(0); } 70% { transform: scale(1.2); } to { transform: scale(1); } }
            @keyframes titleFade { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
            @keyframes bannerSlide { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          `}</style>

        {/* Sky-Pink Theme Confetti */}
        {[...Array(25)].map((_, i) => (
          <div key={i} className="confetti" style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            backgroundColor: ['#BF00FF', '#87CEEB', '#FADADD', '#0077BE'][Math.floor(Math.random() * 4)],
            borderRadius: Math.random() > 0.5 ? '50%' : '0'
          }}></div>
        ))}

        <div className="celebration-card">
          <div className="success-badge-contact">
            <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <h2 className="congrats-title-contact">Message Sent!</h2>
          <div className="highlight-banner-contact">
            We've Received Your Inquiry
          </div>
          <p className="success-details-contact">
            Thank you for reaching out! Your message will be taken care of by our elite support team <strong>within 24 hours</strong>. <br />
            We'll make sure to get back to you with the best solutions.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="btn electric-purple-btn btn-lg"
            style={{ width: 'auto', padding: '1rem 3rem', borderRadius: '15px' }}
          >
            Got it!
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="messages-page-wrapper">
      <style>{`
          .messages-page-wrapper {
            min-height: 100%;
            color: #1B2D3A; 
          }
          
          .sky-pink-card {
            background: linear-gradient(135deg, #87CEEB 0%, #FADADD 100%) !important;
            border: 1px solid rgba(135, 206, 235, 0.4) !important;
            border-radius: 30px !important;
            color: #1B2D3A !important;
            overflow: hidden;
            box-shadow: 0 20px 40px rgba(135, 206, 235, 0.15);
          }

          .sky-header {
            background: rgba(135, 206, 235, 0.2);
            padding: 1.5rem;
            border-bottom: 1px solid rgba(135, 206, 235, 0.2);
          }

          .sky-header h3 {
            margin: 0;
            color: #0077BE; 
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            font-size: 1.1rem;
          }

          .electric-purple-btn {
            background: #BF00FF !important;
            color: #fff !important;
            border: none !important;
            font-weight: 800 !important;
            text-transform: uppercase !important;
            letter-spacing: 0.1em !important;
            transition: all 0.3s ease !important;
            box-shadow: 0 4px 15px rgba(191, 0, 255, 0.3) !important;
          }

          .electric-purple-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(191, 0, 255, 0.5) !important;
            filter: brightness(1.1);
          }

          .form-label-sky {
            color: #0077BE;
            font-weight: 700;
            font-size: 0.8rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: 0.5rem;
            display: block;
          }

          .input-sky {
            background: rgba(255, 255, 255, 0.65) !important;
            border: 1px solid rgba(135, 206, 235, 0.3) !important;
            color: #1B2D3A !important;
            border-radius: 12px !important;
            padding: 0.8rem !important;
          }

          .input-sky:focus {
            border-color: #BF00FF !important;
            box-shadow: 0 0 0 3px rgba(191, 0, 255, 0.1) !important;
            background: #fff !important;
          }

          .info-pill-sky {
            background: rgba(255, 255, 255, 0.45);
            padding: 1.25rem;
            border-radius: 20px;
            border: 1px solid rgba(135, 206, 235, 0.2);
          }

          .quick-link-sky {
            background: rgba(255, 255, 255, 0.35) !important;
            border: 1px solid rgba(135, 206, 235, 0.15) !important;
            transition: all 0.3s ease !important;
          }

          .quick-link-sky:hover {
            background: #fff !important;
            border-color: #BF00FF !important;
            transform: translateX(5px);
            box-shadow: 0 5px 15px rgba(135, 206, 235, 0.1) !important;
          }
        `}</style>

      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1 style={{ color: '#fff', textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>🌊 Community FeedBack</h1>
            <p style={{ color: 'rgba(255,255,255,0.9)' }}>Share your thoughts and partnership inquiries with us</p>
          </div>
        </div>
      </div>

      <div className="contact-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 0.8fr)', gap: '2rem' }}>
        {/* Contact Form */}
        <div className="card sky-pink-card">
          <div className="sky-header">
            <h3>📩 Submit FeedBack</h3>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label-sky">Inquiry Type</label>
                <select
                  className="form-select input-sky"
                  name="inquiryType"
                  value={formData.inquiryType}
                  onChange={handleChange}
                >
                  <option>Partnership Inquiry</option>
                  <option>Dealer Support</option>
                  <option>Manufacturer Onboarding</option>
                  <option>Technical Support</option>
                  <option>Billing & Payments</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label-sky">Business Name</label>
                <input
                  className="form-input input-sky"
                  type="text"
                  name="businessName"
                  placeholder="Enter your business name"
                  value={formData.businessName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label-sky">Contact Email</label>
                <input
                  className="form-input input-sky"
                  type="email"
                  name="email"
                  placeholder="Your business email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label-sky">Phone</label>
                <input
                  className="form-input input-sky"
                  type="tel"
                  name="phone"
                  placeholder="+91 XXXXX XXXXX"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label className="form-label-sky">Message</label>
                <textarea
                  className="form-textarea input-sky"
                  name="message"
                  placeholder="Describe your inquiry in detail..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                ></textarea>
              </div>
              <button
                type="submit"
                className="btn electric-purple-btn btn-lg"
                disabled={isSubmitting}
                style={{ width: '100%', marginTop: '1rem', padding: '1.25rem' }}
              >
                {isSubmitting ? '✨ Transmitting...' : '🚀 Send Message'}
              </button>
            </form>
          </div>
        </div>

        {/* Contact Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="card sky-pink-card">
            <div className="sky-header"><h3>📞 Contact Information</h3></div>
            <div className="card-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div className="info-pill-sky">
                  <div style={{ fontSize: '0.75rem', color: '#0077BE', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 900, marginBottom: '0.25rem' }}>Email</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1B2D3A' }}>partnerships@bikeszone.in</div>
                </div>
                <div className="info-pill-sky">
                  <div style={{ fontSize: '0.75rem', color: '#0077BE', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 900, marginBottom: '0.25rem' }}>Phone</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1B2D3A' }}>+91 1800-BIKES-00</div>
                </div>
                <div className="info-pill-sky">
                  <div style={{ fontSize: '0.75rem', color: '#0077BE', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 900, marginBottom: '0.25rem' }}>Headquarters</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1B2D3A' }}>Kurnool, Andhra Pradesh</div>
                </div>
              </div>
            </div>
          </div>

          <div className="card sky-pink-card">
            <div className="sky-header"><h3>💎 Quick Support</h3></div>
            <div className="card-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[
                  { icon: '🤝', label: 'Become a Dealer', desc: 'Join our network of 180+ verified dealers' },
                  { icon: '🏭', label: 'List as Manufacturer', desc: 'Connect directly with bulk buyers' },
                  { icon: '📋', label: 'API Documentation', desc: 'Integrate with BikesZone platform' },
                ].map((item, i) => (
                  <div key={i} className="quick-link-sky" style={{ display: 'flex', gap: '1rem', padding: '1rem', borderRadius: '18px', cursor: 'pointer' }}>
                    <span style={{ fontSize: '1.5rem' }}>{item.icon}</span>
                    <div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1B2D3A' }}>{item.label}</div>
                      <div style={{ fontSize: '0.8rem', color: '#0077BE', opacity: 0.8 }}>{item.desc}</div>
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
