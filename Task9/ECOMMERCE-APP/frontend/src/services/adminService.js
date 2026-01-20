import axios from 'axios';

const API_URL = 'http://localhost:5000/api/dashboard';

const getDashboardStats = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(API_URL, config);
  return response.data;
};

const adminService = {
  getDashboardStats,
};

export default adminService;
