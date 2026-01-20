import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getOffers, createOffer, updateOffer, deleteOffer, reset } from '../../redux/offerSlice';
import { fetchProducts } from '../../redux/productSlice';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiTag, FiCalendar, FiToggleLeft, FiToggleRight } from 'react-icons/fi';

const AdminOffers = () => {
    const dispatch = useDispatch();
    const { offers, isError, isSuccess, message, areOffersEnabled } = useSelector((state) => state.offer);
    const { products } = useSelector((state) => state.product);

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        discountPercentage: 0,
        startDate: '',
        endDate: '',
        status: true,
        isAppliesToAll: true,
        products: [],
        bannerImage: ''
    });
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        dispatch(reset()); // Clear any stale state on mount
        console.log('AdminOffers:fetch getoffer, product, globalStatus');
        dispatch(getOffers());
        dispatch(fetchProducts());
    }, [dispatch]);

    useEffect(() => {
        if (isError) {
            console.error('AdminOffers Error:', message);
            toast.error(message);
            dispatch(reset());
        }

        if (isSuccess) {
            toast.success(editId ? 'Offer updated successfully' : 'Offer created successfully');
            resetForm();
            dispatch(reset());
        }
    }, [isSuccess, isError, message, dispatch, editId]);

    const resetForm = () => {
        setFormData({
            name: '',
            discountPercentage: 0,
            startDate: '',
            endDate: '',
            status: true,
            isAppliesToAll: true,
            products: [],
            bannerImage: ''
        });
        setEditId(null);
        setIsFormOpen(false);
    };

    const handleCreate = () => {
        resetForm();
        setEditId(null);
        setIsFormOpen(true);
    };

    const handleChange = (e) => {
        console.log('handleChange:', e.target.value);
        const { name, value, type, checked } = e.target;
        console.log('handleChange:', formData);
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Ensure products is an array of strings (IDs)
        const submissionData = {
            ...formData,
            products: formData.products.map(p => (typeof p === 'object' ? p._id : p))
        };

        if (editId) {
            dispatch(updateOffer({ id: editId, offerData: submissionData }));
        } else {
            dispatch(createOffer(submissionData));
        }
    };

    const handleEdit = (offer) => {
        try {
            setEditId(offer._id);
            const formatDate = (dateString) => {
                if (!dateString) return '';
                try {
                    return new Date(dateString).toISOString().split('T')[0];
                } catch (e) {
                    return '';
                }
            };

            setFormData({
                name: offer.name || '',
                discountPercentage: offer.discountPercentage || 0,
                startDate: formatDate(offer.startDate),
                endDate: formatDate(offer.endDate),
                status: offer.status !== undefined ? offer.status : true,
                isAppliesToAll: offer.isAppliesToAll !== undefined ? offer.isAppliesToAll : true,
                products: (offer.products || []).map(p => (p && typeof p === 'object') ? p._id : p),
                bannerImage: offer.bannerImage || ''
            });
            setIsFormOpen(true);
        } catch (error) {
            console.error("Edit loading error:", error);
            toast.error('Failed to load offer for editing');
        }
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this offer?')) {
            dispatch(deleteOffer(id));
            toast.success('Offer Deleted');
        }
    };

    const handleStatusToggle = (offer) => {
        dispatch(updateOffer({ id: offer._id, offerData: { status: !offer.status } }));
    };


    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center gap-4">
                    <h1 className="text-3xl font-serif font-bold text-indigo-dye">Offers & Events</h1>
                    {/* <div className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-full border border-gray-200">
                        {/* <span className="text-sm font-medium text-gray-600">Global Status:</span> */}
                    {/* <button
                            onClick={handleGlobalToggle}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${areOffersEnabled ? 'bg-green-500' : 'bg-gray-300'}`}
                        >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${areOffersEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button> */}
                    {/* <span className={`text-xs font-bold ${areOffersEnabled ? 'text-green-600' : 'text-gray-500'}`}>
                            {areOffersEnabled ? 'Active' : 'Disabled'}
                        </span> */}
                    {/* </div>  */}
                </div>
                <button
                    onClick={handleCreate}
                    className="flex items-center gap-2 bg-indigo-dye text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors"
                >
                    <FiPlus /> Create Offer
                </button>
            </div>
            {/* Create/Edit Form Modal or Section */}
            <AnimatePresence>
                {isFormOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-white p-6 rounded-lg shadow-md border border-gray-100"
                    >
                        <h2 className="text-xl font-bold mb-4">{editId ? 'Edit Offer' : 'New Offer'}</h2>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* ... Fields ... */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Offer Name</label>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full mt-1 p-2 border rounded-md" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Discount (%)</label>
                                <input type="number" name="discountPercentage" value={formData.discountPercentage} onChange={handleChange} required className="w-full mt-1 p-2 border rounded-md" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Start Date</label>
                                <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required className="w-full mt-1 p-2 border rounded-md" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">End Date</label>
                                <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} required className="w-full mt-1 p-2 border rounded-md" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700">Banner Image URL</label>
                                <input type="text" name="bannerImage" value={formData.bannerImage} onChange={handleChange} placeholder="https://example.com/banner.jpg" className="w-full mt-1 p-2 border rounded-md" />
                            </div>
                            <div className="md:col-span-2 flex items-center gap-4">
                                <label className="flex items-center gap-2">
                                    <input type="checkbox" name="status" checked={formData.status} onChange={handleChange} />
                                    Active Status
                                </label>
                                <label className="flex items-center gap-2">
                                    <input type="checkbox" name="isAppliesToAll" checked={formData.isAppliesToAll} onChange={handleChange} />
                                    Applies to All Products
                                </label>
                            </div>

                            {!formData.isAppliesToAll && (
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Products</label>
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-60 overflow-y-auto border p-2 rounded-md">
                                        {products.map(p => (
                                            <div key={p._id} className={`flex items-center gap-2 p-2 rounded border cursor-pointer hover:bg-gray-50 ${formData.products.includes(p._id) ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'}`}
                                                onClick={() => {
                                                    const current = formData.products;
                                                    const isSelected = current.includes(p._id);
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        products: isSelected ? current.filter(id => id !== p._id) : [...current, p._id]
                                                    }));
                                                }}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={formData.products.includes(p._id)}
                                                    onChange={() => { }} // Handled by div click
                                                    className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                                                />
                                                <img src={p.image} alt={p.name} className="w-8 h-8 object-cover rounded" />
                                                <span className="text-xs font-medium truncate" title={p.name}>{p.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">Click to select/deselect products</p>
                                </div>
                            )}
                            <div className="md:col-span-2 flex gap-3 mt-4">
                                <button type="submit" className="bg-[#1B2A4E] text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition-colors shadow-sm">
                                    {editId ? 'Update Offer' : 'Create Offer'}
                                </button>
                                <button type="button" onClick={() => setIsFormOpen(false)} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
            {/* Offers List */}
            <div className="grid grid-cols-1 gap-4">
                {offers.map((offer) => (
                    <div key={offer._id} className={`bg-white p-4 rounded-lg shadow-sm border ${offer.status ? 'border-gray-100' : 'border-red-100 bg-red-50/10'} flex flex-col md:flex-row justify-between items-center gap-4`}>
                        <div className="flex-1">
                            <div className="flex items-center gap-3">
                                <h3 className="text-lg font-bold text-gray-800">{offer.name}</h3>
                                <button
                                    onClick={() => handleStatusToggle(offer)}
                                    className={`flex items-center gap-1 px-3 py-1 text-xs rounded-full font-bold transition-colors border ${offer.status ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100' : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'}`}
                                    title="Click to toggle status"
                                >
                                    {offer.status ? <FiToggleRight size={16} /> : <FiToggleLeft size={16} />}
                                    {offer.status ? 'Active' : 'Inactive'}
                                </button>
                                <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 text-xs rounded-full font-bold">
                                    {offer.discountPercentage}% OFF
                                </span>
                            </div>
                            <div className="text-sm text-gray-500 mt-1 flex gap-4">
                                <span className="flex items-center gap-1"><FiCalendar /> {new Date(offer.startDate).toLocaleDateString()} - {new Date(offer.endDate).toLocaleDateString()}</span>
                                <span className="flex items-center gap-1"><FiTag /> {offer.isAppliesToAll ? 'All Products' : `${offer.products.length} Products`}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={() => handleEdit(offer)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"><FiEdit2 /></button>
                            <button onClick={() => handleDelete(offer._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-full"><FiTrash2 /></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default AdminOffers;
