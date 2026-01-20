import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth/';

//Register user
const register = async (userData) => {
    const response = await axios.post(API_URL + 'register', userData);
    // User is NOT saved to localStorage here anymore. Must verify OTP first.
    return response.data;
};

// Verify OTP
const verifyOTP = async (userData) => {
    const response = await axios.post(API_URL + 'verify', userData);
    if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
};

// Login user
const login = async (userData) => {
    const response = await axios.post(API_URL + 'login', userData);
    if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
};

// Forgot Password
const forgotPassword = async (email) => {
    const response = await axios.post(API_URL + 'forgot-password', { email });
    return response.data;
};

// Reset Password
const resetPassword = async (token, password) => {
    const response = await axios.put(API_URL + 'reset-password/' + token, { password });
    return response.data;
};

// Logout user
const logout = () => {
    localStorage.removeItem('user');
};

//get user wishlist
const getWishlist = async(token) => {
    const config ={
        headers: {
            Authorization: `Bearer ${token}`
        },
    };
    const response = await axios.get(API_URL + 'wishlist', config);
    console.log("fetch wishlist products", response.data);
    return response.data;
};

//toggle/remove from wishlist
const toggleWishlist = async (productId, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        },
    };
    const response = await axios.put(API_URL + 'wishlist', {productId}, config);
    return response.data;
}

const authService = {
    register,
    login,
    logout,
    verifyOTP,
    forgotPassword,
    resetPassword,
    getWishlist,
    toggleWishlist,
};

export default authService;