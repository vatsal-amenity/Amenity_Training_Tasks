const express = require('express');
const router = express.Router();
const { createCoupon,  getCoupon, deleteCoupon, updateCoupon, verifyCoupon} = require('../controllers/couponController');
const {protect, admin} = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, admin, getCoupon)
    .post(protect, admin, createCoupon);

router.route('/:id')
    .put(protect, admin, updateCoupon)
    .delete(protect, admin, deleteCoupon);

router.route('/verify')
    .post(verifyCoupon);

module.exports = router;