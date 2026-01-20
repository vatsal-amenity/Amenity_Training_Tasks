import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCoupons, createCoupon, deleteCoupon, updateCoupon, reset } from '../../redux/couponSlice';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiTrash2, FiTag, FiCalendar, FiEdit2, FiToggleLeft, FiToggleRight } from 'react-icons/fi';


const AdminCoupons = () => {
    const dispatch = useDispatch();
    const { coupons, isError, isSuccess, message } = useSelector((state) => state.coupon || {});

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);

    const [formData, setFormData] = useState({
        code: '',
        discountType: 'percentage',
        discountValue: 0,
        minCartValue: 0,
        expiryDate: '',
        isActive: true,
    });

    useEffect(() => {
        dispatch(getCoupons());
    }, [dispatch]);

    useEffect(() => {
        if (isError) {
            toast.error(message);
            dispatch(reset());
        }
        if (isSuccess) {
            toast.success(editId ? 'Coupon Updated successfully' : 'Coupon Created successfully');
            resetForm(); // This will clear form and close modal
            dispatch(reset());
        }
    }, [isSuccess, isError, message, dispatch, editId]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const resetForm = () => {
        setFormData({
            code: '',
            discountType: 'percentage',
            discountValue: 0,
            minCartValue: 0,
            expiryDate: '',
            isActive: true,
        });
        setIsEditing(false);
        setEditId(null);
        setIsFormOpen(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEditing && editId) {
            //update coupon
            dispatch(updateCoupon({ id: editId, couponData: formData }));
        } else {
            //create new 
            dispatch(createCoupon(formData));
        }
    };

    const handleEdit = (coupon) => {
        //populate form with data
        setFormData({
            code: coupon.code,
            discountType: coupon.discountType,
            discountValue: coupon.discountValue,
            minCartValue: coupon.minCartValue,
            expiryDate: new Date(coupon.expiryDate).toISOString().split('T')[0],
            isActive: coupon.isActive,
        });
        setEditId(coupon._id);
        setIsEditing(true);
        setIsFormOpen(true);

        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleToggleActive = (coupon) => {
        dispatch(updateCoupon({
            id: coupon._id,
            couponData: { ...coupon, isActive: !coupon.isActive }
        }));
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this coupon?')) {
            dispatch(deleteCoupon(id));
        }
    };

    useEffect(() => {
        console.log("fetch Coupons :", coupons);
    }, [coupons]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <h1 className="text-3xl font-serif font-bold text-indigo-dye">Coupons</h1>
                <button
                    onClick={() => {
                        resetForm(); // Clear any previous edit state
                        setIsFormOpen(true);
                    }}
                    className="flex items-center gap-2 bg-indigo-dye text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors"
                >
                    <FiPlus /> Create Coupon
                </button>
            </div>
            <AnimatePresence>
                {isFormOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-white p-6 rounded-lg shadow-md border border-gray-100 overflow-hidden"
                    >
                        <h2 className="text-xl font-bold mb-4">{isEditing ? 'Edit Coupon' : 'New Coupon'}</h2>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Code</label>
                                <input type="text" name="code" value={formData.code} onChange={handleChange} required className="w-full mt-1 p-2 border rounded-md uppercase" placeholder="SUMMER50" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Discount Type</label>
                                <select name="discountType" value={formData.discountType} onChange={handleChange} className="w-full mt-1 p-2 border rounded-md">
                                    <option value="percentage">Percentage (%)</option>
                                    <option value="flat">Fixed Amount</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Discount Value</label>
                                <input type="number" name="discountValue" value={formData.discountValue} onChange={handleChange} required className="w-full mt-1 p-2 border rounded-md" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Min Cart Value</label>
                                <input type="number" name="minCartValue" value={formData.minCartValue} onChange={handleChange} required className="w-full mt-1 p-2 border rounded-md" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
                                <input type="date" name="expiryDate" value={formData.expiryDate} onChange={handleChange} required className="w-full mt-1 p-2 border rounded-md" />
                            </div>
                            <div className="flex items-center mt-6">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} className="w-4 h-4 text-indigo-600 rounded" />
                                    <span>Active</span>
                                </label>
                            </div>
                            <div className="md:col-span-2 flex gap-3 mt-4">
                                <button type="submit" className="bg-[#1B2A4E] text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition-colors">
                                    {isEditing ? 'Update Coupon' : 'Create Coupon'}
                                </button>
                                <button type="button" onClick={resetForm} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300">Cancel</button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
            <div className="grid grid-cols-1 gap-4">
                {Array.isArray(coupons) && coupons.length > 0 ? (
                    coupons.map((coupon) => (
                        <div key={coupon._id} className={`bg-white p-4 rounded-lg shadow-sm border ${coupon.isActive ? 'border-gray-100' : 'border-red-100 bg-red-50/10'} flex flex-col md:flex-row justify-between items-center gap-4`}>
                            <div className="flex-1">
                                <div className="flex items-center gap-3">
                                    <h3 className="text-xl font-bold text-gray-800">{coupon.code}</h3>
                                    {/* Interactive Toggle for Active Status */}
                                    <button
                                        onClick={() => handleToggleActive(coupon)}
                                        className={`flex items-center gap-1 px-2 py-0.5 text-xs rounded-full font-bold cursor-pointer transition-colors ${coupon.isActive ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200'}`}
                                        title="Click to toggle status"
                                    >
                                        {coupon.isActive ? <FiToggleRight size={16} /> : <FiToggleLeft size={16} />}
                                        {coupon.isActive ? 'Active' : 'Inactive'}
                                    </button>
                                    <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 text-xs rounded-full font-bold">
                                        {coupon.discountType === 'percentage' ? `${coupon.discountValue}% OFF` : `₹${coupon.discountValue} OFF`}
                                    </span>
                                </div>
                                <div className="text-sm text-gray-500 mt-1 flex gap-4">
                                    <span className="flex items-center gap-1"><FiCalendar /> Expires: {new Date(coupon.expiryDate).toLocaleDateString()}</span>
                                    <span className="flex items-center gap-1"><FiTag /> Min Order: ₹{coupon.minCartValue}</span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => handleEdit(coupon)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-full" title="Edit Coupon">
                                    <FiEdit2 />
                                </button>
                                <button onClick={() => handleDelete(coupon._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-full" title="Delete Coupon">
                                    <FiTrash2 />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 text-center py-4">No coupons found.</p>
                )}
            </div>
        </div>
    );
};

export default AdminCoupons;
