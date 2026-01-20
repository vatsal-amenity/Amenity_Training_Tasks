const express = require('express');
const router = express.Router();
const {protect, admin} = require('../middleware/authMiddleware');
const {getOffers, getOfferById, createOffer, updateOffer, deleteOffer} = require('../controllers/offerController');

router.route('/')
    .post(protect, admin, createOffer)
    .get(protect, admin, getOffers);

router.route('/:id')
    .get(protect, admin, getOfferById)
    .put(protect, admin, updateOffer)
    .delete(protect, admin, deleteOffer);

module.exports = router;
