// src/components/OngoingEvents.js
import React from 'react';
import Slider from 'react-slick';
import '../styles/OngoingEvents.css';
import moment from 'moment';

const OngoingEvents = ({ events, viewEvent }) => {
  const settings = {
    dots: true,
    infinite: false,
    autoplay: true,
    autoplaySpeed: 300,
    speed: 200,
    slidesToShow: window.innerWidth >= 768 ? 1 : 1,
    slidesToScroll: 1,
  };

  if (!events || events.length === 0) return null;

  return (
    <section className="do_section">
      <Slider {...settings}>
        {events.map((item, index) =>
          item.event_devotee ? (
            <div className="carousel-item-wrapper" key={index}>
              <div className="event-card">
                <div className="image-wrapper">
                  <img
                    src={item.temple.images[0]?.image}
                    alt={item.pooja.name}
                    className="event-img"
                  />
                  <div className="caption">
                    <div className="title">{item.pooja.name}</div>
                    <div className="subtitle">{item.pooja.details}</div>
                  </div>
                </div>
                <div className="footer" onClick={() => viewEvent(item.name)}>
                  <div className="date">{moment(item.end).format('MMMM Do')}</div>
                  <div className="details">
                    View Details <i className="fa fa-arrow-right" />
                  </div>
                </div>
              </div>
            </div>
          ) : null
        )}
      </Slider>
    </section>
  );
};

export default OngoingEvents;




