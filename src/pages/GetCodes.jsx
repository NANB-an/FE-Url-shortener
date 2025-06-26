import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { getAuthHeader } from '../utils/authHeader';

const GetCodes = () => {
  const [codes, setCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCodes = async () => {
      try {
        const headers = await getAuthHeader(); // ✅ use the utility
        const response = await axios.get('http://127.0.0.1:8000/api/getcodes', {
          headers: {
            ...headers,
            Accept: 'application/json',
          },
        });
        setCodes(response.data);
      } catch (err) {
        if (err.response?.status === 401) {
          window.location.href = '/login'; // optional: redirect if unauthorized
        } else {
          setError(err.response?.data?.message || 'Network error');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCodes();
  }, []);

  if (loading) return <p>Loading codes...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Your Short Codes</h2>
      <ul>
        {codes.map((code, index) => (
          <li key={index}>
            <Link to={`/stats/${code}`}>{code}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GetCodes;
