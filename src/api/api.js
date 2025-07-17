// /// src/api/api.js
// import axios from 'axios';
// import config from './config'; // ✅ Import baseURL from config.js

// const api = axios.create({
//   baseURL: config.BASE_URL, // ✅ Use fallback-safe baseURL
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // ✅ Attach token from localStorage to every request
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers['Authorization'] = `Token ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // ✅ Helper: Convert payload to x-www-form-urlencoded
// const toFormUrlEncoded = (obj) =>
//   Object.keys(obj)
//     .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`)
//     .join('&');

// // ✅ Mobile login OTP send
// export const sendMobileOtp = async (mobile_number) => {
//   const payload = {
//     mobile_number,
//     login_token: '123',
//     app_version: '1',
//     device_model: 'Browser',
//     user_type: 'Devotee',
//     lang: 'en',
//   };

//   const response = await api.post(
//     '/api/v1/auth/',
//     toFormUrlEncoded(payload),
//     {
//       headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
//     }
//   );

//   return response.data;
// };

// // ✅ Mobile login verify
// export const loginWithMobile = async (mobile_number, otp) => {
//   const payload = {
//     mobile_number,
//     otp,
//     login_token: '123',
//     app_version: '1',
//     device_model: 'Browser',
//     user_type: 'Devotee',
//   };

//   const response = await api.post(
//     '/api/v1/devotee/login/',
//     toFormUrlEncoded(payload),
//     {
//       headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
//     }
//   );

//   if (response.data.token) {
//     localStorage.setItem('token', response.data.token);
//   }

//   return response.data;
// };

// // ✅ Email login verify
// export const loginWithEmail = async (email, otp) => {
//   const payload = {
//     email,
//     otp,
//     login_token: '123',
//     app_version: '1',
//     device_model: 'Browser',
//     user_type: 'Devotee',
//   };

//   const response = await api.post(
//     '/api/v1/devotee/login/',
//     toFormUrlEncoded(payload),
//     {
//       headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
//     }
//   );

//   if (response.data.token) {
//     localStorage.setItem('token', response.data.token);
//   }

//   return response.data;
// };

// export default api;
















// // working live for temple

// // src/api/api.js
// import axios from 'axios';

// // 🔒 Hardcoded live token for testing
// const LIVE_TOKEN = '46c1e874b116778356a8f7dca5420b2e740d9ac7';
// //  const LIVE_TOKEN = 'c91ae32509fa4ce4e8c21aa4a86118100f97c4f2';

// // Axios instance
// const api = axios.create({
//   baseURL: 'https://live.devalayas.com',
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Attach live token on each request
// api.interceptors.request.use(
//   (config) => {
//     config.headers['Authorization'] = `Token ${LIVE_TOKEN}`;
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Helper to convert object to x-www-form-urlencoded
// const toFormUrlEncoded = (obj) =>
//   Object.keys(obj)
//     .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`)
//     .join('&');

// // Send OTP to mobile
// export const sendMobileOtp = async (mobile_number) => {
//   const payload = {
//     mobile_number,
//     login_token: '123',
//     app_version: '1',
//     device_model: 'Browser',
//     user_type: 'Devotee',
//     lang: 'en',
//   };

//   const response = await api.post(
//     '/api/v1/auth/',
//     toFormUrlEncoded(payload),
//     {
//       headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
//     }
//   );

//   return response.data;
// };

// // Login with mobile + OTP (token is NOT stored anymore)
// export const loginWithMobile = async (mobile_number, otp) => {
//   const payload = {
//     mobile_number,
//     otp,
//     login_token: '123',
//     app_version: '1',
//     device_model: 'Browser',
//     user_type: 'Devotee',
//   };

//   const response = await api.post(
//     '/api/v1/devotee/login/',
//     toFormUrlEncoded(payload),
//     {
//       headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
//     }
//   );

//   return response.data;
// };

// // Login with email + OTP (token is NOT stored anymore)
// export const loginWithEmail = async (email, otp) => {
//   const payload = {
//     email,
//     otp,
//     login_token: '123',
//     app_version: '1',
//     device_model: 'Browser',
//     user_type: 'Devotee',
//   };

//   const response = await api.post(
//     '/api/v1/devotee/login/',
//     toFormUrlEncoded(payload),
//     {
//       headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
//     }
//   );

//   return response.data;
// };

// export default api;











// src/api/api.js
import axios from 'axios';

// ✅ Dynamic environment config
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
  // 🔁 Switch between 'beta' or 'live' here
  current: 'beta'
};

// ✅ Get current server settings
const { base, token } = API_CONFIG.servers[API_CONFIG.current];

// ✅ Create Axios instance
const api = axios.create({
  baseURL: base,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Attach token to every request
api.interceptors.request.use(
  (config) => {
    config.headers['Authorization'] = `Token ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Helper: Convert object to x-www-form-urlencoded
const toFormUrlEncoded = (obj) =>
  Object.keys(obj)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`)
    .join('&');

// ✅ Send mobile OTP
export const sendMobileOtp = async (mobile_number) => {
  const payload = {
    mobile_number,
    login_token: '123',
    app_version: '1',
    device_model: 'Browser',
    user_type: 'Devotee',
    lang: 'en',
  };

  const response = await api.post(
    '/api/v1/auth/',
    toFormUrlEncoded(payload),
    {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    }
  );

  return response.data;
};

// ✅ Verify mobile login
export const loginWithMobile = async (mobile_number, otp) => {
  const payload = {
    mobile_number,
    otp,
    login_token: '123',
    app_version: '1',
    device_model: 'Browser',
    user_type: 'Devotee',
  };

  const response = await api.post(
    '/api/v1/devotee/login/',
    toFormUrlEncoded(payload),
    {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    }
  );

  return response.data;
};

// ✅ Verify email login
export const loginWithEmail = async (email, otp) => {
  const payload = {
    email,
    otp,
    login_token: '123',
    app_version: '1',
    device_model: 'Browser',
    user_type: 'Devotee',
  };

  const response = await api.post(
    '/api/v1/devotee/login/',
    toFormUrlEncoded(payload),
    {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    }
  );

  return response.data;
};

export default api;

