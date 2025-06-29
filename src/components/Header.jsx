// src/components/Header.js

import React from 'react';
import { auth } from '../firebase';
import Logout from '../pages/Logout';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Header.css';

const Header = () => {
  const location = useLocation();

  // These routes should NOT show header (like /login, /register)
  const hiddenPaths = ['/login', '/register'];

  if (hiddenPaths.includes(location.pathname)) {
    return null; // Don't render header
  }

  return (
    <header className="app-header">
      <h1 className="app-title">URL Shortener</h1>
      <nav className="nav-links">
        {location.pathname !== '/shortener' && (
          <Link to="/shortener" className="nav-link">Shortener</Link>
        )}
        {location.pathname !== '/getcodes' && (
          <Link to="/getcodes" className="nav-link">My Codes</Link>
        )}
        {auth.currentUser && (
          <button onClick={Logout} className="logout-btn">Logout</button>
        )}
      </nav>
    </header>
  );
};

export default Header;
