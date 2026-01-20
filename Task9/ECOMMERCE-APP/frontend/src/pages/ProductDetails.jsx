import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowLeft, FiShoppingCart, FiCheck, FiShare2, FiHeart } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/cartSlice';
import { fetchProductDetails } from '../redux/productSlice';
import Navbar from '../components/user/Navbar';
import Footer from '../components/user/Footer';
import axios from 'axios';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux state
  const { product, isLoading: loading, isError, message: error } = useSelector((state) => state.product);
  const { user } = useSelector((state) => state.auth);

  // Local state
  const [activeImage, setActiveImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [showZoom, setShowZoom] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePos({ x, y });
  };

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Fetch product data
  useEffect(() => {
    dispatch(fetchProductDetails(id));
  }, [dispatch, id]);

  // Handle Wishlist Toggle
  const handleWishlistToggle = async () => {
    if (!user) {
      alert("Please login to add items to your wishlist");
      return;
    }

    try {
      setWishlistLoading(true);
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const { data } = await axios.put('http://localhost:5000/api/auth/wishlist', { productId: product._id }, config);

      // Update local state based on response
      const exists = data.wishlist.some(item =>
        (typeof item === 'object' ? item._id : item).toString() === product._id.toString()
      );
      setIsInWishlist(exists);

      setWishlistLoading(false);
    } catch (error) {
      console.error("Error updating wishlist", error);
      setWishlistLoading(false);
    }
  };

  // Check wishlist status and set active image 
  useEffect(() => {
    if (product) {
      setActiveImage(product.image);
    }

    const checkWishlistStatus = async () => {
      if (user && product) {
        try {
          const config = {
            headers: { Authorization: `Bearer ${user.token}` },
          };
          const { data } = await axios.get('http://localhost:5000/api/auth/wishlist', config);
          const list = Array.isArray(data) ? data : (data.wishlist || []);

          const exists = list.some(item =>
            (typeof item === 'object' ? item._id : item).toString() === product._id.toString()
          );
          setIsInWishlist(exists);
        } catch (err) {
          console.error("Failed to check wishlist status", err);
        }
      }
    };
    checkWishlistStatus();
  }, [product, user]);


  //Derived state for stock
  const isoutofstock = product?.countStock === 0 || product?.isoutofstock;

  //animations
  const containerAnim = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.5 } },
  };

  const slideUp = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-warm-cream flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 border-4 border-terracotta border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-indigo-dye font-serif">Loading masterpiece...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-warm-cream flex items-center justify-center flex-col">
        <h2 className="text-3xl font-serif text-indigo-dye mb-4">
          Product Not Found
        </h2>
        <Link to="/shop" className="text-terracotta underline">
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans text-indigo-dye flex flex-col">
      <Navbar />

      <motion.main
        variants={containerAnim}
        initial="hidden"
        animate="show"
        className="flex-grow pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full"
      >
        {/* Breadcrumb & Back */}
        <div className="mb-8 flex items-center gap-2 text-sm text-gray-500">
          <Link
            to="/shop"
            className="hover:text-terracotta flex items-center gap-1 transition-colors"
          >
            <FiArrowLeft /> Back to Shop
          </Link>
          <span>/</span>
          <span className="text-terracotta font-medium">
            {product.category}
          </span>
          <span>/</span>
          <span className="truncate max-w-[200px]">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* LEFT COLUMN: Gallery */}
          <motion.div variants={slideUp} className="space-y-6">
            {/* Main Image Wrapper for Zoom */}
            <div className="relative z-20 aspect-[3/4] lg:aspect-square group">
              {/* Inner Image Card */}
              <div
                className="w-full h-full bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 relative cursor-crosshair"
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setShowZoom(true)}
                onMouseLeave={() => setShowZoom(false)}
              >
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeImage}
                    src={activeImage}
                    alt={product.name}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-full object-cover"
                  />
                </AnimatePresence>

                {/* Lens Overlay */}
                {showZoom && (
                  <div
                    className="absolute w-24 h-24 bg-white/30 border border-white/50 backdrop-blur-[1px] rounded-lg pointer-events-none hidden lg:block"
                    style={{
                      left: `${mousePos.x}%`,
                      top: `${mousePos.y}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                  />
                )}

                {/* Mobile/Tablet Touch Hint (Optional) */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors pointer-events-none block lg:hidden" />
              </div>

              {/* ZOOM PANE (Pop-out) */}
              {showZoom && (
                <div
                  className="hidden lg:block absolute left-[105%] top-0 w-[120%] h-full bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100 z-50"
                  style={{
                    backgroundImage: `url(${activeImage})`,
                    backgroundSize: "250%", // 2.5x Zoom
                    backgroundPosition: `${mousePos.x}% ${mousePos.y}%`,
                  }}
                >
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {/* Include Main Image in Gallery list if not already there */}
              {[product.image, ...(product.gallery || [])].map((img, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(img)}
                  className={`relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${activeImage === img
                    ? "border-terracotta ring-2 ring-terracotta/20"
                    : "border-transparent hover:border-gray-300"
                    }`}
                >
                  <img
                    src={img}
                    alt={`View ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </motion.div>

          {/* RIGHT COLUMN: Info */}
          <motion.div variants={slideUp} className="flex flex-col">
            {/* Header */}
            <div className="border-b border-gray-200 pb-8 mb-8">
              <div className="flex justify-between items-start mb-4">
                <span className="text-terracotta font-medium tracking-widest uppercase text-sm">
                  {product.brand || "Handcrafted"}
                </span>
                <div className="flex gap-3">
                  <button
                    onClick={handleWishlistToggle}
                    className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${isInWishlist ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-red-500'}`}
                  >
                    <FiHeart size={24} fill={isInWishlist ? "currentColor" : "none"} />
                  </button>
                  <button className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-indigo-dye transition-colors">
                    <FiShare2 size={24} />
                  </button>
                </div>
              </div>

              <h1 className="text-4xl md:text-5xl font-serif font-bold text-indigo-dye mb-4 leading-tight">
                {product.name}
              </h1>

              <div className="flex items-center gap-6">

                <div className="flex flex-col">
                  {product.discountPercentage > 0 ? (
                    <div className="flex items-baseline gap-3">
                      <span className="text-3xl font-bold text-red-600">
                        ₹{Number(product.discountedPrice).toLocaleString()}
                      </span>
                      <span className="text-xl text-gray-400 line-through">
                        ₹{Number(product.price).toLocaleString()}
                      </span>
                      <span className="text-sm font-semibold text-green-600 px-2 py-0.5 bg-green-100 rounded-md">
                        -{product.discountPercentage}% OFF
                      </span>
                    </div>
                  ) : (
                    <span className="text-3xl font-bold text-gray-900">
                      ₹{Number(product.price).toLocaleString()}
                    </span>
                  )}
                </div>
                {isoutofstock ? (
                  <span className="px-3 py-1 bg-red-100 text-red-600 text-xs font-bold uppercase tracking-wider rounded-full">
                    Out of Stock
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wider rounded-full flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    In Stock ({product.countStock} left)
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="mb-8 prose prose-lg text-gray-600 font-light leading-relaxed">
              <p>{product.description}</p>
            </div>

            {/* Actions */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
              <div className="flex flex-col sm:flex-row gap-4">


                {/* Add to Cart */}
                <button
                  className={`flex-grow py-4 px-8 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all transform active:scale-95 ${isoutofstock
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-indigo-dye text-white hover:bg-opacity-90 hover:shadow-xl"
                    }`}
                  disabled={isoutofstock}
                  onClick={() => {
                    dispatch(addToCart({
                      productId: product._id,
                      name: product.name,
                      price: product.price,
                      image: product.image,
                      countStock: product.countStock,
                      qty: quantity
                    }));
                  }}
                >
                  <FiShoppingCart size={20} />
                  {isoutofstock ? "Sold Out" : "Add to Cart"}
                </button>
              </div>
            </div>

            {/* Features / Guarantees */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { title: "Authentic Quality", desc: "100% Handpicked" },
                { title: "Secure Shipping", desc: "Across India" },
                { title: "Easy Returns", desc: "7-Day Policy" },
                { title: "Support 24/7", desc: "Dedicated Team" },
              ].map((feature, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-white hover:shadow-sm transition-colors cursor-default"
                >
                  <div className="p-2 bg-terracotta/10 text-terracotta rounded-full">
                    <FiCheck size={16} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-indigo-dye">
                      {feature.title}
                    </h4>
                    <p className="text-xs text-gray-500">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.main>
      <Footer />
    </div>
  );
};

export default ProductDetails;