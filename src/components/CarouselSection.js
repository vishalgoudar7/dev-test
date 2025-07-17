// src/components/CarouselSection.js
import React from 'react';
import '../styles/CarouselSection.css';
import carouselImage from '../assets/11.jpg';
import carouselImage1 from '../assets/22.jpg';
import carouselImage2 from '../assets/33.jpg';

const CarouselSection = () => {
  return (
    <div className="carousel-wrapper container my-5">
      <div className="heading_container text-center mb-4">
        <h2>Ongoing Event's</h2>
      </div>
      <div className="event-carousel-box p-3 shadow rounded">
        <div id="eventCarousel" className="carousel slide" data-bs-ride="carousel">
          <div className="carousel-inner">
            <div className="carousel-item active">
              <img src={carouselImage} className="d-block w-100" alt="Slide 1" />
            </div>
            <div className="carousel-item">
              <img src={carouselImage1} className="d-block w-100" alt="Slide 2" />
            </div>
            <div className="carousel-item">
              <img src={carouselImage2} className="d-block w-100" alt="Slide 3" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarouselSection;
