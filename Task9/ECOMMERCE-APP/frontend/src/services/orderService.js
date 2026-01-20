import axios from 'axios';

const API_URL = 'http://localhost:5000/api/orders/';

// fetch all orders (Admin)
const getAllOrders = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.get(API_URL, config);
    console.log("get all order", response.data);

    return response.data;
};

// mark as delivered
const deliverOrder = async (orderId, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.put(API_URL + orderId + '/deliver', {}, config);

    return response.data;
};

// update order status/message
const updateOrderStatus = async (orderId, message, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.put(API_URL + orderId + '/status', { message }, config);
    return response.data;
};

//get logged in user orders
const getMyOrders = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        },
    };
    const response = await axios.get(API_URL + 'myorders', config);
    return response.data;
}

const orderService = {
    getAllOrders,
    deliverOrder,
    updateOrderStatus,
    getMyOrders,
};

export default orderService;