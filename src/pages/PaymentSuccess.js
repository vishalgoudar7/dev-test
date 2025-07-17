import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // Data passed via navigate state
  // Support both: query params (for direct payment redirect) and state (for in-app navigation)
  const params = new URLSearchParams(location.search);
  const paymentId = params.get('payment_id');
  const orderId = params.get('order_id') || (location.state && location.state.orderId);
  const devoteeName = (location.state && location.state.devoteeName) || '';
  const templeName = (location.state && location.state.templeName) || '';
  const templeImg = (location.state && location.state.templeImg) || '';

  if (!orderId && !paymentId) {
    setTimeout(() => navigate('/'), 2000);
    return <div style={{ padding: 40, textAlign: 'center' }}>No payment info found. Redirecting...</div>;
  }

  return (
    <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#fff8f2' }}>
      <img src={templeImg || require('../assets/logo.png')} alt={templeName || 'Devalaya'} style={{ width: 120, marginBottom: 24, borderRadius: 12 }} />
      <h2 style={{ color: '#28a745', marginBottom: 12 }}>Payment Successful!</h2>
      <p style={{ fontSize: 18, color: '#333', marginBottom: 8 }}>Thank you for your booking.</p>
      {paymentId && <p style={{ color: '#555' }}>Payment ID: <b>{paymentId}</b></p>}
      {orderId && <p style={{ color: '#555' }}>Order ID: <b>{orderId}</b></p>}
      {devoteeName && <p style={{ color: '#555' }}>Devotee: <b>{devoteeName}</b></p>}
      {templeName && <p style={{ color: '#555' }}>Temple: <b>{templeName}</b></p>}
      <button
        style={{ marginTop: 32, padding: '10px 32px', background: '#df3002', color: '#fff', border: 'none', borderRadius: 6, fontSize: 18, cursor: 'pointer' }}
        onClick={() => navigate('/')}
      >
        Go to Home
      </button>
    </div>
  );
};

export default PaymentSuccess;
