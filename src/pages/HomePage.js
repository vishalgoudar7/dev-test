import React from 'react';
import bannerImage from '../assets/banner.png';
import '../styles/HomePage.css';
import '../styles/CardSection.css';
import TempleList from '../components/TempleList';
import carouselImage from '../assets/11.jpg';
import carouselImage1 from '../assets/22.jpg';
import carouselImage2 from '../assets/33.jpg';
import googlePlay from '../assets/googlePlay.png';
import appStore from '../assets/appStore.png';

const HomePage = () => {
  return (
    <>
      <div className="homepage">
        <div className="homepage-row">
          {/* Left: Carousel */}
          <div className="homepage-left">
            <h2 className="section-title">Ongoing Event's</h2>
            <div className="event-carousel-box">
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

          {/* Right: Banner Image and App Buttons */}
          <div className="homepage-right">
            <img src={bannerImage} alt="Phone Display" className="banner-img" />
            <div className="download-buttons">
              <a
                href="https://play.google.com/store/apps/details?id=com.devalaya.devotee"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={googlePlay} alt="Google Play" />
              </a>
              <a
                href="https://play.google.com/store/apps/details?id=com.devalaya.devotee"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={appStore} alt="App Store" />
              </a>
            </div>
          </div>
        </div>

        {/* Temple List */}
        <TempleList />
      </div>
    </>
  );
};

export default HomePage;

