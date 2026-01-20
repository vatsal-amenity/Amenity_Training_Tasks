const express = require('express');
const router = express.Router();
const { addToCart, getCart, updateCartItemQty, removeFromCart, clearCart, applyCoupon, removeCoupon} = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(protect, addToCart).get(protect,getCart).delete(protect, clearCart);
router.route('/:id').delete(protect, removeFromCart);
router.route('/:productId').put(protect, updateCartItemQty);
router.route('/apply-coupon')
    .post(protect, applyCoupon);
router.route('/remove-coupon')
    .delete(protect, removeCoupon);

module.exports = router;