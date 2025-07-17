import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTemples, setSearch } from '../redux/templeSlice';
import { useNavigate } from 'react-router-dom';
import '../styles/TempleList.css';
import { FaMapMarkerAlt } from 'react-icons/fa';

const SkeletonCard = () => (
  <div className="temple-card skeleton">
    <div className="skeleton-img" />
    <div className="skeleton-text title" />
    <div className="skeleton-text location" />
    <div className="skeleton-button" />
  </div>
);

const TempleList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    temples = [],
    loading = false,
    search = ''
  } = useSelector((state) => state.temple || {});

  const [page, setPage] = useState(1);
  const pageSize = 10;
  const BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    dispatch(fetchTemples());
  }, [dispatch]);

  const filteredTemples = temples.filter((temple) =>
    temple.name?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredTemples.length / pageSize);
  const paginated = filteredTemples.slice((page - 1) * pageSize, page * pageSize);

  const handlePageClick = (number) => setPage(number);
  const handlePrev = () => page > 1 && setPage(page - 1);
  const handleNext = () => page < totalPages && setPage(page + 1);

  const getImageUrl = (temple) => {
    if (temple.image_url && temple.image_url !== 'null') {
      return temple.image_url.startsWith('http') ? temple.image_url : `${BASE_URL}${temple.image_url}`;
    }
    if (temple.images && temple.images.length > 0) {
      const img = temple.images[0]?.url || temple.images[0]?.image;
      return img && img !== 'null' ? (img.startsWith('http') ? img : `${BASE_URL}${img}`) : null;
    }
    return 'https://via.placeholder.com/300x200?text=No+Image';
  };

  return (
    <div className="temple-container">
      <h1 className="temple-title">EXPLORE MORE TEMPLES</h1>

      <div className="search-container">
        <input
          type="text"
          className="form-control"
          placeholder="Search Temples..."
          value={search}
          onChange={(e) => dispatch(setSearch(e.target.value))}
        />
        <button className="btn btn-primary" style={{ backgroundColor: '#ff5722', borderColor: '#ff5722' }}>
          SEARCH
        </button>
      </div>

      <div className="temple-grid">
        {loading
          ? Array(10).fill(0).map((_, idx) => <SkeletonCard key={idx} />)
          : paginated.map((temple) => (
              <div key={temple.id} className="temple-card">
                <img
                  src={getImageUrl(temple)}
                  alt={temple.name}
                  onClick={() => navigate(`/Temples/${temple.id}`)}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                  }}
                />
                <div className="card-body">
                  <h5 className="card-title">{temple.name}</h5>
                  <p className="temple-location">
                    <FaMapMarkerAlt className="location-icon" />{' '}
                    {temple.district || temple.taluk || 'Unknown Location'}
                  </p>
                  <button className="btn btn-outline-primary" onClick={() => navigate(`/Temples/${temple.id}`)}>
                    PARTICIPATE
                  </button>
                </div>
              </div>
            ))}
      </div>

      {!loading && (
        <div className="pagination-container" style={{ display: 'flex', gap: 8, justifyContent: 'center', alignItems: 'center' }}>
          <button className="btn btn-outline-danger btn-sm" onClick={handlePrev} disabled={page === 1}>Prev</button>
          {(() => {
            let start = Math.max(1, page - 1);
            let end = Math.min(totalPages, page + 1);
            if (page === 1) end = Math.min(totalPages, 3);
            if (page === totalPages) start = Math.max(1, totalPages - 2);
            const pages = [];
            for (let i = start; i <= end; i++) pages.push(i);
            return pages.map((num) => (
              <button
                key={num}
                onClick={() => handlePageClick(num)}
                className={`btn btn-sm ${page === num ? 'btn-danger' : 'btn-outline-primary'}`}
              >
                {num}
              </button>
            ));
          })()}
          <button className="btn btn-outline-danger btn-sm" onClick={handleNext} disabled={page === totalPages}>Next</button>
        </div>
      )}
    </div>
  );
};

export default TempleList;
