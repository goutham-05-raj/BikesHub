import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';

const Booking = () => {
  const { bikeId } = useParams();
  const [bike, setBike] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetchBike();
  }, [bikeId]);

  const fetchBike = async () => {
    try {
      const bikeRef = doc(db, 'bikes', bikeId);
      const bikeSnap = await getDoc(bikeRef);

      if (bikeSnap.exists()) {
        const bikeData = { id: bikeSnap.id, ...bikeSnap.data() };
        setBike(bikeData);
        setQuantity(1);
      } else {
        console.log("No such bike in Firestore!");
      }
    } catch (error) {
      console.error('Error fetching bike:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => new Intl.NumberFormat('en-IN').format(price);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.target);
      const bookingData = {
        bikeId,
        bikeName: bike.name,
        quantity: 1,
        totalAmount: bike.price,
        location: formData.get('location'),
        customerName: formData.get('fullName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        notes: formData.get('notes'),
        status: 'confirmed',
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, 'bookings'), bookingData);
      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting booking:", error);
      alert("Failed to submit booking. Please try again.");
    }
  };

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  if (!bike) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">🔍</div>
        <h3>Bike not found</h3>
        <p>The requested bike listing could not be found</p>
        <Link to="/inventory" className="btn btn-primary" style={{ marginTop: '1rem' }}>← Back to Inventory</Link>
      </div>
    );
  }

  if (submitted) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>✅</div>
        <h2 className="stylish-title" style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>Booking Confirmed!</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem', fontSize: '1.2rem' }}>
          Your ride with <strong>{bike.name}</strong> has been secured.
        </p>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.9rem' }}>
          Check your email for booking details and pickup instructions.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link to="/inventory" className="btn btn-primary btn-lg">🏍️ Explore More</Link>
          <Link to="/orders" className="btn btn-outline btn-lg">📋 View My Bookings</Link>
        </div>
      </div>
    );
  }

  const features = bike.features ? JSON.parse(bike.features) : [];

  // Mock Technical Specs for a richer dashboard look if missing
  const techSpecs = [
    { label: 'Power', value: `${bike.engine_cc || '200'} CC`, icon: '⚡' },
    { label: 'Rating', value: `${bike.rating || '4.5'} / 5`, icon: '⭐' },
    { label: 'Top Speed', value: '145 km/h', icon: '🚀' },
    { label: 'Mileage', value: '35 kmpl', icon: '⛽' },
    { label: 'Weight', value: '158 kg', icon: '⚖️' },
    { label: 'Delivery', value: `${bike.delivery_days || 7} Days`, icon: '🚚' }
  ];

  return (
    <div className="stylish-font">
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <div className="page-header-row">
          <div>
            <h1 className="stylish-title" style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '0.5rem' }}>{bike.name}</h1>
            <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>{bike.brand} • {bike.category} Series</p>
          </div>
          <Link to="/inventory" className="btn btn-outline">← Back to Fleet</Link>
        </div>
      </div>

      <div className="dashboard-grid dashboard-grid--1" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '2rem' }}>
        {/* Left Column: Visuals & Tech Specs */}
        <div>
          <div className="card" style={{ padding: '0', overflow: 'hidden', border: '1px solid var(--border-accent)', background: 'var(--bg-card)' }}>
            <div style={{ width: '100%', height: '400px', background: 'var(--bg-surface)', position: 'relative' }}>
              {bike.image_url ? (
                <img src={bike.image_url} alt={bike.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '5rem', opacity: 0.1 }}>🏍️</div>
              )}
              <div style={{ position: 'absolute', bottom: '20px', left: '20px', background: 'rgba(15, 23, 42, 0.8)', padding: '0.5rem 1.5rem', borderRadius: '100px', backdropFilter: 'blur(10px)', border: '1px solid var(--border-accent)' }}>
                <span className="stylish-title" style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-light)' }}>₹{formatPrice(bike.price)} <small style={{ fontSize: '0.6em', opacity: 0.7 }}>/ DAY</small></span>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '2rem' }}>
            <h3 className="stylish-title" style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>Performance & Stats</h3>
            <div className="specs-dashboard-grid">
              {techSpecs.map((spec, index) => (
                <div key={index} className="spec-dashboard-item">
                  <span className="spec-dashboard-icon">{spec.icon}</span>
                  <span className="spec-dashboard-label">{spec.label}</span>
                  <span className="spec-dashboard-value">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: '2rem' }}>
            <h3 className="stylish-title" style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>Premium Features</h3>
            <div className="feature-badges">
              {features.map((feature, index) => (
                <span key={index} className="feature-badge">{feature}</span>
              ))}
              <span className="feature-badge">Verified Fleet</span>
              <span className="feature-badge">Insurance Covered</span>
              <span className="feature-badge">Roadside Assist</span>
            </div>
          </div>
        </div>

        {/* Right Column: Booking Form */}
        <div>
          <div className="card" style={{ border: '1px solid var(--border-accent)', background: 'var(--bg-card)', position: 'sticky', top: '2rem' }}>
            <div className="card-header" style={{ borderBottom: '1px solid var(--border)' }}>
              <h3 className="stylish-title" style={{ fontSize: '1.4rem' }}>Secure Your Ride</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                  <label className="form-label" style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Full Name</label>
                  <input className="form-input" name="fullName" type="text" placeholder="John Doe" required style={{ borderRadius: 'var(--radius-sm)' }} />
                </div>

                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                  <label className="form-label" style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Delivery / Pickup City</label>
                  <input className="form-input" name="location" type="text" placeholder="Bengaluru, Karnataka" required style={{ borderRadius: 'var(--radius-sm)' }} />
                </div>

                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                  <label className="form-label" style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Contact Email</label>
                  <input className="form-input" name="email" type="email" placeholder="john@example.com" required style={{ borderRadius: 'var(--radius-sm)' }} />
                </div>

                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                  <label className="form-label" style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Phone Number</label>
                  <input className="form-input" name="phone" type="tel" placeholder="+91 XXXXX XXXXX" required style={{ borderRadius: 'var(--radius-sm)' }} />
                </div>

                <div style={{ padding: '1.5rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius)', marginBottom: '1.5rem', border: '1px dashed var(--border-accent)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Rental Period</span>
                    <span style={{ fontWeight: 600 }}>1 Day</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Base Price</span>
                    <span style={{ fontWeight: 600 }}>₹{formatPrice(bike.price)}</span>
                  </div>
                  <div style={{ height: '1px', background: 'var(--border)', margin: '1rem 0' }}></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="stylish-title" style={{ fontSize: '1.1rem', fontWeight: 700 }}>Total Payable</span>
                    <span className="stylish-title" style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--accent-light)' }}>₹{formatPrice(bike.price)}</span>
                  </div>
                </div>

                <button type="submit" className="btn btn-primary btn-lg btn-glow" style={{ width: '100%', paddingY: '1rem', fontSize: '1.1rem', borderRadius: 'var(--radius)' }}>
                  ⚡ Confirm & Pay
                </button>
                <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '1rem' }}>
                  Cancel anytime before 24 hours of pickup.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;