// src/pages/GetCodes.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { getAuthHeader } from '../utils/authHeader';
import Header from '../components/Header';
import { QRCodeSVG } from 'qrcode.react';
import { showSuccess, showError } from "../utils/toast";
import '../styles/GetCodes.css';

const GetCodes = () => {
  const [codes, setCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const baseUrl = 'https://be-url-shortener.onrender.com/r/';

  useEffect(() => {
    const fetchCodes = async () => {
      try {
        const headers = await getAuthHeader();
        const response = await axios.get(
          'https://be-url-shortener.onrender.com/api/getcodes',
          { headers: { ...headers, Accept: 'application/json' } }
        );
        setCodes(response.data);
      } catch (err) {
        if (err.response?.status === 401) {
          window.location.href = '/login';
        } else {
          setError(err.response?.data?.message || 'Network error');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCodes();
  }, []);

  const handleCopy = (url) => {
    navigator.clipboard.writeText(url).then(() => {
      showSuccess('Short link copied to clipboard!');
    }).catch(err => {
      showError('Failed to copy link.');
      console.error(err);
    });
  };

  return (
    <>
      <Header />

      <div className="codes-container">
        <h2 className="codes-title">Your Short Codes</h2>

        {loading && <p className="codes-status">Loading codes...</p>}
        {error && <p className="codes-status error">Error: {error}</p>}

        {!loading && !error && codes.length > 0 && (
          <table className="codes-table">
            <thead>
              <tr>
                <th>Short Code</th>
                <th>Original URL</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {codes.map((item, index) => {
                const shortUrl = `${baseUrl}${item.short_code}`;
                return (
                  <tr key={index}>
                    <td data-label="Short Code">
                      <Link to={`/stats/${item.short_code}`}>{item.short_code}</Link>
                    </td>
                    <td data-label="Original URL">
                      <a href={item.original_url} target="_blank" rel="noopener noreferrer">
                        {item.original_url.length > 60
                          ? `${item.original_url.slice(0, 60)}…`
                          : item.original_url}
                      </a>
                    </td>
                    <td data-label="Actions">
                      <button
                        onClick={() => handleCopy(shortUrl)}
                        className="copy-btn"
                      >
                        Copy Link
                      </button>
                      <div className="qr-code">
                        <QRCodeSVG value={shortUrl} size={64} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {!loading && !error && codes.length === 0 && (
          <p className="codes-status">No codes found.</p>
        )}
      </div>
    </>
  );
};

export default GetCodes;
