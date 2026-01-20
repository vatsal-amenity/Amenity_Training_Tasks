const Order = require('../models/Order');
const User = require('../models/User');

// get dashboard analytics
//@route GET /api/dashboard
//@access Private/Admin
const getDashboardStats = async (req, res) => {
    try {
        //total revenue
        const revenueResult = await Order.aggregate([
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$totalPrice" },
                },
            },
        ]);
        const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

        //total order
        const totalOrders = await Order.countDocuments();

        //total customer
        const totalCustomers = await User.countDocuments({ isAdmin: false });

        //revenue analytics
        const twelveMonthAgo = new Date();
        twelveMonthAgo.setMonth(twelveMonthAgo.getMonth() - 11);

        const revenueAnalytics = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: twelveMonthAgo },
                },
            }, {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" },
                    },
                    total: { $sum: "$totalPrice" },
                },
            }, {
                $sort: { "_id.year": 1, "_id.month": 1 }
            },
        ]);

        //recent order
        const recentOrders = await Order.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate("user", "name email");

        const recentOrdersFormatted = recentOrders.map((order) => ({
            _id: order._id,
            user: order.user ? order.user.name : "Unknown User",
            totalPrice: order.totalPrice,
            isPaid: order.isPaid,
            deliveredAt: order.deliveredAt,
            createdAt: order.createdAt,
        }));

        res.json({
            totalRevenue,
            totalOrders,
            totalCustomers,
            revenueAnalytics,
            recentOrders: recentOrdersFormatted,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error fetching dashboard stats" });
    }
};

module.exports = { getDashboardStats };