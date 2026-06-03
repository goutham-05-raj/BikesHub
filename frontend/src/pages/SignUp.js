import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import brandingBg from '../assets/images.jpeg';
import brandedLogo from '../assets/logo_branded.png';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setError('Passwords do not match.');
    }
    try {
      setError('');
      setLoading(true);
      await signup(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to create an account. ' + err.message);
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
              alt="BikesZone"
              className="login-custom-logo"
            />
            <div className="login-badge-pro">USER REGISTRATION</div>
            <h2>Create an Account</h2>
            <p>Sign up to start booking rides with BikesZone.</p>
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
                  type="text"
                  placeholder="admin@123.com"
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

            <div className="login-input-group">
              <label>Confirm Security Key</label>
              <div className="input-with-icon">
                <span className="input-icon">🔐</span>
                <input
                  type="password"
                  placeholder="••••••••"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              className="login-btn-submit"
              disabled={loading}
            >
              {loading ? (
                <span className="loader-dots">Creating Account...</span>
              ) : (
                <>Register Account <span className="btn-arrow">→</span></>
              )}
            </button>
          </form>

          <div className="login-help-footer">
            <p>Already have an account? <Link to="/" className="link-support">Log In</Link></p>
            <p>System v2.4.0 • Distributed Node B-88</p>
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
          background: #fff5ec; /* Pale Orange Base */
          overflow: hidden;
          font-family: 'Outfit', 'Inter', -apple-system, sans-serif;
        }

        .login-visual-bg {
          position: absolute;
          inset: 0;
          z-index: 1;
          opacity: 0.6; /* Soften the background image */
        }

        .login-content-wrapper {
          position: relative;
          z-index: 5;
          width: 100%;
          max-width: 480px;
          padding: 2rem;
        }

        .login-glass-card {
          background: rgba(135, 206, 235, 0.15); /* Light Sky Blue with transparency */
          backdrop-filter: blur(20px) saturate(160%);
          border: 1px solid rgba(0, 0, 0, 0.08);
          border-radius: 28px;
          padding: 3.5rem 3rem;
          box-shadow: 
            0 25px 50px -12px rgba(0, 0, 0, 0.08),
            inset 0 0 0 1px rgba(255, 255, 255, 0.4);
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
          filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.1));
          border-radius: 12px;
        }

        .login-badge-pro {
          display: inline-block;
          padding: 0.4rem 1.2rem;
          background: #87ceeb; /* Sky Blue */
          border: 1px solid rgba(0, 0, 0, 0.05);
          border-radius: 100px;
          font-size: 0.7rem;
          font-weight: 800;
          color: #003366; /* Dark Blue text */
          text-transform: uppercase;
          letter-spacing: 0.12em;
          margin-bottom: 1.25rem;
          box-shadow: 0 2px 5px rgba(0,0,0,0.05);
        }

        .login-branding h2 {
          color: #000;
          font-size: 1.85rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          margin-bottom: 0.75rem;
          font-family: 'Outfit', sans-serif;
          text-shadow: 1px 1px 0px rgba(255, 255, 255, 0.8);
        }

        .login-branding p {
          color: #374151; /* Gray-700 */
          font-size: 0.95rem;
          font-weight: 500;
          line-height: 1.6;
        }

        .login-alert-error {
          background: #fee2e2;
          border: 1px solid #fecaca;
          color: #991b1b;
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
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #87ceeb;
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
          color: #87ceeb;
          font-size: 1.1rem;
          pointer-events: none;
        }

        .input-with-icon input {
          width: 100%;
          background: #ffffff;
          border: 1px solid rgba(0, 0, 0, 0.1);
          border-radius: 14px;
          padding: 1.1rem 1.1rem 1.1rem 3.5rem;
          color: #000;
          font-size: 0.95rem;
          font-weight: 600;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 2px 4px rgba(0,0,0,0.02);
        }

        .input-with-icon input:focus {
          outline: none;
          background: #ffffff;
          border-color: #87ceeb;
          box-shadow: 0 0 0 4px rgba(135, 206, 235, 0.1);
          transform: translateY(-2px);
        }

        .input-with-icon input::placeholder {
          color: #94a3b8;
          font-weight: 400;
        }

        .login-btn-submit {
          margin-top: 1rem;
          background: linear-gradient(135deg, #87ceeb, #ffdab9);
          color: #fff;
          border: none;
          border-radius: 14px;
          padding: 1.25rem;
          font-size: 1.05rem;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          box-shadow: 0 10px 20px -5px rgba(135, 206, 235, 0.3);
          text-transform: uppercase;
          letter-spacing: 0.02em;
        }

        .login-btn-submit:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow: 0 15px 30px -5px rgba(135, 206, 235, 0.4);
          filter: brightness(1.05);
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
          border-top: 1px solid rgba(0, 0, 0, 0.05);
        }

        .login-help-footer p {
          color: #64748b;
          font-size: 0.75rem;
          margin-bottom: 0.75rem;
          font-family: 'Inter', sans-serif;
          font-weight: 600;
        }

        .link-support {
          color: #87ceeb;
          font-size: 0.85rem;
          text-decoration: none;
          font-weight: 700;
          transition: all 0.2s ease;
          border-bottom: 2px solid transparent;
        }

        .link-support:hover {
          color: #ffdab9;
          border-bottom-color: #ffdab9;
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

export default SignUp;
