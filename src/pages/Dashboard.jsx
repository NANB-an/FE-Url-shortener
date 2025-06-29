import React from 'react';
import Header from '../components/Header'; // ✅ Add Header
import '../styles/Dashboard.css';

const Dashboard = () => {
  return (
    <>
      <Header /> {/* ✅ Include header */}
      <div className="dashboard-container">
        <h1>Welcome to the URL Shortener!</h1>
        <p>Use this simple tool to shorten your links and track stats.</p>
        
      </div>
    </>
  );
};

export default Dashboard;
