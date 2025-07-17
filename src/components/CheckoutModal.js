// import React, { useState, useEffect } from 'react';
// import { DayPicker } from 'react-day-picker';
// import 'react-day-picker/dist/style.css';
// import { useUserAuth } from '../context/UserAuthContext';
// import '../styles/CheckoutModal.css';

// // Razorpay script loader
// function loadRazorpayScript(src) {
//   return new Promise((resolve) => {
//     const script = document.createElement('script');
//     script.src = src;
//     script.onload = () => resolve(true);
//     script.onerror = () => resolve(false);
//     document.body.appendChild(script);
//   });
// }

// // Fetch pooja/prasadam charges by pooja ID and API key
// async function getChargesByPoojaId(poojaId, apiKey) {
//   try {
//     const response = await fetch(`https://beta.devalayas.com/api/v1/devotee/pooja/${poojaId}`, {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Token ${apiKey}`,
//       },
//     });
//     if (!response.ok) throw new Error('Failed to fetch pooja charges');
//     const data = await response.json();
//     return {
//       id: data.id,
//       name: data.name,
//       details: data.details,
//       included: data.included,
//       excluded: data.excluded,
//       cost: Number(data.cost),
//       original_cost: Number(data.original_cost),
//       convenience_fee: Number(data.convenience_fee),
//       booking_charges: Number(data.booking_charges),
//       fee_amount: Number(data.fee_amount),
//       tax_amount: Number(data.tax_amount),
//       final_total: Number(data.final_total),
//       prasad_delivery: data.prasad_delivery,
//       tax: data.tax,
//     };
//   } catch (err) {
//     console.error('Error fetching charges:', err);
//     return null;
//   }
// }

// // Removed static poojaId/charges and related debug logs. Fetch charges dynamically per cart item if needed.
// // Custom date picker with close on select
// function DatePickerWithClose({ selectedDate, onDateChange, error }) {
//   const [open, setOpen] = React.useState(false);

//   const selected = selectedDate ? new Date(selectedDate + 'T00:00:00') : undefined;

//   return (
//     <div style={{ position: 'relative', marginBottom: 8 }}>
//       <input
//         type="text"
//         readOnly
//         value={selected ? selected.toLocaleDateString() : ''}
//         placeholder="Booking Date *"
//         style={{
//           width: '100%',
//           padding: 8,
//           borderRadius: 6,
//           marginBottom: 0,
//           cursor: 'pointer',
//           background: '#fff'
//         }}
//         onClick={() => setOpen(true)}
//       />
//       {open && (
//         <div
//           style={{
//             position: 'absolute',
//             zIndex: 10,
//             top: 44,
//             left: 0,
//             background: '#fff',
//             borderRadius: 8,
//             boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
//             padding: 8
//           }}
//         >
//           <DayPicker
//             mode="single"
//             selected={selected}
//             onSelect={(date) => {
//               if (date) {
//                 const year = date.getFullYear();
//                 const month = String(date.getMonth() + 1).padStart(2, '0');
//                 const day = String(date.getDate()).padStart(2, '0');
//                 onDateChange(`${year}-${month}-${day}`);
//                 setOpen(false);
//               }
//             }}
//             fromDate={new Date()}
//             required
//           />
//         </div>
//       )}
//       {error && <span className="checkout-error">{error}</span>}
//     </div>
//   );
// }

// const CheckoutModal = ({ open, onClose }) => {
//   const { profile } = useUserAuth();
//   const [showConfirm, setShowConfirm] = useState(false);
//   const [cart, setCart] = useState([]);
//   const [address, setAddress] = useState({
//     bookingDate: '',
//     devoteeName: '',
//     devoteeMobile: '',
//     sankalpa: '',
//     street1: '',
//     street2: '',
//     area: '',
//     city: '',
//     state: '',
//     pincode: ''
//   });

//   const [savedAddresses, setSavedAddresses] = useState(() => {
//     try {
//       return JSON.parse(localStorage.getItem('savedAddresses')) || [];
//     } catch {
//       return [];
//     }
//   });

//   const [showAddressForm, setShowAddressForm] = useState(() => {
//     try {
//       const saved = JSON.parse(localStorage.getItem('savedAddresses')) || [];
//       return saved.length === 0;
//     } catch {
//       return true;
//     }
//   });

//   const [errors, setErrors] = useState({});
//   // Removed unused editModalOpen and editAddress to resolve linter warnings

//   // Prefill devoteeName and devoteeMobile from profile if available
//   useEffect(() => {
//     if (profile) {
//       setAddress((prev) => ({
//         ...prev,
//         devoteeName:
//           profile.firstName && profile.lastName
//             ? `${profile.firstName} ${profile.lastName}`
//             : profile.firstName || prev.devoteeName,
//         devoteeMobile: profile.phone || prev.devoteeMobile
//       }));
//     }
//   }, [profile, open]);

//   // When modal opens, if there are saved addresses, select the first one and hide address form
//   useEffect(() => {
//     if (open) {
//       try {
//         const stored = localStorage.getItem('savedAddresses')
//           ? JSON.parse(localStorage.getItem('savedAddresses'))
//           : [];
//         if (stored.length > 0) {
//           setAddress((a) => ({ ...stored[0], bookingDate: a.bookingDate || '' }));
//           setShowAddressForm(false);
//         } else {
//           setShowAddressForm(true);
//         }
//       } catch {
//         setShowAddressForm(true);
//       }
//     }
//   }, [open]);

//   useEffect(() => {
//     if (open) {
//       try {
//         const stored = JSON.parse(localStorage.getItem('cart')) || [];
//         setCart(stored.map((item) => ({ ...item, quantity: item.quantity || 1 })));
//       } catch {
//         setCart([]);
//       }
//     }
//   }, [open]);

//   const [charges, setCharges] = useState({
//     prasadCost: 0,
//     convinceCharge: 0,
//     shippingCharge: 0,
//     subtotal: 0,
//     gst: 0,
//     total: 0
//   });

//   useEffect(() => {
//     // Always use API values for all price components if available, including shipping charge from API
//     let subtotal = cart.reduce(
//       (sum, item) => sum + (Number(item.payment_data?.original_cost) || Number(item.original_cost) || 0) * (item.quantity || 1),
//       0
//     );
//     let convinceCharge = cart.reduce(
//       (sum, item) => sum + (Number(item.payment_data?.convenience_fee) || Number(item.convenience_fee) || 0) * (item.quantity || 1),
//       0
//     );
//     // Use booking_charges from API for shipping
//     let shippingCharge = cart.reduce(
//       (sum, item) => sum + (Number(item.payment_data?.booking_charges) || Number(item.booking_charges) || 0) * (item.quantity || 1),
//       0
//     );
//     // Use tax_amount from API for GST
//     let gst = cart.reduce(
//       (sum, item) => sum + (Number(item.payment_data?.tax_amount) || Number(item.tax_amount) || 0) * (item.quantity || 1),
//       0
//     );
//     let total = subtotal + convinceCharge + shippingCharge + gst;

//     setCharges({ prasadCost: 0, convinceCharge, shippingCharge, subtotal, gst, total });
//   }, [cart]);

//   const isAddressValid = () => {
//     return (
//       address.bookingDate &&
//       address.devoteeName &&
//       /^\d{10}$/.test(address.devoteeMobile) &&
//       address.street1 &&
//       address.area &&
//       address.city &&
//       address.state &&
//       /^\d{6}$/.test(address.pincode)
//     );
//   };

//   const API_TOKEN = '94c4c11bfac761ba896de08bd383ca187d4e4dc4';

//   async function fetchRazorpayKey() {
//     try {
//       const response = await fetch('https://beta.devalayas.com/api/v1/devotee/payment_key/ ', {
//         headers: {
//           Authorization: `Token ${API_TOKEN}`
//         }
//       });
//       if (!response.ok) throw new Error('Failed to fetch Razorpay key');
//       const data = await response.json();
//       return data.key;
//     } catch (err) {
//       alert('Unable to fetch payment key.');
//       return null;
//     }
//   }

//   async function placeOrder(rz_response, paymentId, orderId) {
//     try {
//       const data = {
//         razorpay_payment_id: rz_response.razorpay_payment_id,
//         razorpay_order_id: rz_response.razorpay_order_id,
//         razorpay_signature: rz_response.razorpay_signature,
//         request_id: paymentId
//       };
//       // Always use the working API token (hardcoded)
//       const response = await fetch('https://beta.devalayas.com/api/v1/devotee/pooja_request/payment/', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json', Authorization: `Token 94c4c11bfac761ba896de08bd383ca187d4e4dc4` },
//         body: JSON.stringify(data)
//       });
//       if (!response.ok) {
//         // Try to get error details, but always redirect to payment success page
//         const errData = await response.json().catch(() => ({}));
//         window.location.href = `/payment-success?payment_id=${rz_response.razorpay_payment_id}&order_id=${orderId}&status=failed&error=${encodeURIComponent(errData.detail || response.statusText)}`;
//         return;
//       }
//       // On success, redirect to payment success page
//       window.location.href = `/payment-success?payment_id=${rz_response.razorpay_payment_id}&order_id=${orderId}&status=success`;
//     } catch (err) {
//       // On error, redirect to payment success page with error info
//       window.location.href = `/payment-success?payment_id=${rz_response.razorpay_payment_id}&order_id=${orderId}&status=failed&error=${encodeURIComponent(err.message)}`;
//     }
//   }

//   if (!open) return null;

//   return (
//     <div className="checkout-modal-overlay" onClick={() => setShowConfirm(true)}>
//       <div className="checkout-modal" onClick={(e) => e.stopPropagation()}>
//         {/* Modal Top Header */}
//         <div className="checkout-modal-header-bar">
//           <img src={require('../assets/logo.png')} alt="Logo" className="checkout-modal-logo" />
//           <h4 className="checkout-modal-title">Checkout Details</h4>
//           <button
//             className="checkout-modal-top-close-btn"
//             onClick={() => setShowConfirm(true)}
//             aria-label="Close"
//           >
//             <svg
//               width="28"
//               height="28"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//             >
//               <line x1="18" y1="6" x2="6" y2="18" />
//               <line x1="6" y1="6" x2="18" y2="18" />
//             </svg>
//           </button>
//         </div>

//         <div className="checkout-modal-content">
//           {/* Left: Address Form */}
//           <div className="checkout-modal-left" style={{ position: 'relative' }}>
//             {showConfirm && (
//               <div className="checkout-confirm-overlay" onClick={(e) => e.stopPropagation()}>
//                 <div className="checkout-confirm-dialog">
//                   <div className="checkout-confirm-title">Are you sure?</div>
//                   <div className="checkout-confirm-message">Do you want to close the payment.</div>
//                   <div className="checkout-confirm-actions">
//                     <button
//                       className="btn btn-danger me-2"
//                       onClick={() => {
//                         setShowConfirm(false);
//                         onClose();
//                       }}
//                     >
//                       Confirm
//                     </button>
//                     <button
//                       className="btn btn-secondary"
//                       onClick={() => setShowConfirm(false)}
//                     >
//                       Cancel
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             )}

//             <div style={{ marginBottom: 12 }}>
//               <label style={{ fontWeight: 600, fontSize: '1.08rem', display: 'block', marginBottom: 4 }}>
//                 Select Your Puja Date
//               </label>
//               <DatePickerWithClose
//                 selectedDate={address.bookingDate}
//                 onDateChange={(date) => setAddress({ ...address, bookingDate: date })}
//                 error={errors?.bookingDate}
//               />
//             </div>

//             <div className="checkout-modal-address-label">
//               <span>Address</span>
//             </div>

//             <div className="checkout-modal-left-scroll">
//               {/* Show saved addresses */}
//               {savedAddresses.length > 0 && !showAddressForm && (
//                 <div
//                   style={{
//                     marginBottom: 16,
//                     opacity: address.bookingDate ? 1 : 0.5,
//                     pointerEvents: address.bookingDate ? 'auto' : 'none'
//                   }}
//                 >
//                   <label style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>Shipping address</label>
//                   <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
//                     {savedAddresses.map((addr, idx) => {
//                       const isSelected = (() => {
//                         const { bookingDate: _1, ...a1 } = addr;
//                         const { bookingDate: _2, ...a2 } = address;
//                         return JSON.stringify(a1) === JSON.stringify(a2);
//                       })();
//                       return (
//                         <div
//                           key={idx}
//                           className="address-card"
//                           style={{
//                             border: isSelected ? '2px solid #c1440e' : '1.5px solid #ddd',
//                             borderRadius: 10,
//                             padding: '16px 18px 12px 18px',
//                             background: isSelected ? '#fff8f2' : '#fff',
//                             boxShadow: isSelected
//                               ? '0 2px 8px rgba(193,68,14,0.08)'
//                               : '0 1px 4px rgba(0,0,0,0.03)',
//                             position: 'relative',
//                             cursor: address.bookingDate ? 'pointer' : 'not-allowed',
//                             minHeight: 80
//                           }}
//                           onClick={() => {
//                             if (!address.bookingDate) return;
//                             setAddress((a) => ({ ...addr, bookingDate: a.bookingDate }));
//                             setShowAddressForm(false);
//                           }}
//                         >
//                           <div
//                             style={{
//                               display: 'flex',
//                               alignItems: 'flex-start',
//                               justifyContent: 'space-between'
//                             }}
//                           >
//                             <div style={{ fontWeight: 600, fontSize: '1.08rem' }}>{addr.devoteeName}</div>
//                             {isSelected && (
//                               <span style={{ color: '#c1440e', fontWeight: 700, fontSize: 22 }}>&#10003;</span>
//                             )}
//                           </div>
//                           <div>{addr.street1}, {addr.area}, {addr.city}, {addr.state} - {addr.pincode}</div>
//                           <div>{addr.devoteeMobile}</div>
//                           {/*
//                           <button
//                             type="button"
//                             style={{
//                               position: 'absolute',
//                               top: 10,
//                               right: 16,
//                               background: 'none',
//                               border: 'none',
//                               color: '#c1440e',
//                               textDecoration: 'underline',
//                               cursor: address.bookingDate ? 'pointer' : 'not-allowed'
//                             }}
//                             onClick={(e) => {
//                               if (!address.bookingDate) return;
//                               e.stopPropagation();
//                               // setEditAddress(addr);
//                               // setEditModalOpen(true);
//                             }}
//                           >
//                             edit
//                           </button>
//                           */}
//                         </div>
//                       );
//                     })}
//                   </div>
//                   <button
//                     type="button"
//                     style={{
//                       display: 'flex',
//                       alignItems: 'center',
//                       gap: 6,
//                       marginTop: 18,
//                       background: 'none',
//                       border: 'none',
//                       color: '#c1440e',
//                       fontWeight: 500,
//                       fontSize: 17
//                     }}
//                     onClick={() => {
//                       if (!address.bookingDate) return;
//                       setShowAddressForm(true);
//                       setAddress((a) => ({
//                         bookingDate: a.bookingDate,
//                         devoteeName: a.devoteeName,
//                         devoteeMobile: a.devoteeMobile,
//                         sankalpa: '',
//                         street1: '',
//                         street2: '',
//                         area: '',
//                         city: '',
//                         state: '',
//                         pincode: ''
//                       }));
//                     }}
//                   >
//                     + Add new address
//                   </button>
//                 </div>
//               )}

//               {/* Show address form */}
//               {showAddressForm && (
//                 <form
//                   onSubmit={(e) => {
//                     e.preventDefault();
//                     const newErrors = {};
//                     if (!address.bookingDate) newErrors.bookingDate = 'Required';
//                     if (!address.devoteeName) newErrors.devoteeName = 'Required';
//                     if (!address.devoteeMobile || !/^\d{10}$/.test(address.devoteeMobile))
//                       newErrors.devoteeMobile = 'Valid 10-digit mobile required';
//                     if (!address.street1) newErrors.street1 = 'Required';
//                     if (!address.area) newErrors.area = 'Required';
//                     if (!address.city) newErrors.city = 'Required';
//                     if (!address.state) newErrors.state = 'Required';
//                     if (!address.pincode || !/^\d{6}$/.test(address.pincode))
//                       newErrors.pincode = 'Valid 6-digit pincode required';

//                     setErrors(newErrors);

//                     if (Object.keys(newErrors).length === 0) {
//                       const updatedAddresses = [...savedAddresses, address];
//                       setSavedAddresses(updatedAddresses);
//                       localStorage.setItem('savedAddresses', JSON.stringify(updatedAddresses));
//                       setShowAddressForm(false);
//                       alert('Address saved! Proceeding to payment...');
//                     }
//                   }}
//                 >
//                   <div className="mb-2">
//                     <label>Devotee Name *</label>
//                     <input
//                       type="text"
//                       value={address.devoteeName}
//                       onChange={(e) => setAddress({ ...address, devoteeName: e.target.value })}
//                       className="form-control"
//                       placeholder="Devotee Name"
//                     />
//                     {errors.devoteeName && <span className="checkout-error">{errors.devoteeName}</span>}
//                   </div>

//                   <div className="mb-2">
//                     <label>Devotee Mobile Number *</label>
//                     <input
//                       type="tel"
//                       maxLength={10}
//                       value={address.devoteeMobile}
//                       onChange={(e) =>
//                         setAddress({ ...address, devoteeMobile: e.target.value.replace(/[^0-9]/g, '') })
//                       }
//                       className="form-control"
//                       placeholder="10-digit Mobile"
//                     />
//                     {errors.devoteeMobile && (
//                       <span className="checkout-error">{errors.devoteeMobile}</span>
//                     )}
//                   </div>

//                   <div className="mb-2">
//                     <label>Sankalpa (optional)</label>
//                     <input
//                       type="text"
//                       value={address.sankalpa}
//                       onChange={(e) => setAddress({ ...address, sankalpa: e.target.value })}
//                       className="form-control"
//                       placeholder="Sankalpa"
//                     />
//                   </div>

//                   <div className="mb-2">
//                     <label>Street Address 1 *</label>
//                     <input
//                       type="text"
//                       value={address.street1}
//                       onChange={(e) => setAddress({ ...address, street1: e.target.value })}
//                       className="form-control"
//                       placeholder="Street Address"
//                     />
//                     {errors.street1 && <span className="checkout-error">{errors.street1}</span>}
//                   </div>

//                   <div className="mb-2">
//                     <label>Street Address 2 (optional)</label>
//                     <input
//                       type="text"
//                       value={address.street2}
//                       onChange={(e) => setAddress({ ...address, street2: e.target.value })}
//                       className="form-control"
//                       placeholder="Street Address"
//                     />
//                   </div>

//                   <div className="mb-2">
//                     <label>Area *</label>
//                     <input
//                       type="text"
//                       value={address.area}
//                       onChange={(e) => setAddress({ ...address, area: e.target.value })}
//                       className="form-control"
//                       placeholder="Area"
//                     />
//                     {errors.area && <span className="checkout-error">{errors.area}</span>}
//                   </div>

//                   <div className="mb-2">
//                     <label>City *</label>
//                     <input
//                       type="text"
//                       value={address.city}
//                       onChange={(e) => setAddress({ ...address, city: e.target.value })}
//                       className="form-control"
//                       placeholder="City"
//                     />
//                     {errors.city && <span className="checkout-error">{errors.city}</span>}
//                   </div>

//                   <div className="mb-2">
//                     <label>State *</label>
//                     <input
//                       type="text"
//                       value={address.state}
//                       onChange={(e) => setAddress({ ...address, state: e.target.value })}
//                       className="form-control"
//                       placeholder="State"
//                     />
//                     {errors.state && <span className="checkout-error">{errors.state}</span>}
//                   </div>

//                   <div className="mb-2">
//                     <label>Pincode * (6-digit Pincode)</label>
//                     <input
//                       type="text"
//                       value={address.pincode}
//                       maxLength={6}
//                       onChange={(e) => setAddress({ ...address, pincode: e.target.value.replace(/[^0-9]/g, '')})}
//                       className="form-control"
//                       placeholder="Pincode"
//                     />
//                     {errors.pincode && <span className="checkout-error">{errors.pincode}</span>}
//                   </div>

//                   <button className="checkout-proceed-btn" type="submit">
//                     Save Address & Proceed to Payment
//                   </button>
//                 </form>
//               )}

//               {/* Proceed to Payment Button */}
//               {!showAddressForm && isAddressValid() && (
//                 <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end' }}>
//                   <button
//                     type="button"
//                     className="checkout-proceed-btn"
//                     disabled={!isAddressValid()}
//                     onClick={async () => {

//                       if (!isAddressValid()) return;

//                       // --- Allow guest checkout: userToken/profile may be missing ---
//                       const userToken = localStorage.getItem('token') || '94c4c11bfac761ba896de08bd383ca187d4e4dc4';

//                       const res = await loadRazorpayScript('https://checkout.razorpay.com/v1/checkout.js');
//                       if (!res) {
//                         alert('Razorpay SDK failed to load.');
//                         return;
//                       }

//                       const rzKey = await fetchRazorpayKey();
//                       if (!rzKey) return;

//                       // ✅ Step 1: Send POST to create pooja order
//                       const constructPayload = () => {
//                         // Validate address and cart
//                         if (!isAddressValid() || cart.length === 0) {
//                           alert('Please complete the address and cart details.');
//                           return null;
//                         }

//                         // Allow guest checkout: fallback to 'CSC' if no profile.id
//                         const bookedBy = (profile && profile.id) ? profile.id : 'CSC';
//                         const familyId = (profile && profile.id) ? profile.id : 1;
//                         const devoteeName = address.devoteeName || profile?.name || profile?.firstName || 'Devotee';
//                         const devoteeNumber = `+91${address.devoteeMobile || profile?.phone || ''}`;
//                         return {
//                           requests: cart.map((item, index) => ({
//                             comment: `( Nakshatra: ${address.nakshatra || ''} )( Gotra: ${address.gotra || ''} )( Rashi: ${address.rashi || ''} )`,
//                             is_prasadam_delivery: true,
//                             pooja_date: address.bookingDate, // format: 'YYYY-MM-DD'
//                             pooja: item.id || item.pooja_id || 467,
//                             devotee_name: devoteeName,
//                             devotee_number: devoteeNumber,
//                             booked_by: bookedBy,
//                             family_member: [
//                               {
//                                 id: familyId,
//                                 name: devoteeName
//                               }
//                             ],
//                             sankalpa: address.sankalpa,
//                             nakshatra: address.nakshatra || '',
//                             gotra: address.gotra || '',
//                             rashi: address.rashi || '',
//                             street1: address.street1,
//                             street2: address.street2,
//                             area: address.area,
//                             city: address.city,
//                             state: address.state,
//                             pincode: address.pincode,
//                             booking_date: address.bookingDate
//                           }))
//                         };
//                       };

//                       const payload = constructPayload();
//                       if (!payload) return;

//                       console.log('Payload being sent:', payload);

//                       // Always use the user's token for authentication
//                       const response = await fetch('https://beta.devalayas.com/api/v1/devotee/bulk_pooja_request/', {
//                         method: 'POST',
//                         headers: {
//                           'Content-Type': 'application/json',
//                           Authorization: `Token ${userToken}`,
//                         },
//                         body: JSON.stringify(payload),
//                       });

//                       if (!response.ok) {
//                         const error = await response.json();
//                         console.error('Order creation failed:', error);
//                         alert('Failed to create pooja order: ' + JSON.stringify(error));
//                         return;
//                       }

//                       const data = await response.json();

//                       const order = data[0];

//                       // Always use the UI summary total for payment amount (from cart summary)
//                       // If charges.total is not available, fallback to order.payment_data.final_total
//                       let paymentAmount = charges.total;
//                       if (!paymentAmount || isNaN(paymentAmount) || paymentAmount <= 0) {
//                         paymentAmount = order?.payment_data?.final_total || 1;
//                       }
//                       const amount = Math.round(Number(paymentAmount) * 100);
//                       const razorpayOrderId = order.payment_order_id;
//                       const internalOrderId = order.order_id;

//                       // ✅ Step 2: Trigger Razorpay
//                       const options = {
//                         key: rzKey,
//                         amount,
//                         currency: 'INR',
//                         name: 'Devalaya',
//                         description: 'Payment towards Event Pooja',
//                         image: 'https://cdn.shopify.com/s/files/1/0735/5895/0166/files/unnamed_copy_ac3ece77-8a3a-44b7-b0f2-820c39455044.jpg?v=1679241399&width=500',
//                         order_id: razorpayOrderId,
//                         handler: function (rz_response) {
//                           placeOrder(rz_response, rz_response.razorpay_payment_id, internalOrderId);
//                         },
//                         prefill: {
//                           name: order.name,
//                           email: profile?.email || '',
//                           contact: order.devotee_number,
//                         },
//                         notes: {
//                           address: 'Devalaya',
//                         },
//                         theme: {
//                           color: '#df3002',
//                         },
//                       };

//                       const rzp1 = new window.Razorpay(options);
//                       rzp1.on('payment.failed', function (response) {
//                         alert(JSON.stringify(response.error));
//                       });
//                       rzp1.open();
//                     }}
//                   >
//                     Proceed to Checkout / Make Payment
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Right: Cart Summary */}
//           <div className="checkout-modal-right">
//             <h5>Cart</h5>
//             <div className="checkout-cart-list">
//               {cart.map((item) => (
//                 <div className="checkout-cart-item" key={item.id}>
//                   {item.images?.[0]?.image && (
//                     <img
//                       src={
//                         item.images[0].image.startsWith('http')
//                           ? item.images[0].image
//                           : ` https://beta.devalayas.com ${item.images[0].image}`
//                       }
//                       alt={item.name}
//                       className="checkout-cart-img"
//                     />
//                   )}
//                   <div className="checkout-cart-info">
//                     <div className="checkout-cart-title">{item.name}</div>
//                     <div className="checkout-cart-qty">
//                       {item.quantity} x ₹{(item.quantity * Number(item.final_total || item.cost)).toLocaleString('en-IN')}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             <div className="checkout-cart-summary">
//               <div className="checkout-summary-row">
//                 <span>Subtotal</span>
//                 <span>₹{charges.subtotal}</span>
//               </div>
//               <div className="checkout-summary-row">
//                 <span>Convenience Charge</span>
//                 <span>₹{charges.convinceCharge}</span>
//               </div>
//               <div className="checkout-summary-row">
//                 <span>Shipping Charge</span>
//                 <span>₹{charges.shippingCharge}</span>
//               </div>
//               <div className="checkout-summary-row">
//                 <span>GST</span>
//                 <span>₹{charges.gst}</span>
//               </div>
//               <div className="checkout-summary-row checkout-summary-total">
//                 <span>Total (inc. all taxes)</span>
//                 <span>₹{charges.total}</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CheckoutModal;