import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiFilter,
  FiSearch,
  FiX,
  FiShoppingCart,
  FiAlertCircle,
} from "react-icons/fi";
import Navbar from "../components/user/Navbar";
import Footer from "../components/user/Footer";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../redux/productSlice';

const Shop = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Redux State
  const { products, isLoading: loading, isError, message: error } = useSelector(
    (state) => state.product
  );

  // Local State
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All");
  const [stockFilter, setStockFilter] = useState("All"); // All, In Stock, Out of Stock
  // Default max price increased to 1,00,000 to ensure products aren't hidden by default
  const [priceRange, setPriceRange] = useState([0, 100000]);

  const categories = [
    "All",
    "Cotton",
    "Silk",
    "Banarasi",
    "Chiffon",
    "Georgette",
  ];

  // Fetch Products on Mount
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Update filtered products when products change
  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);

  // Filter Logic
  useEffect(() => {
    let result = [...products];
    //Search 
    if (searchTerm) {
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    // Category 
    if (category !== "All") {
      result = result.filter(
        (p) => p.category?.toLowerCase() === category.toLowerCase()
      );
    }
    // Price 
    if (priceRange) {
      result = result.filter(
        (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
      );
    }
    // Stock Filter
    if (stockFilter === "In Stock") {
      result = result.filter((p) => p.countStock > 0 && !p.isoutofstock);
    } else if (stockFilter === "Out of Stock") {
      result = result.filter((p) => p.countStock === 0 || p.isoutofstock);
    }
    setFilteredProducts(result);
  }, [products, searchTerm, category, priceRange, stockFilter]);

  useEffect(() => {
    const catParam = searchParams.get("category");
    if (catParam) {
      const matchedCat = categories.find(
        (c) => c.toLowerCase() === catParam.toLowerCase()
      );
      if (matchedCat) setCategory(matchedCat);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans text-indigo-dye flex flex-col">
      <Navbar />
      <div className="flex-grow pt-28 pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div>
            <span className="text-terracotta text-sm font-bold tracking-widest uppercase mb-2 block">
              The Collection
            </span>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-indigo-dye">
              Shop All Items
            </h1>
            <p className="text-gray-500 mt-2 font-light text-lg">
              {filteredProducts.length} unique designs discovered
            </p>
          </div>
          {/* Search & Mobile Filter Toggle */}
          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative flex-grow md:flex-grow-0 group">
              <input
                type="text"
                placeholder="Search collection..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-72 pl-12 pr-4 py-3 rounded-full border border-gray-200 bg-white focus:border-indigo-dye focus:ring-1 focus:ring-indigo-dye outline-none transition-all shadow-sm group-hover:shadow-md"
              />
              <FiSearch
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-terracotta transition-colors"
                size={20}
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden p-3 border border-gray-200 rounded-full bg-white hover:bg-gray-50 text-indigo-dye transition-colors shadow-sm"
            >
              <FiFilter size={20} />
            </button>
          </div>
        </motion.div>
        <div className="flex flex-col md:flex-row gap-10 items-start">
          {/* FILTER SIDEBAR (Desktop & Mobile Wrapper) */}
          <aside
            className={`
                        md:w-64 md:block flex-shrink-0 
                        ${showFilters
                ? "block fixed inset-0 z-50 bg-white p-6 overflow-y-auto"
                : "hidden"
              }
                        md:static md:bg-transparent md:p-0 md:overflow-visible md:z-auto
                    `}
          >
            {/* Mobile Close Button */}
            <div className="md:hidden flex justify-between items-center mb-6">
              <h2 className="text-2xl font-serif font-bold">Filters</h2>
              <button
                onClick={() => setShowFilters(false)}
                className="p-2 bg-gray-100 rounded-full"
              >
                <FiX size={24} />
              </button>
            </div>
            <div className="space-y-8 sticky top-28">
              {/* Stock Status */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100/50">
                <h3 className="font-serif font-bold text-lg mb-4 text-indigo-dye">
                  Availability
                </h3>
                <div className="space-y-3">
                  {["All", "In Stock", "Out of Stock"].map((status) => (
                    <label
                      key={status}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${stockFilter === status
                          ? "border-terracotta bg-terracotta"
                          : "border-gray-300"
                          }`}
                      >
                        {stockFilter === status && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                      <input
                        type="radio"
                        name="stockFilter"
                        checked={stockFilter === status}
                        onChange={() => setStockFilter(status)}
                        className="hidden"
                      />
                      <span
                        className={`text-sm font-medium transition-colors ${stockFilter === status
                          ? "text-indigo-dye"
                          : "text-gray-500 group-hover:text-terracotta"
                          }`}
                      >
                        {status}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              {/* Categories */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100/50">
                <h3 className="font-serif font-bold text-lg mb-4 text-indigo-dye">
                  Category
                </h3>
                <div className="space-y-3">
                  {categories.map((cat) => (
                    <label
                      key={cat}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <div
                        className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${category === cat
                          ? "border-terracotta bg-terracotta"
                          : "border-gray-300"
                          }`}
                      >
                        {category === cat && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                      <input
                        type="radio"
                        name="category"
                        checked={category === cat}
                        onChange={() => setCategory(cat)}
                        className="hidden"
                      />
                      <span
                        className={`text-sm font-medium transition-colors ${category === cat
                          ? "text-indigo-dye"
                          : "text-gray-500 group-hover:text-terracotta"
                          }`}
                      >
                        {cat}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              {/* Price Range */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100/50">
                <h3 className="font-serif font-bold text-lg mb-4 text-indigo-dye">
                  Price Range
                </h3>
                <div className="px-2">
                  <input
                    type="range"
                    min="0"
                    max="100000"
                    step="1000"
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([0, parseInt(e.target.value)])
                    }
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-terracotta"
                  />
                  <div className="flex justify-between mt-3 text-sm font-medium text-gray-600">
                    <span>₹0</span>
                    <span className="text-terracotta">
                      Max: ₹{priceRange[1].toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </aside>
          {/* MAIN CONTENT AREA */}
          <div className="flex-1 w-full">
            {loading ? (
              // Loading Skeletons
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div
                    key={n}
                    className="bg-white rounded-2xl p-4 shadow-sm animate-pulse border border-gray-100"
                  >
                    <div className="bg-gray-200 aspect-[3/4] rounded-xl mb-4"></div>
                    <div className="bg-gray-200 h-6 w-3/4 rounded mb-2"></div>
                    <div className="bg-gray-200 h-4 w-1/2 rounded"></div>
                  </div>
                ))}
              </div>
            ) : error ? (
              // Error State
              <div className="text-center py-20 bg-white rounded-3xl border border-red-100 shadow-sm">
                <FiAlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Oops! Something went wrong
                </h3>
                <p className="text-gray-500 mb-6">{error}</p>
                <button
                  className="px-6 py-2 bg-indigo-dye text-white rounded-full hover:bg-opacity-90"
                  onClick={() => window.location.reload()}
                >
                  Try Again
                </button>
              </div>
            ) : filteredProducts.length === 0 ? (
              // Empty State
              <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                  <FiSearch size={24} />
                </div>
                <h3 className="text-xl font-serif font-bold text-gray-800 mb-2">
                  No products found
                </h3>
                <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                  We couldn't find any matches for your current filters.
                </p>
                <button
                  onClick={() => {
                    setCategory("All");
                    setSearchTerm("");
                    setPriceRange([0, 100000]);
                    setStockFilter("All");
                  }}
                  className="px-6 py-2 border border-terracotta text-terracotta rounded-full hover:bg-terracotta hover:text-white transition-all font-medium"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              // Product Grid
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                {filteredProducts.map((product) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="group bg-white rounded-xl md:rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
                  >
                    <div className="relative aspect-[3/4] overflow-hidden bg-gray-50">
                      {/* Image */}
                      <img
                        src={
                          product.image ||
                          "https://via.placeholder.com/300x400?text=No+Image"
                        }
                        alt={product.name}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
                        loading="lazy"
                      />
                      {/* Badges */}
                      {product.countStock === 0 || product.isoutofstock ? (
                        <div className="absolute top-2 left-2 md:top-4 md:left-4 bg-red-500/90 backdrop-blur-sm text-white text-[9px] md:text-[10px] font-bold px-2 py-0.5 md:px-3 md:py-1 rounded-full uppercase tracking-wider shadow-lg">
                          Sold Out
                        </div>
                      ) : (
                        <div className="absolute top-2 left-2 md:top-4 md:left-4 bg-white/90 backdrop-blur-sm text-indigo-dye text-[9px] md:text-[10px] font-bold px-2 py-0.5 md:px-3 md:py-1 rounded-full uppercase tracking-wider shadow-sm">
                          In Stock
                        </div>
                      )}
                      {product.discountPercentage > 0 && (
                        <div className="absolute top-2 right-2 md:top-4 md:right-4 bg-red-600 text-white text-[10px] md:text-xs font-bold px-2 py-1 rounded-full shadow-sm">
                          {product.discountPercentage}% OFF
                        </div>
                      )}
                      {/* Quick Actions (Desktop Only) */}
                      <div className="hidden md:block absolute bottom-4 left-4 right-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <Link to={`/product/${product._id}`} className="w-full">
                          <button className="w-full bg-white/95 backdrop-blur text-indigo-dye py-3 rounded-xl font-bold text-sm shadow-lg hover:bg-terracotta hover:text-white transition-colors flex items-center justify-center gap-2">
                            <FiShoppingCart size={16} /> View Details
                          </button>
                        </Link>
                      </div>
                    </div>
                    {/* Content */}
                    <div className="p-3 md:p-5">
                      <p className="text-[10px] md:text-xs text-gray-500 mb-1 uppercase tracking-wide font-medium truncate">
                        {product.category}
                      </p>
                      <Link to={`/product/${product._id}`}>
                        <h3
                          className="font-serif font-bold text-sm md:text-lg text-indigo-dye mb-1 md:mb-2 group-hover:text-terracotta transition-colors line-clamp-1"
                          title={product.name}
                        >
                          {product.name}
                        </h3>
                      </Link>
                      <div className="flex items-center justify-between">
                        {product.discountPercentage > 0 ? (
                          <div className="flex flex-col">
                            <span className="text-base md:text-lg font-bold text-red-600">
                              ₹{Number(product.discountedPrice).toLocaleString()}
                            </span>
                            <span className="text-xs text-gray-400 line-through">
                              ₹{Number(product.price).toLocaleString()}
                            </span>
                          </div>
                        ) : (
                          <span className="text-base md:text-lg font-bold text-gray-900">
                            ₹{Number(product.price).toLocaleString()}
                          </span>
                        )}
                      </div>

                      {/* Mobile View Details Link (Optional, since whole card is clickable but good for affordance) */}
                      <div className="block md:hidden mt-2">
                        <Link to={`/product/${product._id}`} className="text-[10px] text-terracotta font-bold uppercase tracking-wider flex items-center gap-1">
                          View <FiSearch size={10} />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
export default Shop;
