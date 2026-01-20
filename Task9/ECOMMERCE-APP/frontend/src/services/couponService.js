import axios from "axios";

const API_URL = 'http://localhost:5000/api/coupons/';


// get all coupons
const getCoupons = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        },
    };
    const response = await axios.get(API_URL, config);
    console.log("fetch coupons", response.data);
    return response.data;
};

//create coupon
const createCoupon = async (couponData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        },
    };
    const response = await axios.post(API_URL, couponData, config);
    console.log("create coupon", response.data);

    return response.data;
};


//delete coupon
const deleteCoupon = async (id, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        },
    };
    const response = await axios.delete(API_URL + id, config);
    return response.data;
};

//update coupon
const updateCoupon = async (id, couponData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        },
    };
    const response = await axios.put(API_URL + id, couponData, config);
    console.log("update coupon", response.data);
    return response.data;
};

//validate coupon
const validateCoupon = async (couponData) => {
    const response = await axios.post(API_URL + "verify", couponData);
    console.log("validate coupon", response.data);
    return response.data;
};

const couponService = { getCoupons, createCoupon, updateCoupon, deleteCoupon, validateCoupon };

export default couponService;