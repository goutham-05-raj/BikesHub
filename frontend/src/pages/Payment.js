import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../config/api';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Payment = () => {
    const { bookingId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        const fetchBookingDetails = async () => {
            if (!user) return;
            try {
                const idToken = await user.getIdToken();
                const response = await fetch(`${API_BASE_URL}/api/bookings/${bookingId}`, {
                    headers: { 'Authorization': `Bearer ${idToken}` }
                });
                const result = await response.json();

                if (result.success && result.data) {
                    setBooking(result.data);
                } else {
                    console.warn("Booking not found via direct fetch:", bookingId);
                }
            } catch (err) {
                console.error("Error fetching booking for payment:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchBookingDetails();
    }, [user, bookingId]);

    const handlePayment = async (e) => {
        if (e) e.preventDefault();
        setIsProcessing(true);

        // Simulate real-time processing
        setTimeout(async () => {
            try {
                const idToken = await user.getIdToken();
                const totalAmt = (booking.totalAmount || 0) + 2000 + ((booking.totalAmount || 0) * 0.18);

                const response = await fetch(`${API_BASE_URL}/api/bookings/record-payment`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${idToken}`
                    },
                    body: JSON.stringify({
                        bookingId: booking.id,
                        paymentMethod: paymentMethod,
                        transactionId: `TXN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
                        amount: totalAmt
                    })
                });

                if (response.ok) {
                    setIsSuccess(true);
                } else {
                    alert("Payment verification failed. Please contact support.");
                }
            } catch (err) {
                console.error("Payment recording error:", err);
                alert("An error occurred during payment. Please try again.");
            } finally {
                setIsProcessing(false);
            }
        }, 2500);
    };

    if (loading) return <div className="payment-loading">
        <div className="spinner"></div>
        <span>Initializing Secure Gateway...</span>
        <style>{`
            .payment-loading { height: 100vh; background: #0F172A; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #3B82F6; font-weight: 800; gap: 1rem; }
            .spinner { width: 40px; height: 40px; border: 3px solid rgba(59, 130, 246, 0.2); border-top-color: #3B82F6; border-radius: 50%; animation: spin 0.8s linear infinite; }
            @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
    </div>;

    if (!booking) return <div className="payment-error">Booking not found. Or Session Expired.</div>;

    const totalAmount = booking.totalAmount || 0;
    const securityDeposit = 2000;
    const taxes = totalAmount * 0.18;
    const grandTotal = totalAmount + securityDeposit + taxes;

    if (isSuccess) {
        return (
            <div className="celebration-overlay">
                <style>{`
                    .celebration-overlay {
                        position: fixed; inset: 0; background: #FFF5F8; z-index: 9999;
                        display: flex; align-items: center; justify-content: center;
                        overflow: hidden; font-family: 'Inter', sans-serif;
                    }
                    .celebration-card {
                        background: rgba(255, 255, 255, 0.85); padding: 4rem 3rem; border-radius: 40px; text-align: center;
                        max-width: 600px; width: 90%; border: 2px solid rgba(0, 0, 0, 0.05);
                        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.05); position: relative;
                        backdrop-filter: blur(20px);
                        animation: cardPop 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
                    }
                    .success-badge {
                        width: 120px; height: 120px;
                        background: linear-gradient(135deg, #FF4D6D, #FF8C42);
                        border-radius: 50%; display: flex; align-items: center; justify-content: center;
                        margin: 0 auto 2.5rem; box-shadow: 0 15px 35px rgba(255, 77, 109, 0.3);
                        animation: badgeScale 0.6s ease-out 0.4s backwards;
                    }
                    .congrats-title {
                        font-size: 2.8rem; font-weight: 900; margin-bottom: 1rem;
                        color: #000000;
                        animation: titleFade 0.8s ease-out 0.6s backwards;
                    }
                    .highlight-banner {
                        background: rgba(255, 77, 109, 0.1); color: #FF4D6D;
                        padding: 10px 14px; border-radius: 12px; font-size: 1.4rem;
                        font-weight: 800; display: inline-block; margin-bottom: 2rem;
                        border: 1px solid rgba(255, 77, 109, 0.2);
                        animation: bannerSlide 0.8s ease-out 0.8s backwards;
                    }
                    .success-details { color: #64748b; font-size: 1.1rem; line-height: 1.6; margin-bottom: 3rem; animation: fadeIn 0.8s ease-out 1s backwards; }
                    .confetti { position: absolute; width: 10px; height: 10px; background: #FF4D6D; top: -20px; animation: fall 3s linear infinite; }
                    @keyframes fall { to { transform: translateY(100vh) rotate(360deg); } }
                    @keyframes cardPop { from { transform: scale(0.5) translateY(50px); opacity: 0; } to { transform: scale(1) translateY(0); opacity: 1; } }
                    @keyframes badgeScale { from { transform: scale(0); } 70% { transform: scale(1.2); } to { transform: scale(1); } }
                    @keyframes titleFade { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
                    @keyframes bannerSlide { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
                `}</style>
                {[...Array(30)].map((_, i) => (
                    <div key={i} className="confetti" style={{
                        left: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 3}s`,
                        backgroundColor: ['#3B82F6', '#60A5FA', '#FACC15', '#87ceeb'][Math.floor(Math.random() * 4)]
                    }}></div>
                ))}
                <div className="celebration-card">
                    <div className="success-badge">
                        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                    </div>
                    <h2 className="congrats-title">Congratulations!</h2>
                    <div className="highlight-banner">Payment Successful</div>
                    <p className="success-details">
                        Your ride with <strong>{booking.bikeName}</strong> is ready for pickup! <br />
                        Booking ID: <span style={{ color: '#fff', fontWeight: 700 }}>{booking.booking_id || booking.id.substring(0, 8)}</span>
                    </p>
                    <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
                        <Link to="/orders" className="btn-booking-primary" style={{ border: 'none', background: 'linear-gradient(135deg, #FF4D6D, #FF8C42)', color: '#fff', padding: '1.25rem 2.5rem', borderRadius: '16px', textDecoration: 'none', fontWeight: 800, fontSize: '1.1rem', boxShadow: '0 10px 20px rgba(255, 77, 109, 0.3)' }}>📋 My Bookings</Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="payment-container">
            <style>{`
        .payment-container {
          min-height: 100vh;
          background: #FFF5F8;
          display: flex; align-items: center; justify-content: center;
          padding: 2rem; font-family: 'Inter', sans-serif; color: #000000;
        }
        .payment-glass-card {
          background: rgba(255, 255, 255, 0.75); backdrop-filter: blur(25px); -webkit-backdrop-filter: blur(25px);
          border: 1px solid rgba(0, 0, 0, 0.05); border-radius: 24px;
          width: 100%; max-width: 500px; padding: 2.5rem;
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.05); animation: slideUp 0.6s ease-out;
        }
        @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        .summary-card {
          background: rgba(0, 0, 0, 0.03); border-radius: 16px; padding: 1.5rem;
          margin-bottom: 2rem; display: flex; gap: 1.5rem; align-items: center;
        }
        .summary-img { width: 80px; height: 80px; background: #fff; border-radius: 12px; object-fit: cover; border: 1px solid rgba(0,0,0,0.05); }
        .summary-info h2 { font-size: 1.25rem; font-weight: 800; margin: 0; color: #000000; }
        .summary-info p { font-size: 0.85rem; color: #64748b; margin: 4px 0 0 0; font-weight: 500; }
        .price-breakdown { margin-bottom: 2rem; }
        .price-row { display: flex; justify-content: space-between; margin-bottom: 0.75rem; font-size: 0.95rem; color: #64748b; font-weight: 500; }
        .price-row.total { margin-top: 1.25rem; padding-top: 1.25rem; border-top: 1px solid rgba(0, 0, 0, 0.05); color: #000000; font-weight: 900; font-size: 1.35rem; }
        .accent-text { color: #FF4D6D; }
        .payment-methods { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.75rem; margin-bottom: 2rem; }
        .method-tab { background: #fff; border: 1px solid rgba(0, 0, 0, 0.05); padding: 0.75rem; border-radius: 12px; text-align: center; cursor: pointer; transition: 0.3s; font-size: 0.75rem; font-weight: 700; color: #ADB5BD; }
        .method-tab.active { background: #FF4D6D; border-color: #FF4D6D; color: #fff; }
        .form-input { background: #fff; border: 1px solid rgba(0, 0, 0, 0.1); padding: 0.9rem 1.1rem; border-radius: 12px; color: #000; font-size: 1rem; width: 100%; transition: 0.3s; }
        .btn-pay-securely { width: 100%; margin-top: 1.5rem; background: linear-gradient(to right, #FF4D6D, #FF8C42); color: #fff; border: none; padding: 1.25rem; border-radius: 14px; font-weight: 800; font-size: 1.1rem; cursor: pointer; transition: 0.4s; box-shadow: 0 10px 20px rgba(255, 77, 109, 0.2); }
        .btn-pay-securely:hover { transform: translateY(-3px); box-shadow: 0 15px 30px rgba(255, 77, 109, 0.3); }
        .upi-qr-container { background: #fff; padding: 1.5rem; border-radius: 20px; text-align: center; margin-bottom: 1.5rem; border: 1px solid rgba(0,0,0,0.05); }
        .upi-qr-img { width: 180px; height: 180px; margin: 0 auto 1rem; }
        .upi-vpa { font-family: monospace; color: #1e293b; font-weight: 700; background: #f1f5f9; padding: 0.5rem; border-radius: 8px; font-size: 0.9rem; }
        .security-footer { margin-top: 2rem; display: flex; align-items: center; justify-content: center; gap: 0.5rem; color: #ADB5BD; font-size: 0.75rem; font-weight: 700; }
      `}</style>

            <div className="payment-glass-card">
                <div className="summary-card">
                    {booking.bikeImage ? (
                        <img src={booking.bikeImage} alt={booking.bikeName} className="summary-img" />
                    ) : (
                        <div style={{ width: 80, height: 80, background: 'rgba(255,255,255,0.05)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>🏍️</div>
                    )}
                    <div className="summary-info">
                        <h2>{booking.bikeName}</h2>
                        <p>Duration: {booking.rentalDays} Days</p>
                        <p style={{ fontSize: '0.75rem' }}>{booking.startLocation} ➔ {booking.location}</p>
                    </div>
                </div>

                <div className="price-breakdown">
                    <div className="price-row"><span>Base Price</span><span>₹{new Intl.NumberFormat('en-IN').format(totalAmount)}</span></div>
                    <div className="price-row"><span>Deposit</span><span>₹{new Intl.NumberFormat('en-IN').format(securityDeposit)}</span></div>
                    <div className="price-row"><span>GST (18%)</span><span>₹{new Intl.NumberFormat('en-IN').format(taxes)}</span></div>
                    <div className="price-row total"><span>Total Payable</span><span className="accent-text">₹{new Intl.NumberFormat('en-IN').format(grandTotal)}</span></div>
                </div>

                <div className="payment-selection">
                    <div className="payment-methods">
                        {['upi', 'card', 'netbanking', 'wallet'].map(method => (
                            <div key={method} className={`method-tab ${paymentMethod === method ? 'active' : ''}`} onClick={() => setPaymentMethod(method)}>
                                {method.toUpperCase()}
                            </div>
                        ))}
                    </div>
                </div>

                {paymentMethod === 'upi' ? (
                    <div className="upi-qr-flow">
                        <div className="upi-qr-container">
                            <div style={{ color: '#64748B', fontSize: '0.7rem', marginBottom: '1rem', fontWeight: 800 }}>SCAN TO PAY WITH ANY UPI APP</div>
                            <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=bikeszone@upibank%26pn=BikesZone%26am=${grandTotal}%26cu=INR`} alt="UPI QR" className="upi-qr-img" />
                            <div className="upi-vpa">bikeszone@upibank</div>
                        </div>
                        <button className="btn-pay-securely" onClick={handlePayment} disabled={isProcessing}>
                            {isProcessing ? "Verifying Transaction..." : "I have paid via UPI"}
                        </button>
                    </div>
                ) : paymentMethod === 'card' ? (
                    <form onSubmit={handlePayment} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <input className="form-input" placeholder="Card Number" required />
                        <input className="form-input" placeholder="Card Holder Name" required />
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <input className="form-input" placeholder="MM/YY" required />
                            <input className="form-input" placeholder="CVV" type="password" required />
                        </div>
                        <button className="btn-pay-securely" type="submit" disabled={isProcessing}>
                            {isProcessing ? "Authorizing Card..." : `Pay ₹${new Intl.NumberFormat('en-IN').format(grandTotal)}`}
                        </button>
                    </form>
                ) : (
                    <div className="generic-flow">
                        <p style={{ color: '#94A3B8', textAlign: 'center', marginBottom: '1.5rem' }}>Securely connect to your {paymentMethod} for checkout.</p>
                        <button className="btn-pay-securely" onClick={handlePayment} disabled={isProcessing}>
                            {isProcessing ? "Redirecting..." : `Continue with ${paymentMethod.toUpperCase()}`}
                        </button>
                    </div>
                )}

                <div className="security-footer">
                    <span>🔒 256-bit SSL</span>
                    <span style={{ opacity: 0.3 }}>|</span>
                    <span>PCI DSS Compliant</span>
                </div>
            </div>
        </div>
    );
};

export default Payment;
