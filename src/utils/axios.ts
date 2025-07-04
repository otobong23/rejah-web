import axios from 'axios';
// axios.defaults.baseURL = 'https://api.naijazoneonline.com/api';
// axios.defaults.baseURL = 'http://localhost:4000/api';



/**
 * @author Miracle Boniface
 * @export default
 */

const baseURL = 'https://rejah-backend.onrender.com'
// const baseURL = 'http://localhost:5000/'

// Create an Axios instance
const api = axios.create({
  baseURL,
  timeout: 30000, // Optional: Set a timeout (in ms)
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
