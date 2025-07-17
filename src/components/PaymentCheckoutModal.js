import React, { useState, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { useUserAuth } from '../context/UserAuthContext';
import {
  fetchConstants,
  submitBulkPoojaRequest,
  fetchRazorpayKey,
  confirmPayment,
  loadRazorpayScript,
  constructBulkPoojaPayload
} from '../api/poojaService';
import '../styles/PaymentCheckoutModal.css';

// Custom date picker component with close on select
function DatePickerWithClose({ selectedDate, onDateChange, error, minDate }) {
  const [open, setOpen] = React.useState(false);

  const selected = selectedDate ? new Date(selectedDate + 'T00:00:00') : undefined;

  return (
    <div style={{ position: 'relative', marginBottom: 8 }}>
      <input
        type="text"
        readOnly
        value={selected ? selected.toLocaleDateString() : ''}
        placeholder="Booking Date *"
        style={{
          width: '100%',
          padding: 8,
          borderRadius: 6,
          marginBottom: 0,
          cursor: 'pointer',
          background: '#fff',
          border: error ? '1px solid #d32f2f' : '1px solid #ccc'
        }}
        onClick={() => setOpen(true)}
      />
      {open && (
        <div
          style={{
            position: 'absolute',
            zIndex: 10,
            top: 44,
            left: 0,
            background: '#fff',
            borderRadius: 8,
            boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
            padding: 8
          }}
        >
          <DayPicker
            mode="single"
            selected={selected}
            onSelect={(date) => {
              if (date) {
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                onDateChange(`${year}-${month}-${day}`);
                setOpen(false);
              }
            }}
            fromDate={minDate || new Date()}
            required
          />
        </div>
      )}
      {error && <span className="checkout-error">{error}</span>}
    </div>
  );
}

const PaymentCheckoutModal = ({ open, onClose }) => {
  const { user: profile } = useUserAuth();
  const [showConfirm, setShowConfirm] = useState(false);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [constants, setConstants] = useState(null);
  const [minBookingDate, setMinBookingDate] = useState(new Date());

  const [address, setAddress] = useState({
    bookingDate: '',
    devoteeName: '',
    devoteeMobile: '',
    sankalpa: '',
    nakshatra: '',
    gotra: '',
    rashi: '',
    street1: '',
    street2: '',
    area: '',
    city: '',
    state: '',
    pincode: ''
  });

  const [savedAddresses, setSavedAddresses] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('savedAddresses')) || [];
    } catch {
      return [];
    }
  });

  const [showAddressForm, setShowAddressForm] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('savedAddresses')) || [];
      return saved.length === 0;
    } catch {
      return true;
    }
  });

  const [errors, setErrors] = useState({});

  // Load constants and set minimum booking date
  useEffect(() => {
    const loadConstants = async () => {
      try {
        const constantsData = await fetchConstants();
        setConstants(constantsData);
        
        // Set minimum booking date based on constants
        if (constantsData.pooja_booking_min_csc_estore) {
          const minDays = parseInt(constantsData.pooja_booking_min_csc_estore);
          const minDate = new Date();
          minDate.setDate(minDate.getDate() + minDays);
          setMinBookingDate(minDate);
        }
      } catch (error) {
        console.error('Error loading constants:', error);
      }
    };

    if (open) {
      loadConstants();
    }
  }, [open]);

  // Prefill user data from profile
  useEffect(() => {
    if (profile && open) {
      setAddress((prev) => ({
        ...prev,
        devoteeName:
          profile.firstName && profile.lastName
            ? `${profile.firstName} ${profile.lastName}`
            : profile.name || profile.firstName || prev.devoteeName,
        devoteeMobile: profile.phone || prev.devoteeMobile
      }));
    }
  }, [profile, open]);

  // Load saved addresses when modal opens
  useEffect(() => {
    if (open) {
      try {
        const stored = localStorage.getItem('savedAddresses')
          ? JSON.parse(localStorage.getItem('savedAddresses'))
          : [];
        if (stored.length > 0) {
          setAddress((a) => ({ ...stored[0], bookingDate: a.bookingDate || '' }));
          setShowAddressForm(false);
        } else {
          setShowAddressForm(true);
        }
      } catch {
        setShowAddressForm(true);
      }
    }
  }, [open]);

  // Load cart data
  useEffect(() => {
    if (open) {
      try {
        const stored = JSON.parse(localStorage.getItem('cart')) || [];
        console.log('Cart data from localStorage:', stored);
        
        // If cart is empty, add some test data for debugging
        if (stored.length === 0) {
          const testCart = [
            {
              id: 467,
              name: 'Test Pooja',
              cost: 100,
              original_cost: 100,
              convenience_fee: 10,
              booking_charges: 20,
              tax_amount: 15,
              final_total: 145,
              quantity: 1,
              images: []
            }
          ];
          console.log('Using test cart data:', testCart);
          setCart(testCart);
          // Also save to localStorage for consistency
          localStorage.setItem('cart', JSON.stringify(testCart));
        } else {
          setCart(stored.map((item) => ({ ...item, quantity: item.quantity || 1 })));
        }
      } catch (error) {
        console.error('Error loading cart:', error);
        setCart([]);
      }
    }
  }, [open]);

  // Calculate charges
  const [charges, setCharges] = useState({
    subtotal: 0,
    convenienceCharge: 0,
    shippingCharge: 0,
    gst: 0,
    total: 0
  });

  useEffect(() => {
    let subtotal = cart.reduce(
      (sum, item) => sum + (Number(item.payment_data?.original_cost) || Number(item.original_cost) || Number(item.cost) || 0) * (item.quantity || 1),
      0
    );
    let convenienceCharge = cart.reduce(
      (sum, item) => sum + (Number(item.payment_data?.convenience_fee) || Number(item.convenience_fee) || 0) * (item.quantity || 1),
      0
    );
    let shippingCharge = cart.reduce(
      (sum, item) => sum + (Number(item.payment_data?.booking_charges) || Number(item.booking_charges) || 0) * (item.quantity || 1),
      0
    );
    let gst = cart.reduce(
      (sum, item) => sum + (Number(item.payment_data?.tax_amount) || Number(item.tax_amount) || 0) * (item.quantity || 1),
      0
    );
    let total = subtotal + convenienceCharge + shippingCharge + gst;

    setCharges({ subtotal, convenienceCharge, shippingCharge, gst, total });
  }, [cart]);

  // Address validation
  const isAddressValid = () => {
    return (
      address.bookingDate &&
      address.devoteeName &&
      /^\d{10}$/.test(address.devoteeMobile) &&
      address.street1 &&
      address.area &&
      address.city &&
      address.state &&
      /^\d{6}$/.test(address.pincode)
    );
  };

  // State for order details from API
  const [orderDetails, setOrderDetails] = useState(null);
  const [showOrderSummary, setShowOrderSummary] = useState(false);

  // Handle getting order details and updated charges
  const handleGetOrderDetails = async () => {
    if (!isAddressValid()) {
      alert('Please complete all required address fields.');
      return;
    }

    setLoading(true);

    try {
      // Process each cart item individually using the pooja request endpoint
      const orderResponses = [];
      
      for (const item of cart) {
        const poojaId = item.id || item.pooja_id || 467;
        console.log(`Requesting pooja ${poojaId} for item:`, item);
        
        try {
          // Use the individual pooja request endpoint
          const response = await fetch(`https://beta.devalayas.com/api/v1/devotee/pooja/${poojaId}/request`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Token 94c4c11bfac761ba896de08bd383ca187d4e4dc4`
            }
          });

          if (!response.ok) {
            throw new Error(`Failed to request pooja ${poojaId}: ${response.status} ${response.statusText}`);
          }

          const orderData = await response.json();
          console.log(`API Response for pooja ${poojaId}:`, JSON.stringify(orderData, null, 2));
          
          orderResponses.push({
            ...orderData,
            item: item,
            poojaId: poojaId
          });
        } catch (itemError) {
          console.error(`Error requesting pooja ${poojaId}:`, itemError);
          throw new Error(`Failed to request pooja ${poojaId}: ${itemError.message}`);
        }
      }

      if (orderResponses.length === 0) {
        throw new Error('No order data received from API');
      }

      // Use the first order response for payment processing
      const primaryOrder = orderResponses[0];
      console.log('Primary order for payment:', primaryOrder);

      // Calculate updated charges from all responses
      let totalSubtotal = 0;
      let totalConvenienceCharge = 0;
      let totalShippingCharge = 0;
      let totalGst = 0;
      let totalAmount = 0;

      orderResponses.forEach((orderData, index) => {
        const item = orderData.item;
        const quantity = item.quantity || 1;
        
        // Use API response data if available, otherwise fall back to item data
        const itemSubtotal = Number(orderData.payment_data?.original_cost || orderData.original_cost || item.cost || 0) * quantity;
        const itemConvenience = Number(orderData.payment_data?.convenience_fee || orderData.convenience_fee || item.convenience_fee || 0) * quantity;
        const itemShipping = Number(orderData.payment_data?.booking_charges || orderData.booking_charges || item.booking_charges || 0) * quantity;
        const itemGst = Number(orderData.payment_data?.tax_amount || orderData.tax_amount || item.tax_amount || 0) * quantity;
        
        totalSubtotal += itemSubtotal;
        totalConvenienceCharge += itemConvenience;
        totalShippingCharge += itemShipping;
        totalGst += itemGst;
        
        console.log(`Item ${index + 1} charges:`, {
          subtotal: itemSubtotal,
          convenience: itemConvenience,
          shipping: itemShipping,
          gst: itemGst
        });
      });

      totalAmount = totalSubtotal + totalConvenienceCharge + totalShippingCharge + totalGst;

      const updatedCharges = {
        subtotal: totalSubtotal,
        convenienceCharge: totalConvenienceCharge,
        shippingCharge: totalShippingCharge,
        gst: totalGst,
        total: totalAmount
      };

      console.log('Updated charges from API:', updatedCharges);
      setCharges(updatedCharges);

      // Store order details for payment processing (use primary order)
      setOrderDetails(primaryOrder);
      setShowOrderSummary(true);

    } catch (error) {
      console.error('Error getting order details:', error);
      console.error('Error details:', {
        message: error.message,
        cart: cart,
        address: address
      });
      
      // Provide more specific error messages
      let errorMessage = 'Failed to get order details. ';
      if (error.message.includes('401')) {
        errorMessage += 'Authentication failed. Please try logging in again.';
      } else if (error.message.includes('400')) {
        errorMessage += 'Invalid request data. Please check your cart items.';
      } else if (error.message.includes('Network Error') || error.message.includes('Failed to fetch')) {
        errorMessage += 'Network connection issue. Please check your internet connection.';
      } else {
        errorMessage += error.message || 'Please try again.';
      }
      
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handle actual payment process
  const handlePayment = async () => {
    if (!orderDetails) {
      alert('Please get order details first.');
      return;
    }

    setLoading(true);

    try {
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        alert('Razorpay SDK failed to load. Please try again.');
        return;
      }

      // Get Razorpay key
      const keyData = await fetchRazorpayKey();
      const rzKey = keyData.key;

      // Use updated charges from API
      const amount = Math.round(Number(charges.total) * 100);

      // Razorpay options
      const options = {
        key: rzKey,
        amount,
        currency: 'INR',
        name: 'Devalaya',
        description: 'Payment towards Pooja Booking',
        image: 'https://cdn.shopify.com/s/files/1/0735/5895/0166/files/unnamed_copy_ac3ece77-8a3a-44b7-b0f2-820c39455044.jpg?v=1679241399&width=500',
        order_id: orderDetails.payment_order_id,
        handler: async function (razorpayResponse) {
          try {
            // Confirm payment
            const paymentData = {
              razorpay_payment_id: razorpayResponse.razorpay_payment_id,
              razorpay_order_id: razorpayResponse.razorpay_order_id,
              razorpay_signature: razorpayResponse.razorpay_signature,
              request_id: razorpayResponse.razorpay_payment_id
            };

            await confirmPayment(paymentData);
            
            // Clear cart and redirect to success page
            localStorage.removeItem('cart');
            window.location.href = `/payment-success?payment_id=${razorpayResponse.razorpay_payment_id}&order_id=${orderDetails.order_id}&status=success`;
          } catch (error) {
            console.error('Payment confirmation error:', error);
            window.location.href = `/payment-success?payment_id=${razorpayResponse.razorpay_payment_id}&order_id=${orderDetails.order_id}&status=failed&error=${encodeURIComponent(error.message)}`;
          }
        },
        prefill: {
          name: address.devoteeName,
          email: profile?.email || '',
          contact: address.devoteeMobile,
        },
        notes: {
          address: 'Devalaya Pooja Booking',
        },
        theme: {
          color: '#df3002',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        console.error('Payment failed:', response.error);
        alert(`Payment failed: ${response.error.description}`);
      });
      rzp.open();

    } catch (error) {
      console.error('Payment process error:', error);
      alert('Failed to initiate payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle address form submission
  const handleAddressSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    
    if (!address.bookingDate) newErrors.bookingDate = 'Required';
    if (!address.devoteeName) newErrors.devoteeName = 'Required';
    if (!address.devoteeMobile || !/^\d{10}$/.test(address.devoteeMobile))
      newErrors.devoteeMobile = 'Valid 10-digit mobile required';
    if (!address.street1) newErrors.street1 = 'Required';
    if (!address.area) newErrors.area = 'Required';
    if (!address.city) newErrors.city = 'Required';
    if (!address.state) newErrors.state = 'Required';
    if (!address.pincode || !/^\d{6}$/.test(address.pincode))
      newErrors.pincode = 'Valid 6-digit pincode required';

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const updatedAddresses = [...savedAddresses, address];
      setSavedAddresses(updatedAddresses);
      localStorage.setItem('savedAddresses', JSON.stringify(updatedAddresses));
      setShowAddressForm(false);
      alert('Address saved successfully!');
    }
  };

  if (!open) return null;

  return (
    <div className="payment-checkout-modal-overlay" onClick={() => setShowConfirm(true)}>
      <div className="payment-checkout-modal" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="payment-checkout-modal-header-bar">
          <img src={require('../assets/logo.png')} alt="Logo" className="payment-checkout-modal-logo" />
          <h4 className="payment-checkout-modal-title">Checkout Details</h4>
          <button
            className="payment-checkout-modal-top-close-btn"
            onClick={() => setShowConfirm(true)}
            aria-label="Close"
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="payment-checkout-modal-content">
          {/* Confirmation Dialog */}
          {showConfirm && (
            <div className="payment-checkout-confirm-overlay" onClick={(e) => e.stopPropagation()}>
              <div className="payment-checkout-confirm-dialog">
                <div className="payment-checkout-confirm-title">Are you sure?</div>
                <div className="payment-checkout-confirm-message">Do you want to close the payment?</div>
                <div className="payment-checkout-confirm-actions">
                  <button
                    className="btn btn-danger me-2"
                    onClick={() => {
                      setShowConfirm(false);
                      onClose();
                    }}
                  >
                    Confirm
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => setShowConfirm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Left: Address Form */}
          <div className="payment-checkout-modal-left">
            {/* Date Selection */}
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontWeight: 600, fontSize: '1.08rem', display: 'block', marginBottom: 4 }}>
                Select Your Puja Date
              </label>
              <DatePickerWithClose
                selectedDate={address.bookingDate}
                onDateChange={(date) => setAddress({ ...address, bookingDate: date })}
                error={errors?.bookingDate}
                minDate={minBookingDate}
              />
            </div>

            <div className="payment-checkout-modal-address-label">
              <span>Address</span>
            </div>

            <div className="payment-checkout-modal-left-scroll">
              {/* Saved Addresses */}
              {savedAddresses.length > 0 && !showAddressForm && (
                <div
                  style={{
                    marginBottom: 16,
                    opacity: address.bookingDate ? 1 : 0.5,
                    pointerEvents: address.bookingDate ? 'auto' : 'none'
                  }}
                >
                  <label style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>Shipping address</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {savedAddresses.map((addr, idx) => {
                      const isSelected = (() => {
                        const { bookingDate: _1, ...a1 } = addr;
                        const { bookingDate: _2, ...a2 } = address;
                        return JSON.stringify(a1) === JSON.stringify(a2);
                      })();
                      return (
                        <div
                          key={idx}
                          className="address-card"
                          style={{
                            border: isSelected ? '2px solid #c1440e' : '1.5px solid #ddd',
                            borderRadius: 10,
                            padding: '16px 18px 12px 18px',
                            background: isSelected ? '#fff8f2' : '#fff',
                            boxShadow: isSelected
                              ? '0 2px 8px rgba(193,68,14,0.08)'
                              : '0 1px 4px rgba(0,0,0,0.03)',
                            position: 'relative',
                            cursor: address.bookingDate ? 'pointer' : 'not-allowed',
                            minHeight: 80
                          }}
                          onClick={() => {
                            if (!address.bookingDate) return;
                            setAddress((a) => ({ ...addr, bookingDate: a.bookingDate }));
                            setShowAddressForm(false);
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'flex-start',
                              justifyContent: 'space-between'
                            }}
                          >
                            <div style={{ fontWeight: 600, fontSize: '1.08rem' }}>{addr.devoteeName}</div>
                            {isSelected && (
                              <span style={{ color: '#c1440e', fontWeight: 700, fontSize: 22 }}>&#10003;</span>
                            )}
                          </div>
                          <div>{addr.street1}, {addr.area}, {addr.city}, {addr.state} - {addr.pincode}</div>
                          <div>{addr.devoteeMobile}</div>
                        </div>
                      );
                    })}
                  </div>
                  <button
                    type="button"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      marginTop: 18,
                      background: 'none',
                      border: 'none',
                      color: '#c1440e',
                      fontWeight: 500,
                      fontSize: 17
                    }}
                    onClick={() => {
                      if (!address.bookingDate) return;
                      setShowAddressForm(true);
                      setAddress((a) => ({
                        bookingDate: a.bookingDate,
                        devoteeName: a.devoteeName,
                        devoteeMobile: a.devoteeMobile,
                        sankalpa: '',
                        nakshatra: '',
                        gotra: '',
                        rashi: '',
                        street1: '',
                        street2: '',
                        area: '',
                        city: '',
                        state: '',
                        pincode: ''
                      }));
                    }}
                  >
                    + Add new address
                  </button>
                </div>
              )}

              {/* Address Form */}
              {showAddressForm && (
                <form onSubmit={handleAddressSubmit}>
                  <div className="mb-2">
                    <label>Devotee Name *</label>
                    <input
                      type="text"
                      value={address.devoteeName}
                      onChange={(e) => setAddress({ ...address, devoteeName: e.target.value })}
                      className="form-control"
                      placeholder="Devotee Name"
                    />
                    {errors.devoteeName && <span className="checkout-error">{errors.devoteeName}</span>}
                  </div>

                  <div className="mb-2">
                    <label>Devotee Mobile Number *</label>
                    <input
                      type="tel"
                      maxLength={10}
                      value={address.devoteeMobile}
                      onChange={(e) =>
                        setAddress({ ...address, devoteeMobile: e.target.value.replace(/[^0-9]/g, '') })
                      }
                      className="form-control"
                      placeholder="10-digit Mobile"
                    />
                    {errors.devoteeMobile && (
                      <span className="checkout-error">{errors.devoteeMobile}</span>
                    )}
                  </div>

                  <div className="mb-2">
                    <label>Sankalpa (optional)</label>
                    <input
                      type="text"
                      value={address.sankalpa}
                      onChange={(e) => setAddress({ ...address, sankalpa: e.target.value })}
                      className="form-control"
                      placeholder="Sankalpa"
                    />
                  </div>

                  <div className="row">
                    <div className="col-md-4 mb-2">
                      <label>Nakshatra (optional)</label>
                      <input
                        type="text"
                        value={address.nakshatra}
                        onChange={(e) => setAddress({ ...address, nakshatra: e.target.value })}
                        className="form-control"
                        placeholder="Nakshatra"
                      />
                    </div>
                    <div className="col-md-4 mb-2">
                      <label>Gotra (optional)</label>
                      <input
                        type="text"
                        value={address.gotra}
                        onChange={(e) => setAddress({ ...address, gotra: e.target.value })}
                        className="form-control"
                        placeholder="Gotra"
                      />
                    </div>
                    <div className="col-md-4 mb-2">
                      <label>Rashi (optional)</label>
                      <input
                        type="text"
                        value={address.rashi}
                        onChange={(e) => setAddress({ ...address, rashi: e.target.value })}
                        className="form-control"
                        placeholder="Rashi"
                      />
                    </div>
                  </div>

                  <div className="mb-2">
                    <label>Street Address 1 *</label>
                    <input
                      type="text"
                      value={address.street1}
                      onChange={(e) => setAddress({ ...address, street1: e.target.value })}
                      className="form-control"
                      placeholder="Street Address"
                    />
                    {errors.street1 && <span className="checkout-error">{errors.street1}</span>}
                  </div>

                  <div className="mb-2">
                    <label>Street Address 2 (optional)</label>
                    <input
                      type="text"
                      value={address.street2}
                      onChange={(e) => setAddress({ ...address, street2: e.target.value })}
                      className="form-control"
                      placeholder="Street Address"
                    />
                  </div>

                  <div className="mb-2">
                    <label>Area *</label>
                    <input
                      type="text"
                      value={address.area}
                      onChange={(e) => setAddress({ ...address, area: e.target.value })}
                      className="form-control"
                      placeholder="Area"
                    />
                    {errors.area && <span className="checkout-error">{errors.area}</span>}
                  </div>

                  <div className="mb-2">
                    <label>City *</label>
                    <input
                      type="text"
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      className="form-control"
                      placeholder="City"
                    />
                    {errors.city && <span className="checkout-error">{errors.city}</span>}
                  </div>

                  <div className="mb-2">
                    <label>State *</label>
                    <input
                      type="text"
                      value={address.state}
                      onChange={(e) => setAddress({ ...address, state: e.target.value })}
                      className="form-control"
                      placeholder="State"
                    />
                    {errors.state && <span className="checkout-error">{errors.state}</span>}
                  </div>

                  <div className="mb-2">
                    <label>Pincode * (6-digit Pincode)</label>
                    <input
                      type="text"
                      value={address.pincode}
                      maxLength={6}
                      onChange={(e) => setAddress({ ...address, pincode: e.target.value.replace(/[^0-9]/g, '')})}
                      className="form-control"
                      placeholder="Pincode"
                    />
                    {errors.pincode && <span className="checkout-error">{errors.pincode}</span>}
                  </div>

                  <button className="payment-checkout-proceed-btn" type="submit">
                    Save Address & Proceed to Payment
                  </button>
                </form>
              )}

              {/* Proceed to Payment Button */}
              {!showAddressForm && isAddressValid() && !showOrderSummary && (
                <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    className="payment-checkout-proceed-btn"
                    disabled={!isAddressValid() || loading}
                    onClick={handleGetOrderDetails}
                  >
                    {loading ? 'Getting Order Details...' : 'Proceed to Payment'}
                  </button>
                </div>
              )}

              {/* Order Summary and Final Payment Button */}
              {showOrderSummary && orderDetails && (
                <div style={{ marginTop: 24 }}>
                  <div style={{ 
                    padding: '16px', 
                    backgroundColor: '#f8f9fa', 
                    borderRadius: '8px', 
                    marginBottom: '16px',
                    border: '1px solid #dee2e6'
                  }}>
                    <h6 style={{ marginBottom: '12px', color: '#495057' }}>Delivery Address:</h6>
                    <div style={{ fontSize: '14px', lineHeight: '1.5', color: '#6c757d' }}>
                      <div><strong>{address.devoteeName}</strong></div>
                      <div>{address.street1}</div>
                      {address.street2 && <div>{address.street2}</div>}
                      <div>{address.area}, {address.city}</div>
                      <div>{address.state} - {address.pincode}</div>
                      <div>Mobile: {address.devoteeMobile}</div>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => {
                        setShowOrderSummary(false);
                        setOrderDetails(null);
                      }}
                    >
                      Edit Details
                    </button>
                    <button
                      type="button"
                      className="payment-checkout-proceed-btn"
                      disabled={loading}
                      onClick={handlePayment}
                    >
                      {loading ? 'Processing Payment...' : 'Confirm & Pay'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Cart Summary */}
          <div className="payment-checkout-modal-right">
            <h5>Cart</h5>
            <div className="payment-checkout-cart-list">
              {cart.map((item) => (
                <div className="payment-checkout-cart-item" key={item.id}>
                  {item.images?.[0]?.image && (
                    <img
                      src={
                        item.images[0].image.startsWith('http')
                          ? item.images[0].image
                          : `https://beta.devalayas.com${item.images[0].image}`
                      }
                      alt={item.name}
                      className="payment-checkout-cart-img"
                    />
                  )}
                  <div className="payment-checkout-cart-info">
                    <div className="payment-checkout-cart-title">{item.name}</div>
                    <div className="payment-checkout-cart-qty">
                      {item.quantity} x ₹{(item.quantity * Number(item.final_total || item.cost)).toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="payment-checkout-cart-summary">
              <div className="payment-checkout-summary-row">
                <span>Subtotal</span>
                <span>₹{charges.subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="payment-checkout-summary-row">
                <span>Convenience Charge</span>
                <span>₹{charges.convenienceCharge.toLocaleString('en-IN')}</span>
              </div>
              <div className="payment-checkout-summary-row">
                <span>Shipping Charge</span>
                <span>₹{charges.shippingCharge.toLocaleString('en-IN')}</span>
              </div>
              <div className="payment-checkout-summary-row">
                <span>GST</span>
                <span>₹{charges.gst.toLocaleString('en-IN')}</span>
              </div>
              <div className="payment-checkout-summary-row payment-checkout-summary-total">
                <span>Total (inc. all taxes)</span>
                <span>₹{charges.total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentCheckoutModal;
