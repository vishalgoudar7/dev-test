// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import api from '../api/api';
// import '../styles/PujaList.css';

// const PujaList = () => {
//   const [pujas, setPujas] = useState([]);
//   const [filteredPujas, setFilteredPujas] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [searchTerm, setSearchTerm] = useState('');
//   const navigate = useNavigate();
//   const BASE_URL = process.env.REACT_APP_API_BASE_URL || '';

//   useEffect(() => {
//     const fetchPujas = async () => {
//       try {
//         const response = await api.get('/api/v1/devotee/pooja/');
//         const pujaList = response.data?.results || [];
//         setPujas(pujaList);
//         setFilteredPujas(pujaList);
//         localStorage.setItem('pujas', JSON.stringify(pujaList));
//       } catch (err) {
//         console.error('API Error:', err);
//         setError('Failed to load puja list');
//       } finally {
//         setLoading(false);
//       }
//     };

//     // Small timeout to ensure token is applied (avoids pending state)
//     setTimeout(fetchPujas, 100); 
//   }, []);

//   const getImageUrl = (imagePath) => {
//     if (!imagePath) return null;
//     return imagePath.startsWith('http') ? imagePath : `${BASE_URL}${imagePath}`;
//   };

//   const handlePujaClick = (id) => {
//     navigate(`/puja/${id}`);
//   };

//   const handleSearch = () => {
//     const filtered = pujas.filter((puja) =>
//       puja.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       puja.included?.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//     setFilteredPujas(filtered);
//   };

//   return (
//     <div className="puja-list-container">
//       <h2 className="puja-heading">AVAILABLE PUJA'S</h2>

//       <div className="search-box">
//         <input
//           type="text"
//           placeholder="Search Pujas..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="search-input"
//         />
//         <button onClick={handleSearch} className="search-button">
//           Search
//         </button>
//       </div>

//       {error && <p className="error">{error}</p>}

//       <div className="puja-cards">
//         {loading ? (
//           [...Array(6)].map((_, index) => (
//             <div className="puja-card skeleton" key={index}>
//               <div className="puja-image skeleton-img" />
//               <h3 className="skeleton-text">Loading...</h3>
//               <p className="skeleton-text">Fetching description...</p>
//               <p className="skeleton-text">Loading price...</p>
//               <button className="book-button skeleton-button">Loading...</button>
//             </div>
//           ))
//         ) : filteredPujas.length === 0 ? (
//           <p>No Pujas found for the search term.</p>
//         ) : (
//           filteredPujas.map((puja) => (
//             <div
//               className="puja-card"
//               key={puja.id}
//               onClick={() => handlePujaClick(puja.id)}
//             >
//               {puja.images && puja.images[0]?.image ? (
//                 <img
//                   src={getImageUrl(puja.images[0].image)}
//                   alt={puja.name}
//                   className="puja-image"
//                   loading="lazy"
//                   onError={(e) => {
//                     e.target.onerror = null;
//                     e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
//                   }}
//                 />
//               ) : (
//                 <div className="no-image">No Image</div>
//               )}
//               <h3>{puja.name || 'Untitled Puja'}</h3>
//               <p>{puja.included || 'No description available.'}</p>
//               <p><strong>Price:</strong> ₹{puja.cost || 'N/A'}</p>
//               <button className="book-button">PARTICIPATE</button>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default PujaList;









import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../api/api';
import '../styles/PujaList.css';

const PujaList = () => {
  const [pujas, setPujas] = useState([]);
  const [filteredPujas, setFilteredPujas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const BASE_URL = process.env.REACT_APP_API_BASE_URL || '';

  // Get temple id from URL query param ?temple=1
  const templeId = searchParams.get('temple');

  useEffect(() => {
    const fetchPujas = async () => {
      try {
        let url = '/api/v1/devotee/pooja/';
        if (templeId) {
          url += `?temple=${templeId}`;
        }
        const response = await api.get(url);
        const pujaList = response.data?.results || [];
        setPujas(pujaList);
        setFilteredPujas(pujaList);
        localStorage.setItem('pujas', JSON.stringify(pujaList));
      } catch (err) {
        console.error('API Error:', err);
        setError('Failed to load puja list');
      } finally {
        setLoading(false);
      }
    };

    setTimeout(fetchPujas, 100);
  }, [templeId]);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    return imagePath.startsWith('http') ? imagePath : `${BASE_URL}${imagePath}`;
  };

  const handlePujaClick = (id) => {
    navigate(`/puja/${id}`);
  };

  const handleSearch = () => {
    const filtered = pujas.filter((puja) =>
      (puja.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      puja.included?.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredPujas(filtered);
  };

  return (
    <div className="puja-list-container">
      <h2 className="puja-heading">AVAILABLE PUJA'S</h2>

      <div className="search-box">
        <input
          type="text"
          placeholder="Search Pujas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <button onClick={handleSearch} className="search-button">
          Search
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      <div className="puja-cards">
        {loading ? (
          [...Array(6)].map((_, index) => (
            <div className="puja-card skeleton" key={index}>
              <div className="puja-image skeleton-img" />
              <h3 className="skeleton-text">Loading...</h3>
              <p className="skeleton-text">Fetching description...</p>
              <p className="skeleton-text">Loading price...</p>
              <button className="book-button skeleton-button">Loading...</button>
            </div>
          ))
        ) : filteredPujas.length === 0 ? (
          <p>No Pujas found for the search term.</p>
        ) : (
          filteredPujas.map((puja) => (
            <div
              className="puja-card"
              key={puja.id}
              onClick={() => handlePujaClick(puja.id)}
            >
              {puja.images && puja.images[0]?.image ? (
                <img
                  src={getImageUrl(puja.images[0].image)}
                  alt={puja.name}
                  className="puja-image"
                  loading="lazy"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                  }}
                />
              ) : (
                <div className="no-image">No Image</div>
              )}
              <h3>{puja.name || 'Untitled Puja'}</h3>
              <p>{puja.included || 'No description available.'}</p>
              <p><strong>Price:</strong> ₹{puja.cost || 'N/A'}</p>
              <button className="book-button">PARTICIPATE</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PujaList;
