import React from 'react';
import { useNavigate } from 'react-router-dom';
import SplPuja1 from '../assets/Spl_puja1.png';
import SplPuja2 from '../assets/Spl_puja2.png';
import SplPuja3 from '../assets/Spl_puja3.png';
import SplPuja4 from '../assets/Spl_puja4.png';
import SplPuja5 from '../assets/Spl_puja5.png';
import '../styles/SpecialPujaSection.css';

const SpecialPujaSection = () => {
  const navigate = useNavigate();

  const splTitles = ['Festival Pujas', 'Dosha Nivaran', 'Shanti/Vrat', 'Deity Pujas', 'Remedies'];

  const viewsplPooja = (id) => {
    console.log('Puja clicked:', id);
    navigate(`/puja/${id}`);
  };

  const pujaData = [
    { id: 1, title: splTitles[0], img: SplPuja1 },
    { id: 2, title: splTitles[1], img: SplPuja2 },
    { id: 3, title: splTitles[2], img: SplPuja3 },
    { id: 4, title: splTitles[3], img: SplPuja4 },
    { id: 5, title: splTitles[4], img: SplPuja5 },
  ];

  return (
    <section className="special-do_section layout_padding">
      <div className="container">
        <div className="special-heading_container">
          <h2>SPECIAL PUJA'S</h2>
          <p>
            Experience the magic of a special puja, an enchanting ritual that elevates the spirit and brings blessings into your life.
          </p>
        </div>
        <div className="special-do_container">
          {pujaData.map((puja, index) => (
            <div className="special-puja-card" key={index}>
              <button
                type="button"
                onClick={() => viewsplPooja(puja.id)}
                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                className="special-puja-link"
              >
                <img src={puja.img} className="special-img-box" alt={`Puja ${puja.id}`} />
              </button>
              <div className="special-detail-box">
                <h6>{puja.title}</h6>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SpecialPujaSection;

