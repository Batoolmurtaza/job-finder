import { React, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ACCESS_TOKEN } from '../constants';
import { getUserDetail } from '../api';
import '../styles/header.css';

export default function Header() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem(ACCESS_TOKEN));
  const [user, setUser] = useState(null)

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };
  
  useEffect(()=>{

    const fetchUser = async () => {

      if (!isAuthenticated) return

      try{
        const userData = await getUserDetail();
        if (userData){
          if (userData.has_business){
            localStorage.setItem("business_id", userData.business)
          }

          setUser(userData)
        }else{
          navigate('/login')
        }
      }catch(error){
        console.log("error fetching user: ", error)
        navigate('/login')
      }
    }

    fetchUser()
  }, [isAuthenticated])

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <Link to="/" className="logo">JobFinder</Link>
          <nav className="nav-links">
            {isAuthenticated ? (
              <>
                <Link to="/">Jobs</Link>
                
                {/* 
                Show view business link if user has a business or 
                else show Create Business link 
                */}
                {user && user.has_business? 
                  <Link to="/view-business">View Business</Link>: 
                  <Link to="/create-business">Create Business</Link>
                }

                <Link to="/my-applications">My Applications (Coming Soon!)</Link>
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