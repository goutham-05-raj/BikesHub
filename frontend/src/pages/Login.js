import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import brandingBg from '../assets/branding_bg.jpg';
import brandedLogo from '../assets/logo_branded.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError('Failed to log in. Please check your credentials.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-professional-container">
      {/* Background with Blur & Gradients */}
      <div className="login-visual-bg" style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.85)), url(${brandingBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}></div>

      <div className="login-content-wrapper">
        <div className="login-glass-card">
          <div className="login-branding">
            <img
              src={brandedLogo}
              alt="BikesZone Admin"
              className="login-custom-logo"
            />
            <div className="login-badge-pro">ADMIN PORTAL</div>
            <h2>Enterprise Management</h2>
            <p>Access the core distribution network Control Center.</p>
          </div>

          {error && (
            <div className="login-alert-error">
              <span className="alert-icon">⚠️</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form-pro">
            <div className="login-input-group">
              <label>Service Email</label>
              <div className="input-with-icon">
                <span className="input-icon">✉️</span>
                <input
                  type="email"
                  placeholder="admin@bikeszone.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="login-input-group">
              <label>Security Key</label>
              <div className="input-with-icon">
                <span className="input-icon">🔐</span>
                <input
                  type="password"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              className="login-btn-submit"
              disabled={loading}
            >
              {loading ? (
                <span className="loader-dots">Authenticating...</span>
              ) : (
                <>Authorize Access <span className="btn-arrow">→</span></>
              )}
            </button>
          </form>

          <div className="login-help-footer">
            <p>System v2.4.0 • Distributed Node B-88</p>
            <a href="#help" className="link-support">Technical Support</a>
          </div>
        </div>
      </div>

      <style jsx="true">{`
        .login-professional-container {
          position: relative;
          min-height: 100vh;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #000;
          overflow: hidden;
          font-family: 'Inter', -apple-system, sans-serif;
        }

        .login-visual-bg {
          position: absolute;
          inset: 0;
          z-index: 1;
        }

        .login-content-wrapper {
          position: relative;
          z-index: 5;
          width: 100%;
          max-width: 480px;
          padding: 2rem;
        }

        .login-glass-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(25px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 28px;
          padding: 3.5rem 3rem;
          box-shadow: 
            0 25px 50px -12px rgba(0, 0, 0, 0.5),
            inset 0 0 0 1px rgba(255, 255, 255, 0.05);
          transition: all 0.4s ease;
        }

        .login-branding {
          text-align: center;
          margin-bottom: 3rem;
        }

        .login-custom-logo {
          width: 120px;
          height: auto;
          margin-bottom: 1.5rem;
          filter: drop-shadow(0 0 15px rgba(255, 255, 255, 0.2));
          border-radius: 12px;
        }

        .login-badge-pro {
          display: inline-block;
          padding: 0.35rem 1rem;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 100px;
          font-size: 0.65rem;
          font-weight: 800;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          margin-bottom: 1.25rem;
        }

        .login-branding h2 {
          color: #fff;
          font-size: 1.75rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          margin-bottom: 0.75rem;
          font-family: 'Outfit', sans-serif;
        }

        .login-branding p {
          color: #94a3b8;
          font-size: 0.95rem;
          line-height: 1.6;
        }

        .login-alert-error {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          color: #fca5a5;
          padding: 1rem;
          border-radius: 12px;
          font-size: 0.85rem;
          margin-bottom: 2rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .alert-icon { font-size: 1.1rem; }

        .login-form-pro {
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
        }

        .login-input-group {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }

        .login-input-group label {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #64748b;
          padding-left: 0.25rem;
        }

        .input-with-icon {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 1.25rem;
          color: #475569;
          font-size: 1.1rem;
          pointer-events: none;
        }

        .input-with-icon input {
          width: 100%;
          background: rgba(15, 23, 42, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 14px;
          padding: 1.1rem 1.1rem 1.1rem 3.5rem;
          color: #fff;
          font-size: 0.95rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .input-with-icon input:focus {
          outline: none;
          background: rgba(15, 23, 42, 0.6);
          border-color: rgba(255, 255, 255, 0.2);
          box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.03);
          transform: translateY(-2px);
        }

        .login-btn-submit {
          margin-top: 1rem;
          background: #fff;
          color: #000;
          border: none;
          border-radius: 14px;
          padding: 1.25rem;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          box-shadow: 0 10px 20px -5px rgba(0, 0, 0, 0.3);
        }

        .login-btn-submit:hover:not(:disabled) {
          background: #f8fafc;
          transform: translateY(-3px);
          box-shadow: 0 15px 30px -5px rgba(0, 0, 0, 0.4);
        }

        .login-btn-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-arrow {
          font-size: 1.2rem;
          transition: transform 0.3s ease;
        }

        .login-btn-submit:hover .btn-arrow {
          transform: translateX(5px);
        }

        .login-help-footer {
          margin-top: 3.5rem;
          text-align: center;
          padding-top: 2rem;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        .login-help-footer p {
          color: #475569;
          font-size: 0.75rem;
          margin-bottom: 0.75rem;
          font-family: monospace;
          letter-spacing: 0.05em;
        }

        .link-support {
          color: #94a3b8;
          font-size: 0.8rem;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.2s ease;
        }

        .link-support:hover {
          color: #fff;
        }

        @media (max-width: 480px) {
          .login-glass-card {
            padding: 2.5rem 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;
