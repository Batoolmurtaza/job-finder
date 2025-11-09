import React, { useEffect, useState } from 'react';
import api from '../api';
import '../styles/applications.css';

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      try {
        const res = await api.get('/api/applications/');
        setApplications(res.data);
      } catch (err) {
        setError(err.message || 'Could not fetch applications');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  if (loading) return <div>Loading applications...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="applications-page">
      <h2>My Applications</h2>
      <div className="applications-list">
        {applications.map(app => (
          <div key={app.id} className="application-card">
            <div className="application-header">
              <h3>{app.job_title}</h3>
              <span className={`status status-${app.status}`}>{app.status}</span>
            </div>
            <div className="application-details">
              <p><strong>Applied:</strong> {new Date(app.created_at).toLocaleDateString()}</p>
              {app.cover_letter && (
                <div className="cover-letter">
                  <strong>Cover Letter:</strong>
                  <p>{app.cover_letter}</p>
                </div>
              )}
            </div>
          </div>
        ))}
        {applications.length === 0 && (
          <p className="no-applications">You haven't submitted any applications yet.</p>
        )}
      </div>
    </div>
  );
}