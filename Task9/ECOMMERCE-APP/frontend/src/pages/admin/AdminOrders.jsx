import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FiPackage, FiTruck, FiCheckCircle, FiAlertCircle, FiSearch, FiEye, FiX, FiFilter } from 'react-icons/fi';
import { toast } from 'sonner';
import orderService from '../../services/orderService';

const AdminOrders = () => {
  const { user } = useSelector((state) => state.auth);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [adminMessage, setAdminMessage] = useState('');

  // Helper to check isadmin
  const isAdminOrSpecialUser = user && (user.isAdmin || user.email === 'saykokiller45@gmail.com');

  // Fetch All Orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await orderService.getAllOrders(user.token);
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          toast.error("Access Denied: Admin privileges required.");
        } else {
          toast.error(error.response?.data?.message || "Failed to load orders");
        }
      } finally {
        setLoading(false);
      }
    };

    if (isAdminOrSpecialUser) {
      fetchOrders();
    } else {
      setLoading(false); // stop loading
    }
  }, [user]);

  // Mark as Delivered
  const handleMarkDelivered = async (orderId) => {
    try {
      await orderService.deliverOrder(orderId, user.token);

      // Update local state
      setOrders(orders.map(order =>
        order._id === orderId ? { ...order, deliveryStatus: 'Delivered', deliveredAt: new Date() } : order
      ));

      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder({ ...selectedOrder, deliveryStatus: 'Delivered', deliveredAt: new Date() });
      }

      toast.success("Order marked as Delivered");
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error(error.response?.data?.message || "Update failed");
    }
  };

  // Handler: Send Admin Message / Update Status with Note
  const handleUpdateStatus = async (orderId) => {
    if (!adminMessage.trim()) return;

    try {
      await orderService.updateOrderStatus(orderId, adminMessage, user.token);

      toast.success("Status update sent to user");
      setAdminMessage('');
    } catch (error) {
      console.error("Error sending update:", error);
      toast.error("Failed to send update");
    }
  };

  // Filter Logic
  const filteredOrders = orders.filter(order =>
    order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-dye"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-serif font-bold text-indigo-dye">Order Management</h1>
        <div className="relative w-full sm:w-64">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-dye/20"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="p-4 font-semibold text-gray-600 text-sm">Order ID</th>
                <th className="p-4 font-semibold text-gray-600 text-sm">Customer</th>
                <th className="p-4 font-semibold text-gray-600 text-sm">Date</th>
                <th className="p-4 font-semibold text-gray-600 text-sm">Total</th>
                <th className="p-4 font-semibold text-gray-600 text-sm">Payment</th>
                <th className="p-4 font-semibold text-gray-600 text-sm">Status</th>
                <th className="p-4 font-semibold text-gray-600 text-sm">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-mono text-xs text-black">#{order._id.substring(0, 8)}...</td>
                  <td className="p-4 text-sm text-gray-700">
                    <div className="font-medium">{order.user?.name || 'Guest'}</div>
                    <div className="text-xs text-gray-400">{order.user?.email}</div>
                  </td>
                  <td className="p-4 text-sm text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 font-medium text-indigo-dye">{formatPrice(order.totalPrice)}</td>
                  <td className="p-4">
                    <span className={`inline-flex px-2 py-1 rounded text-xs font-semibold ${order.isPaid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                      {order.isPaid ? 'Paid' : 'Unpaid'}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${order.deliveryStatus === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                      {order.deliveryStatus === 'Delivered' ? <FiCheckCircle size={10} /> : <FiTruck size={10} />}
                      {order.deliveryStatus === 'Delivered' ? 'Delivered' : 'Processing'}
                    </span>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="p-2 text-indigo-dye hover:bg-indigo-dye/10 rounded-full transition-colors"
                      title="View Details"
                    >
                      <FiEye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredOrders.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No orders found matching your search.
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
            >
              <FiX size={24} />
            </button>

            <div className="p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-serif font-bold text-indigo-dye">Order Details</h2>
                <span className="font-mono text-sm text-gray-400">#{selectedOrder._id}</span>
              </div>

              {/* Enhanced Tracking Stepper (New Feature) */}
              <div className="mb-10 px-4">
                <div className="relative">
                  {/* Progress Bar Background */}
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-100 rounded-full"></div>

                  <div
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-indigo-dye rounded-full transition-all duration-500"
                    style={{ width: selectedOrder.deliveryStatus === 'Delivered' ? '100%' : '50%' }}
                  ></div>

                  <div className="relative flex justify-between">
                    {/* Step 1: Placed */}
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-indigo-dye text-white flex items-center justify-center z-10 box-content border-4 border-white">
                        <FiCheckCircle size={16} />
                      </div>
                      <span className="text-xs font-bold text-indigo-dye">Order Placed</span>
                      <span className="text-[10px] text-gray-400">{formatDate(selectedOrder.createdAt)}</span>
                    </div>

                    {/* Step 2: Processing / Shipped */}
                    <div className="flex flex-col items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 box-content border-4 border-white ${selectedOrder.isPaid ? 'bg-indigo-dye text-white' : 'bg-gray-200 text-gray-400'
                        }`}>
                        <FiTruck size={16} />
                      </div>
                      <span className={`text-xs font-bold ${selectedOrder.isPaid ? 'text-indigo-dye' : 'text-gray-400'}`}>
                        Processing
                      </span>
                    </div>

                    {/* Step 3: Delivered */}
                    <div className="flex flex-col items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 box-content border-4 border-white ${selectedOrder.deliveryStatus === 'Delivered' ? 'bg-indigo-dye text-white' : 'bg-gray-200 text-gray-400'
                        }`}>
                        <FiPackage size={16} />
                      </div>
                      <span className={`text-xs font-bold ${selectedOrder.deliveryStatus === 'Delivered' ? 'text-indigo-dye' : 'text-gray-400'}`}>
                        Delivered
                      </span>
                      {selectedOrder.deliveryStatus === 'Delivered' && (
                        <span className="text-[10px] text-gray-400">{formatDate(selectedOrder.deliveredAt)}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {/* Customer Info */}
                <div className="space-y-4">
                  <h3 className="font-bold text-gray-900 border-b pb-2">Customer & Shipping</h3>
                  <div>
                    <p className="font-medium text-indigo-dye">{selectedOrder.user?.name}</p>
                    <p className="text-sm text-gray-500">{selectedOrder.user?.email}</p>
                  </div>
                  <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                    <p>{selectedOrder.shippingAddress.address}</p>
                    <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.postalCode}</p>
                    <p>{selectedOrder.shippingAddress.country}</p>
                  </div>
                </div>

                {/* Order Status Management */}
                <div className="space-y-4">
                  <h3 className="font-bold text-gray-900 border-b pb-2">Status Management</h3>

                  {/* Delivered Toggle */}
                  <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                    <span className="text-sm font-medium">Delivery Status</span>
                    {selectedOrder.deliveryStatus === 'Delivered' ? (
                      <span className="text-green-600 font-bold text-sm flex items-center gap-1">
                        <FiCheckCircle /> Delivered on {new Date(selectedOrder.deliveredAt).toLocaleDateString()}
                      </span>
                    ) : (
                      <button
                        onClick={() => handleMarkDelivered(selectedOrder._id)}
                        className="px-3 py-1 bg-indigo-dye text-white text-xs rounded hover:bg-opacity-90 transition-colors shadow-sm"
                      >
                        Mark as Delivered
                      </button>
                    )}
                  </div>

                  {/* Admin Message / Issue Input */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">
                      Update Message / Shipping Issue
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={adminMessage}
                        onChange={(e) => setAdminMessage(e.target.value)}
                        placeholder="e.g., Delay due to weather..."
                        className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded focus:border-indigo-dye outline-none"
                      />
                      <button
                        onClick={() => handleUpdateStatus(selectedOrder._id)}
                        className="px-3 py-2 bg-gray-900 text-white rounded hover:bg-gray-800 transition-colors"
                      >
                        Send
                      </button>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1">
                      <FiAlertCircle className="inline mr-1" />
                      This message will be visible to the user on their order tracking.
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="font-bold text-gray-900 border-b pb-2 mb-4">Order Items</h3>
                <div className="space-y-3">
                  {selectedOrder.orderItems.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                      <div className="flex items-center gap-4">
                        <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded border border-gray-200" />
                        <div>
                          <p className="font-medium text-sm text-indigo-dye">{item.name}</p>
                          <p className="text-xs text-gray-500">Qty: {item.qty} × {formatPrice(item.price)}</p>
                        </div>
                      </div>
                      <p className="font-medium text-indigo-dye">{formatPrice(item.qty * item.price)}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Total Amount</p>
                    <p className="text-xl font-bold text-indigo-dye">{formatPrice(selectedOrder.totalPrice)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
