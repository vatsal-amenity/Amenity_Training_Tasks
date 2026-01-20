import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiAlertCircle, FiCheckCircle, FiX, FiUploadCloud, FiImage } from 'react-icons/fi';
import { toast } from 'sonner';
import productService from '../../services/productService'; // Import Service

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    //model state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentProductId, setCurrentProductId] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [statusFilter, setStatusFilter] = useState('all');

    //from state
    const [formData, setFormData] = useState({
        name: "",
        brand: "",
        category: "",
        description: "",
        price: "",
        countStock: "",
        isoutofstock: false,
        image: null,
        gallery: [] // New field for gallery
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [galleryPreviews, setGalleryPreviews] = useState([]); // Preview for gallery images

    useEffect(() => {
        fetchProducts();
    }, []);

    //api calls
    const fetchProducts = async () => {
        try {
            // productService.getProducts() returns data directly
            const data = await productService.getProducts();
            console.log("product data:", data);
            setProducts(data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching products:", error);
            toast.error("Failed to Load products");
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                await productService.deleteProduct(id, user?.token);

                toast.success("Product deleted successfully");
                fetchProducts();
            } catch (error) {
                console.error("Error deleting product:", error);
                toast.error("Failed to delete product");
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        //create from data for multer
        const data = new FormData();
        data.append("name", formData.name);
        data.append("brand", formData.brand);
        data.append("category", formData.category);
        data.append("description", formData.description);
        data.append("price", formData.price);
        data.append("countStock", formData.countStock);
        data.append("isoutofstock", formData.isoutofstock); // Add stock status

        //only append image if new file is selected
        if (formData.image && typeof formData.image !== "string") {
            data.append("image", formData.image);
        }

        // Append gallery images
        if (formData.gallery && formData.gallery.length > 0) {
            // If it's an array of File objects
            Array.from(formData.gallery).forEach((file) => {
                if (typeof file !== 'string') {
                    data.append("gallery", file);
                }
            });
        }

        try {
            const user = JSON.parse(localStorage.getItem('user'));

            if (isEditMode) {
                await productService.updateProduct(currentProductId, data, user?.token);
                toast.success("Product updated successfully");
            } else {
                await productService.createProduct(data, user?.token);
                toast.success("Product added successfully");
            }
            closeModal();
            fetchProducts();
        } catch (error) {
            console.error("Error saving products:", error);
            // Enhanced error message from backend if available
            const errorMsg = error.response?.data?.message || "Failed to save product";
            toast.error(errorMsg);
        } finally {
            setIsSubmitting(false);
        }
    };

    //helper function

    const openAddModal = () => {
        setIsEditMode(false);
        setFormData({
            name: "",
            brand: "",
            category: "",
            description: "",
            price: "",
            countStock: "",
            isoutofstock: false,
            image: null,
            gallery: []
        });
        setImagePreview(null);
        setGalleryPreviews([]);
        setIsModalOpen(true);
    };

    const openEditModal = (product) => {
        setIsEditMode(true);
        setCurrentProductId(product._id);
        setFormData({
            name: product.name,
            brand: product.brand,
            category: product.category,
            description: product.description,
            price: product.price,
            countStock: product.countStock,
            isoutofstock: product.isoutofstock || false,
            image: product.image,
            gallery: product.gallery || []
        });
        setImagePreview(product.image);
        // Determine gallery previews (mix of strings/URLs and files handled in logic, but initially just strings)
        setGalleryPreviews(product.gallery || []);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setFormData({ name: '', brand: '', category: '', description: '', price: '', countStock: '', isoutofstock: false, image: null, gallery: [] });
        setImagePreview(null);
        setGalleryPreviews([]);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, image: file });
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleGalleryChange = (e) => {
        const NewFiles = Array.from(e.target.files);

        // Combine existing gallery with new files
        const updatedGallery = [...formData.gallery, ...NewFiles];

        if (updatedGallery.length > 5) {
            toast.error("You can only have up to 5 gallery images in total.");
            return;
        }

        setFormData({ ...formData, gallery: updatedGallery });

        // Update Previews (Create object URLs for new files)
        const newPreviews = NewFiles.map(file => URL.createObjectURL(file));
        setGalleryPreviews(prev => [...prev, ...newPreviews]);
    };

    const removeGalleryImage = (index) => {
        const updatedGallery = formData.gallery.filter((_, i) => i !== index);
        setFormData({ ...formData, gallery: updatedGallery });

        // Update Previews
        const updatedPreviews = galleryPreviews.filter((_, i) => i !== index);
        setGalleryPreviews(updatedPreviews);
    };


    //filter products
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.category.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all'
            ? true
            : statusFilter === 'outofstock'
                ? product.countStock === 0 || product.isoutofstock
                : product.countStock > 0 && !product.isoutofstock;

        return matchesSearch && matchesStatus;
    });

    // Pagination Logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));


    return (
        <div className="space-y-6 relative">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-indigo-dye">Products</h1>
                    <p className="text-gray-500 mt-1">Manage your inventory (~{products.length} items)</p>
                </div>
                <button
                    onClick={openAddModal}
                    className="flex items-center gap-2 bg-terracotta text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition-all font-medium shadow-md"
                >
                    <FiPlus size={20} />
                    <span>Add New Product</span>
                </button>
            </div>
            {/* Search Bar and Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by name, brand, or category..."
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                        className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-dye focus:ring-1 focus:ring-indigo-dye outline-none transition-all"
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                    className="px-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-dye focus:ring-1 focus:ring-indigo-dye outline-none bg-white text-gray-700 font-medium cursor-pointer"
                >
                    <option value="all">All Status</option>
                    <option value="available">Available (In Stock)</option>
                    <option value="outofstock">Out of Stock</option>
                </select>
            </div>
            {/* Products Table */}
            {/* Products Table (Desktop) & Cards (Mobile) */}
            <div className="bg-transparent md:bg-white rounded-lg md:shadow-sm md:border border-gray-100 overflow-hidden">
                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-warm-cream/30 text-indigo-dye font-serif">
                            <tr>
                                <th className="p-4 font-bold">Product</th>
                                <th className="p-4 font-bold">Brand/Category</th>
                                <th className="p-4 font-bold">Price</th>
                                <th className="p-4 font-bold">Stock</th>
                                <th className="p-4 font-bold text-center">Status</th>
                                <th className="p-4 font-bold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="6" className="p-8 text-center text-gray-500">Loading products...</td></tr>
                            ) : currentItems.length === 0 ? (
                                <tr><td colSpan="6" className="p-8 text-center text-gray-500">No products found.</td></tr>
                            ) : (
                                currentItems.map((product, index) => (
                                    <motion.tr
                                        key={product._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
                                    >
                                        <td className="p-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-16 h-16 rounded-md overflow-hidden bg-gray-100 border border-gray-200">
                                                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-indigo-dye">{product.name}</h3>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <p className="text-sm font-medium text-gray-700">{product.brand}</p>
                                            <span className="inline-block px-2 py-0.5 mt-1 text-xs rounded-full bg-indigo-dye/5 text-indigo-dye">{product.category}</span>
                                        </td>
                                        <td className="p-4 font-medium text-indigo-dye">₹{product.price?.toLocaleString()}</td>
                                        <td className="p-4 text-gray-600">{product.countStock}</td>
                                        <td className="p-4 text-center">
                                            {product.countStock === 0 || product.isoutofstock ? (
                                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-50 text-red-600"><FiAlertCircle /> Out of Stock</span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-600"><FiCheckCircle /> Active</span>
                                            )}
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => openEditModal(product)} className="p-2 text-indigo-dye hover:bg-indigo-dye/10 rounded-full transition-colors"><FiEdit2 size={18} /></button>
                                                <button onClick={() => handleDelete(product._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"><FiTrash2 size={18} /></button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden space-y-4">
                    {loading ? (
                        <div className="text-center py-10 text-gray-500">Loading products...</div>
                    ) : currentItems.length === 0 ? (
                        <div className="text-center py-10 text-gray-500">No products found.</div>
                    ) : (
                        currentItems.map((product, index) => (
                            <motion.div
                                key={product._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4"
                            >
                                {/* Image */}
                                <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                </div>
                                {/* Content */}
                                <div className="flex-1 min-w-0 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-bold text-indigo-dye truncate pr-2">{product.name}</h3>
                                            <div className="flex gap-1">
                                                <button onClick={() => openEditModal(product)} className="p-1.5 text-indigo-dye bg-indigo-dye/5 rounded-md"><FiEdit2 size={14} /></button>
                                                <button onClick={() => handleDelete(product._id)} className="p-1.5 text-red-500 bg-red-50 rounded-md"><FiTrash2 size={14} /></button>
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-500">{product.brand} • {product.category}</p>
                                    </div>

                                    <div className="flex items-end justify-between mt-2">
                                        <div>
                                            <p className="font-bold text-indigo-dye">₹{product.price?.toLocaleString()}</p>
                                            <p className="text-xs text-gray-500">Stock: {product.countStock}</p>
                                        </div>
                                        <div>
                                            {product.countStock === 0 || product.isoutofstock ? (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-600 uppercase tracking-wide">Sold Out</span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-700 uppercase tracking-wide">Active</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
            {/* Pagination Controls */}
            {!loading && filteredProducts.length > 0 && (
                <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-b-lg shadow-sm">
                    <div className="flex flex-1 justify-between sm:hidden">
                        <button
                            onClick={prevPage}
                            disabled={currentPage === 1}
                            className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            Previous
                        </button>
                        <button
                            onClick={nextPage}
                            disabled={currentPage === totalPages}
                            className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            Next
                        </button>
                    </div>
                    <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-gray-700">
                                Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to <span className="font-medium">{Math.min(indexOfLastItem, filteredProducts.length)}</span> of <span className="font-medium">{filteredProducts.length}</span> results
                            </p>
                        </div>
                        <div>
                            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                                <button
                                    onClick={prevPage}
                                    disabled={currentPage === 1}
                                    className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    <span className="sr-only">Previous</span>
                                    {/* Chevron Left */}
                                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                                    </svg>
                                </button>
                                {/* Current Page Indicator */}
                                <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 focus:outline-offset-0">
                                    Page {currentPage} of {totalPages}
                                </span>
                                <button
                                    onClick={nextPage}
                                    disabled={currentPage === totalPages}
                                    className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    <span className="sr-only">Next</span>
                                    {/* Chevron Right */}
                                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>
            )}
            {/* Add/Edit Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 20 }}
                            className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                        >
                            <div className="p-4 md:p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                                <h2 className="text-xl md:text-2xl font-serif font-bold text-indigo-dye">
                                    {isEditMode ? 'Edit Product' : 'Add New Product'}
                                </h2>
                                <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><FiX size={24} /></button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-6">
                                {/* Image Upload Main */}
                                <div className="flex justify-center">
                                    <div className="w-full max-w-xs">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Main Product Image (Required)</label>
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-indigo-dye transition-colors cursor-pointer relative">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            />
                                            {imagePreview ? (
                                                <div className="relative h-48 w-full">
                                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-contain rounded-md" />
                                                </div>
                                            ) : (
                                                <div className="py-8 text-gray-400 flex flex-col items-center">
                                                    <FiUploadCloud size={40} className="mb-2" />
                                                    <span>Click to upload main image</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Gallery Upload */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Gallery Images (Max 5)</label>
                                    <div className="flex flex-col gap-4">
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-indigo-dye transition-colors cursor-pointer relative bg-gray-50/50">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                onChange={handleGalleryChange}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                disabled={formData.gallery.length >= 5}
                                            />
                                            <div className="py-4 text-gray-400 flex flex-col items-center">
                                                <FiImage size={24} className="mb-2" />
                                                <span>
                                                    {formData.gallery.length >= 5
                                                        ? "Limit reached (5 images)"
                                                        : "Click to add images (Append)"}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Gallery Previews Grid */}
                                        {galleryPreviews.length > 0 && (
                                            <div className="grid grid-cols-5 gap-2">
                                                {galleryPreviews.map((src, idx) => (
                                                    <div key={idx} className="relative group w-20 h-20 rounded-md overflow-hidden border border-gray-200">
                                                        <img src={src} alt={`gallery-${idx}`} className="w-full h-full object-cover" />
                                                        <button
                                                            type="button"
                                                            onClick={() => removeGalleryImage(idx)}
                                                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity transform hover:scale-110"
                                                        >
                                                            <FiX size={12} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="input-group">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-dye/20 focus:border-indigo-dye outline-none"
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.brand}
                                            onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-dye/20 focus:border-indigo-dye outline-none"
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-dye/20 focus:border-indigo-dye outline-none"
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                                        <input
                                            type="number"
                                            required
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-dye/20 focus:border-indigo-dye outline-none"
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Stock Count</label>
                                        <input
                                            type="number"
                                            required
                                            value={formData.countStock}
                                            onChange={(e) => setFormData({ ...formData, countStock: e.target.value })}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-dye/20 focus:border-indigo-dye outline-none"
                                        />
                                    </div>
                                    <div className="input-group flex items-center h-full pt-6">
                                        <label className="flex items-center space-x-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={formData.isoutofstock}
                                                onChange={(e) => setFormData({ ...formData, isoutofstock: e.target.checked })}
                                                className="w-5 h-5 text-indigo-dye rounded focus:ring-indigo-dye border-gray-300"
                                            />
                                            <span className="text-sm font-medium text-gray-700">Mark as Out of Stock</span>
                                        </label>
                                    </div>
                                </div>
                                <div className="input-group">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <textarea
                                        rows="4"
                                        required
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-dye/20 focus:border-indigo-dye outline-none resize-none"
                                    ></textarea>
                                </div>
                                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className={`px-6 py-2 rounded-lg bg-indigo-dye text-white hover:bg-opacity-90 transition-colors shadow-md ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                                    >
                                        {isSubmitting ? 'Processing...' : (isEditMode ? 'Update Product' : 'Create Product')}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminProducts;


