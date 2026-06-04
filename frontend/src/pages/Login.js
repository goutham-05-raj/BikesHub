import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import brandedLogo from '../assets/logo_branded.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'signup'

  // Sign-up form fields
  const [suName, setSuName] = useState('');
  const [suEmail, setSuEmail] = useState('');
  const [suPhone, setSuPhone] = useState('');
  const [suPassword, setSuPassword] = useState('');
  const [suConfirm, setSuConfirm] = useState('');

  const containerRef = useRef(null);
  const { login, signup, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => setMounted(true), 100);
  }, []);

  useEffect(() => {
    const onMove = (e) => {
      if (!containerRef.current) return;
      const r = containerRef.current.getBoundingClientRect();
      setMousePos({
        x: (e.clientX - r.left - r.width / 2) / r.width,
        y: (e.clientY - r.top - r.height / 2) / r.height,
      });
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  // Known demo credentials — must match what the backend creates in Firebase Auth
  const DEMO_CREDENTIALS = {
    'admin@123.com': 'admin123',
    'user@123.com':  'user123',
    'user@234.com':  'user234',
    'user@345.com':  'user345',
  };

  const friendlyError = (code) => {
    switch (code) {
      case 'auth/invalid-credential':
      case 'auth/wrong-password':
      case 'auth/user-not-found':
        return 'Incorrect email or password. Please check your credentials and try again.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please wait a moment then try again.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your internet connection.';
      default:
        return 'Login failed. Please try again.';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Normalise email (add .com suffix if missing)
    const rawEmail = email.trim();
    const formattedEmail = rawEmail.includes('@') && !rawEmail.includes('.')
      ? `${rawEmail}.com`
      : rawEmail;

    try {
      // Step 1: Try direct login with whatever the user typed
      await login(formattedEmail, password);
      setShowLoginModal(false);
    } catch (err) {
      const isDemoAccount = Object.prototype.hasOwnProperty.call(
        DEMO_CREDENTIALS, formattedEmail.toLowerCase()
      );

      if (isDemoAccount) {
        // Step 2: Trigger backend to (re)create all demo users in Firebase Auth
        try {
          setError('⏳ Setting up demo account, please wait...');
          const backendUrl = process.env.REACT_APP_API_URL || 'http://';
          const resetRes = await fetch(`${backendUrl}/api/reset-now`);
          const resetData = await resetRes.json();
          console.log('Backend user reset result:', resetData);
        } catch (resetErr) {
          console.warn('Backend reset call failed:', resetErr.message);
        }

        // Step 3: Retry login with the known correct demo password
        const knownPassword = DEMO_CREDENTIALS[formattedEmail.toLowerCase()];
        try {
          await login(formattedEmail, knownPassword);
          setError('');
          setShowLoginModal(false);
          return;
        } catch (retryErr) {
          console.error('Login retry after reset failed:', retryErr);
          setError(friendlyError(retryErr.code));
        }
      } else {
        // Not a demo account
        console.error('Login error:', err);
        setError(friendlyError(err.code));
      }
    } finally {
      setLoading(false);
    }
  };

  // ── SIGN UP HANDLER ────────────────────────────────────────────────────────
  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (suPassword !== suConfirm) {
      return setError('Passwords do not match.');
    }
    if (suPassword.length < 6) {
      return setError('Password must be at least 6 characters.');
    }

    setLoading(true);
    try {
      // 1. Create Firebase Auth user
      const userCredential = await signup(suEmail, suPassword);
      const newUser = userCredential.user;

      // 2. Store full profile in Firestore via firebase SDK
      const { db: firestoreDb } = await import('../firebase');
      const { doc, setDoc } = await import('firebase/firestore');
      const profile = {
        uid: newUser.uid,
        email: suEmail.trim().toLowerCase(),
        name: suName.trim(),
        phone: suPhone.trim(),
        role: 'user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await setDoc(doc(firestoreDb, 'users', newUser.uid), profile);

      // 3. Also send to backend for server-side Firestore storage
      try {
        const backendUrl = process.env.REACT_APP_API_URL || 'http://';
        await fetch(`${backendUrl}/api/users/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...profile })
        });
      } catch (backendErr) {
        // Backend call is non-critical; Firestore already saved
        console.warn('Backend register call failed (non-critical):', backendErr.message);
      }

      setSuccess(`🎉 Account created! Welcome, ${suName || suEmail}. You can now sign in.`);
      // Switch to login tab and pre-fill email
      setEmail(suEmail);
      setActiveTab('login');
      setSuName(''); setSuEmail(''); setSuPhone(''); setSuPassword(''); setSuConfirm('');
    } catch (err) {
      console.error('Sign up error:', err);
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Please sign in instead.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else {
        setError(err.message || 'Sign up failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const getMagneticStyle = (multiplier) => ({
    transform: `translate(${mousePos.x * multiplier}px, ${mousePos.y * multiplier}px)`,
  });

  return (
    <div className={`hero-viewport ${mounted ? 'active-load' : ''}`} ref={containerRef}>
      
      {/* ── CINEMATIC BG VIDEO (LIGHT PINK TINTED OVERLAY) ── */}
      <div className="hero-dark-bg">
        <video 
          src="/hero-video.mp4" 
          autoPlay loop muted playsInline 
          className="hero-bg-video"
          onError={(e) => {
            // Fallback back to local Windows absolute path if the direct asset is not copied yet
            e.target.src = "file:///C:/Users/deepi/Downloads/57a2b11370df6478fccb403d25412904_720w.mp4";
          }}
        />
        <div className="hero-grid-overlay" />
        <div className="hero-pink-spotlight" style={getMagneticStyle(30)} />
        <div className="hero-pink-vignette" />
      </div>

      {/* ── NAV BAR ── */}
      <header className="hero-nav-bar">
        <div className="hero-nav-logo">
          <img src={brandedLogo} alt="BikesHub" />
          <span>BikesHub</span>
        </div>
        <div className="hero-nav-links">
          <span>About</span>
          <span>Fleet</span>
          <span>Locations</span>
          <span>Support</span>
        </div>
        
        {user ? (
          <div className="hero-nav-user-pill" onClick={() => navigate('/dashboard')}>
            <span className="user-avatar-dot" />
            <span className="user-email-text">{user.email}</span>
            <button className="enter-dash-pill-btn">Dashboard →</button>
          </div>
        ) : (
          <button className="hero-nav-cta" onClick={() => setShowLoginModal(true)}>
            Portal Access
          </button>
        )}
      </header>

      {/* ── HERO CORE LAYOUT ── */}
      <main className="hero-core-content">
        
        {/* Massive Backdrop Title (Light Pink / Silver Gradient) */}
        <h1 className="hero-background-title" style={getMagneticStyle(-20)}>
          YOUR RIDE AWAITS
        </h1>

        {/* Hero Taglines and CTA Section */}
        <div className="hero-text-footer">
          <p className="hero-subheading">
            Premium bikes. Instant booking. Unforgettable rides.
          </p>
          <div className="hero-cta-buttons">
            {user ? (
              <button className="hero-primary-pill hero-primary-pill--pulse" onClick={() => navigate('/dashboard')}>
                Enter Command Dashboard →
              </button>
            ) : (
              <>
                <button className="hero-primary-pill" onClick={() => setShowLoginModal(true)}>
                  Book Now
                </button>
                <button className="hero-ghost-pill" onClick={() => setShowLoginModal(true)}>
                  Explore Bikes
                </button>
              </>
            )}
          </div>
        </div>
      </main>

      {/* ── STUNNING GLASS LIGHT-PINK LOGIN MODAL ── */}
      {showLoginModal && (
        <div className="login-modal-overlay">
          <div className="login-modal-backdrop" onClick={() => { setShowLoginModal(false); setError(''); setSuccess(''); }} />

          <div className="login-modal-card">
            <button className="login-modal-close" onClick={() => { setShowLoginModal(false); setError(''); setSuccess(''); }}>×</button>

            {/* Logo Header */}
            <div className="login-card-header">
              <img src={brandedLogo} alt="BikesHub" className="login-card-logo" />
              <div>
                <h2 className="login-card-title">
                  {activeTab === 'login' ? 'Welcome Back' : 'Create Account'}
                </h2>
                <p className="login-card-sub">
                  {activeTab === 'login' ? 'Sign into your BikesHub portal' : 'Join the BikesHub community'}
                </p>
              </div>
            </div>

            {/* Tab Switcher */}
            <div className="modal-tab-bar">
              <button
                className={`modal-tab ${activeTab === 'login' ? 'modal-tab--active' : ''}`}
                onClick={() => { setActiveTab('login'); setError(''); setSuccess(''); }}
              >Sign In</button>
              <button
                className={`modal-tab ${activeTab === 'signup' ? 'modal-tab--active' : ''}`}
                onClick={() => { setActiveTab('signup'); setError(''); setSuccess(''); }}
              >Sign Up</button>
            </div>

            {/* Status messages */}
            {error && (
              <div className="login-error"><span>⚠️</span> {error}</div>
            )}
            {success && (
              <div className="login-success"><span>✅</span> {success}</div>
            )}

            {/* ── LOGIN FORM ── */}
            {activeTab === 'login' && (
              <form onSubmit={handleSubmit} className="login-form">
                <div className="login-field">
                  <label className="login-label">Email</label>
                  <div className="login-input-wrap">
                    <span className="login-input-icon">✉</span>
                    <input
                      type="text" required
                      placeholder="admin@123.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="login-input"
                    />
                  </div>
                </div>

                <div className="login-field">
                  <label className="login-label">Password</label>
                  <div className="login-input-wrap">
                    <span className="login-input-icon">⚿</span>
                    <input
                      type="password" required
                      placeholder="••••••••"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="login-input"
                    />
                  </div>
                </div>

                <button type="submit" className="login-submit" disabled={loading}>
                  {loading
                    ? <><span className="login-spinner" />Authenticating...</>
                    : <>Sign In <span className="login-arrow">→</span></>
                  }
                </button>

                <div className="login-cred-hint">
                  <p className="login-cred-title">🔑 Demo Accounts</p>
                  <table className="login-cred-table">
                    <tbody>
                      <tr><td>admin@123.com</td><td>admin123</td></tr>
                      <tr><td>user@123.com</td><td>user123</td></tr>
                      <tr><td>user@234.com</td><td>user234</td></tr>
                      <tr><td>user@345.com</td><td>user345</td></tr>
                    </tbody>
                  </table>
                </div>

                <p className="login-switch-hint">
                  New here?{' '}
                  <button type="button" className="login-switch-link" onClick={() => { setActiveTab('signup'); setError(''); setSuccess(''); }}>
                    Create an account
                  </button>
                </p>
              </form>
            )}

            {/* ── SIGN UP FORM ── */}
            {activeTab === 'signup' && (
              <form onSubmit={handleSignUp} className="login-form">
                <div className="login-field">
                  <label className="login-label">Full Name</label>
                  <div className="login-input-wrap">
                    <span className="login-input-icon">👤</span>
                    <input
                      type="text" required
                      placeholder="Your full name"
                      value={suName}
                      onChange={e => setSuName(e.target.value)}
                      className="login-input"
                    />
                  </div>
                </div>

                <div className="login-field">
                  <label className="login-label">Email Address</label>
                  <div className="login-input-wrap">
                    <span className="login-input-icon">✉</span>
                    <input
                      type="email" required
                      placeholder="you@example.com"
                      value={suEmail}
                      onChange={e => setSuEmail(e.target.value)}
                      className="login-input"
                    />
                  </div>
                </div>

                <div className="login-field">
                  <label className="login-label">Phone Number</label>
                  <div className="login-input-wrap">
                    <span className="login-input-icon">📱</span>
                    <input
                      type="tel"
                      placeholder="+91 9876543210"
                      value={suPhone}
                      onChange={e => setSuPhone(e.target.value)}
                      className="login-input"
                    />
                  </div>
                </div>

                <div className="su-row">
                  <div className="login-field">
                    <label className="login-label">Password</label>
                    <div className="login-input-wrap">
                      <span className="login-input-icon">🔒</span>
                      <input
                        type="password" required
                        placeholder="Min. 6 chars"
                        value={suPassword}
                        onChange={e => setSuPassword(e.target.value)}
                        className="login-input"
                      />
                    </div>
                  </div>
                  <div className="login-field">
                    <label className="login-label">Confirm</label>
                    <div className="login-input-wrap">
                      <span className="login-input-icon">🔒</span>
                      <input
                        type="password" required
                        placeholder="Repeat password"
                        value={suConfirm}
                        onChange={e => setSuConfirm(e.target.value)}
                        className="login-input"
                      />
                    </div>
                  </div>
                </div>

                {/* Password strength indicator */}
                {suPassword && (
                  <div className="pw-strength">
                    <div className={`pw-bar pw-bar--${suPassword.length < 6 ? 'weak' : suPassword.length < 10 ? 'medium' : 'strong'}`} />
                    <span className="pw-label">
                      {suPassword.length < 6 ? 'Too short' : suPassword.length < 10 ? 'Good' : 'Strong 💪'}
                    </span>
                  </div>
                )}

                <button type="submit" className="login-submit login-submit--signup" disabled={loading}>
                  {loading
                    ? <><span className="login-spinner" />Creating account...</>
                    : <>Create My Account <span className="login-arrow">→</span></>
                  }
                </button>

                <p className="login-switch-hint">
                  Already have an account?{' '}
                  <button type="button" className="login-switch-link" onClick={() => { setActiveTab('login'); setError(''); setSuccess(''); }}>
                    Sign in
                  </button>
                </p>
              </form>
            )}

            <div className="login-card-footer">
              <span className="login-footer-dot" />
              System v3.2 · Live Hubs · Andhra Pradesh
            </div>
          </div>
        </div>
      )}

      {/* ── EMBEDDED LIGHT-PINK & WHITE STYLE OVERLAYS ── */}
      <style>{`
        .hero-viewport {
          position: relative;
          width: 100%;
          min-height: 100vh;
          background: #FFF5F8; /* Light Pink Base */
          font-family: 'Kanit', sans-serif;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          color: #2D142C; /* Dark plum text */
        }

        /* Video Background and Tint Overlays */
        .hero-dark-bg {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 1;
        }

        .hero-bg-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          position: absolute;
          inset: 0;
          opacity: 0.85;
        }
        
        .hero-grid-overlay {
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(rgba(255, 77, 109, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 77, 109, 0.04) 1px, transparent 1px);
          background-size: 60px 60px;
        }

        .hero-pink-spotlight {
          position: absolute;
          width: 700px;
          height: 700px;
          border-radius: 50%;
          left: calc(50% - 350px);
          top: calc(50% - 400px);
          background: radial-gradient(circle, rgba(255, 240, 245, 0.5) 0%, rgba(255, 255, 255, 0.3) 60%, transparent 100%);
          filter: blur(60px);
        }

        .hero-pink-vignette {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at center, rgba(255, 240, 245, 0.3) 30%, #FFF5F8 95%);
        }

        /* Navbar Styling */
        .hero-nav-bar {
          position: relative;
          z-index: 10;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px 80px;
          opacity: 0;
          transform: translateY(-20px);
          transition: opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1), transform 1.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .active-load .hero-nav-bar {
          opacity: 1;
          transform: translateY(0);
        }

        .hero-nav-logo {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .hero-nav-logo img {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          box-shadow: 0 4px 15px rgba(255, 77, 109, 0.2);
        }

        .hero-nav-logo span {
          font-size: 1.4rem;
          font-weight: 800;
          text-transform: uppercase;
          color: #2D142C;
          letter-spacing: -0.01em;
        }

        .hero-nav-links {
          display: flex;
          gap: 40px;
        }

        .hero-nav-links span {
          font-size: 0.85rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: #5C3D57;
          cursor: pointer;
          transition: color 0.2s;
        }

        .hero-nav-links span:hover {
          color: #FF4D6D;
        }

        .hero-nav-cta {
          background: #FFFFFF;
          border: 1px solid rgba(255, 77, 109, 0.2);
          color: #FF4D6D;
          padding: 10px 24px;
          border-radius: 100px;
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(255, 77, 109, 0.08);
        }

        .hero-nav-cta:hover {
          background: #FF4D6D;
          color: #FFFFFF;
          box-shadow: 0 6px 20px rgba(255, 77, 109, 0.25);
          transform: translateY(-2px);
        }

        .hero-nav-user-pill {
          display: flex;
          align-items: center;
          gap: 12px;
          background: #FFFFFF;
          border: 1px solid rgba(255, 77, 109, 0.2);
          padding: 8px 16px;
          border-radius: 100px;
          cursor: pointer;
          box-shadow: 0 4px 15px rgba(255, 77, 109, 0.08);
          transition: all 0.2s;
        }
        .hero-nav-user-pill:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(255, 77, 109, 0.15);
        }

        .user-avatar-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #FF4D6D;
          animation: navpulse 1.5s infinite;
        }

        @keyframes navpulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.3); opacity: 0.6; } }

        .user-email-text {
          font-size: 0.8rem;
          font-weight: 700;
          color: #2D142C;
        }

        .enter-dash-pill-btn {
          border: none;
          background: linear-gradient(135deg, #FF4D6D, #FF8C42);
          color: #FFFFFF;
          font-family: 'Kanit', sans-serif;
          font-weight: 800;
          text-transform: uppercase;
          font-size: 0.7rem;
          padding: 6px 12px;
          border-radius: 100px;
          cursor: pointer;
        }

        /* Core Content */
        .hero-core-content {
          position: relative;
          z-index: 5;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          padding: 40px 20px;
        }

        .hero-background-title {
          position: absolute;
          font-size: clamp(8vw, 12vw, 15vw);
          font-weight: 900;
          line-height: 0.85;
          text-transform: uppercase;
          margin: 0;
          top: 15%;
          letter-spacing: -0.04em;
          background: linear-gradient(180deg, rgba(255, 77, 109, 0.25) 0%, rgba(255, 255, 255, 0.05) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          pointer-events: none;
          z-index: 1;
          opacity: 0;
          transform: scale(0.95);
          transition: opacity 1.5s ease-out 0.2s, transform 1.5s ease-out 0.2s;
        }

        .active-load .hero-background-title {
          opacity: 1;
          transform: scale(1);
        }

        .hero-bike-container {
          position: relative;
          z-index: 3;
          margin-top: -60px;
          margin-bottom: 20px;
          max-width: 900px;
          width: 100%;
          opacity: 0;
          transform: translateY(40px) scale(0.95);
          transition: opacity 1.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s, transform 1.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s;
        }

        .active-load .hero-bike-container {
          opacity: 1;
          transform: translateY(0) scale(1);
        }

        .hero-centerpiece-bike {
          width: 100%;
          height: auto;
          object-fit: contain;
          filter: drop-shadow(0 20px 40px rgba(255, 77, 109, 0.25));
          animation: floatBike 6s infinite alternate ease-in-out;
        }

        .hero-bike-shadow {
          position: absolute;
          width: 60%;
          height: 20px;
          background: rgba(255, 77, 109, 0.15);
          border-radius: 50%;
          bottom: -40px;
          left: 20%;
          filter: blur(15px);
          animation: shadowScale 6s infinite alternate ease-in-out;
        }

        @keyframes floatBike {
          0% { transform: translateY(0); }
          100% { transform: translateY(-20px); }
        }

        @keyframes shadowScale {
          0% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(0.85); opacity: 0.4; }
        }

        .hero-text-footer {
          position: relative;
          z-index: 5;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 24px;
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 1.5s ease-out 0.6s, transform 1.5s ease-out 0.6s;
        }

        .active-load .hero-text-footer {
          opacity: 1;
          transform: translateY(0);
        }

        .hero-subheading {
          font-size: 0.95rem;
          font-weight: 400;
          text-transform: uppercase;
          letter-spacing: 0.3em;
          color: #5C3D57;
          margin: 0;
          text-shadow: 0 2px 5px rgba(255, 255, 255, 0.5);
        }

        .hero-cta-buttons {
          display: flex;
          gap: 20px;
        }

        .hero-primary-pill {
          background: linear-gradient(135deg, #FF4D6D 0%, #FF8C42 100%);
          color: #FFFFFF;
          border: none;
          padding: 16px 40px;
          border-radius: 100px;
          font-size: 0.9rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 8px 25px rgba(255, 77, 109, 0.3);
        }

        .hero-primary-pill:hover {
          transform: translateY(-4px) scale(1.02);
          box-shadow: 0 16px 35px rgba(255, 77, 109, 0.45);
        }

        .hero-primary-pill--pulse {
          animation: pulseBorder 2s infinite;
        }

        @keyframes pulseBorder {
          0% { box-shadow: 0 0 0 0 rgba(255, 77, 109, 0.4); }
          70% { box-shadow: 0 0 0 15px rgba(255, 77, 109, 0); }
          100% { box-shadow: 0 0 0 0 rgba(255, 77, 109, 0); }
        }

        .hero-ghost-pill {
          background: #FFFFFF;
          border: 2px solid rgba(255, 77, 109, 0.2);
          color: #FF4D6D;
          padding: 14px 40px;
          border-radius: 100px;
          font-size: 0.9rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .hero-ghost-pill:hover {
          background: rgba(255, 77, 109, 0.05);
          border-color: #FF4D6D;
          transform: translateY(-2px);
        }

        /* ── LIGHT PINK GLASS MODAL ── */
        .login-modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }

        .login-modal-backdrop {
          position: absolute;
          inset: 0;
          background: rgba(45, 20, 44, 0.6);
          backdrop-filter: blur(8px);
        }

        .login-modal-card {
          position: relative;
          width: 100%;
          max-width: 460px;
          background: rgba(255, 255, 255, 0.95);
          border: 1px solid rgba(255, 77, 109, 0.2);
          border-radius: 28px;
          padding: 44px 36px;
          box-shadow: 0 30px 80px rgba(45, 20, 44, 0.15), 0 0 40px rgba(255, 77, 109, 0.1);
          z-index: 1010;
          animation: modalFadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes modalFadeIn {
          from { opacity: 0; transform: scale(0.95) translateY(15px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }

        .login-modal-close {
          position: absolute;
          right: 24px;
          top: 24px;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(255, 77, 109, 0.05);
          border: 1px solid rgba(255, 77, 109, 0.1);
          color: #FF4D6D;
          font-size: 1.2rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .login-modal-close:hover {
          background: #FF4D6D;
          color: #FFFFFF;
        }

        .login-card-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 32px;
        }

        .login-card-logo {
          width: 56px;
          height: 56px;
          border-radius: 12px;
          box-shadow: 0 6px 15px rgba(255, 77, 109, 0.15);
        }

        .login-card-title {
          font-size: 1.8rem;
          font-weight: 800;
          color: #2D142C;
          margin: 0 0 4px;
        }

        .login-card-sub {
          color: #868E96;
          margin: 0;
          font-size: 0.9rem;
        }

        .login-error {
          display: flex;
          align-items: center;
          gap: 10px;
          background: rgba(255, 77, 109, 0.08);
          border: 1px solid rgba(255, 77, 109, 0.2);
          color: #E63946;
          border-radius: 12px;
          padding: 14px 18px;
          font-size: 0.85rem;
          font-weight: 600;
          margin-bottom: 24px;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 22px;
        }

        .login-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .login-label {
          font-size: 0.75rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: #FF4D6D;
          margin-left: 4px;
        }

        .login-input-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }

        .login-input-icon {
          position: absolute;
          left: 16px;
          font-size: 1.1rem;
          color: #FF4D6D;
          pointer-events: none;
        }

        .login-input {
          width: 100%;
          background: #FFFBFD;
          border: 1px solid rgba(255, 77, 109, 0.15);
          border-radius: 14px;
          padding: 16px 16px 16px 46px;
          color: #2D142C;
          font-size: 0.95rem;
          font-family: 'Kanit', sans-serif;
          transition: all 0.3s ease;
        }

        .login-input::placeholder {
          color: #ADB5BD;
        }

        .login-input:focus {
          outline: none;
          border-color: #FF4D6D;
          background: #FFFFFF;
          box-shadow: 0 0 0 4px rgba(255, 77, 109, 0.1);
          transform: translateY(-1px);
        }

        .login-submit {
          margin-top: 12px;
          background: linear-gradient(135deg, #FF4D6D 0%, #FF8C42 100%);
          color: #FFFFFF;
          border: none;
          border-radius: 14px;
          font-size: 1.05rem;
          font-weight: 800;
          font-family: 'Kanit', sans-serif;
          cursor: pointer;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          padding: 16px;
          transition: all 0.3s ease;
          box-shadow: 0 8px 25px rgba(255, 77, 109, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .login-submit:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow: 0 15px 35px rgba(255, 77, 109, 0.35);
        }

        .login-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .login-arrow {
          font-size: 1.3rem;
          transition: transform 0.3s ease;
        }

        .login-submit:hover .login-arrow {
          transform: translateX(6px);
        }

        .login-spinner {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          border: 2px solid rgba(255, 77, 109, 0.3);
          border-top-color: #FF4D6D;
          animation: spin 0.8s linear infinite;
        }

        /* ── TAB BAR ── */
        .modal-tab-bar {
          display: flex;
          gap: 4px;
          background: rgba(255, 77, 109, 0.06);
          border-radius: 12px;
          padding: 4px;
          margin-bottom: 20px;
        }

        .modal-tab {
          flex: 1;
          background: transparent;
          border: none;
          border-radius: 9px;
          padding: 10px 0;
          font-family: 'Kanit', sans-serif;
          font-size: 0.85rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #9D6F85;
          cursor: pointer;
          transition: all 0.25s ease;
        }

        .modal-tab--active {
          background: #FFFFFF;
          color: #FF4D6D;
          box-shadow: 0 2px 10px rgba(255, 77, 109, 0.15);
        }

        /* ── SUCCESS MESSAGE ── */
        .login-success {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          background: rgba(34, 197, 94, 0.08);
          border: 1px solid rgba(34, 197, 94, 0.25);
          color: #15803d;
          border-radius: 12px;
          padding: 14px 18px;
          font-size: 0.85rem;
          font-weight: 600;
          margin-bottom: 16px;
          line-height: 1.5;
        }

        /* ── SIDE BY SIDE ROW (passwords) ── */
        .su-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        /* ── PASSWORD STRENGTH ── */
        .pw-strength {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .pw-bar {
          flex: 1;
          height: 4px;
          border-radius: 4px;
          transition: all 0.3s ease;
        }

        .pw-bar--weak   { background: #f87171; width: 33%;  }
        .pw-bar--medium { background: #fb923c; width: 66%;  }
        .pw-bar--strong { background: #4ade80; width: 100%; }

        .pw-label {
          font-size: 0.72rem;
          font-weight: 700;
          color: #868E96;
          white-space: nowrap;
        }

        /* ── SIGNUP BUTTON VARIANT ── */
        .login-submit--signup {
          background: linear-gradient(135deg, #7C3AED 0%, #FF4D6D 100%);
        }

        /* ── SWITCH HINT ── */
        .login-switch-hint {
          text-align: center;
          font-size: 0.8rem;
          color: #868E96;
          margin: 8px 0 0;
        }

        .login-switch-link {
          background: none;
          border: none;
          color: #FF4D6D;
          font-weight: 700;
          cursor: pointer;
          font-size: 0.8rem;
          font-family: 'Kanit', sans-serif;
          text-decoration: underline;
          text-underline-offset: 3px;
        }

        .login-switch-link:hover {
          color: #D6294A;
        }

        .login-cred-hint {
          margin-top: 20px;
          background: rgba(255, 77, 109, 0.04);
          border: 1px dashed rgba(255, 77, 109, 0.25);
          border-radius: 12px;
          padding: 14px 18px;
        }

        .login-cred-title {
          font-size: 0.72rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #FF4D6D;
          margin: 0 0 10px;
        }

        .login-cred-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.78rem;
        }

        .login-cred-table td {
          padding: 3px 8px 3px 0;
          color: #5C3D57;
          font-weight: 600;
        }

        .login-cred-table td:last-child {
          color: #FF4D6D;
          font-weight: 700;
          font-family: monospace;
          font-size: 0.82rem;
        }

        .login-card-footer {
          margin-top: 32px;
          text-align: center;
          font-size: 0.75rem;
          color: #868E96;
          font-weight: 600;
          letter-spacing: 0.06em;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .login-footer-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #FF4D6D;
          opacity: 0.6;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        @media (max-width: 1024px) {
          .hero-nav-bar { padding: 24px 40px; }
          .hero-nav-links { display: none; }
        }

        @media (max-width: 600px) {
          .hero-nav-bar { padding: 20px 24px; }
          .hero-cta-buttons { flex-direction: column; width: 80%; }
          .hero-primary-pill, .hero-ghost-pill { padding: 14px 28px; width: 100%; text-align: center; }
          .hero-subheading { font-size: 0.8rem; letter-spacing: 0.2em; }
        }
      `}</style>
    </div>
  );
};

export default Login;
