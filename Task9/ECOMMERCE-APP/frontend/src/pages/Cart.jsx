import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  FiTrash2,
  FiMinus,
  FiPlus,
  FiArrowLeft,
  FiShoppingBag,
} from "react-icons/fi";
import { motion } from "framer-motion";
import { getCart, removeFromCart, updateCartItemQty } from "../redux/cartSlice";
import Navbar from "../components/user/Navbar";
import Footer from "../components/user/Footer";
import { useEffect } from "react";

const Cart = () => {
  const { product } = useSelector((state) => state.product);

  // const [couponCode, setCouponCode] = useState("");
  const { cartItems } = useSelector(
    (state) => state.cart
  );
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      dispatch(getCart());
    }
  }, [dispatch, user]);

  const calculateTotal = () => {
    return Array.isArray(cartItems)
      ? cartItems.reduce(
        (acc, item) => acc + Number(item.price) * Number(item.qty),
        0
      )
      : 0;
  };

  const handleQuantityChange = (id, currentQty, type, maxStock) => {
    if (type === "inc") {
      if (currentQty < maxStock) {
        dispatch(updateCartItemQty({ productId: id, qty: currentQty + 1 }));
        console.log("qty increase:", currentQty);
      }
    } else {
      if (currentQty > 1) {
        dispatch(updateCartItemQty({ productId: id, qty: currentQty - 1 }));
        console.log("qty decrease", currentQty);
      }
    }
  };


  const handleRemove = (item) => {
    const cartId =
      typeof item.product === "object" ? item.product._id : item.product;
    console.log("remove item from cart", cartId);

    dispatch(removeFromCart(cartId));
  };

  // const handleApplyCoupon = () => {
  //   if (!couponCode.trim()) return;
  //   const total = calculateTotal();
  //   dispatch(applyCoupon({ code: couponCode, cartTotal: total }));
  // };

  const calculateFinalTotal = () => {
    const subTotal = calculateTotal();
    const gst = subTotal * 0.18;
    let total = subTotal + gst;

    // if (coupon) {
    //   if (coupon.discountType === "percentage") {
    //     const discountAmount = (subTotal * coupon.discountValue) / 100;
    //     total = total - discountAmount;
    //   } else if (coupon.discountType === 'flat') {
    //     total = total - coupon.discountValue;
    //   }
    // }
    return total > 0 ? total : 0;
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] font-sans text-indigo-dye">
        <Navbar />
        <div className="pt-32 text-center">
          <h2>Please login to view your cart</h2>
          <Link to="/login" className="text-blue-500 underline">
            Login
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans text-indigo-dye">
      <Navbar />
      <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-indigo-dye mb-2">
            Shopping Cart
          </h1>
          <p className="text-gray-500">
            {cartItems?.length || 0}{" "}
            {(cartItems?.length || 0) === 1 ? "item" : "items"} in your bag
          </p>
        </div>
        {!cartItems || cartItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300"
          >
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
              <FiShoppingBag size={32} />
            </div>
            <h2 className="text-2xl font-serif font-bold text-gray-800 mb-3">
              Your cart is empty
            </h2>
            <p className="text-gray-500 mb-8 max-w-sm mx-auto">
              Looks like you haven't added any pieces to your collection yet.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-8 py-3 bg-indigo-dye text-white rounded-full font-medium hover:bg-terracotta transition-colors shadow-lg"
            >
              <FiArrowLeft /> Continue Shopping
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-6">
              {cartItems.map((item) => (
                <motion.div
                  key={item._id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100 flex gap-6 items-start md:items-center"
                >
                  {/* Image */}
                  <div className="w-24 h-32 md:w-32 md:h-32 flex-shrink-0 bg-gray-50 rounded-xl overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">
                          {item.product?.category}
                        </p>
                        <Link
                          to={`/product/${item.product || item._id}`} // Or `item.product` if _id is cart item id
                          className="font-serif font-bold text-lg md:text-xl text-indigo-dye hover:text-terracotta transition-colors line-clamp-1"
                        >
                          {item.name}
                        </Link>
                      </div>
                      <button
                        onClick={() => handleRemove(item)}
                        className="text-gray-400 hover:text-red-500 p-2 -mr-2 transition-colors"
                      >
                        <FiTrash2 size={20} />
                      </button>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-4">
                      {/* Quantity Controls */}
                      <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200 w-fit">
                        <button
                          onClick={() =>
                            handleQuantityChange(
                              typeof item.product === "object"
                                ? item.product._id
                                : item.product,
                              item.qty,
                              "dec",
                              item.product?.countStock
                            )
                          }
                          className="p-2 hover:text-terracotta disabled:opacity-30 transition-colors"
                          disabled={item.qty <= 1}
                        >
                          <FiMinus size={14} />
                        </button>
                        <span className="w-8 text-center font-bold text-sm">
                          {item.qty}
                        </span>
                        <button
                          onClick={() =>
                            handleQuantityChange(
                              typeof item.product === "object"
                                ? item.product._id
                                : item.product,
                              item.qty,
                              "inc",
                              item.product?.countStock
                            )
                          }
                          className="p-2 hover:text-terracotta disabled:opacity-30 transition-colors"
                          disabled={item.qty >= item.product?.countStock}
                        >
                          <FiPlus size={14} />
                        </button>
                      </div>
                      {/* Price */}
                      <div className="text-right">
                        {item.product && item.product.price > item.price ? (
                          <div className="flex flex-col items-end">
                            <p className="text-lg font-bold text-red-600">
                              ₹
                              {(
                                Number(item.price) * Number(item.qty)
                              ).toLocaleString()}
                            </p>
                            <div className="flex items-center gap-2">
                              <p className="text-xs text-gray-400 line-through">
                                ₹
                                {(
                                  Number(item.product.price) * Number(item.qty)
                                ).toLocaleString()}
                              </p>
                              <span className="text-[10px] font-semibold text-green-600 px-1.5 py-0.5 bg-green-100 rounded-md">
                                {Math.round(
                                  ((item.product.price - item.price) /
                                    item.product.price) *
                                  100
                                )}
                                % OFF
                              </span>
                            </div>
                          </div>
                        ) : (
                          <p className="text-lg font-bold text-indigo-dye">
                            ₹
                            {(
                              Number(item.price) * Number(item.qty)
                            ).toLocaleString()}
                          </p>
                        )}

                        {Number(item.qty) > 1 && (
                          <p className="text-xs text-gray-400 mt-1">
                            {item.product && item.product.price > item.price ? (
                              <>
                                <span className="line-through mr-1">
                                  ₹{Number(item.product.price).toLocaleString()}
                                </span>
                                <span className="text-red-500">
                                  ₹{Number(item.price).toLocaleString()}
                                </span>
                              </>
                            ) : (
                              <span>
                                ₹{Number(item.price).toLocaleString()}
                              </span>
                            )}{" "}
                            each
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-32">
                <h3 className="font-serif font-bold text-xl text-indigo-dye mb-6">
                  Order Summary
                </h3>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-medium">
                      ₹{calculateTotal().toLocaleString()}
                    </span>
                  </div>

                  {/* Coupon Input
                  <div className="mb-6">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="Coupon Code"
                        className="flex-1 p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-dye"
                      />
                      <button
                        onClick={handleApplyCoupon}
                        disabled={isCouponLoading}
                        className="bg-indigo-dye text-white px-4 py-2 rounded-xl font-medium hover:bg-opacity-90 disabled:opacity-50"
                      >
                        {isCouponLoading ? "..." : "Apply"}
                      </button>
                    </div>
                    {coupon && (
                      <div className="mt-2 text-green-600 text-sm flex justify-between items-center">
                        <span>Coupon applied: {coupon.code}</span>
                      </div>
                    )}
                  </div> */}
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="text-green-600 font-medium">Free</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax (GST)</span>
                    <span className="font-medium">
                      ₹{(calculateTotal() * 0.18).toLocaleString()}
                    </span>
                  </div>
                  <div className="border-t border-dashed border-gray-200 pt-4 flex justify-between items-center">
                    <span className="font-serif font-bold text-lg text-indigo-dye">
                      Total
                    </span>
                    <span className="font-serif font-bold text-xl text-terracotta">
                      ₹{calculateFinalTotal().toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="w-full">
                  <Link
                    to="/checkout"
                    className="w-full bg-indigo-dye text-white py-4 rounded-xl font-bold hover:bg-opacity-90 transition-all shadow-lg hover:shadow-xl transform active:scale-95 flex items-center justify-center"
                  >
                    Proceed to Checkout
                  </Link>
                </div>
                <div className="mt-6 text-center">
                  <Link
                    to="/shop"
                    className="text-sm text-gray-500 hover:text-terracotta transition-colors underline"
                  >
                    or Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Cart;
