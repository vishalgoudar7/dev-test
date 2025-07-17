// // src/api/temples.js
// import axios from 'axios';

// export const getTemples = (page = 1, size = 10) => {
//   return axios.get('https://live.devalayas.com/api/v1/devotee/temple/', {
//     params: { page, size }
//   });
// };




// src/api/temples.js
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const getTemples = (page = 1, size = 10) => {
  return axios.get(`${BASE_URL}/api/v1/devotee/temple/`, {
    params: { page, size }
  });
};
