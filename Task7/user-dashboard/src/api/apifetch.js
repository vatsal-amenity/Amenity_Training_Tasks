import axios from 'axios';

const api = axios.create({
  baseURL: 'https://unheuristic-chelsea-unschooled.ngrok-free.dev/api', 
  headers: {
    // 'Content-Type': 'application/json',
    "ngrok-skip-browser-warning": "69420",
  },
});

export default api;