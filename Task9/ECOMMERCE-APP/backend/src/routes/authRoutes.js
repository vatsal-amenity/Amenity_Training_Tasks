const express = require('express');
const router = express.Router();
const { registerUser, verifyOtp, forgotPassword, resetPassword, loginUser, toggleWishlist, getWishlist } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/verify', verifyOtp);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:resetToken', resetPassword);
router.post('/login', loginUser);
router.put('/wishlist', protect, toggleWishlist);
router.get('/wishlist', protect, getWishlist);

module.exports = router;