// src/components/ContactUs.js
import React from 'react';

import '../styles/ContactUs.css';  // ✅ correct if CSS is in src/styles/

import bgImage from '../assets/bac.webp'; // Make sure the image is placed here

const ContactUs = () => {
  return (
    <div className="contact-wrapper">
      <div className="background-image">
        <img src={bgImage} alt="Shiva" />
      </div>

      <div className="contact-card">
        <div className="form-side">
          <h2>Contact Us</h2>
          <form>
            <input type="text" placeholder="Enter your Name" required />
            <input type="email" placeholder="Enter a valid email address" required />
            <textarea placeholder="Enter your message" rows="4" required></textarea>
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>

      <div className="info-card">
        <div>
          <h4>📍ADDRESS</h4>
          <p>CTS NO 4824/C7,<br />S P OFFICE ROAD, BELAGAVI,<br />Karnataka, 590016</p>
        </div>
        <div>
          <h4>📞 CALL US</h4>
          <p>+91 8951 269 111<br />+91 8296 443 111</p>
        </div>
        <div>
         <h4>📧 EMAIL</h4>
    <p>info@devalayas.com</p>
        </div>
      </div>
    </div>
     
  );
};

export default ContactUs;
