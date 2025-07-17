// src/components/AppInfoSection.js
import React from 'react';
import '../styles/AppInfoSection.css';
import downloadIcon from '../assets/downloadIcon.png';
import worshiperIcon from '../assets/worshiperIcon.png';
import pujaIcon from '../assets/pujaIcon.png';
import templeIcon from '../assets/templeIcon.png';
import '../styles/AppInfoSection.css';


const AppInfoSection = () => {
  return (
    <section className="app-info-section">
      <div className="app-info-left">
        <p className="subheading">Trusted by more than 300k devotees in India and over 10k NRIs.</p>
        <h2>The Devotional & Astrology App<br />cherished by many in India.</h2>
        <p className="description">
          We embark on a mission to support one billion Indians in their spiritual and devotional endeavors,
          leading them toward a state of happiness, peace, and contentment.
        </p>
      </div>
      <div className="app-info-right">
        <div className="info-item">
          <img src={downloadIcon} alt="Downloads" />
          <h4>50000+ Downloads</h4>
          <p>Building Trust, One Crore Users Strong: Your Journey, Our Commitment!</p>
        </div>
        <div className="info-item">
          <img src={worshiperIcon} alt="Worshipers" />
          <h4>350000+ Worshipers</h4>
          <p>Have placed their trust in us during their spiritual journey.</p>
        </div>
        <div className="info-item">
          <img src={pujaIcon} alt="Pujas" />
          <h4>100000+ Puja's</h4>
          <p>Countless worshipers seek divine blessings at top Indian temples through our platform.</p>
        </div>
        <div className="info-item">
          <img src={templeIcon} alt="Temples" />
          <h4>800+ Temples</h4>
          <p>Have placed their trust in over 800+ active temples and devoted priests.</p>
        </div>
      </div>
    </section>
  );
};

export default AppInfoSection;

