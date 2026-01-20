import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiShoppingBag, FiUsers, FiDollarSign } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import adminService from '../../services/adminService';

const StatCard = ({ title, value, icon: Icon, color, index }) => (
    <motion.div
        className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1, duration: 0.5 }}
        whileHover={{ y: -5, boxShadow: "0 10px 20px -10px rgba(0,0,0,0.1)" }}
    >
        <div>
            <p className="text-gray-500 text-sm font-medium tracking-wide">{title}</p>
            <h3 className="text-2xl font-serif font-bold text-indigo-dye mt-1">{value}</h3>
        </div>
        <div className={`p-4 rounded-full ${color} text-white shadow-md`}>
            <Icon size={24} />
        </div>
    </motion.div>
);

const AdminDashboard = () => {
    const { user } = useSelector((state) => state.auth); //get admin user for token

    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        totalCustomers: 0,
        revenueAnalytics: [],
        recentOrders: []
    });

    //fetch data
    useEffect(() => {
        const fetchStats = async () => {
            try {
                if (user && user.token) {
                    const data = await adminService.getDashboardStats(user.token);
                    setStats(data);
                }
            } catch (error) {
                console.error("Error fetching dashboard stats:", error);
            }
        };
        fetchStats();
    }, [user]);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-serif font-bold text-indigo-dye">Dashboard Overview</h1>
                <p className="text-gray-500 mt-1">Welcome back, Administrator.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Revenue" value={`₹${stats.totalRevenue.toLocaleString()}`} icon={FiDollarSign} color="bg-indigo-dye" index={0} />
                <StatCard title="Total Orders" value={stats.totalOrders} icon={FiShoppingBag} color="bg-terracotta" index={1} />
                <StatCard title="Total Customers" value={stats.totalCustomers} icon={FiUsers} color="bg-ocher" index={2} />
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Visual Placeholder for Charts */}
                <motion.div
                    className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-gray-100 h-96 flex flex-col"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    <h3 className="text-lg font-serif font-bold text-indigo-dye mb-6">Revenue Analytics</h3>
                    <div className="flex-1 flex items-end justify-start gap-6 px-4 overflow-hidden">
                        {stats.revenueAnalytics && stats.revenueAnalytics.length > 0 ? (
                            (() => {
                                const maxRevenue = Math.max(...stats.revenueAnalytics.map(item => item.total), 1);
                                return stats.revenueAnalytics.map((item, i) => (
                                    <div key={i} className="flex flex-col items-center gap-2 group">
                                        <div className="relative h-64 flex items-end">
                                            <motion.div
                                                className="w-12 bg-indigo-dye/10 rounded-t-sm relative overflow-hidden"
                                                style={{ height: `${(item.total / maxRevenue) * 100}%` }}
                                                initial={{ height: 0 }}
                                                animate={{ height: `${(item.total / maxRevenue) * 100}%` }}
                                                transition={{ delay: 0.6 + (i * 0.1), duration: 0.8, type: "spring" }}
                                            >
                                                <div className="absolute inset-0 bg-indigo-dye opacity-80 group-hover:opacity-100 transition-opacity"></div>
                                            </motion.div>
                                        </div>
                                        <span className="text-xs text-gray-400 font-medium">
                                            {item._id.month}/{item._id.year}
                                        </span>
                                        {/* Tooltip-like value */}
                                        <span className="text-[10px] font-bold text-indigo-dye opacity-0 group-hover:opacity-100 transition-opacity absolute -top-6">
                                            ₹{item.total.toLocaleString()}
                                        </span>
                                    </div>
                                ));
                            })()
                        ) : (
                            <div className="w-full text-center text-gray-400">No analytics data available</div>
                        )}
                    </div>
                </motion.div>

                {/* Recent Activity */}
                <motion.div
                    className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <h3 className="text-lg font-serif font-bold text-indigo-dye mb-4">Recent Orders</h3>
                    <div className="space-y-4">
                        {stats.recentOrders && stats.recentOrders.length > 0 ? (
                            stats.recentOrders.map((order) => (
                                <div key={order._id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors border-b border-gray-50 last:border-0">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-warm-cream flex items-center justify-center text-indigo-dye font-bold uppercase">
                                            {order.user ? order.user.substring(0, 2) : 'GU'}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-charcoal">{order.user || 'Guest'}</p>
                                            <p className="text-xs text-gray-400">
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-sm font-medium text-emerald-600">
                                        +₹{order.totalPrice.toLocaleString()}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className="text-center text-gray-400 py-4">No recent orders</div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default AdminDashboard;
