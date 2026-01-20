const express = require('express');
const router = express.Router();
const {
    getProduct,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

//route to get all product
router.route('/')
    .get(getProduct)
    .post(protect, admin, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'gallery', maxCount: 5 }]), createProduct);

//route for dingle product operation
router.route('/:id')
    .get(getProductById)
    .put(protect, admin, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'gallery', maxCount: 5 }]), updateProduct)
    .delete(protect, admin, deleteProduct);

module.exports = router;