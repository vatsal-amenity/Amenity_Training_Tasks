import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { clearCart, applyCoupon } from "../redux/cartSlice";
import { toast } from "sonner";
import {
  FiMapPin,
  FiTruck,
  FiCreditCard,
  FiCheckCircle,
  FiTag,
  FiX,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //redux state
  const { cartItems, coupon, isCouponLoading } = useSelector(
    (state) => state.cart
  );
  const { user } = useSelector((state) => state.auth);

  //form state
  const [shippingAddress, setShippingAddress] = useState({
    address: "",
    city: "",
    postalCode: "",
    country: "India",
    state: "",
  });

  const [couponCode, setCouponCode] = useState("");
  const [showCouponInput, setShowCouponInput] = useState(false);
  const [loading, setLoading] = useState(false);

  //calculate (matching cart.jsx)
  const subtotal = cartItems.reduce(
    (acc, item) => acc + Number(item.price) * Number(item.qty),
    0
  );
  const taxAmount = subtotal * 0.18; // 18% gst
  const shippingCost = 0;

  let discountAmount = 0;
  if (coupon) {
    if (coupon.discountType === "percentage") {
      discountAmount = (subtotal * coupon.discountValue) / 100;
    } else if (coupon.discountType === "flat") {
      discountAmount = coupon.discountValue;
    }
  }

  const totalAmount = Math.max(
    0,
    subtotal + taxAmount + shippingCost - discountAmount
  );

  //load razorpay script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  //handle input
  const handleInputChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) return;
    dispatch(applyCoupon({ code: couponCode, cartTotal: subtotal }))
      .unwrap()
      .then(() => {
        toast.success("Coupon applied successfully");
        setShowCouponInput(false);
      })
      .catch((error) => {
        //we toast show here if promise rejects
        toast.error(error || "Failed to apply coupon");
      });
  };

  //payment logic
  const handlePayment = async () => {
    if (
      !shippingAddress.address ||
      !shippingAddress.city ||
      !shippingAddress.postalCode
    ) {
      toast.error("Please fill in all address fields.");
      return;
    }

    if (!user) {
      toast.error("Please login to place an order.");
      navigate("/login");
      return;
    }
    setLoading(true);

    const res = await loadRazorpayScript();
    if (!res) {
      toast.error("Razorpay SDK failed to load. check internet.");
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      //create backend order
      const orderPayload = {
        orderItems: cartItems.map((item) => ({
          name: item.name,
          qty: item.qty,
          image: item.image,
          price: item.price,
          product: item._id,
        })),
        shippingAddress: shippingAddress,
        totalPrice: totalAmount,
        paymentMethod: "Razorpay", // Added to prevent 500 error
      };

      const { data } = await axios.post(
        "http://localhost:5000/api/orders",
        orderPayload,
        config
      );

      // Fix: Ensure variable name matches backend response and usage below
      const { razorpayOrder } = data;
      console.log("razorpay api", import.meta.env.VITE_RAZORPAY_KEY_ID);

      //open razorpay
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount, // Now this variable exists
        currency: razorpayOrder.currency,
        name: "House of Saree",
        description: "Checkout Payment",
        order_id: razorpayOrder.id,
        handler: async function (response) {
          try {
            const verifyPayload = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderItems: orderPayload.orderItems,
              userId: user._id,
            };
            console.log(
              "this is verify from frotnedn that payload is correct",
              verifyPayload
            );

            const verifyRes = await axios.post(
              "http://localhost:5000/api/orders/verify",
              verifyPayload,
              config
            );
            if (verifyRes.status === 200 || verifyRes.status === 201) {
              toast.success("Order placed successfully!");
              dispatch(clearCart());
              navigate("/"); // Redirect to Home or Orders page
            }
          } catch (err) {
            console.error(err);
            toast.error("Payment verification failed.");
          }
        },
        // prefill: {
        //   name: user.name,
        //   email: user.email,
        //   contact: user.phone || "",
        // },
        theme: { color: "#283044" },
      };
      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error("Payment Error:", error);
      const msg =
        error.response?.data?.message || "Payment initialization failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
        <div className="text-center">
          <h2 className="text-2xl font-serif text-indigo-dye mb-4">
            Your cart is empty
          </h2>
          <button
            onClick={() => navigate("/shop")}
            className="text-terracotta underline"
          >
            Go Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-serif font-bold text-indigo-dye mb-8 text-center">
          Checkout
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Shipping Form */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
            <div className="flex items-center gap-2 mb-6 text-indigo-dye border-b border-gray-100 pb-2">
              <FiMapPin size={24} />
              <h2 className="text-xl font-bold font-serif">Shipping Address</h2>
            </div>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={shippingAddress.address}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-indigo-dye outline-none"
                  placeholder="123 Fashion St"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={shippingAddress.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-indigo-dye outline-none"
                    placeholder="Mumbai"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={shippingAddress.postalCode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-indigo-dye outline-none"
                    placeholder="400001"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={shippingAddress.state}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-indigo-dye outline-none"
                    placeholder="Maharashtra"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={shippingAddress.country}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-indigo-dye outline-none"
                    readOnly
                  />
                </div>
              </div>
            </form>
          </div>
          {/* Order Summary */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
            <div className="flex items-center gap-2 mb-6 text-indigo-dye border-b border-gray-100 pb-2">
              <FiTruck size={24} />
              <h2 className="text-xl font-bold font-serif">Order Summary</h2>
            </div>
            <div className="space-y-4 max-h-80 overflow-y-auto mb-6 pr-2">
              {cartItems.map((item) => (
                <div key={item._id} className="flex gap-4 items-center">
                  <div className="w-16 h-16 rounded-md bg-gray-50 overflow-hidden border border-gray-200">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-indigo-dye text-sm">
                      {item.name}
                    </h4>
                    <p className="text-xs text-gray-500">Qty: {item.qty}</p>
                  </div>
                  <p className="font-bold text-indigo-dye">
                    ₹{(Number(item.price) * Number(item.qty)).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 pt-4 space-y-2 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax (18% GST)</span>
                <span>₹{taxAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>Free</span>
              </div>

              <div className="pt-2">
                {!showCouponInput && !coupon ? (
                  <button
                    onClick={() => setShowCouponInput(true)}
                    className="flex items-center gap-2 text-terracotta font-medium hover:text-indigo-dye transition-colors"
                  >
                    <FiTag /> Have a coupon?
                  </button>
                ) : (
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                    {!coupon ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          placeholder="Enter coupon code"
                          className="flex-1 p-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:border-indigo-dye"
                        />
                        <button
                          onClick={handleApplyCoupon}
                          disabled={isCouponLoading || !couponCode.trim()}
                          className="bg-indigo-dye text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-opacity-90 disabled:opacity-50"
                        >
                          {isCouponLoading ? "..." : "Apply"}
                        </button>
                        <button
                          onClick={() => setShowCouponInput(false)}
                          className="text-gray-400 hover:text-gray-600 px-1"
                        >
                          <FiX />
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-green-600 font-medium flex items-center gap-2">
                          <FiTag /> Code {coupon.code} applied
                        </span>
                        {/* Option to remove coupon could be added here if action exists */}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Discount Display */}
              {coupon && (
                <div className="flex justify-between text-green-600 font-medium">
                  <span>Discount</span>
                  <span>- ₹{discountAmount.toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between text-xl font-bold text-indigo-dye pt-2 border-t border-gray-100">
                <span>Total</span>
                <span>₹{totalAmount.toLocaleString()}</span>
              </div>
            </div>
            <button
              onClick={handlePayment}
              disabled={loading}
              className={`w-full py-4 rounded-lg font-bold text-white shadow-lg flex items-center justify-center gap-2 transition-all ${
                loading ? "bg-gray-400" : "bg-indigo-dye hover:bg-opacity-90"
              }`}
            >
              {loading ? (
                <span>Processing...</span>
              ) : (
                <>
                  <FiCreditCard size={20} /> Pay with Razorpay
                </>
              )}
            </button>
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
              <FiCheckCircle />
              <span>Secure Payment by Razorpay</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
