import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <header className="header">
      <nav className="navbar">
        <Link to="/" className="logo">
          Bike<span>Rental</span>
        </Link>
        
        <button className="mobile-menu-btn" onClick={toggleMenu}>
          ☰
        </button>

        <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
          <li><Link to="/" className={isActive('/')} onClick={() => setIsMenuOpen(false)}>Home</Link></li>
          <li><Link to="/bikes" className={isActive('/bikes')} onClick={() => setIsMenuOpen(false)}>Bikes</Link></li>
          <li><Link to="/manage-bookings" className={isActive('/manage-bookings')} onClick={() => setIsMenuOpen(false)}>Manage Bookings</Link></li>
          <li><Link to="/contact" className={isActive('/contact')} onClick={() => setIsMenuOpen(false)}>Contact</Link></li>
          <li><Link to="/terms" className={isActive('/terms')} onClick={() => setIsMenuOpen(false)}>Terms</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;