import React from 'react';
import API from '../api/axios';

export default function Dashboard() {
  const logout = async () => {
    try {
      await API.post('/logout');
      localStorage.removeItem('token');
      alert('Logged out');
      window.location.href = '/login';
    } catch (err) {
      alert('Logout failed');
    }
  };

  return (
    <div>
      <h2>Dashboard</h2>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
