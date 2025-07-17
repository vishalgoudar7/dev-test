// src/api/poojaService.js
import api from './api';

// Get the current API configuration
const API_CONFIG = {
  servers: {
    beta: {
      base: "https://beta.devalayas.com",
      token: "94c4c11bfac761ba896de08bd383ca187d4e4dc4"
    },
    live: {
      base: "https://live.devalayas.com", 
      token: "18a6c4adbef1a4398a1869347358a926689bbdb8"
    }
  },
  current: 'beta'
};

const { token: API_TOKEN } = API_CONFIG.servers[API_CONFIG.current];

/**
 * Fetch Poojas/Prasadams for a specific temple
 * @param {string} templeId - Temple ID
 * @param {string} searchQuery - Search query (optional)
 * @returns {Promise} API response
 */
export const fetchPoojas = async (templeId, searchQuery = '') => {
  try {
    const response = await api.get(`/api/v1/devotee/pooja/`, {
      params: {
        temple: templeId,
        search: searchQuery
      },
      headers: {
        Authorization: `Token ${API_TOKEN}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching poojas:', error);
    throw error;
  }
};

/**
 * Fetch Constants for configuration data
 * @returns {Promise} API response with constants
 */
export const fetchConstants = async () => {
  try {
    const response = await api.get('/api/v1/devotee/constants/', {
      headers: {
        Authorization: `Token ${API_TOKEN}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching constants:', error);
    throw error;
  }
};

/**
 * Request a specific pooja (when no pujari is available)
 * @param {string} poojaId - Pooja ID
 * @returns {Promise} API response
 */
export const requestPooja = async (poojaId) => {
  try {
    const response = await api.get(`/api/v1/devotee/pooja/${poojaId}/request`, {
      headers: {
        Authorization: `Token ${API_TOKEN}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error requesting pooja:', error);
    throw error;
  }
};

/**
 * Submit bulk pooja request from cart
 * @param {Array} cartRequests - Array of pooja requests
 * @returns {Promise} API response with order details
 */
export const submitBulkPoojaRequest = async (cartRequests) => {
  try {
    const response = await api.post('/api/v1/devotee/bulk_pooja_request/', {
      requests: cartRequests
    }, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${API_TOKEN}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error submitting bulk pooja request:', error);
    throw error;
  }
};

/**
 * Fetch Razorpay payment key
 * @returns {Promise} API response with Razorpay key
 */
export const fetchRazorpayKey = async () => {
  try {
    const response = await api.get('/api/v1/devotee/payment_key/', {
      headers: {
        Authorization: `Token ${API_TOKEN}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching Razorpay key:', error);
    throw error;
  }
};

/**
 * Confirm payment with Razorpay response
 * @param {Object} paymentData - Payment confirmation data
 * @returns {Promise} API response
 */
export const confirmPayment = async (paymentData) => {
  try {
    const response = await api.post('/api/v1/devotee/pooja_request/payment/', paymentData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${API_TOKEN}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error confirming payment:', error);
    throw error;
  }
};

/**
 * Get pooja details by ID (for fetching charges)
 * @param {string} poojaId - Pooja ID
 * @returns {Promise} API response with pooja details
 */
export const getPoojaById = async (poojaId) => {
  try {
    const response = await api.get(`/api/v1/devotee/pooja/${poojaId}`, {
      headers: {
        Authorization: `Token ${API_TOKEN}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching pooja details:', error);
    throw error;
  }
};

/**
 * Load Razorpay script dynamically
 * @param {string} src - Razorpay script URL
 * @returns {Promise<boolean>} Success status
 */
export const loadRazorpayScript = (src = 'https://checkout.razorpay.com/v1/checkout.js') => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

/**
 * Helper function to construct bulk pooja request payload
 * @param {Array} cart - Cart items
 * @param {Object} address - Address details
 * @param {Object} profile - User profile
 * @returns {Object} Formatted payload
 */
export const constructBulkPoojaPayload = (cart, address, profile) => {
  const bookedBy = (profile && profile.id) ? profile.id : 'CSC';
  const familyId = (profile && profile.id) ? profile.id : 1;
  const devoteeName = address.devoteeName || profile?.name || profile?.firstName || 'Devotee';
  const devoteeNumber = `+91${address.devoteeMobile || profile?.phone || ''}`;

  return {
    requests: cart.map((item) => ({
      comment: `( Nakshatra: ${address.nakshatra || ''} )( Gotra: ${address.gotra || ''} )( Rashi: ${address.rashi || ''} )`,
      is_prasadam_delivery: true,
      pooja_date: address.bookingDate,
      pooja: item.id || item.pooja_id || 467,
      devotee_name: devoteeName,
      devotee_number: devoteeNumber,
      booked_by: bookedBy,
      family_member: [
        {
          id: familyId,
          name: devoteeName
        }
      ],
      sankalpa: address.sankalpa || '',
      nakshatra: address.nakshatra || '',
      gotra: address.gotra || '',
      rashi: address.rashi || '',
      street1: address.street1,
      street2: address.street2 || '',
      area: address.area,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      booking_date: address.bookingDate,
      // Add prasadam delivery address fields explicitly
      prasadam_delivery_street1: address.street1,
      prasadam_delivery_street2: address.street2 || '',
      prasadam_delivery_area: address.area,
      prasadam_delivery_city: address.city,
      prasadam_delivery_state: address.state,
      prasadam_delivery_pincode: address.pincode
    }))
  };
};

const poojaService = {
  fetchPoojas,
  fetchConstants,
  requestPooja,
  submitBulkPoojaRequest,
  fetchRazorpayKey,
  confirmPayment,
  getPoojaById,
  loadRazorpayScript,
  constructBulkPoojaPayload
};

export default poojaService;
