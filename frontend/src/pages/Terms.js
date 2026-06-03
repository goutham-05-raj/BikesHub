import React from 'react';

const Terms = () => {
  const sections = [
    {
      title: '1. Eligibility & Verification',
      id: 'eligibility',
      items: [
        'Renter must be at least 18 years old with valid proof.',
        'Valid driving license for the appropriate class is mandatory.',
        'Original ID proof (Aadhar/Passport) required at the time of pickup.',
        'International customers require a valid International Driving Permit (IDP).',
      ]
    },
    {
      title: '2. Commercial Booking & Payments',
      id: 'payments',
      items: [
        'Full B2B trade payment required for booking confirmation.',
        'Security deposit is applicable per vehicle (fully refundable).',
        'Bulk Cancellation 24h before: Full refund minus processing fee.',
        'Late cancellations within 24h: 50% refund applied to platform credit.',
      ]
    },
    {
      title: '3. Rental Lifecycle Management',
      id: 'lifecycle',
      items: [
        'Standard rental cycle: 24-hour periods starting from pickup.',
        'Late returns incur automated hourly excess charges.',
        'Extension requests must be authenticated via the dashboard.',
        'Vehicle health report must be signed off during pickup/return.',
      ]
    },
    {
      title: '4. Operational Guardrails',
      id: 'guardrails',
      items: [
        'Vehicles must remain within the agreed geofenced regions.',
        'Stunt riding and competitive racing are strictly prohibited.',
        'Zero-tolerance policy for operation under the influence.',
        'Certified helmets and safety gear must be worn at all times.',
      ]
    },
    {
      title: '5. Asset Insurance & Risk',
      id: 'insurance',
      items: [
        'Premium comprehensive insurance included for all fleet units.',
        'Renter is liable for internal damages due to negligent usage.',
        'Insurance excess deductible applies in case of physical collision.',
        'Theft protection active with dual-key authentication.',
      ]
    },
  ];

  return (
    <div className="legal-terms-premium">
      <style>{`
        .legal-terms-premium {
          position: relative;
          min-height: 100%;
          color: #fff;
          font-family: 'Outfit', 'Inter', sans-serif;
          overflow: hidden;
          animation: pageFadeIn 1s ease-out;
        }

        /* Cinematic Background Elements */
        .bike-bg-element {
          position: fixed;
          width: 600px;
          height: 600px;
          opacity: 0.08;
          z-index: 0;
          pointer-events: none;
          filter: grayscale(1) blur(2px);
          animation: float 20s infinite alternate ease-in-out;
        }

        .bg-top-right { top: -100px; right: -100px; transform: rotate(-15deg); }
        .bg-bottom-left { bottom: -150px; left: -150px; transform: rotate(15deg); opacity: 0.12; }

        .legal-content-wrapper {
          position: relative;
          z-index: 1;
          max-width: 900px;
          margin: 0 auto;
          padding: 2rem 1.5rem;
        }

        .premium-header {
          text-align: center;
          margin-bottom: 4rem;
        }

        .premium-header h1 {
          font-size: 3.5rem;
          font-weight: 900;
          background: linear-gradient(135deg, #fff 0%, #6366F1 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 1rem;
          letter-spacing: -0.04em;
        }

        .premium-header p {
          color: #94a3b8;
          font-size: 1.1rem;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        /* Glassmorphism Section Cards */
        .terms-section-card {
          background: rgba(30, 41, 59, 0.4);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 30px;
          padding: 2.5rem;
          margin-bottom: 2rem;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          opacity: 0;
          transform: translateY(30px);
        }

        .terms-section-card:hover {
          background: rgba(30, 41, 59, 0.6);
          border-color: rgba(99, 102, 241, 0.3);
          transform: scale(1.02) translateY(-5px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.2);
        }

        .terms-section-card.animate {
          animation: slideUp 0.8s forwards;
        }

        .section-idx {
          font-size: 3rem;
          font-weight: 900;
          color: rgba(99, 102, 241, 0.1);
          position: absolute;
          top: 10px;
          right: 20px;
          line-height: 1;
          user-select: none;
        }

        .terms-section-card h3 {
          font-size: 1.5rem;
          font-weight: 800;
          color: #fff;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .terms-section-card h3::before {
          content: '';
          display: block;
          width: 4px;
          height: 24px;
          background: #6366F1;
          border-radius: 10px;
        }

        .terms-list {
          list-style: none;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
        }

        .terms-list li {
          font-size: 1.05rem;
          color: #CBD5E1;
          line-height: 1.6;
          padding-left: 2rem;
          position: relative;
        }

        .terms-list li::after {
          content: '✔';
          position: absolute;
          left: 0;
          color: #6366F1;
          font-weight: 900;
          font-size: 0.9rem;
          opacity: 0.8;
        }

        /* Safety Highlight */
        .safety-alert-premium {
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%);
          border: 1px solid rgba(99, 102, 241, 0.3);
          border-radius: 25px;
          padding: 2.5rem;
          margin-top: 4rem;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .safety-alert-premium h4 {
          font-size: 1.3rem;
          font-weight: 800;
          color: #fff;
          margin-bottom: 1rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .safety-alert-premium p {
          color: #94a3b8;
          font-size: 1rem;
          line-height: 1.8;
          max-width: 700px;
          margin: 0 auto;
        }

        @keyframes slideUp { to { opacity: 1; transform: translateY(0); } }
        @keyframes pageFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes float { from { transform: translate(0, 0) rotate(0); } to { transform: translate(20px, 30px) rotate(5deg); } }

        /* Staggered Delay Generation */
        ${sections.map((_, i) => `
          .stagger-delay-${i} { animation-delay: ${0.2 + (i * 0.15)}s !important; }
        `).join('')}
      `}</style>

      {/* Background Decor */}
      <img src="/assets/3d/3d_motorbike_1772291087296.png" className="bike-bg-element bg-top-right" alt="" />
      <img src="/assets/3d/3d_motorbike_1772291087296.png" className="bike-bg-element bg-bottom-left" alt="" />

      <div className="legal-content-wrapper">
        <header className="premium-header">
          <h1>Master Agreement</h1>
          <p>Global Trade Compliance • Rental Protocol • Liability Shield</p>
        </header>

        <div className="terms-grid">
          {sections.map((section, i) => (
            <div key={section.id} className={`terms-section-card animate stagger-delay-${i}`}>
              <span className="section-idx">0{i + 1}</span>
              <h3>{section.title}</h3>
              <ul className="terms-list">
                {section.items.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="safety-alert-premium animate" style={{ animationDelay: '1.2s' }}>
          <h4>🔒 Strategic Enforcement</h4>
          <p>
            By finalizing your fleet transaction via the BikesZone dashboard, you bind your organization
            to the terms above. Our protocols are designed to ensure safety and
            operational excellence for every verified partner.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Terms;