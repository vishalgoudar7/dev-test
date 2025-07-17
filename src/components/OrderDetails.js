// src/components/OrderDetails.js
import React from 'react';
import '../../styles/OrderDetails.css';

const OrderDetails = ({ payment, booking, razorpayPayment, closeDialog }) => {
  return (
    <div className="card shadow">
      <div className="card-header border-bottom">
        <div className="float-right">
          <i className="fas fa-times-circle" onClick={closeDialog}></i>
        </div>
        <h5 className="mb-0">Order Details</h5>
      </div>
      <div className="card-body">
        <ul className="list-group list-group-borderless mb-3">
          {["Pooja Cost", "Prasadam Delivery", "Platform Fee", "Tax"].map((field, index) => (
            <li
              key={index}
              className="list-group-item py-2"
              style={{ display: field === "Prasadam Delivery" && !booking.prasadam ? "none" : "flex" }}
            >
              <span className="h6 fw-light mb-0">{field}</span>
              <span className="h6 fw-light mb-0">₹{payment[field.toLowerCase().replace(/ /g, '_')]}</span>
            </li>
          ))}
          <li className="list-group-item py-2">
            <hr className="my-0" />
          </li>
          <li className="list-group-item pb-0">
            <div>
              <h5 className="fw-normal mb-0">Total</h5>
              <small>Inc. of all taxes</small>
            </div>
            <span className="h5 fw-normal mb-0">₹{payment.final_total}</span>
          </li>
        </ul>
        <button className="btn btn-primary w-100 mb-0" onClick={razorpayPayment}>Place Order</button>
      </div>
    </div>
  );
};

export default OrderDetails;