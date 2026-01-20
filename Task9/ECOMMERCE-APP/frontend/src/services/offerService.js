import axios from "axios";

const API_URL = 'http://localhost:5000/api/offers/';

//fetch all offers
const getOffers = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        },
    };
    const response = await axios.get(API_URL, config);
    console.log("get offers",response.data);
                                             
    return response.data;
};

//fetch single offer
const getOfferById = async (id, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        },
    };
    const response = await axios.get(API_URL + id, config);
    return response.data;
};

//create new offer
const createOffer = async (offerData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        },
    };
    const response = await axios.post(API_URL, offerData, config);
    return response.data;
};

//update offer
const updateOffer = async (id, offerData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        },
    };
    const response = await axios.put(API_URL + id, offerData, config);
    return response.data;
};

//delete offer
const deleteOffer = async (id, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        },
    };
    const response = await axios.delete(API_URL + id, config);
    return response.data;
};

//fetch global offer status
const getGlobalOfferStatus = async () => {
    const response = await axios.get(SETTINGS_URL + 'areOffersEnabled');
    return response.data; 
};

//toggle global offer status
const toggleGlobalOfferStatus = async (status, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        },
    };
    const response = await axios.put(SETTINGS_URL + 'areOffersEnabled', { value: status }, config);
    return response.data;
};

const offerService = {
    getOffers,
    getOfferById,
    createOffer,
    updateOffer,
    deleteOffer,
    getGlobalOfferStatus,
    toggleGlobalOfferStatus
};

export default offerService;