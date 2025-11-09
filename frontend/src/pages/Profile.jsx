import React, { useEffect, useState } from 'react';
import api from '../api';
import '../styles/form.css';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const res = await api.get('/auth/users/me/');
        setUser(res.data);
      } catch (err) {
        setError(err.response?.data || err.message || 'Could not load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading) return <div className="profile-container">Loading profile…</div>;

  if (!user) return <div className="profile-container">No profile data available.</div>;

  return (
    <div className="profile-container">
      <h2>My Profile</h2>
      
      <div className="profile-section">
        <div className="profile-field">
          <label>Full Name</label>
          <p>{user.first_name} {user.last_name}</p>
        </div>

        <div className="profile-field">
          <label>Email</label>
          <p>{user.email}</p>
        </div>

        {/* Display date joined if available */}
        {user.date_joined && (
          <div className="profile-field">
            <label>Member Since</label>
            <p>{new Date(user.date_joined).toLocaleDateString()}</p>
          </div>
        )}
      </div>

      {error && <div className="error-message">{JSON.stringify(error)}</div>}
    </div>
  );
}