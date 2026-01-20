import axios from "axios";

const API_URL = 'http://localhost:5000/api/products/';

//fetch all products
const getProducts = async () => {
    const response = await axios.get(API_URL);
    console.log("product", response.data);

    return response.data;


};
//fetch single product by id
const getProductById = async (productId) => {
    const response = await axios.get(API_URL + productId);
    console.log("product id", response.data);

    return response.data;
};

//create new product in admin side
const createProduct = async (productData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.post(API_URL, productData, config);
    return response.data;
};

//update product in admin 
const updateProduct = async (productId, productData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.put(API_URL + productId, productData, config);
    return response.data;
};

//delete product in admin
const deleteProduct = async (productId, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.delete(API_URL + productId, config);
    return response.data;
};

const productService = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};

export default productService;