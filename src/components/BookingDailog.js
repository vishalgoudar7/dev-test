import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './BookingDialog.css';
import { useUserAuth } from '../context/UserAuthContext';

const BookingDialog = ({ request, tabNo, close }) => {
  const { profile } = useUserAuth();
  const [booking, setBooking] = useState({
    pooja_name: '',
    booking_date: null,
    name: '',
    mobile_no: profile?.phone || '',
    rashi: '',
    comment: '',
    prasadam: false,
    prasadam_address: {
      street_address_1: '',
      street_address_2: '',
      area: '',
      city: '',
      district: '',
      state: '',
      pincode: ''
    },
    prasad_delivery: false
  });

  const [error, setError] = useState({});

  const validateMobileNumber = (e) => {
    const val = e.target.value;
    if (/^\d{0,10}$/.test(val)) {
      setBooking({ ...booking, mobile_no: val });
    }
  };

  const handleChange = (field, value) => {
    setBooking(prev => ({ ...prev, [field]: value }));
  };

  const handleAddressChange = (field, value) => {
    setBooking(prev => ({
      ...prev,
      prasadam_address: { ...prev.prasadam_address, [field]: value }
    }));
  };

  const poojaSelections = () => {
    console.log('Added to cart:', booking);
  };

  return (
    <dialog id="payment" className="dialtag" open={request}>
      <div className="card shadow mb-4">
        <div className="card-header border-bottom">
          <div className="close-btn" onClick={close}>
            <i className="fas fa-times-circle"></i>
          </div>
          <h5>Booking Details</h5>
        </div>
        <div className="card-body">
          <div className="mb-2">
            <label>Pooja Name <span className="text-red">*</span></label>
            <input type="text" value={booking.pooja_name} disabled className="form-control" placeholder="Pooja Name" />
          </div>
          <div className="mb-2">
            <label>Booking Date <span className="text-red">*</span></label>
            <DatePicker
              selected={booking.booking_date}
              onChange={date => handleChange('booking_date', date)}
              dateFormat="dd/MM/yyyy"
              minDate={new Date()}
              className="form-control"
              placeholderText="Select Booking Date"
              disabled={!request}
            />
          </div>
          <div className="mb-2">
            <label>Devotee Name <span className="text-red">*</span></label>
            <input
              type="text"
              value={booking.name}
              onChange={e => handleChange('name', e.target.value)}
              className="form-control"
              disabled={!request}
            />
          </div>
          <div className="mb-2">
            <label>Devotee Mobile Number <span className="text-red">*</span></label>
            <input
              type="text"
              value={profile?.phone || ''}
              readOnly
              className="form-control"
              disabled
            />
          </div>

          {tabNo === 2 && (
            <>
              <div className="mb-2">
                <label>Rashi, Nakshatra, Gotra</label>
                <textarea
                  value={booking.rashi}
                  onChange={e => handleChange('rashi', e.target.value)}
                  className="form-control"
                  disabled={!request}
                />
              </div>
              <div className="mb-2">
                <label>Sankalpa</label>
                <textarea
                  value={booking.comment}
                  onChange={e => handleChange('comment', e.target.value)}
                  className="form-control"
                  disabled={!request}
                />
              </div>
              <div className="mb-2">
                <label>
                  <input
                    type="checkbox"
                    checked={booking.prasadam}
                    onChange={e => handleChange('prasadam', e.target.checked)}
                    disabled={!request}
                  /> Do you want Prasadam?
                </label>
              </div>
            </>
          )}

          {(booking.prasadam || tabNo === 4) && (
            <>
              {['street_address_1', 'street_address_2', 'area', 'city', 'district', 'state', 'pincode'].map((field, i) => (
                <div className="mb-2" key={i}>
                  <label>{field.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</label>
                  <input
                    type="text"
                    value={booking.prasadam_address[field] || ''}
                    onChange={e => handleAddressChange(field, e.target.value)}
                    className="form-control"
                  />
                </div>
              ))}
            </>
          )}

          <div className="mb-0">
            <button onClick={poojaSelections} className="btn btn-primary w-100">Add to Cart</button>
            <p className="note">Note: Video availability is subject to temple consent</p>
          </div>
        </div>
      </div>
    </dialog>
  );
};

export default BookingDialog;
