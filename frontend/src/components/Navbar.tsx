import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container container">
        <div className="navbar-left">
          <Link to="/" className="navbar-logo">
            Launchpad
          </Link>
          <div className="navbar-links">
            <Link to="/explore" className="nav-link active">Explore</Link>
            <Link to="/share" className="nav-link">Share Project</Link>
          </div>
        </div>
        
        <div className="navbar-right">
          <div className="search-bar">
            <svg 
              className="search-icon" 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input type="text" placeholder="Search projects..." />
          </div>
          <Link to="/signin" className="nav-link sign-in">Sign In</Link>
          <Link to="/signup" className="btn btn-primary">Sign Up</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
