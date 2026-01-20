import { useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FiArrowRight, FiStar } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import Navbar from '../components/user/Navbar';
import Footer from '../components/user/Footer';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../redux/productSlice';

const Home = () => {
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);
    const y2 = useTransform(scrollY, [0, 500], [0, -150]);

    const dispatch = useDispatch();
    const { products } = useSelector((state) => state.product);

    // Derived state
    const featuredProducts = products.slice(0, 4);

    useEffect(() => {
        if (products.length === 0) {
            dispatch(fetchProducts());
        }
    }, [dispatch, products.length]);

    const fadeInUp = {
        hidden: { opacity: 0, y: 60 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
    };

    const stagger = {
        visible: { transition: { staggerChildren: 0.2 } }
    };

    return (
        <div className="min-h-screen bg-warm-cream text-indigo-dye overflow-hidden font-sans">
            <Navbar />

            {/* Hero Section */}
            <section className="relative h-screen flex items-center justify-center pt-20">
                <div className="absolute inset-0 z-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1610030469983-98e55041d04f?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-warm-cream/0 via-warm-cream/20 to-warm-cream"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={stagger}
                        className="space-y-6"
                    >
                        <motion.span variants={fadeInUp} className="inline-block px-4 py-1.5 rounded-full border border-indigo-dye/20 text-indigo-dye text-sm font-medium tracking-wide bg-white/50 backdrop-blur-sm">
                            🌿 100% Organic Cotton
                        </motion.span>
                        <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-serif font-bold leading-tight text-indigo-dye">
                            Elegance in <br />
                            <span className="text-terracotta italic">Every Thread</span>
                        </motion.h1>
                        <motion.p variants={fadeInUp} className="text-lg text-gray-700 max-w-lg leading-relaxed">
                            Discover our handcrafted collection of authentic Cotton Sarees. Where tradition meets modern luxury, woven with care for the conscious woman.
                        </motion.p>
                        <motion.div variants={fadeInUp} className="flex gap-4 pt-4">
                            <Link to="/shop" className="px-8 py-4 bg-indigo-dye text-white rounded-lg font-medium shadow-lg hover:shadow-xl hover:bg-opacity-90 transition-all flex items-center gap-2 group">
                                Shop Collection <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link to="/about" className="px-8 py-4 border border-indigo-dye text-indigo-dye rounded-lg font-medium hover:bg-indigo-dye hover:text-white transition-all">
                                Our Story
                            </Link>
                        </motion.div>
                    </motion.div>

                    <motion.div
                        style={{ y: y2 }}
                        className="hidden md:block relative"
                    >
                        <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl border-4 border-white transform rotate-3 hover:rotate-0 transition-transform duration-500">
                            <img src="https://www.kiransboutique.com/wp-content/uploads/2023/01/soft-cotton-saree-types.jpeg" alt="Woman in Saree" className="w-full h-[600px] object-cover" />
                        </div>
                        <div className="absolute top-10 -right-10 w-full h-full border-4 border-terracotta/30 rounded-2xl z-0 transform -rotate-3"></div>
                    </motion.div>
                </div>
            </section>

            {/* Featured Section */}
            <section className="py-24 bg-white relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16 space-y-4">
                        <span className="text-terracotta font-medium tracking-widest text-sm uppercase">Curated For You</span>
                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-indigo-dye">Trending Collections</h2>
                        <div className="w-24 h-1 bg-terracotta mx-auto rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                        {featuredProducts.length > 0 ? featuredProducts.map((product, i) => (
                            <Link to={`/product/${product._id}`} key={product._id} className="block group">
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="cursor-pointer"
                                >
                                    <div className="relative overflow-hidden rounded-xl bg-gray-100 aspect-[3/4] mb-3 md:mb-4">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                        />
                                        {product.countStock === 0 && (
                                            <div className="absolute top-2 left-2 md:top-4 md:left-4 bg-red-500 text-white text-[10px] md:text-xs px-2 py-0.5 md:py-1 rounded-full uppercase tracking-wide font-bold">Sold Out</div>
                                        )}
                                        {/* Quick View - Desktop Only */}
                                        <div className="hidden md:block absolute bottom-0 left-0 w-full p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                            <button className="w-full bg-white text-indigo-dye py-3 rounded-lg font-medium shadow-lg hover:bg-terracotta hover:text-white transition-colors">
                                                Quick View
                                            </button>
                                        </div>
                                    </div>
                                    <h3 className="font-serif text-sm md:text-lg font-bold text-gray-900 group-hover:text-terracotta transition-colors line-clamp-1">{product.name}</h3>
                                    <div className="flex flex-col md:flex-row md:justify-between md:items-center mt-1">
                                        <p className="text-gray-500 text-[10px] md:text-sm">{product.category}</p>
                                        <div className="flex flex-col items-end">
                                            {product.discountPercentage > 0 ? (
                                                <>
                                                    <p className="font-bold text-red-600 text-sm md:text-base">₹{Number(product.discountedPrice).toLocaleString()}</p>
                                                    <p className="text-xs text-gray-400 line-through">₹{Number(product.price).toLocaleString()}</p>
                                                </>
                                            ) : (
                                                <p className="font-medium text-indigo-dye text-sm md:text-base">₹{Number(product.price).toLocaleString()}</p>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            </Link>
                        )) : (
                            // Skeletons
                            [1, 2, 3, 4].map(n => (
                                <div key={n} className="animate-pulse">
                                    <div className="bg-gray-200 aspect-[3/4] rounded-xl mb-4"></div>
                                    <div className="h-4 md:h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                                    <div className="h-3 md:h-4 bg-gray-200 rounded w-1/2"></div>
                                </div>
                            ))
                        )}
                    </div>
                    <div className="text-center mt-12">
                        <Link to="/shop" className="inline-flex items-center gap-2 text-indigo-dye font-medium border-b-2 border-terracotta pb-1 hover:text-terracotta transition-colors">
                            View All Products <FiArrowRight />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Marquee / Brand Values */}
            <div className="bg-indigo-dye py-12 overflow-hidden">
                <div className="flex gap-16 animate-marquee whitespace-nowrap text-warm-cream/20 text-6xl font-serif font-bold uppercase tracking-wider">
                    <span>Organic</span>
                    <span>•</span>
                    <span>Handcrafted</span>
                    <span>•</span>
                    <span>Luxury</span>
                    <span>•</span>
                    <span>Tradition</span>
                    <span>•</span>
                    <span>Sustainable</span>
                    <span>•</span>
                    <span>Timeless</span>
                    <span>•</span>
                    <span>Organic</span>
                    <span>•</span>
                    <span>Handcrafted</span>
                </div>
            </div>


            <Footer />
        </div>
    );
};

export default Home;
