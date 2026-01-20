const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Offer = require('../models/Offer');
const Coupon = require('../models/Coupon');

//add item in cart
//@route POST /api/cart
//@access Private
const addToCart = async (req, res) => {
    try {
        const { productId, qty } = req.body;
        const userId = req.user._id;

        // fetch product detail
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Calculate active offer price
        const now = new Date();
        const activeOffers = await Offer.find({
            status: true,
            startDate: { $lte: now }
        });

        let bestDiscount = 0;
        let finalPrice = product.price;

        activeOffers.forEach(offer => {
            // Adjust end date to end of day
            const end = new Date(offer.endDate);
            end.setHours(23, 59, 59, 999);

            if (now > end) return; // Skip if truly expired

            const isApplicable = offer.isAppliesToAll || offer.products.some(pId => pId.toString() === product._id.toString());
            if (isApplicable && offer.discountPercentage > bestDiscount) {
                bestDiscount = offer.discountPercentage;
            }
        });

        if (bestDiscount > 0) {
            finalPrice = Math.round(product.price * (1 - bestDiscount / 100));
        }

        let cart = await Cart.findOne({ user: userId });

        if (cart) {
            //cart exits for user
            const itemIndex = cart.cartItems.findIndex(p => p.product.toString() === productId);

            if (itemIndex > -1) {
                //product exit to cart
                return res.status(400).json({ message: 'Product already in cart' });
            } else {
                //jo product cart ma no hoy to add new item
                cart.cartItems.push({
                    product: productId,
                    name: product.name,
                    qty: qty,
                    price: finalPrice,
                    image: product.image,
                });
            }
            cart = await cart.save();
            await cart.populate('cartItems.product', 'countStock isoutofstock category');
            return res.status(200).json({ cart });
        } else {
            //jo user no hoy cart mate to create new cart
            const newCart = await Cart.create({
                user: userId,
                cartItems: [{
                    product: productId,
                    name: product.name,
                    qty: qty,
                    price: finalPrice,
                    image: product.image,
                }],
            });
            await newCart.populate('cartItems.product', 'countStock isoutofstock category');
            return res.status(201).json(newCart);
        }

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


//get user cart
//@route GET /api/cart
//@access Private
const getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id }).populate('cartItems.product', 'countStock isoutofstock category');

        if (cart) {
            res.json(cart);
        } else {
            res.json({ cartItems: [] });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//update cart item 
//@route PUT /api/cart/:productId
//@access Private
const updateCartItemQty = async (req, res) => {
    try {
        const { qty } = req.body;
        const productId = req.params.productId;
        const userId = req.user._id;

        console.log("Update Qty Request - ProductId:", productId, "Qty:", qty, "User:", userId);

        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            console.log("Cart not found for user");
            return res.status(404).json({ message: 'Cart not found' });
        }

        const itemIndex = cart.cartItems.findIndex(p => p.product.toString() === productId);
        console.log("Item Index found:", itemIndex);

        if (itemIndex > -1) {
            cart.cartItems[itemIndex].qty = qty;
            await cart.save();
            await cart.populate('cartItems.product', 'countStock isoutofstock category');
            console.log("Cart updated successfully");
            res.json(cart);
        } else {
            console.log("Item not found in cartItems. Exisrting items:", cart.cartItems.map(i => i.product.toString()));
            res.status(404).json({ message: 'Item not found in cart' });
        }
    } catch (error) {
        console.error("Error updating cart qty:", error);
        res.status(500).json({ message: error.message });
    }
};

//remove item from cart
//@route DELETE /api/cart/:id (productid)
//@access Private
const removeFromCart = async (req, res) => {
    try {
        const productId = req.params.id;
        const userId = req.user._id;

        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        cart.cartItems = cart.cartItems.filter(item => item.product.toString() !== productId);
        await cart.save();
        await cart.populate('cartItems.product', 'countStock isoutofstock category');
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//clear cart
//@route DELETE /api/cart
//@access Private
const clearCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });
        if (cart) {
            cart.cartItems = [];
            await cart.save();
        }
        res.json({ message: 'Cart cleared' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// apply coupon
//@route POST /api/cart/apply-coupon
//@access Private
const applyCoupon = async (req, res) => {
    try {
        const { couponCode } = req.body;
        const userId = req.user._id;

        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ message: "Cart not  found" });
        }

        const coupon = await Coupon.findOne({ code: couponCode, isActive: true });

        if (!coupon) {
            return res.status(404).json({ message: "Invalid or Inactive coupon" });
        }

        const currentDate = new Date();
        if (coupon.expiryDate < currentDate) {
            return res.status(400).json({ message: "Coupon has expired" });
        }

        //calculate cart total
        const cartTotal = cart.cartItems.reduce((acc, item) => acc + item * price * item.qty, 0);

        if (cartTotal < coupon.minCartValue) {
            return res.status(400).json({ message: `Minimum cart value of rs.${coupon.minCartValue} required` });
        }

        //assign coupon to cart
        cart.coupon = coupon._id;

        //calculate discount here and save
        let discountAmount = 0;
        if (coupon.discountType === 'percentage') {
            discountAmount = Math.round((cartTotal * coupon.discountValue) / 100);

        } else if (coupon.discountType === 'flat') {
            discountAmount = coupon.discountValue;
        }

        if (discountAmount > cartTotal) {
            discountAmount = cartTotal;
        }

        cart.discountTotal = discountAmount;

        await cart.save();
        await cart.populate('cartItems.product', 'countStock isoutofstock category');
        await cart.populate('coupon');//populate coupon details

        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//remove coupon
//@route DELETE /api/cart/remove-coupon
//@access Private
const removeCoupon = async (req, res) => {
    try {
        const userId = req.user._id;
        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        cart.coupon = null;
        cart.discountTotal = 0;
        await cart.save();
        await cart.populate('cartItems.product', 'countStock isoutofstock category');

        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = { addToCart, getCart, updateCartItemQty, removeFromCart, clearCart, applyCoupon, removeCoupon };