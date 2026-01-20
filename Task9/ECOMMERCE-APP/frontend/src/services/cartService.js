import axios from "axios";

const API_URL = 'http://localhost:5000/api/cart/';

//helper to get config token
const getConfig = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = user?.token;

    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    return config;
};

//get cart
const getCart = async () => {
    const config = getConfig();
    const response = await axios.get(API_URL, config);
    console.log("get cart ", response.data);

    return response.data;
};

//Add cart
const addToCart = async (productData) => {
    const config = getConfig();
    const response = await axios.post(API_URL, productData, config);
    console.log("add cart", response);
    
    return response.data;
};

//update cart qty
const updateCartItemQty = async (getProductById, qty) => {
    const config = getConfig();
    console.log("Updating cart qty for Product ID:", getProductById, "with Qty:", qty);
    const response = await axios.put(API_URL + getProductById, { qty }, config);
    console.log("Backend response for update qty:", response.data);
    return response.data;
};

//remove from cart
const removeFromCart = async (id) => {
    const config = getConfig();
    const response = await axios.delete(API_URL + id, config);
    return response.data;
};

//clear cart
const clearCart = async () => {
    const config = getConfig();
    const response = await axios.delete(API_URL, config);
    return response.data;
};

const cartService = {
    getCart,
    addToCart,
    updateCartItemQty,
    removeFromCart,
    clearCart,
};

export default cartService;