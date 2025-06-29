// src/components/Header.js

import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
import Logout from '../pages/Logout';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Header.css';

const Header = () => {
  const location = useLocation();
  const [user, setUser] = useState(null);

  // Update user state on auth changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Routes where header should be hidden
  const hiddenPaths = ['/login', '/register'];

  if (hiddenPaths.includes(location.pathname)) {
    return null; // Hide header on /login & /register
  }

  return (
    <header className="app-header">
      <h1 className="app-title">
        <Link to="/">URL Shortener</Link>
      </h1>

      <nav className="nav-links">
        {user ? (
          <>
            {location.pathname !== '/shortener' && (
              <Link to="/shortener" className="nav-link">Shortener</Link>
            )}
            {location.pathname !== '/getcodes' && (
              <Link to="/getcodes" className="nav-link">My Codes</Link>
            )}
            <button onClick={Logout} className="logout-btn">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-link">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
