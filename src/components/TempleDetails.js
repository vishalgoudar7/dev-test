// src/pages/TempleDetails.js
import React, { useEffect, useState } from 'react';
import CartDrawer from './CartDrawer';
import { useParams } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import '../styles/TempleDetails.css';
import api from '../api/api';

const TempleDetails = () => {
  const { id } = useParams();
  const [temple, setTemple] = useState(null);
  const [tabNo, setTabNo] = useState(2);
  const [search, setSearch] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const BASE_IMAGE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const fetchTempleAndPoojas = async () => {
      try {
        const templeRes = await api.get(`/api/v1/devotee/temple/${id}`);

        let prasadamData = [];
        try {
          const prasadamRes = await api.get(`/api/v1/devotee/prasadam/?temple=${id}`);
          prasadamData = prasadamRes.data.results || [];
        } catch (prasadamErr) {
          console.warn('Failed to load prasadam:', prasadamErr);
        }

        const poojaRes = await api.get(`/api/v1/devotee/pooja/?temple=${id}`);

        setTemple({
          ...templeRes.data,
          prasadam: prasadamData,
        });

        setFilteredData(poojaRes.data.results || []);
      } catch (err) {
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTempleAndPoojas();
  }, [id]);

  const handleAddToCart = (item) => {
    let cart = [];

    try {
      cart = JSON.parse(localStorage.getItem('cart')) || [];
    } catch {
      cart = [];
    }

    if (!cart.find((c) => c.id === item.id)) {
      cart.push(item);
      localStorage.setItem('cart', JSON.stringify(cart));
      window.dispatchEvent(new Event('storage'));
    }

    setCartDrawerOpen(true);
  };

  const handleTabSwitch = (tab) => {
    setTabNo(tab);
    setSearch('');
    if (tab === 2) {
      handleSearch('');
    } else {
      setFilteredData([]);
    }
  };

  const handleSearch = async (query = search) => {
    try {
      const res = await api.get(`/api/v1/devotee/pooja/?temple=${id}&search=${query}`);
      setFilteredData(res.data.results || []);
    } catch (err) {
      console.error('Search failed:', err);
    }
  };

  const getFullImageUrl = (imgPath) => {
    if (!imgPath || imgPath === 'null') return require('../assets/Default.png');
    return imgPath.startsWith('http') ? imgPath : `${BASE_IMAGE_URL}${imgPath.startsWith('/') ? '' : '/'}${imgPath}`;
  };

  const renderCards = (data) => {
    const rows = [];
    for (let i = 0; i < data.length; i += 3) {
      rows.push(data.slice(i, i + 3));
    }

    return rows.map((row, rowIdx) => (
      <div className="row" key={rowIdx}>
        {row.map((p) => (
          <div className="col-md-3 mb-2" key={p.id}>
            <div className="card h-100 shadow-sm border-0 rounded-3" style={{ background: '#ffe9d6' }}>
              <div className="card-body d-flex flex-column justify-content-between">
                <h5 className="fw-bold text-danger">🌸 {p.name}</h5>
                <div className="text-center my-3">
                  <img
                    src={getFullImageUrl(p.images?.[0]?.image)}
                    alt={p.name}
                    className="img-fluid rounded"
                    style={{
                      border: '3px solid orange',
                      padding: '6px',
                      borderRadius: '12px',
                      maxHeight: '180px',
                      objectFit: 'contain',
                    }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = require('../assets/Default.png');
                    }}
                  />
                </div>
                <div className="mt-2 small text-dark">
                  <p><strong className="text-danger">Details:</strong><br />{p.details}</p>
                  <p><strong className="text-danger">Includes:</strong><br />{p.included || 'N/A'}</p>
                  <p><strong className="text-danger">Benefits:</strong><br />{p.benefits || '-'}</p>
                  <p><strong className="text-danger">Cost:</strong><br />₹ {p.original_cost || p.cost || 'N/A'} /-</p>
                </div>
                <div className="d-flex justify-content-center mt-3">
                  <button className="btn btn-warning px-4 fw-semibold shadow-sm" onClick={() => handleAddToCart({ ...p, type: 'pooja', cost: p.original_cost || p.cost })}>
                    Participate ➜
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    ));
  };

  const renderPrasadam = () => {
    if (!temple?.prasadam || temple.prasadam.length === 0) {
      return <p className="text-center">No prasadam available for this temple.</p>;
    }

    const rows = [];
    for (let i = 0; i < temple.prasadam.length; i += 3) {
      rows.push(temple.prasadam.slice(i, i + 3));
    }

    return rows.map((row, rowIdx) => (
      <div className="row" key={rowIdx}>
        {row.map((p) => (
          <div className="col-md-3 mb-2" key={p.id}>
            <div className="card h-100 shadow-sm border-0 rounded-3" style={{ background: '#ffe9d6' }}>
              <div className="card-body d-flex flex-column justify-content-between">
                <h5 className="fw-bold text-danger">🍛 {p.name}</h5>
                <div className="text-center my-3">
                  <img
                    src={getFullImageUrl(p.image)}
                    alt={p.name}
                    className="img-fluid rounded"
                    style={{
                      border: '3px solid orange',
                      padding: '6px',
                      borderRadius: '12px',
                      maxHeight: '180px',
                      objectFit: 'contain',
                    }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = require('../assets/Default.png');
                    }}
                  />
                </div>
                <div className="mt-2 small text-dark">
                  <p><strong className="text-danger">Details:</strong><br />{p.details || 'N/A'}</p>
                  <p><strong className="text-danger">Includes:</strong><br />{p.included || 'N/A'}</p>
                  <p><strong className="text-danger">Benefits:</strong><br />{p.benefits || '-'}</p>
                  <p><strong className="text-danger">Cost:</strong><br />₹ {p.original_cost || 'N/A'} /-</p>
                </div>
                <div className="d-flex justify-content-center mt-3">
                  <button className="btn btn-success px-4 fw-semibold shadow-sm" onClick={() => handleAddToCart({ ...p, type: 'prasadam', cost: p.original_cost || 'N/A' })}>
                    Add to Cart ➜
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    ));
  };

  if (loading) return <p>Loading temple details...</p>;
  if (!temple) return <p>No temple found.</p>;

  return (
    <>
      <CartDrawer open={cartDrawerOpen} onClose={() => setCartDrawerOpen(false)} />
      <main className="temple-main">
        <section className="temple-container container">
          <h2 className="temple-name">{temple.name}</h2>
          <p className="temple-address">📍 {temple.address}</p>

          <Carousel
            autoPlay
            infiniteLoop
            showThumbs={false}
            showStatus={false}
            interval={4000}
            transitionTime={500}
            centerMode
            centerSlidePercentage={33.33}
            className="temple-carousel"
          >
            {temple.images?.map((img, idx) => (
              <div key={idx}>
                <img src={getFullImageUrl(img.image)} alt={`Temple ${idx + 1}`} className="rounded temple-carousel-img" />
              </div>
            ))}
          </Carousel>

          {/* Tabs */}
          <ul className="nav nav-tabs justify-content-center mt-4 tab-list">
            <li className="nav-item" onClick={() => handleTabSwitch(2)}>
              <span className={`nav-link ${tabNo === 2 ? 'active' : ''}`}>Puja / Udi / Chadava</span>
            </li>
            <li className="nav-item" onClick={() => handleTabSwitch(4)}>
              <span className={`nav-link ${tabNo === 4 ? 'active' : ''}`}>Prasadam</span>
            </li>
            <li className="nav-item" onClick={() => handleTabSwitch(3)}>
              <span className={`nav-link ${tabNo === 3 ? 'active' : ''}`}>e-Services</span>
            </li>
            <li className="nav-item" onClick={() => handleTabSwitch(1)}>
              <span className={`nav-link ${tabNo === 1 ? 'active' : ''}`}>About Temple</span>
            </li>
          </ul>

          <div className="tab-content mt-4">
            {tabNo === 2 && (
              <>
                <div className="row mb-4">
                  <div className="col-md-6 col-12 mx-auto d-flex align-items-center gap-2">
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      placeholder="Search for Pooja or Prasadam"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <button className="btn btn-lg btn-primary" onClick={handleSearch}>
                      Search
                    </button>
                  </div>
                </div>
                <div className="row">
                  {filteredData.length > 0 ? renderCards(filteredData) : <p className="text-center">No items found.</p>}
                </div>
              </>
            )}

            {tabNo === 4 && (
              <div className="prasadam-section my-5">
                <h4 className="mb-4 text-center">Prasadam</h4>
                {renderPrasadam()}
              </div>
            )}

            {tabNo === 3 && <h4 className="text-center text-muted">e-Services coming soon...</h4>}

            {tabNo === 1 && (
              <div className="row mt-4">
                <div className="col-md-8">
                  <h4>Description</h4>
                  <p>{temple.details}</p>

                  <h4 className="mt-4">Image Gallery</h4>
                  <div className="row g-3">
                    {temple.images?.map((img, i) => (
                      <div className="col-md-4" key={i}>
                        <img
                          src={getFullImageUrl(img.image)}
                          className="img-fluid rounded"
                          alt={`Temple ${i + 1}`}
                          style={{ padding: '8px', background: '#f8f9fa', borderRadius: '8px' }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="col-md-4 order-md-2">
                  <ul className="list-group">
                    <li className="list-group-item"><strong>Taluk:</strong> {temple.taluk}</li>
                    <li className="list-group-item"><strong>District:</strong> {temple.district}</li>
                    <li className="list-group-item"><strong>City:</strong> {temple.city}</li>
                    <li className="list-group-item"><strong>State:</strong> {temple.state}</li>
                    <li className="list-group-item"><strong>Pincode:</strong> {temple.pincode}</li>
                    <li className="list-group-item"><strong>Website:</strong> {temple.website || '-'}</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
};

export default TempleDetails;
