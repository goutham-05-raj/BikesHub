import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>BikeRental</h3>
          <p>Your trusted partner for bike rentals. Quality bikes, affordable prices, and excellent service.</p>
        </div>
        
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/bikes">Bikes</Link></li>
            <li><Link to="/manage-bookings">Manage Bookings</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h3>Contact Info</h3>
          <p>📞 +91 9876543210</p>
          <p>✉️ info@bikerental.com</p>
          <p>📍 123 Bike Street, City, State 560001</p>
        </div>
        
        <div className="footer-section">
          <h3>Business Hours</h3>
          <p>Monday - Friday: 8:00 AM - 8:00 PM</p>
          <p>Saturday - Sunday: 9:00 AM - 6:00 PM</p>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; 2024 BikeRental. All rights reserved. | <Link to="/terms">Terms & Conditions</Link></p>
      </div>
    </footer>
  );
};

export default Footer;