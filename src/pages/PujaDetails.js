// src/pages/PujaDetails.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/api';
import '../styles/PujaDetails.css';

const PujaDetails = () => {
  const { id } = useParams();
  const [puja, setPuja] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('about');
  const [imageError, setImageError] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    const fetchPujaDetails = async () => {
      try {
        const response = await api.get(`/api/v1/devotee/pooja/${id}`);
        setPuja(response.data);
      } catch (err) {
        setError('❌ Failed to load puja details. Please try again later.');
        console.error('Error:', err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPujaDetails();
  }, [id]);

  const handleParticipate = () => {
    if (!puja || addingToCart) return;
    
    setAddingToCart(true);
    
    try {
      // Get existing cart from localStorage
      const existingCart = JSON.parse(localStorage.getItem('cart')) || [];
      
      // Extract all pricing information from puja data
      const originalCost = Number(puja.original_cost || puja.cost || 0);
      const convenienceFee = Number(puja.convenience_fee || 0);
      const bookingCharges = Number(puja.booking_charges || 0);
      const taxAmount = Number(puja.tax_amount || 0);
      const finalTotal = Number(puja.final_total || originalCost + convenienceFee + bookingCharges + taxAmount);
      
      // Create cart item from puja data with complete pricing structure
      const cartItem = {
        id: puja.id,
        name: puja.name,
        details: puja.details || 'Puja participation',
        cost: originalCost,
        final_total: finalTotal,
        original_cost: originalCost,
        convenience_fee: convenienceFee,
        booking_charges: bookingCharges,
        tax_amount: taxAmount,
        quantity: 1,
        images: puja.images || [],
        prasad_delivery: puja.prasad_delivery || false,
        // Include complete payment_data structure
        payment_data: {
          original_cost: originalCost,
          final_total: finalTotal,
          convenience_fee: convenienceFee,
          booking_charges: bookingCharges,
          tax_amount: taxAmount,
          delivery_charge: Number(puja.delivery_charge || 0),
          fee_amount: Number(puja.fee_amount || 0)
        }
      };
      
      // Check if item already exists in cart
      const existingItemIndex = existingCart.findIndex(item => item.id === puja.id);
      
      if (existingItemIndex >= 0) {
        // If item exists, increment quantity
        existingCart[existingItemIndex].quantity += 1;
      } else {
        // If item doesn't exist, add new item
        existingCart.push(cartItem);
      }
      
      // Save updated cart to localStorage
      localStorage.setItem('cart', JSON.stringify(existingCart));
      
      // Dispatch storage event to update cart count in navbar
      window.dispatchEvent(new Event('storage'));
      
      // Open cart drawer
      window.dispatchEvent(new Event('open-cart-drawer'));
      
      // Show success message with pricing details
      const totalAmount = finalTotal.toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
      alert(`Item added to cart successfully!\nTotal: ₹${totalAmount}`);
      
    } catch (error) {
      console.error('Error adding item to cart:', error);
      alert('Failed to add item to cart. Please try again.');
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) return <div className="loading">Loading Puja Details...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!puja) return <div>No puja found</div>;

  const imageUrl =
    imageError
      ? 'https://via.placeholder.com/500x300?text=Image+Not+Available'
      : puja.image ||
        (puja.images?.length > 0 && puja.images[0].image) ||
        'https://via.placeholder.com/500x300?text=No+Image+Available';

  return (
    <div className="puja-details-container">
      <h2 className="puja-title">{puja.name}</h2>

      <div className="puja-flex-wrapper">
        <div className="puja-image-box">
          <img
            src={imageUrl}
            alt={puja.name}
            className="puja-main-image"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        </div>

        <div className="puja-text-box">
          {/* <p><strong>Details:</strong> {puja.details || 'No details available'}</p> */}
          <p><strong>Temple:</strong> {puja.included || 'N/A'}</p>
          <p><strong>Included:</strong> {puja.included || 'N/A'}</p>
          <p><strong>Excluded:</strong> {puja.excluded || 'N/A'}</p>
          <p><strong>Price:</strong> ₹{Number(puja.original_cost || puja.cost || 0).toLocaleString('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}</p>
          {puja.convenience_fee && Number(puja.convenience_fee) > 0 && (
            <p><strong>Convenience Fee:</strong> ₹{Number(puja.convenience_fee).toLocaleString('en-IN', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}</p>
          )}
          {puja.booking_charges && Number(puja.booking_charges) > 0 && (
            <p><strong>Booking Charges:</strong> ₹{Number(puja.booking_charges).toLocaleString('en-IN', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}</p>
          )}
          {puja.tax_amount && Number(puja.tax_amount) > 0 && (
            <p><strong>Tax:</strong> ₹{Number(puja.tax_amount).toLocaleString('en-IN', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}</p>
          )}
          {puja.final_total && Number(puja.final_total) !== Number(puja.original_cost || puja.cost || 0) && (
            <p><strong>Total Amount:</strong> ₹{Number(puja.final_total).toLocaleString('en-IN', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}</p>
          )}
          <p><strong>God:</strong> {puja.god?.name || 'N/A'}</p>
          {/* <p><strong>Prasad Delivery:</strong> {puja.prasad_delivery ? 'Yes' : 'No'}</p>
          <p><strong>Approval Status:</strong> {puja.approval_status || 'N/A'}</p> */}

          <div className="participate-button-wrapper">
            <button 
              className="participate-btn" 
              onClick={handleParticipate}
              disabled={addingToCart}
            >
              {addingToCart ? 'ADDING...' : 'PARTICIPATE'}
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tab-nav">
        <button className={activeTab === 'about' ? 'active' : ''} onClick={() => setActiveTab('about')}>About Puja</button>
        <button className={activeTab === 'benefits' ? 'active' : ''} onClick={() => setActiveTab('benefits')}>Benefits</button>
        <button className={activeTab === 'temple' ? 'active' : ''} onClick={() => setActiveTab('temple')}>Temple Details</button>
        <button className={activeTab === 'packages' ? 'active' : ''} onClick={() => setActiveTab('packages')}>Packages</button>
      </div>

      <div className="tab-content">
        {activeTab === 'about' && (
          <div>
            <h3>About Puja</h3>
            <p>{puja.details || 'Information coming soon.'}</p>
          </div>
        )}
        {activeTab === 'benefits' && (
          <div>
            <h3>Benefits</h3>
            <p>{puja.benefits || 'This puja is beneficial for spiritual harmony and inner peace.'}</p>
          </div>
        )}
        {activeTab === 'temple' && (
          <div>
            <h3>Temple Details</h3>
            <p>{puja.temple_details || 'This puja is conducted at a sacred temple location.'}</p>
          </div>
        )}
        {activeTab === 'packages' && (
          <div>
            <h3>Packages</h3>
            <p>{puja.packages || 'Various participation packages are available for this puja.'}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PujaDetails;
