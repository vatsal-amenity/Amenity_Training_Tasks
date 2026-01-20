import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    FiPackage, FiUser, FiMapPin, FiCheckCircle, FiTruck,
    FiShoppingBag, FiChevronRight, FiX, FiHeart, FiTrash2,
    FiShoppingCart
} from 'react-icons/fi';

// Services
import orderService from '../services/orderService';
import authService from '../services/authService';

// Redux Slices
import { addToCart } from '../redux/cartSlice';

// Utility helper for currency formatting
const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(price);
};

// Utility helper for date formatting
const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

// --- Sub-Components ---

const StepIcon = ({ active, icon, label, date }) => (
    <div className="flex flex-col items-center gap-2">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 box-content border-4 border-white ${active ? 'bg-indigo-dye text-white' : 'bg-gray-200 text-gray-400'
            }`}>
            {icon}
        </div>
        <span className={`text-xs font-bold ${active ? 'text-indigo-dye' : 'text-gray-400'}`}>
            {label}
        </span>
        {date && <span className="text-[10px] text-gray-400">{date}</span>}
    </div>
);

const OrderTrackingModal = ({ order, onClose }) => {
    if (!order) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
                >
                    <FiX size={24} />
                </button>

                <div className="p-6 sm:p-8">
                    <h3 className="text-2xl font-serif font-bold text-indigo-dye mb-2">Track Order</h3>
                    <p className="text-gray-500 mb-8">Order ID: <span className="font-mono text-black">#{order._id}</span></p>

                    <div className="mb-10">
                        <div className="relative">
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-100 rounded-full"></div>
                            <div
                                className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-indigo-dye rounded-full transition-all duration-500"
                                style={{ width: order.deliveryStatus === 'Delivered' ? '100%' : '50%' }}
                            ></div>

                            <div className="relative flex justify-between">
                                <StepIcon active={true} icon={<FiCheckCircle size={16} />} label="Order Placed" date={formatDate(order.createdAt)} />
                                <StepIcon active={order.isPaid} icon={<FiTruck size={16} />} label="Processing" />
                                <StepIcon active={order.deliveryStatus === 'Delivered'} icon={<FiPackage size={16} />} label="Delivered" date={order.deliveryStatus === 'Delivered' ? formatDate(order.deliveredAt) : null} />
                            </div>
                        </div>
                    </div>

                    {order.message && (
                        <div className="mb-6 bg-blue-50 border-l-4 border-indigo-dye p-4 rounded-r-md">
                            <div className="flex items-start">
                                <div className="flex-shrink-0"><FiCheckCircle className="h-5 w-5 text-indigo-dye" /></div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-bold text-indigo-dye">Update from Seller</h3>
                                    <p className="mt-1 text-sm text-gray-700">{order.message}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="space-y-4 border-t border-gray-100 pt-6">
                        <h4 className="font-bold text-indigo-dye">Order Items</h4>
                        {order.orderItems.map((item) => (
                            <div key={item.product || item._id} className="flex items-center gap-4">
                                <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded bg-gray-50 border border-gray-200" />
                                <div className="flex-1">
                                    <p className="font-medium text-sm text-indigo-dye">{item.name}</p>
                                    <p className="text-xs text-gray-500">Qty: {item.qty} × {formatPrice(item.price)}</p>
                                </div>
                                <p className="font-bold text-indigo-dye">{formatPrice(item.qty * item.price)}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 bg-gray-50 p-4 rounded-lg flex gap-4 items-start">
                        <FiMapPin className="mt-1 text-terracotta flex-shrink-0" />
                        <div>
                            <p className="text-sm font-bold text-indigo-dye mb-1">Shipping Address</p>
                            <p className="text-sm text-gray-600">
                                {order.shippingAddress.address}, {order.shippingAddress.city}<br />
                                {order.shippingAddress.state}, {order.shippingAddress.postalCode}<br />
                                {order.shippingAddress.country}
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-between items-center bg-indigo-dye/5 p-4 rounded-lg">
                        <span className="font-bold text-indigo-dye">Total Amount Paid</span>
                        <span className="text-xl font-bold text-indigo-dye">{formatPrice(order.totalPrice)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const OrdersView = ({ orders, loading, onTrackOrder }) => {
    if (loading) return <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-dye"></div></div>;

    if (orders.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                <FiPackage size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
                <p className="text-gray-500 mb-6">Looks like you haven't bought anything yet.</p>
                <a href="/shop" className="text-terracotta font-medium hover:underline">Start Shopping</a>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {orders.map((order) => (
                <div key={order._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md">
                    <div className="p-6 border-b border-gray-50 flex flex-wrap justify-between items-center gap-4">
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Order ID</p>
                            <p className="font-mono text-indigo-dye">#{order._id.substring(0, 8)}...</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Date</p>
                            <p className="text-indigo-dye">{formatDate(order.createdAt)}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Total</p>
                            <p className="font-bold text-indigo-dye">{formatPrice(order.totalPrice)}</p>
                        </div>
                        <div>
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${order.deliveryStatus === 'Delivered' ? 'bg-green-50 text-green-700 border-green-100' :
                                    order.isPaid ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                        'bg-yellow-50 text-yellow-700 border-yellow-100'
                                }`}>
                                {order.deliveryStatus === 'Delivered' ? 'Delivered' : order.isPaid ? 'Processing' : 'Pending'}
                            </span>
                        </div>
                        <button
                            onClick={() => onTrackOrder(order)}
                            className="px-4 py-2 bg-indigo-dye text-white text-sm rounded-lg hover:bg-opacity-90 transition-colors flex items-center gap-2"
                        >
                            Track Order <FiChevronRight />
                        </button>
                    </div>
                    <div className="p-6 bg-gray-50 flex items-center gap-4 overflow-x-auto">
                        {order.orderItems.slice(0, 3).map((item, index) => (
                            <div key={index} className="flex-shrink-0 w-16 h-16 bg-white rounded border border-gray-200 p-1 relative group">
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                <div className="absolute -top-2 -right-2 w-5 h-5 bg-terracotta text-white rounded-full text-xs flex items-center justify-center font-bold">
                                    {item.qty}
                                </div>
                            </div>
                        ))}
                        {order.orderItems.length > 3 && (
                            <div className="flex-shrink-0 w-16 h-16 bg-white rounded border border-gray-200 flex items-center justify-center text-gray-400 text-sm font-medium">
                                +{order.orderItems.length - 3}
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

const WishlistView = ({ wishlist, loading, onRemove, onAddToCart }) => {
    if (loading) return <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-dye"></div></div>;

    if (!wishlist || wishlist.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                <FiHeart size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
                <p className="text-gray-500 mb-6">Save items you love to buy later.</p>
                <a href="/shop" className="text-terracotta font-medium hover:underline">Start Shopping</a>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {wishlist.map((item) => (
                <div key={item._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all flex flex-col">
                    <div className="relative aspect-[4/3] overflow-hidden">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        <button
                            onClick={() => onRemove(item._id)}
                            className="absolute top-2 right-2 p-2 bg-white/80 backdrop-blur-sm rounded-full text-red-500 hover:bg-white transition-colors"
                        >
                            <FiTrash2 size={18} />
                        </button>
                    </div>
                    <div className="p-4 flex flex-col flex-grow">
                        <h3 className="font-serif font-bold text-indigo-dye mb-1 truncate">{item.name}</h3>
                        <p className="text-sm text-gray-500 mb-3 truncate">{item.brand}</p>
                        <div className="mt-auto flex items-center justify-between">
                            <span className="font-bold text-lg text-indigo-dye">{formatPrice(item.price)}</span>
                            {item.countStock > 0 ? (
                                <button
                                    onClick={() => onAddToCart(item)}
                                    className="p-2 bg-indigo-dye text-white rounded-lg hover:bg-opacity-90 transition-colors"
                                    title="Add to Cart"
                                >
                                    <FiShoppingCart size={18} />
                                </button>
                            ) : (
                                <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-bold uppercase rounded">Out of Stock</span>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

// --- Main Page Component ---

const ProfilePage = () => {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const [activeTab, setActiveTab] = useState('orders');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [orders, setOrders] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(false);
    const [wishlist, setWishlist] = useState([]);
    const [wishlistLoading, setWishlistLoading] = useState(false);

    // Fetch Orders
    const fetchOrders = useCallback(async () => {
        if (!user?.token) return;
        try {
            setOrdersLoading(true);
            const data = await orderService.getMyOrders(user.token);
            setOrders(data);
        } catch (err) {
            console.error("Error fetching orders:", err);
            // Handle error appropriately if needed
        } finally {
            setOrdersLoading(false);
        }
    }, [user?.token]);

    // Fetch Wishlist
    const fetchWishlist = useCallback(async () => {
        if (!user?.token) return;
        try {
            setWishlistLoading(true);
            const data = await authService.getWishlist(user.token);
            // Ensure data is array; if backend returns { wishlist: [...] }, extract it.
            setWishlist(Array.isArray(data) ? data : data.wishlist || []);
        } catch (error) {
            console.error("Error fetching wishlist:", error);
        } finally {
            setWishlistLoading(false);
        }
    }, [user?.token]);

    useEffect(() => {
        if (activeTab === 'orders') fetchOrders();
        else if (activeTab === 'wishlist') fetchWishlist();
    }, [activeTab, fetchOrders, fetchWishlist]);

    const handleRemoveFromWishlist = async (productId) => {
        try {
            // Using toggleWishlist which acts as remove when item exists
            await authService.toggleWishlist(productId, user.token);
            setWishlist(prev => prev.filter(item => item._id !== productId));
        } catch (error) {
            console.error("Error removing from wishlist", error);
        }
    };

    const handleAddToCart = (item) => {
        dispatch(addToCart({
            productId: item._id,
            name: item.name,
            price: item.price,
            image: item.image,
            countStock: item.countStock,
            qty: 1
        }));
    };

    if (!user) return <div className="p-8 text-center text-gray-500">Please log in to view your profile.</div>;

    return (
        <div className="min-h-screen bg-[#FDFBF7] font-sans pb-12">
            <div className="bg-indigo-dye text-white pt-24 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-serif font-bold mb-2">My Profile</h1>
                    <p className="text-gray-300">Manage your account and track your orders</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center text-indigo-dye mb-4"><FiUser size={40} /></div>
                                <h2 className="text-xl font-bold text-indigo-dye mb-1">{user?.name || 'User'}</h2>
                                <p className="text-gray-500 text-sm mb-6">{user?.email}</p>
                                <div className="w-full border-t border-gray-100 pt-6 text-left space-y-4">
                                    <div className="flex items-center gap-3 text-gray-600"><FiShoppingBag className="text-terracotta" /><span>{orders.length} Orders Placed</span></div>
                                    <div className="flex items-center gap-3 text-gray-600"><FiHeart className="text-terracotta" /><span>{wishlist.length} Items in Wishlist</span></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-1 flex gap-2">
                            {['orders', 'wishlist'].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`flex-1 py-3 text-sm font-medium rounded-lg transition-all capitalize ${activeTab === tab ? 'bg-indigo-dye text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
                                >
                                    My {tab}
                                </button>
                            ))}
                        </div>

                        {activeTab === 'orders' ? (
                            <>
                                <h2 className="text-2xl font-serif font-bold text-indigo-dye mb-4">Order History</h2>
                                <OrdersView orders={orders} loading={ordersLoading} onTrackOrder={setSelectedOrder} />
                            </>
                        ) : (
                            <>
                                <h2 className="text-2xl font-serif font-bold text-indigo-dye mb-4">My Wishlist</h2>
                                <WishlistView wishlist={wishlist} loading={wishlistLoading} onRemove={handleRemoveFromWishlist} onAddToCart={handleAddToCart} />
                            </>
                        )}
                    </div>
                </div>
            </div>
            <OrderTrackingModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
        </div>
    );
};

export default ProfilePage;