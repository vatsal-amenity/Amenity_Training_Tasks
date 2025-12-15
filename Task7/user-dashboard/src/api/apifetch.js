import axios from 'axios';

const api = axios.create({
  baseURL: 'https://unheuristic-chelsea-unschooled.ngrok-free.dev/api', 
  headers: {
    "ngrok-skip-browser-warning": "69420",
    "Content-Type": "multipart/form-data",
    // "Authorization" : `Barer ${token}`
  },
});

export default api;