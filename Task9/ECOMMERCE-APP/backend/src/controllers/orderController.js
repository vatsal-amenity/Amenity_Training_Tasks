const Order = require("../models/Order");
const Razorpay = require("razorpay");
const crypto = require("crypto");


// razorpay initialization
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_SECRET,
});

// create new order and razorpay order
// @route POST /api/orders
// @access Private
const createOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, totalPrice } = req.body;

    if (orderItems && orderItems.length === 0) {
      res.status(400);
      throw new Error("No order items");
    }

    //create order in database (pending)
    const order = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      totalPrice,
      paymentStatus: "Pending",
      deliveryStatus: "Processing",
    });

    const createdOrder = await order.save();

    // create order on razorpay
    const options = {
      amount: Math.round(totalPrice * 100), // Ensure integer
      currency: "INR",
      receipt: `receipt_order_${createdOrder._id}`,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    //send both fun back to frontend
    res.status(201).json({
      orderDetails: createdOrder,
      razorpayOrder: razorpayOrder,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// verify razorpay
//@route POST /api/orders/verify
//@access Private
const verifyOrderPayment = async (req, res) => {
  try {
    let {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = req.body;

    console.log("Verify Request Body:", req.body);

    // If orderId is missing, fetch it from Razorpay
    if (!orderId) {
      console.log("Order ID missing, fetching from Razorpay...");
      const razorpayOrder = await razorpay.orders.fetch(razorpay_order_id);
      console.log("Fetched Razorpay Order:", razorpayOrder);

      // Extract orderId from receipt (format: receipt_order_<id>)
      if (razorpayOrder.receipt && razorpayOrder.receipt.startsWith("receipt_order_")) {
        orderId = razorpayOrder.receipt.split("receipt_order_")[1];
        console.log("Extracted Order ID:", orderId);
      } else {
        console.error("Could not extract Order ID from receipt:", razorpayOrder.receipt);
        return res.status(400).json({ message: "Unable to retrieve order details" }); // Return to prevent execution
      }
    }

    console.log("Verify Request Body:", req.body);

    //generate signature to compare
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      //update order in db
      const order = await Order.findById(orderId);
      console.log("ljvnslnvwe", order);


      if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentStatus = "Paid";
        order.paymentResult = {
          id: razorpay_payment_id,
          status: "success",
          update_time: Date.now(),
          email_address: req.user.email,
        };

        const updateOrder = await order.save();
        console.log("update Order", updateOrder);

        res.json(updateOrder);
      } else {
        res.status(404).json({ message: "Order not found" });
      }
    } else {
      res.status(400).json({
        success: false,
        message: "Payment verification Failed ",
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


//get logged in user orders
//@route GET /api/orders/myorders
//@access Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 }); //sort by newest first
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get order by id
//@route GET /api/orders/:id
//@access Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );

    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get all orders
// @route GET /api/orders
// @access Private/Admin
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate("user", "id name").sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// update order status and message
// @route PUT /api/orders/:id/status
//@access Private/Admin
const updateOrderStatus = async (req, res) => {
  try {
    const { deliveryStatus, orderUpdateMessage } = req.body;
    const order = await Order.findById(req.params.id);

    if(order) {
      if(deliveryStatus){
        order.deliveryStatus = deliveryStatus;

        if(deliveryStatus === 'Delivered'){
          order.deliveredAt = Date.now();
        }
      }

      if(orderUpdateMessage){
        order.orderUpdateMessage = orderUpdateMessage;
      }

      const updateOrder = await order.save();
      res.json(updateOrder);
    }else{
      res.status(404).json({message: "Order not found"});
    }
  } catch (error) {
    res.status(500).json({message: error.message});
  }
};

//mark order as delivered
//@route PUT /api/orders/:id/deliver
//@access Private/Admin
const updateOrderToDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if(order){
      order.deliveryStatus = "Delivered";
      order.deliveredAt = Date.now();

      const updateOrder = await order.save();
      res.json(updateOrder);
    }else{
      res.status(404).json({message: "Order not found"});
    }
  } catch (error) {
    res.status(500).json({message: error.message});
  }
};

module.exports = { createOrder, verifyOrderPayment, getMyOrders, getOrderById, getAllOrders, updateOrderStatus, updateOrderToDelivered };
