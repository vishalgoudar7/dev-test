import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/PaymentSuccess.css';

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [paymentDetails, setPaymentDetails] = useState({
    payment_id: '',
    order_id: '',
    status: '',
    error: ''
  });

  const [bookingDetails, setBookingDetails] = useState({
    temples: [],
    image: '',
    templeName: '',
    devoteeName: '',
    amount: 0,
    request: false,
    upiUrl: '',
    loading: false
  });

  const upiId = 'devalayas@paytm'; // UPI ID for payments

  // Fetch booking details from API
  const getBookings = async (orderId) => {
    if (!orderId) return;

    setBookingDetails(prev => ({ ...prev, loading: true }));

    try {
      const token = localStorage.getItem('token') || '94c4c11bfac761ba896de08bd383ca187d4e4dc4';
      const uri = `devotee/pooja_request/list/?search=${orderId}`;
      
      const response = await fetch(`https://beta.devalayas.com/api/v1/${uri}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch booking details: ${response.status}`);
      }

      const data = await response.json();
      console.log('Booking details response:', data);

      if (data.results && data.results.length > 0) {
        const booking = data.results[0];
        const amount = booking.pooja?.price || booking.amount || 0;
        
        // Generate UPI URL
        const encodedName = encodeURIComponent("Devalaya Temple");
        const upiUrl = `upi://pay?pa=${upiId}&pn=${encodedName}&am=${amount.toFixed(2)}&cu=INR`;

        setBookingDetails({
          temples: data.results,
          image: booking.temple?.images?.[0]?.image || '',
          templeName: booking.temple?.name || '',
          devoteeName: booking.name || '',
          amount: amount,
          request: true,
          upiUrl: upiUrl,
          loading: false
        });
      } else {
        setBookingDetails(prev => ({ ...prev, loading: false, request: false }));
      }
    } catch (error) {
      console.error('Error fetching booking details:', error);
      setBookingDetails(prev => ({ ...prev, loading: false, request: false }));
    }
  };

  useEffect(() => {
    // Parse URL parameters
    const urlParams = new URLSearchParams(location.search);
    const details = {
      payment_id: urlParams.get('payment_id') || '',
      order_id: urlParams.get('order_id') || '',
      status: urlParams.get('status') || 'unknown',
      error: urlParams.get('error') || ''
    };
    setPaymentDetails(details);

    // Clear cart on successful payment
    if (details.status === 'success') {
      localStorage.removeItem('cart');
      // Dispatch storage event to update cart drawer
      window.dispatchEvent(new Event('storage'));
      
      // Fetch booking details for successful payments
      if (details.order_id) {
        getBookings(details.order_id);
      }
    }
  }, [location.search]);

  const handleContinueShopping = () => {
    navigate('/');
  };

  const handleViewOrders = () => {
    navigate('/orders'); // Adjust route as needed
  };

  const isSuccess = paymentDetails.status === 'success';
  const isFailure = paymentDetails.status === 'failed';

  return (
    <div className="payment-success-container">
      <div className="payment-success-card">
        {/* Success State */}
        {isSuccess && (
          <div>
            <div className="payment-success-icon">
              <svg
                width="80"
                height="80"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#4caf50"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22,4 12,14.01 9,11.01" />
              </svg>
            </div>
            <h1 className="payment-success-title">Payment Successful!</h1>
            <p className="payment-success-message">
              Your pooja booking has been confirmed. You will receive a confirmation email shortly.
            </p>

            {/* Booking Details Section */}
            {bookingDetails.loading && (
              <div className="booking-loading">
                <p>Loading booking details...</p>
              </div>
            )}

            {bookingDetails.request && !bookingDetails.loading && (
              <div className="booking-details-section">
                <h3 className="booking-details-title">Booking Details</h3>
                <div className="booking-info-card">
                  {bookingDetails.image && (
                    <div className="temple-image">
                      <img 
                        src={bookingDetails.image.startsWith('http') 
                          ? bookingDetails.image 
                          : `https://beta.devalayas.com${bookingDetails.image}`
                        } 
                        alt={bookingDetails.templeName}
                        className="temple-img"
                      />
                    </div>
                  )}
                  <div className="booking-info">
                    <div className="booking-detail-row">
                      <span className="booking-detail-label">Temple:</span>
                      <span className="booking-detail-value">{bookingDetails.templeName}</span>
                    </div>
                    <div className="booking-detail-row">
                      <span className="booking-detail-label">Devotee Name:</span>
                      <span className="booking-detail-value">{bookingDetails.devoteeName}</span>
                    </div>
                    <div className="booking-detail-row">
                      <span className="booking-detail-label">Amount:</span>
                      <span className="booking-detail-value">₹{bookingDetails.amount.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>

                {/* UPI Payment Option */}
                {bookingDetails.upiUrl && (
                  <div className="upi-payment-section">
                    <h4>Alternative Payment Method</h4>
                    <a 
                      href={bookingDetails.upiUrl} 
                      className="upi-payment-btn"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Pay via UPI
                    </a>
                  </div>
                )}
              </div>
            )}

            <div className="payment-success-details">
              <div className="payment-detail-row">
                <span className="payment-detail-label">Payment ID:</span>
                <span className="payment-detail-value">{paymentDetails.payment_id}</span>
              </div>
              <div className="payment-detail-row">
                <span className="payment-detail-label">Order ID:</span>
                <span className="payment-detail-value">{paymentDetails.order_id}</span>
              </div>
            </div>
          </div>
        )}

        {/* Failure State */}
        {isFailure && (
          <div>
            <div className="payment-failure-icon">
              <svg
                width="80"
                height="80"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#f44336"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            </div>
            <h1 className="payment-failure-title">Payment Failed</h1>
            <p className="payment-failure-message">
              Unfortunately, your payment could not be processed. Please try again.
            </p>
            {paymentDetails.error && (
              <div className="payment-error-details">
                <p className="payment-error-text">
                  <strong>Error:</strong> {decodeURIComponent(paymentDetails.error)}
                </p>
              </div>
            )}
            <div className="payment-success-details">
              {paymentDetails.payment_id && (
                <div className="payment-detail-row">
                  <span className="payment-detail-label">Payment ID:</span>
                  <span className="payment-detail-value">{paymentDetails.payment_id}</span>
                </div>
              )}
              {paymentDetails.order_id && (
                <div className="payment-detail-row">
                  <span className="payment-detail-label">Order ID:</span>
                  <span className="payment-detail-value">{paymentDetails.order_id}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Unknown State */}
        {!isSuccess && !isFailure && (
          <div>
            <div className="payment-unknown-icon">
              <svg
                width="80"
                height="80"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ff9800"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <point cx="12" cy="17" />
              </svg>
            </div>
            <h1 className="payment-unknown-title">Payment Status Unknown</h1>
            <p className="payment-unknown-message">
              We're unable to determine the status of your payment. Please contact support if you have any concerns.
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="payment-success-actions">
          {isSuccess && (
            <div>
              <button
                className="btn btn-primary payment-success-btn"
                onClick={handleViewOrders}
              >
                View My Orders
              </button>
              <button
                className="btn btn-outline-primary payment-success-btn"
                onClick={handleContinueShopping}
              >
                Continue Shopping
              </button>
            </div>
          )}
          
          {isFailure && (
            <div>
              <button
                className="btn btn-danger payment-success-btn"
                onClick={() => window.history.back()}
              >
                Try Again
              </button>
              <button
                className="btn btn-outline-secondary payment-success-btn"
                onClick={handleContinueShopping}
              >
                Continue Shopping
              </button>
            </div>
          )}
          
          {!isSuccess && !isFailure && (
            <button
              className="btn btn-primary payment-success-btn"
              onClick={handleContinueShopping}
            >
              Continue Shopping
            </button>
          )}
        </div>

        {/* Support Information */}
        <div className="payment-support-info">
          <p className="payment-support-text">
            Need help? Contact our support team at{' '}
            <a href="mailto:support@devalayas.com" className="payment-support-link">
              support@devalayas.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
