import React from 'react';
import '../styles/AboutUs.css';

import mainImg from '../assets/ol.png';
import dpiitCert from '../assets/DPIIT-CERTIFICATE.jpg';
import startupCert from '../assets/StartUP-Certificate.jpg';
import elevateCert from '../assets/elevate-Certificate.jpg';

const AboutUs = () => {
  return (
    <div className="About">
      <div className="responsive-container-block bigContainer">
        <div className="responsive-container-block Container bottomContainer">
          <div className="ultimateImg">
            <img className="mainImg" src={mainImg} alt="Main" />
            <div className="purpleBox">
              <p className="purpleText">
                The access to remote temples, Virtual Puja and information about
                Kuladevata in this Devalaya App is Good.
              </p>
              <img
                className="stars"
                src="https://workik-widget-assets.s3.amazonaws.com/widget-assets/images/mp5.svg"
                alt="Stars"
              />
            </div>
          </div>
          <div className="allText bottomText">
            <p className="text-blk headingText">About Us</p>
            <p className="text-blk subHeadingText">With Trust & Devotion</p>

            <p className="text-blk description">
              DEVALAYA is an innovative spiritual tech platform to fulfil the
              needs of Devotee & Pandit ji across the globe, We aim to bring
              local traditions into the global platform, so that the rituals and
              traditions are not lost in the backdrop of modern advancements and
              negligence.
              <br />
              <br />
              The true cultural heritage of India can be witnessed from the
              Indian Temples which are unique infusion of a high architectural
              elements forming the gracious outer appearance and the
              ‘garbha-griha’ or the ‘womb chamber’, housing the deity of the
              temple. The very essence of a temple is believed to have developed
              from the ideology that all things are one and everything is
              associated. The Indian temples suggest contemplations,
              encouragement and further purification of mind and prompt the
              process of self-realisation in devotees; however the preferred
              process is left to the convention of individual devotees. It is to
              experience; this oneness with God and the blissful feeling, every
              Indian visited the temple of their choice and worshipped their
              deity.
              <a
                className="align-items-center button"
                href="https://www.devalayas.in/AboutUs.html"
                target="_blank"
                rel="noopener noreferrer"
              >
                Know more..
              </a>
            </p>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="section-title">
          <h1>Our Certificate's</h1>
        </div>
      </div>

      <div className="cardio">
        <div className="row" style={{ justifyContent: 'flex-start' }}>
          <div className="column">
            <div className="team-img">
              <img
                src={dpiitCert}
                alt="DPIIT Certificate"
                style={{ maxHeight: '250px' }}
              />
            </div>
          </div>
          <div className="column">
            <div className="team-img">
              <img src={startupCert} alt="Startup Certificate" />
            </div>
          </div>
          <div className="column">
            <div className="team-img">
              <img
                src={elevateCert}
                alt="Elevate Certificate"
                style={{ border: '1px solid black', minHeight: '200px' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
   
  );
};

export default AboutUs;
