import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { getAuthHeader } from '../utils/authHeader';

const StatsPage = () => {
  const { code } = useParams();
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const headers = await getAuthHeader();
        const response = await axios.get(`https://be-url-shortener.onrender.com/api/stats/${code}`, {
          headers: {
            ...headers,
            Accept: 'application/json',
          },
        });
        setStats(response.data);
      } catch (err) {
        if (err.response?.status === 401) {
    
        } else {
          setError(err.response?.data?.message || 'Error loading stats');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [code]);

  if (loading) return <p>Loading stats...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Stats for {code}</h2>
      <p><strong>Total Clicks:</strong> {stats.total_clicks}</p>
      <h3>By Country:</h3>
      <ul>
        {Object.entries(stats.by_country).map(([country, count]) => (
          <li key={country}>{country}: {count}</li>
        ))}
      </ul>
      <h3>By Referrer:</h3>
      <ul>
        {Object.entries(stats.by_referrer).map(([referrer, count]) => (
          <li key={referrer}>{referrer}: {count}</li>
        ))}
      </ul>
      <h3>Timestamps:</h3>
      <ul>
        {stats.timestamps.map((timestamp, idx) => (
          <li key={idx}>{timestamp}</li>
        ))}
      </ul>
    </div>
  );
};

export default StatsPage;
