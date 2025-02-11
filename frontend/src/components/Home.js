import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import IssueReported from './IssueReported';
import './Home.css';

function Home() {
  const { user, logout } = useAuth(); // Access user from AuthContext
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    logout(); // Clear user data from context on logout
    navigate('/'); // Navigate to home page after logout
  };

  return (
    <div className="home-container">
      <header className="home-header">
        <div className="nav-container">
          <div className="nav-logo">Community Tracker</div>
          <button className="menu-toggle" onClick={toggleMenu}>
            ☰
          </button>
          <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
            {/* Show Login and Sign Up only when no user is logged in */}
            {!user ? (
              <>
                <li><Link to="/login-selection" className="home-link">Login</Link></li>
                <li><Link to="/register" className="home-link">Sign Up</Link></li>
              </>
            ) : (
              // Show Profile and Logout when user is logged in
              <>
                <li><Link to="/profile" className="home-link">Profile</Link></li>
                <li><button onClick={handleLogout} className="home-link">Logout</button></li>
                
                {/* Show these links only when logged in */}
                <li><Link to="/report" className="home-link">Report an Issue</Link></li>
                <li><Link to="/admin" className="home-link">Admin Dashboard</Link></li>
                <li><Link to="/tracker" className="home-link">Tracker</Link></li>
                <li><Link to="/iss" className="home-link">Issuereported</Link></li>
              </>
            )}
          </ul>
        </div>
      </header>

      <main className="home-main">
        <p>
          Empowering communities to report and resolve issues efficiently. 
          Join us in making a difference by addressing community challenges together!
        </p>
      </main>
    </div>
  );
}

export default Home;
