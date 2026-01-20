const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const { createOrder, verifyOrderPayment, getMyOrders, getOrderById, getAllOrders, updateOrderStatus, updateOrderToDelivered } = require('../controllers/orderController');


//create order
router.route('/').post(protect, createOrder).get(protect, admin, getAllOrders);

//verify
router.route('/verify').post(protect, verifyOrderPayment);

//myorders
router.route('/myorders').get(protect, getMyOrders);

//order by id
router.route('/:id').get(protect, getOrderById);

// Update Order Status (Admin)
router.route('/:id/status').put(protect, admin, updateOrderStatus);

// Mark as Delivered (Admin)
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered);

//get razorpay key id
//get razorpay key id
router.get('/config/razorpay', (req, res) => {
    res.send(process.env.RAZORPAY_API_KEY);
});

module.exports = router;