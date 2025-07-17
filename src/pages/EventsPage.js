import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import '../styles/EventsPage.css';
import moment from 'moment';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://beta.devalayas.com';

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Using the correct events API endpoint
        const response = await api.get('/api/v1/devotee/event/');
        const eventList = response.data?.results || [];
        setEvents(eventList);
        setFilteredEvents(eventList);
        localStorage.setItem('events', JSON.stringify(eventList));
      } catch (err) {
        console.error('API Error:', err);
        setError('Failed to load events list');
        // Fallback to mock data for demonstration
        const mockEvents = [
          {
            id: 1,
            name: 'Diwali Celebration',
            details: 'Grand Diwali celebration with special pujas and festivities',
            start: '2024-11-12T18:00:00',
            end: '2024-11-12T22:00:00',
            temple: { 
              name: 'Sri Krishna Temple',
              images: [{ image: 'https://via.placeholder.com/300x200?text=Diwali+Event' }]
            }
          },
          {
            id: 2,
            name: 'Navratri Festival',
            details: 'Nine days of devotional celebration with dance and music',
            start: '2024-10-15T18:00:00',
            end: '2024-10-24T22:00:00',
            temple: { 
              name: 'Durga Mata Temple',
              images: [{ image: 'https://via.placeholder.com/300x200?text=Navratri+Event' }]
            }
          },
          {
            id: 3,
            name: 'Ganesh Chaturthi',
            details: 'Celebration of Lord Ganesha with special prayers and offerings',
            start: '2024-09-07T18:00:00',
            end: '2024-09-07T22:00:00',
            temple: { 
              name: 'Ganesh Temple',
              images: [{ image: 'https://via.placeholder.com/300x200?text=Ganesh+Event' }]
            }
          }
        ];
        setEvents(mockEvents);
        setFilteredEvents(mockEvents);
      } finally {
        setLoading(false);
      }
    };

    setTimeout(fetchEvents, 100);
  }, []);

  const getImageUrl = (event) => {
    if (event.temple?.images && event.temple.images.length > 0) {
      const imagePath = event.temple.images[0].image;
      return imagePath.startsWith('http') ? imagePath : `${BASE_URL}${imagePath}`;
    }
    return 'https://via.placeholder.com/300x200?text=Event+Image';
  };

  const handleEventClick = (eventName) => {
    // Navigate to event details page using event name as ID
    navigate(`/events/${encodeURIComponent(eventName)}`);
  };

  const handleSearch = () => {
    const filtered = events.filter((event) =>
      event.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.details?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.temple?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEvents(filtered);
  };

  const formatDateRange = (startDate, endDate) => {
    const start = moment(startDate);
    const end = moment(endDate);
    
    if (start.isSame(end, 'day')) {
      return start.format('MMMM Do, YYYY');
    } else {
      return `${start.format('MMM Do')} - ${end.format('MMM Do, YYYY')}`;
    }
  };

  return (
    <div className="events-list-container">
      <h2 className="events-heading">EXPLORE MORE EVENTS</h2>

      <div className="search-box">
        <input
          type="text"
          placeholder="Search Events..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <button onClick={handleSearch} className="search-button">
          Search
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      <div className="events-cards">
        {loading ? (
          [...Array(6)].map((_, index) => (
            <div className="event-card skeleton" key={index}>
              <div className="event-image skeleton-img" />
              <h3 className="skeleton-text">Loading...</h3>
              <p className="skeleton-text">Fetching description...</p>
              <p className="skeleton-text">Loading date...</p>
              <button className="view-button skeleton-button">Loading...</button>
            </div>
          ))
        ) : filteredEvents.length === 0 ? (
          <p>No Events found for the search term.</p>
        ) : (
          filteredEvents.map((event) => (
            <div
              className="event-card"
              key={event.id}
              onClick={() => handleEventClick(event.name)}
            >
              <img
                src={getImageUrl(event)}
                alt={event.name}
                className="event-image"
                loading="lazy"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/300x200?text=Event+Image';
                }}
              />
              <div className="event-content">
                <h3>{event.name || 'Untitled Event'}</h3>
                <p className="event-description">{event.details || 'No description available.'}</p>
                <p className="event-date">
                  <strong>Date:</strong> {event.start && event.end ? formatDateRange(event.start, event.end) : 'Date TBA'}
                </p>
                {event.temple && (
                  <p className="event-temple">
                    <strong>Temple:</strong> {event.temple.name}
                  </p>
                )}
                {event.pooja && (
                  <p className="event-pooja">
                    <strong>Pooja:</strong> {event.pooja.name}
                  </p>
                )}
                <button className="view-button">VIEW DETAILS</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EventsPage;
