import React, { useState } from 'react';
import axios from 'axios';
import { auth } from '../firebase';
import { getAuthHeader } from '../utils/authHeader'; // ✅ Reuse shared auth header function
import Logout from '../pages/Logout';

const Shortener = () => {
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [code, setCode] = useState('');
  const [stats, setStats] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const headers = await getAuthHeader();

      const response = await axios.post(
        'https://be-url-shortener.onrender.com/api/shorten',
        { url },
        { headers }
      );

      const short = response.data.short_url;
      const shortCode = response.data.code;

      setShortUrl(short);
      setCode(shortCode);

      fetchStats(shortCode, headers);
    } catch (error) {
      console.error('Error creating short URL:', error.response?.data || error.message);
    }
  };

  const fetchStats = async (shortCode, headersOverride = null) => {
    try {
      const headers = headersOverride || await getAuthHeader();

      const response = await axios.get(
        `https://be-url-shortener.onrender.com/api/stats/${shortCode}`,
        { headers }
      );

      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error.response?.data || error.message);
    }
  };

  const handleRefresh = () => {
    if (code) fetchStats(code);
  };

  return (
    <div>
      <h2>Logout</h2>
      {auth.currentUser && (
        <button onClick={Logout}>Logout</button>
      )}

      <h2>URL Shortener</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter URL"
          required
        />
        <button type="submit">Shorten</button>
      </form>

      {shortUrl && (
        <div>
          <p>Short URL: <a href={shortUrl} target="_blank" rel="noreferrer">{shortUrl}</a></p>
          <button onClick={handleRefresh}>🔄 Refresh Stats</button>
        </div>
      )}

      {stats && (
        <div>
          <h3>Stats:</h3>
          <p><strong>Total Clicks:</strong> {stats.total_clicks}</p>

          <h4>By Country:</h4>
          <ul>
            {Object.entries(stats.by_country).map(([country, count]) => (
              <li key={country}>{country}: {count}</li>
            ))}
          </ul>

          <h4>By Referrer:</h4>
          <ul>
            {Object.entries(stats.by_referrer).map(([ref, count]) => (
              <li key={ref}>{ref}: {count}</li>
            ))}
          </ul>

          <h4>Timestamps:</h4>
          <ul>
            {stats.timestamps.map((ts, i) => (
              <li key={i}>{ts}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Shortener;
