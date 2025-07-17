import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CheckoutModal from '../components/CheckoutModal';

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);

  const BASE_URL = process.env.REACT_APP_API_BASE_URL || '';

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('cart')) || [];
      setCart(stored.map(item => ({ ...item, quantity: item.quantity || 1 })));
    } catch {
      setCart([]);
    }
  }, []);

  const updateCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    window.dispatchEvent(new Event('storage'));
  };

  const increment = (id) => {
    const newCart = cart.map(item =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    updateCart(newCart);
  };

  const decrement = (id) => {
    const newCart = cart
      .map(item =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity - 1) } : item
      )
      .filter(item => item.quantity > 0);
    updateCart(newCart);
  };

  const removeItem = (id) => {
    const newCart = cart.filter(item => item.id !== id);
    updateCart(newCart);
  };

  const handleCheckout = () => {
    setShowCheckout(true);
  };

  const subtotal = cart.reduce(
    (sum, item) =>
      sum +
      (item.payment_data?.original_cost
        ? Number(item.payment_data.original_cost)
        : Number(item.final_total) || Number(item.cost) || 0) *
        (item.quantity || 1),
    0
  );

  const getImageUrl = (item) => {
    const image = item?.images?.[0]?.image;
    if (!image || image === 'null') return '';
    if (image.startsWith('http')) return image;
    if (image.startsWith('/')) return `${BASE_URL}${image}`;
    return `${BASE_URL}/${image}`;
  };

  return (
    <div className="container py-5" style={{ minHeight: '80vh' }}>
      <h1 className="text-center mb-5" style={{ fontWeight: 500, fontSize: '2.5rem' }}>
        POOJA SELECTIONS
      </h1>
      {cart.length === 0 ? (
        <div className="text-center">
          <p>Your cart is empty.</p>
          <Link to="/" className="btn btn-primary">Go Home</Link>
        </div>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table align-middle" style={{ minWidth: 900 }}>
              <thead style={{ background: '#fafafa' }}>
                <tr>
                  <th style={{ width: 180, fontWeight: 600, fontSize: '1.1rem' }}>Product</th>
                  <th></th>
                  <th style={{ width: 120, fontWeight: 600, fontSize: '1.1rem' }}>Price</th>
                  <th style={{ width: 160, fontWeight: 600, fontSize: '1.1rem' }}>Quantity</th>
                  <th style={{ width: 120, fontWeight: 600, fontSize: '1.1rem' }}>Total</th>
                  <th style={{ width: 40 }}></th>
                </tr>
              </thead>
              <tbody>
                {cart.map(item => (
                  <tr key={item.id} style={{ verticalAlign: 'middle' }}>
                    <td>
                      <img
                        src={getImageUrl(item)}
                        alt={item.name}
                        style={{
                          width: 110,
                          height: 110,
                          objectFit: 'contain',
                          borderRadius: 8,
                          background: '#fff',
                          border: '1px solid #eee'
                        }}
                        onError={e => {
                          e.target.onerror = null;
                          e.target.style.display = 'none';
                        }}
                      />
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>{item.name}</div>
                      <div className="text-muted" style={{ fontSize: 15 }}>{item.details}</div>
                    </td>
                    <td style={{ fontWeight: 500, fontSize: 18 }}>
                      Rs.<br />{item.final_total || item.cost}
                    </td>
                    <td>
                      <div className="d-flex align-items-center" style={{ maxWidth: 120 }}>
                        <button className="btn btn-outline-secondary btn-sm" onClick={() => decrement(item.id)}>-</button>
                        <span className="mx-2" style={{ minWidth: 24, textAlign: 'center' }}>{item.quantity}</span>
                        <button className="btn btn-outline-secondary btn-sm" onClick={() => increment(item.id)}>+</button>
                      </div>
                    </td>
                    <td style={{ fontWeight: 500, fontSize: 18 }}>
                      Rs.<br />{(item.final_total || item.cost) * item.quantity}
                    </td>
                    <td>
                      <button
                        className="btn btn-link text-danger"
                        onClick={() => removeItem(item.id)}
                        title="Remove"
                        style={{ fontSize: 22 }}
                      >
                        <span role="img" aria-label="delete">🗑️</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="d-flex flex-column align-items-end mt-4">
            <div style={{ minWidth: 400, background: '#fafafa', borderRadius: 8, padding: '24px 32px', fontSize: 22, fontWeight: 600 }}>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span>Subtotal</span>
                <span>Rs. {subtotal}</span>
              </div>
            </div>
            <div className="text-muted mt-2" style={{ fontSize: 15 }}>
              Tax included and shipping calculated at checkout
            </div>
            <button
              className="btn btn-lg mt-4"
              style={{
                background: '#c44a1c',
                color: '#fff',
                fontWeight: 600,
                width: 320,
                fontSize: 20,
                borderRadius: 6
              }}
              onClick={handleCheckout}
            >
              CHECKOUT
            </button>
            <Link to="/" className="btn btn-link mt-2" style={{ color: '#222', fontWeight: 500, fontSize: 17 }}>
              Continue Shopping
            </Link>
          </div>
        </>
      )}
      {showCheckout && (
        <CheckoutModal
          open={showCheckout}
          onClose={() => setShowCheckout(false)}
          cart={cart}
          setCart={setCart}
        />
      )}
    </div>
  );
};

export default CartPage;
