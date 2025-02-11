import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import LoginSelection from './components/LoginSelection';
import UserLogin from './components/UserLogin';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import Register from './components/Register';
import ReportIssue from './components/ReportIssue';
import { AuthProvider } from './context/AuthContext'; 
import LocationPage from './components/LocationPage';
import Tracker from './components/Tracker';
import IssueReported from './components/IssueReported';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login-selection" element={<LoginSelection />} />
            <Route path="/user-login" element={<UserLogin />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/register" element={<Register />} />
            <Route path="/report" element={<ReportIssue />} />
            <Route path="/location" element={<LocationPage />} />
            <Route path="/tracker" element={<Tracker/>} />
            <Route path="/iss" element={<IssueReported/>} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
