import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import incubatedAt from '../assets/3.png';
import supported1 from '../assets/digitalindia-logo.jpg';
import supported2 from '../assets/2.png';
import winnerOf from '../assets/1.png';
import supported3 from '../assets/3.png';
import supported4 from '../assets/4.jpeg';
import supported5 from '../assets/5.jpeg';
import supported6 from '../assets/6.png';
import '../styles/Footer.css';

import { FaPhoneAlt, FaEnvelope, FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-wrapper">
        
        {/* Top Section */}
        <div className="footer-top">

          {/* Logo Column */}
          <div className="footer-column logo-column">
            <img className="footer-logo" src={logo} alt="Devalaya Logo" />
            <h6 className="footer-tagline">With Trust & Devotion</h6>
            <p className="about-text">
              DEVALAYA is an innovative spiritual tech platform to fulfill the needs of Devotees & Pandit jis across the globe.
              We aim to bring local traditions to the global stage to preserve rituals in the modern age.
            </p>
          </div>

          {/* Support Section */}
          <div className="footer-column">
            <h5>Support</h5>
            <div className="footer-links">
              <Link to="/TermsAndConditions">Terms & Conditions</Link>
              <Link to="/CancellationPolicy">Cancellation Policy</Link>
              <Link to="/RefundPolicy">Refund Policy</Link>
              <Link to="/PrivacyPolicy">Privacy Policy</Link>
            </div>
          </div>

          {/* Contact Section with Icons */}
          <div className="footer-column">
            <h5>Contact</h5>
            <p><FaPhoneAlt style={{ marginRight: '8px' }} /> +91 8951269111</p>
            <p><FaEnvelope style={{ marginRight: '8px' }} /> info@devalayas.com</p>
            <div className="social-icons">
              <a href="https://facebook.com/devalayaonlinepujaapp/" target="_blank" rel="noreferrer">
                <FaFacebookF />
              </a>
              <a href="https://twitter.com/devalayas_app" target="_blank" rel="noreferrer">
                <FaTwitter />
              </a>
              <a href="http://linkedin.com/in/devalayaonlinepujaapp" target="_blank" rel="noreferrer">
                <FaLinkedinIn />
              </a>
              <a href="https://instagram.com/devalaya_app/" target="_blank" rel="noreferrer">
                <FaInstagram />
              </a>
              <a href="https://youtube.com/channel/UCRcWjnz7ybHWy2DfxlHlBpw" target="_blank" rel="noreferrer">
                <FaYoutube />
              </a>
            </div>
          </div>
        </div>

        {/* Honors Row */}
        <div className="footer-honors-row">
          <div className="honor-item">
            <h4>Incubated At</h4>
            <img src={incubatedAt} alt="Incubated At" />
          </div>
          <div className="honor-item">
            <h4>Supported By</h4>
            <div className="supported-logos">
              <img src={supported1} alt="Supported 1" />
              <img src={supported2} alt="Supported 2" />
              <img src={supported3} alt="Supported 3" />
              <img src={supported4} alt="Supported 4" />
              <img src={supported5} alt="Supported 5" />
              <img src={supported6} alt="Supported 6" />
            </div>
          </div>
          <div className="honor-item">
            <h4>Winner Of</h4>
            <img src={winnerOf} alt="Winner Of" />
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          © {new Date().getFullYear()} <a href="https://www.devalayas.in/" target="_blank" rel="noreferrer">Devalaya</a>. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;

