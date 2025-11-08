import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ACCESS_TOKEN } from '../constants';
import '../styles/header.css';

export default function Header() {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem(ACCESS_TOKEN);

  const handleLogout = () => {
    localStorage.removeItem(ACCESS_TOKEN);
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <Link to="/" className="logo">JobFinder</Link>
          <nav className="nav-links">
            {isAuthenticated ? (
              <>
                <Link to="/">Jobs</Link>
                <Link to="/companies">Companies</Link>
                <Link to="/create-business">Create Business</Link>
                <Link to="/my-applications">My Applications</Link>
                <Link to="/post-job">Post a Job</Link>
              </>
            ) : null}
          </nav>
        </div>
        
        <div className="header-right">
          {isAuthenticated ? (
            <>
              <Link to="/profile" className="profile-link">Profile</Link>
              <button onClick={handleLogout} className="auth-button">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="auth-button">Login</Link>
              <Link to="/register" className="auth-button signup">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}