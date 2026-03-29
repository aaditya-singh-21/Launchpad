import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">Launchpad</Link>
          <p className="copyright">&copy; 2024 Launchpad. Crafted for developers.</p>
        </div>
        
        <div className="footer-column">
          <p className="footer-heading">Platform</p>
          <ul className="footer-links">
            <li><Link to="/about">About</Link></li>
            <li><Link to="/web-apps">Web Apps</Link></li>
            <li><Link to="/mobile">Mobile</Link></li>
          </ul>
        </div>
        
        <div className="footer-column">
          <p className="footer-heading">Resources</p>
          <ul className="footer-links">
            <li><Link to="/ai-tools">AI Tools</Link></li>
            <li><Link to="/open-source">Open Source</Link></li>
          </ul>
        </div>
        
        <div className="footer-column">
          <p className="footer-heading">Legal</p>
          <ul className="footer-links">
            <li><Link to="/terms">Terms</Link></li>
            <li><Link to="/privacy">Privacy</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
