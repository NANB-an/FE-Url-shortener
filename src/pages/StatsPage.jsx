import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { getAuthHeader } from '../utils/authHeader';
import Header from '../components/Header';
import '../styles/StatsPage.css';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const StatsPage = () => {
  const { code } = useParams();
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);

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

        const cleanTimestamps = response.data.timestamps.filter(Boolean);

        setStats({
          ...response.data,
          timestamps: cleanTimestamps,
        });

        // Process timestamps for chart
        const dateCounts = {};
        cleanTimestamps.forEach(ts => {
          const date = new Date(ts).toISOString().split('T')[0];
          dateCounts[date] = (dateCounts[date] || 0) + 1;
        });

        const sortedData = Object.entries(dateCounts)
          .sort(([a], [b]) => new Date(a) - new Date(b))
          .map(([date, count]) => ({ date, count }));

        setChartData(sortedData);

      } catch (err) {
        if (err.response?.status === 401) {
          window.location.href = '/login';
        } else {
          setError(err.response?.data?.message || 'Error loading stats');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [code]);

  if (loading) return <p className="stats-status">Loading stats...</p>;
  if (error) return <p className="stats-status error">Error: {error}</p>;

  return (
    <>
      <Header />

      <div className="stats-container">
        <h2 className="stats-title">
          Stats for <span className="code">{code}</span>
        </h2>

        <p>
          <strong>Original URL:</strong>{' '}
          <a href={stats.original_url} target="_blank" rel="noopener noreferrer">
            {stats.original_url.length > 60
                      ? `${stats.original_url.slice(0, 60)}…`
                      : stats.original_url}
          </a>
        </p>

        <p><strong>Total Clicks:</strong> {stats.total_clicks}</p>

        <h3>By Country</h3>
        <table className="stats-table">
          <thead>
            <tr>
              <th>Country</th>
              <th>Clicks</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(stats.by_country).map(([country, count]) => (
              <tr key={country}>
                <td>{country}</td>
                <td>{count}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3>By Referrer</h3>
        <table className="stats-table">
          <thead>
            <tr>
              <th>Referrer</th>
              <th>Clicks</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(stats.by_referrer).map(([referrer, count]) => (
              <tr key={referrer}>
                <td>{referrer}</td>
                <td>{count}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3>Clicks Over Time</h3>
        <div className="chart-wrapper">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#007bff" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p>No clicks yet to display in chart.</p>
          )}
        </div>

        
      </div>
    </>
  );
};

export default StatsPage;
