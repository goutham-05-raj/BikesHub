import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../config/api';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

const Booking = () => {
  const { bikeId } = useParams();
  const [bike, setBike] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [showCouponPopup, setShowCouponPopup] = useState(false);
  const [rentalDays, setRentalDays] = useState(1);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [otpError, setOtpError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchBike();
  }, [bikeId]);

  const fetchBike = async () => {
    try {
      setLoading(true);
      setError('');

      const bikeRef = doc(db, 'bikes', bikeId);

      // Enforce a 5-second timeout on Firestore getDoc
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Firestore timeout')), 5000)
      );

      const bikeSnap = await Promise.race([
        getDoc(bikeRef),
        timeoutPromise
      ]);

      if (bikeSnap.exists()) {
        const bikeData = { id: bikeSnap.id, ...bikeSnap.data() };
        setBike(bikeData);
      } else {
        await fetchFromBackend();
      }
    } catch (error) {
      console.warn('⚠️ Fetch issue, trying Backend API fallback...', error.message);
      await fetchFromBackend();
    } finally {
      setLoading(false);
    }
  };

  const fetchFromBackend = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/bikes/${bikeId}`);
      if (!response.ok) throw new Error('Bike not found in Backend API either');

      const result = await response.json();
      if (result.success && result.data) {
        // console.log("✅ Bike found via Backend API fallback");
        setBike(result.data);
      } else {
        setBike(null);
      }
    } catch (err) {
      console.error('Final fetch error:', err);
      setBike(null);
    }
  };

  const handleCouponChange = (e) => {
    const code = e.target.value.trim().toUpperCase();
    setCouponCode(code);
    if (code === 'GOUTHAM35') {
      if (discount === 0) {
          setShowCouponPopup(true);
          setTimeout(() => setShowCouponPopup(false), 3000);
      }
      setDiscount(500);
    } else {
      setDiscount(0);
    }
  };

  const formatPrice = (price) => new Intl.NumberFormat('en-IN').format(price);

  const { user } = useAuth();
  const [phone, setPhone] = useState('');

  const handleSendOtp = () => {
    if (!phone || phone.length < 10) {
      alert("Please enter a valid phone number first.");
      return;
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otp);
    setIsOtpSent(true);
    setOtpError('');
    // console.log("DEBUG: Your OTP is:", otp);
    alert(`SECURITY ALERT: Your 6-digit verification code is ${otp}. Please enter it to verify your booking.`);
  };

  const handleVerifyOtp = () => {
    if (otpInput === generatedOtp) {
      setIsOtpVerified(true);
      setOtpError('');
      alert("Success! Multi-factor authentication completed.");
    } else {
      // User specifically asked to "confirm booking even if wrong otp"
      // So we show a warning but allow them to proceed by setting a flag or just letting them know.
      // We'll set isOtpVerified to true anyway but show a message.
      setIsOtpVerified(true);
      setOtpError('Note: Verification code mismatch, but proceeding as requested.');
      alert("Verification bypass enabled. You can proceed with the booking.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("You must be logged in to book a bike.");
      return;
    }

    if (!isOtpSent) {
      alert("Please verify your phone number via OTP first.");
      return;
    }

    try {
      const formData = new FormData(e.target);
      const baseTotal = bike.price * rentalDays;
      const finalPrice = Math.max(0, baseTotal - discount);

      const bookingData = {
        bikeId,
        bikeName: bike.name,
        quantity: 1,
        rentalDays,
        totalAmount: finalPrice,
        bikeImage: bike.image || bike.imageUrl || '',
        startLocation: formData.get('startLocation'),
        location: formData.get('location'),
        customerName: formData.get('fullName'),
        email: user.email,
        contactEmail: formData.get('email'),
        phone: phone,
        couponUsed: couponCode === 'GOUTHAM35' ? 'GOUTHAM35' : 'none',
        discountApplied: discount,
        notes: formData.get('notes') || '',
        status: 'confirmed',
        createdAt: new Date().toISOString()
      };

      const idToken = await user.getIdToken();

      const response = await fetch(`${API_BASE_URL}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify(bookingData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Backend booking error response:', errorText);
        throw new Error(`Failed to create booking: ${errorText || response.statusText}`);
      }

      const result = await response.json();
      const newBookingId = result.data?.id || result.data?.booking_id || result.id;

      setSubmitted(true);
      setTimeout(() => {
        navigate(`/payment/${newBookingId}`);
      }, 1500);
    } catch (error) {
      console.error("Error submitting booking:", error);
      alert(`Booking Failed: ${error.message}. Please check console for details.`);
    }
  };

  if (loading) {
    return (
      <div className="premium-loader-container">
        <style>{`
          .premium-loader-container { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; background: #0f172a; color: #f8fafc; }
          .premium-spinner { width: 60px; height: 60px; border: 4px solid rgba(255,255,255,0.1); border-top-color: #ef4444; border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 1.5rem; }
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
        <div className="premium-spinner"></div>
        <p style={{ fontSize: '1.2rem', fontWeight: 600 }}>Preparing your ride...</p>
      </div>
    );
  }

  if (!bike) {
    return (
      <div className="empty-state-container" style={{
        padding: '6rem 2rem',
        textAlign: 'center',
        color: '#f8fafc',
        background: 'linear-gradient(rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 1)), url(/bikes/hero-video.mp4)',
        backgroundSize: 'cover',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          background: 'rgba(239, 68, 68, 0.1)',
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '4rem',
          marginBottom: '2rem',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          boxShadow: '0 0 40px rgba(239, 68, 68, 0.2)'
        }}>🚫</div>
        <h3 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1rem', letterSpacing: '-0.02em' }}>Listing Unavailable</h3>
        <p style={{ color: '#94a3b8', maxWidth: '500px', fontSize: '1.1rem', lineHeight: 1.6 }}>We couldn't retrieve the details for this bike. It may have been archived or moved by the administrator.</p>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '3rem' }}>
          <Link to="/inventory" className="btn-booking-primary" style={{ display: 'inline-block', width: 'auto', padding: '1rem 2rem', textDecoration: 'none' }}>📦 Back to Fleet</Link>
          <Link to="/dashboard" style={{ display: 'inline-block', padding: '1rem 2rem', border: '1px solid #334155', borderRadius: '15px', color: '#fff', textDecoration: 'none', fontWeight: 700 }}>🏠 Dashboard</Link>
        </div>
      </div>
    );
  }

  const safeFeatures = () => {
    try {
      if (!bike.features) return [];
      return typeof bike.features === 'string' ? JSON.parse(bike.features) : bike.features;
    } catch (e) {
      return [];
    }
  };
  const features = safeFeatures();

  const techSpecs = [
    { label: 'Power', value: `${bike.engine_cc || '200'} CC`, icon: '⚡' },
    { label: 'Rating', value: `${bike.rating || '4.5'} / 5`, icon: '⭐' },
    { label: 'Top Speed', value: '145 km/h', icon: '🚀' },
    { label: 'Mileage', value: '35 kmpl', icon: '⛽' },
    { label: 'Weight', value: '158 kg', icon: '⚖️' },
    { label: 'Delivery', value: `${bike.delivery_days || 7} Days`, icon: '🚚' }
  ];

  const baseTotal = (bike.price || 0) * rentalDays;
  const finalPrice = Math.max(0, baseTotal - discount);

  if (submitted) {
    return (
      <div className="redirect-overlay">
        <style>{`
            .redirect-overlay {
              position: fixed; inset: 0; background: #0F172A; z-index: 9999;
              display: flex; flex-direction: column; align-items: center; justify-content: center;
              font-family: 'Inter', sans-serif; color: #fff;
            }
            .secure-ring {
              width: 80px; height: 80px; border: 3px solid rgba(59, 130, 246, 0.1);
              border-top: 3px solid #3B82F6; border-radius: 50%; animation: spin 0.8s linear infinite;
              margin-bottom: 2rem; position: relative;
            }
            .secure-ring::after {
              content: '🔒'; position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-size: 1.5rem;
            }
            @keyframes spin { to { transform: rotate(360deg); } }
            .redirect-text { font-size: 1.25rem; font-weight: 700; color: #fff; text-align: center; }
            .redirect-subtext { color: #94A3B8; font-size: 0.9rem; margin-top: 0.5rem; }
          `}</style>
        <div className="secure-ring"></div>
        <div className="redirect-text">Securing Transaction Gateway</div>
        <div className="redirect-subtext">Connecting to BikesZone encrypted payment portal...</div>
      </div>
    );
  }

  return (
    <div className="booking-page-premium">

      {/* Coupon Success Popup */}
      {showCouponPopup && (
        <div style={{
          position: 'fixed', top: '40px', left: '50%', transform: 'translateX(-50%)', zIndex: 9999,
          background: '#00C853', color: '#fff', padding: '16px 28px', borderRadius: '50px',
          boxShadow: '0 10px 30px rgba(0,200,83,0.4)', display: 'flex', alignItems: 'center', gap: '12px',
          fontFamily: 'Outfit, sans-serif', animation: 'dropIn 0.5s cubic-bezier(0.16, 1, 0.3, 1), fadeOut 0.5s ease-in 2.5s forwards'
        }}>
          <div style={{ fontSize: '24px' }}>🎉</div>
          <div>
            <div style={{ fontWeight: 900, fontSize: '1.1rem', letterSpacing: '0.02em' }}>Coupon Applied!</div>
            <div style={{ fontWeight: 600, fontSize: '0.9rem', opacity: 0.9 }}>You saved ₹500 on this booking.</div>
          </div>
        </div>
      )}

      {/* CSS Injection for Professional Red/Blue/Yellow Look */}
      <style>{`
        @keyframes fadeOut { to { opacity: 0; transform: translate(-50%, -20px); } }
        @keyframes dropIn { from { opacity: 0; transform: translate(-50%, -20px); } to { opacity: 1; transform: translate(-50%, 0); } }
        .booking-page-premium { 
          animation: fadeIn 0.8s ease-out; 
          background: transparent;
          min-height: 100vh;
          padding: 2rem;
          color: #000000;
        }
        .card-premium-form {
          background: rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(25px);
          border: 1px solid rgba(139, 69, 19, 0.15);
          border-radius: 24px;
          padding: 2rem;
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.05);
          border-top: 4px solid #8B4513;
        }
        .form-label { display: block; font-size: 0.875rem; font-weight: 700; margin-bottom: 0.5rem; color: #1e293b; }
        .form-input, .form-select {
          width: 100%;
          padding: 0.75rem 1rem;
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid rgba(0, 0, 0, 0.1);
          border-radius: 12px;
          color: #000000;
          font-size: 1rem;
          transition: 0.3s;
          margin-bottom: 1.25rem;
        }
        .form-input::placeholder { color: #94a3b8; }
        .form-input:focus, .form-select:focus { outline: none; border-color: #8B4513; box-shadow: 0 0 0 2px rgba(139, 69, 19, 0.1); }
        .btn-booking-primary {
          background: linear-gradient(to right, #ef4444, #dc2626);
          color: white;
          width: 100%;
          padding: 1.25rem;
          border-radius: 15px;
          font-weight: 800;
          font-size: 1.15rem;
          border: none;
          cursor: pointer;
          transition: 0.3s;
          box-shadow: 0 10px 20px rgba(239, 68, 68, 0.2);
        }
        .btn-booking-primary:hover { transform: translateY(-2px); box-shadow: 0 15px 30px rgba(239, 68, 68, 0.3); }
        .price-summary-box { background: rgba(139, 69, 19, 0.05); border-radius: 16px; padding: 1.5rem; margin-bottom: 1.5rem; border-left: 4px solid #8B4513; }
        .text-yellow { color: #8B4513; font-weight: 800; }
        .booking-title { font-size: 2.5rem; font-weight: 900; margin-bottom: 0.5rem; color: #000000; }
        .booking-subtitle { font-size: 1.1rem; color: #64748b; font-weight: 500; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <div className="page-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 className="booking-title">{bike.name}</h1>
            <p className="booking-subtitle">{bike.brand} • <span className="text-yellow">{bike.category}</span> <span className="shining-bookit">Bookit</span></p>
          </div>
          <Link to="/inventory" style={{ border: '1px solid rgba(0,0,0,0.1)', color: '#000000', padding: '0.75rem 1.5rem', borderRadius: '12px', textDecoration: 'none', fontWeight: 700, background: '#fff' }}>← Bookit</Link>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 0.8fr)', gap: '2rem' }}>
        {/* Left Column: Visuals & Tech Specs */}
        <div>
          <div style={{ background: 'rgba(139, 69, 19, 0.1)', padding: '0', backdropFilter: 'blur(20px)', overflow: 'hidden', border: '1px solid rgba(139, 69, 19, 0.2)', borderRadius: '30px', marginBottom: '2rem' }}>
            <div style={{ width: '100%', height: '400px', background: '#0f172a', position: 'relative' }}>
              {bike.image_url ? (
                <img src={bike.image_url} alt={bike.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '5rem', opacity: 0.1 }}>🏍️</div>
              )}
              <div style={{ position: 'absolute', bottom: '20px', left: '20px', background: 'rgba(139, 69, 19, 0.8)', backdropFilter: 'blur(10px)', padding: '0.75rem 1.5rem', borderRadius: '100px', border: '1px solid rgba(139, 69, 19, 0.4)' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc' }}>₹{formatPrice(bike.price)} <small style={{ fontSize: '0.6em', opacity: 0.7 }}>/ DAY</small></span>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem', color: '#000000' }}>Technical Specifications</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
              {techSpecs.map((spec, index) => (
                <div key={index} style={{ background: 'rgba(255, 255, 255, 0.5)', backdropFilter: 'blur(10px)', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '20px', padding: '1.25rem', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{spec.icon}</div>
                  <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 800, letterSpacing: '0.05em' }}>{spec.label}</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#000000' }}>{spec.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Booking Form */}
        <div>
          <div className="card-premium-form">
            <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '1.5rem', color: '#000000' }}>Complete Your Reservation</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input className="form-input" name="fullName" type="text" placeholder="Enter your name" required />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Pickup City</label>
                  <select className="form-select" name="startLocation" required>
                    <option value="" disabled selected>Select city</option>
                    <option value="Kurnool">Kurnool</option>
                    <option value="Nandyal">Nandyal</option>
                    <option value="Kadapa">Kadapa</option>
                    <option value="Vijayawada">Vijayawada</option>
                    <option value="Vizag">Vizag</option>
                    <option value="Guntur">Guntur</option>
                    <option value="Tirupati">Tirupati</option>
                    <option value="Nellore">Nellore</option>
                    <option value="Rajamundry">Rajamundry</option>
                    <option value="Kakinada">Kakinada</option>
                    <option value="Ananthapur">Ananthapur</option>
                    <option value="Ongole">Ongole</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Destination City</label>
                  <select className="form-select" name="location" required>
                    <option value="" disabled selected>Select city</option>
                    <option value="Kurnool">Kurnool</option>
                    <option value="Nandyal">Nandyal</option>
                    <option value="Kadapa">Kadapa</option>
                    <option value="Vijayawada">Vijayawada</option>
                    <option value="Vizag">Vizag</option>
                    <option value="Guntur">Guntur</option>
                    <option value="Tirupati">Tirupati</option>
                    <option value="Nellore">Nellore</option>
                    <option value="Rajamundry">Rajamundry</option>
                    <option value="Kakinada">Kakinada</option>
                    <option value="Ananthapur">Ananthapur</option>
                    <option value="Ongole">Ongole</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Rental Duration</label>
                <select
                  className="form-select"
                  value={rentalDays}
                  onChange={(e) => setRentalDays(parseInt(e.target.value))}
                  required
                >
                  {[1, 2, 3, 4, 5, 6, 7].map(day => (
                    <option key={day} value={day}>{day} {day === 1 ? 'Day' : 'Days'}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Contact Email</label>
                <input className="form-input" name="email" type="email" placeholder="Enter your email" required />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    className="form-input"
                    name="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={{ flex: 1 }}
                  />
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    style={{
                      padding: '0 1rem',
                      height: '45px',
                      borderRadius: '12px',
                      background: '#334155',
                      color: 'white',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      fontWeight: '700'
                    }}
                  >
                    {isOtpSent ? 'Resend' : 'Send OTP'}
                  </button>
                </div>
              </div>

              {isOtpSent && (
                <div className="form-group" style={{ animation: 'fadeIn 0.5s ease-out' }}>
                  <label className="form-label text-yellow">Enter 6-Digit OTP</label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                      className="form-input"
                      type="text"
                      maxLength="6"
                      placeholder="XXXXXX"
                      value={otpInput}
                      onChange={(e) => setOtpInput(e.target.value)}
                      style={{ flex: 1, letterSpacing: '0.5rem', textAlign: 'center', fontSize: '1.2rem', fontWeight: '800' }}
                    />
                    <button
                      type="button"
                      onClick={handleVerifyOtp}
                      style={{
                        padding: '0 1rem',
                        height: '45px',
                        borderRadius: '12px',
                        background: isOtpVerified ? '#87ceeb' : '#eab308',
                        color: '#0f172a',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        fontWeight: '800'
                      }}
                    >
                      {isOtpVerified ? 'Verified' : 'Verify'}
                    </button>
                  </div>
                  {otpError && <p style={{ fontSize: '0.75rem', color: '#f59e0b', marginTop: '-0.5rem', marginBottom: '1rem' }}>{otpError}</p>}
                </div>
              )}

              <div className="form-group">
                <label className="form-label text-yellow">Promo Code (If any)</label>
                <input
                  className="form-input"
                  type="text"
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={handleCouponChange}
                  style={{ borderColor: discount > 0 ? '#87ceeb' : '#334155' }}
                />
                {discount > 0 && <p style={{ fontSize: '0.8rem', color: '#87ceeb', marginTop: '-0.75rem', marginBottom: '1rem', fontWeight: 600 }}>✓ Applied: ₹500 discount</p>}
              </div>

              <div className="price-summary-box">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#64748b', fontWeight: 600 }}>
                  <span>Base Price (₹{formatPrice(bike.price)} x {rentalDays})</span>
                  <span>₹{formatPrice(baseTotal)}</span>
                </div>
                {discount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#228b22', fontWeight: 700 }}>
                    <span>Coupon Savings</span>
                    <span>- ₹{formatPrice(discount)}</span>
                  </div>
                )}
                <div style={{ height: '1px', background: 'rgba(0,0,0,0.05)', margin: '0.75rem 0' }}></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 800, fontSize: '1rem', color: '#495057' }}>Estimated Total</span>
                  <span style={{ fontSize: '1.75rem', fontWeight: 900, color: '#000000' }}>₹{formatPrice(finalPrice)}</span>
                </div>
              </div>

              <button
                type="submit"
                className="btn-booking-primary"
                style={{
                  opacity: isOtpVerified ? 1 : 0.6,
                  cursor: isOtpVerified ? 'pointer' : 'not-allowed'
                }}
              >
                🚀 {isOtpVerified ? 'Confirm Booking' : 'Verify Phone to Continue'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
