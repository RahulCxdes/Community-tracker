import React from 'react';
import { Link } from 'react-router-dom';
// import './LoginSelection.css';

function LoginSelection() {
  return (
    <div className="login-selection-container">
      <h2>Choose Login Type</h2>
      <div className="login-buttons">
        <Link to="/user-login" className="login-button">User Login</Link>
        <Link to="/admin-login" className="login-button">Admin Login</Link>
      </div>
    </div>
  );
}

export default LoginSelection;
