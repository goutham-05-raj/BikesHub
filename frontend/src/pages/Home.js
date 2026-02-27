import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [activeQuote, setActiveQuote] = useState(0);

  const quotes = [
    { text: "Life is a journey. Enjoy the ride.", author: "— Unknown" },
    { text: "Four wheels move the body. Two wheels move the soul.", author: "— Anonymous" },
    { text: "The road is there. You just have to decide when to take it.", author: "— Chris Guillebeau" },
    { text: "Riding is not a hobby. It's a way of life.", author: "— BikesZone" },
    { text: "Freedom on two wheels. Power in every deal.", author: "— BikesZone" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveQuote((prev) => (prev + 1) % quotes.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [quotes.length]);

  const specialties = [
    { icon: '🔒', title: 'Secure Online Payments', desc: 'End-to-end encrypted payments with security protection for every booking.' },
    { icon: '✅', title: 'Verified Bike Fleet', desc: 'Every bike is regularly serviced and audited for safety and quality assurance.' },
    { icon: '🏭', title: 'Premium Collections', desc: 'Choose from top brands — Bajaj, Royal Enfield, Yamaha, KTM, Honda.' },
    { icon: '🚚', title: 'Express Delivery', desc: 'Get your bike delivered to your doorstep with real-time tracking.' },
    { icon: '📊', title: 'Transparent Pricing', desc: 'No hidden charges. What you see is what you pay for your ride.' },
    { icon: '💎', title: 'Built for Comfort', desc: 'Focus on ergonomic designs and high-performance engines for long rides.' },
  ];

  const stats = [
    { value: '2,500+', label: 'Happy Riders', icon: '🏍️' },
    { value: '180+', label: 'Verified Bikes', icon: '🤝' },
    { value: '50k+', label: 'Kms Covered', icon: '🛣️' },
    { value: '5+', label: 'Operating Cities', icon: '🏙️' },
  ];

  return (
    <div className="landing-page page-pale-black">

      {/* ═══════ SECTION 1: 3D CINEMATIC HERO WITH VIDEO ═══════ */}
      <section className="landing-hero">
        {/* Video Background */}
        <video
          className="landing-hero-video"
          autoPlay muted loop playsInline
          onLoadedData={(e) => { e.target.playbackRate = 0.65; }}
          src={`${process.env.PUBLIC_URL}/bikes/hero-video.mp4`}
        />

        {/* 3D Depth Layers */}
        <div className="landing-hero-overlay"></div>
        <div className="landing-3d-orb landing-3d-orb--1"></div>
        <div className="landing-3d-orb landing-3d-orb--2"></div>
        <div className="landing-3d-orb landing-3d-orb--3"></div>
        <div className="landing-3d-ring landing-3d-ring--1"></div>
        <div className="landing-3d-ring landing-3d-ring--2"></div>

        {/* Floating Quote on Video */}
        <div className="landing-video-quote" key={activeQuote}>
          <div className="landing-video-quote-text">
            "{quotes[activeQuote].text}"
          </div>
          <div className="landing-video-quote-author">
            {quotes[activeQuote].author}
          </div>
        </div>

        {/* Main Content */}
        <div className="landing-hero-content">
          <div className="landing-hero-badge">
            <span className="landing-hero-badge-dot"></span>
            India's Premier Bike Rental Platform
          </div>

          <h1 className="landing-hero-title">
            The <span className="text-gradient">Journey</span> Begins <span>Here</span>
          </h1>

          <p className="landing-hero-subtitle">
            Premium bike rentals for serious riders.
            Transparent pricing. Verified bikes. Seamless experience.
          </p>

          <div className="landing-hero-cta">
            <Link to="/inventory" className="btn btn-primary btn-lg landing-btn-glow">
              🏍️ Browse Bikes
            </Link>
            <Link to="/about" className="btn btn-white-outline btn-lg">
              📖 Learn More
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="landing-scroll-indicator">
          <span>Scroll to explore</span>
          <div className="landing-scroll-arrow">↓</div>
        </div>
      </section>

      {/* ═══════ SECTION 2: VISION ═══════ */}
      <section className="landing-vision">
        <div className="landing-vision-inner">
          <div className="landing-vision-tag">Our Vision</div>
          <blockquote className="landing-vision-quote">
            "We believe every dealer deserves <em>direct access</em> to manufacturers,
            every manufacturer deserves <em>transparent demand</em>, and every
            transaction deserves <em>absolute trust</em>."
          </blockquote>
          <p className="landing-vision-desc">
            BikesZone was built to eliminate the chaos of traditional bike distribution.
            No more middlemen inflating prices. No more opaque deals. Just a clean, powerful
            platform where serious traders do business — at scale.
          </p>
        </div>
      </section>

      {/* ═══════ SECTION 3: 3D SPECIALTY CARDS ═══════ */}
      <section className="landing-specialties">
        <div className="section-header">
          <div className="section-tag">Why BikesZone</div>
          <h2 className="section-title">Built Different. Built to Last.</h2>
          <p className="section-desc">Six pillars that make BikesZone the most trusted B2B bike platform in India</p>
        </div>
        <div className="landing-specialties-grid">
          {specialties.map((s, i) => (
            <div className="landing-specialty-card" key={i}>
              <div className="landing-specialty-glow"></div>
              <div className="landing-specialty-icon">{s.icon}</div>
              <h3 className="landing-specialty-title">{s.title}</h3>
              <p className="landing-specialty-desc">{s.desc}</p>
              <div className="landing-specialty-line"></div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════ SECTION 4: STATS ═══════ */}
      <section className="landing-stats">
        <div className="landing-stats-inner">
          <div className="landing-stats-quote">
            <p>"The only impossible journey is the one you never begin."</p>
            <span>— Tony Robbins</span>
          </div>
          <div className="landing-stats-grid">
            {stats.map((s, i) => (
              <div className="landing-stat-item" key={i}>
                <div className="landing-stat-icon">{s.icon}</div>
                <div className="landing-stat-value">{s.value}</div>
                <div className="landing-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ SECTION 5: CLOSING ═══════ */}
      <section className="landing-closing">
        <div className="landing-closing-inner">
          <div className="landing-closing-quote">
            "It's not about the destination. It's about the ride — and who rides with you."
          </div>
          <p className="landing-closing-sub">
            Join 180+ verified dealers and manufacturers building the future of motorcycle trade in India.
          </p>
          <div className="landing-closing-cta">
            <Link to="/inventory" className="btn btn-primary btn-lg landing-btn-glow">
              Start Trading Today →
            </Link>
          </div>
          <div className="landing-closing-peace">🏍️</div>
        </div>
      </section>
    </div>
  );
};

export default Home;