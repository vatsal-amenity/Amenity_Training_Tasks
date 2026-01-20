import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiShoppingBag, FiUser, FiLogOut } from 'react-icons/fi';
import { logout, reset } from '../../redux/authSlice';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { user } = useSelector((state) => state.auth);
    const { cartItems } = useSelector((state) => state.cart);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        dispatch(reset());
        navigate('/');
    };

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Shop', path: '/shop' },
        { name: 'About', path: '/about' },
        { name: 'Contact', path: '/contact' },
    ];

    return (
        <nav className="fixed w-full z-50 top-0 left-0 bg-warm-cream/90 backdrop-blur-md border-b border-indigo-dye/10 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link to="/" className="flex-shrink-0 flex items-center gap-2 group">
                        <div className="w-10 h-10 bg-indigo-dye rounded-full flex items-center justify-center text-warm-cream">
                            <span className="font-serif font-bold text-xl">H</span>
                        </div>
                        <span className="font-serif text-2xl font-bold text-indigo-dye tracking-tight group-hover:text-terracotta transition-colors">
                            House of Saree
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className="text-indigo-dye font-medium hover:text-terracotta px-3 py-2 rounded-md transition-colors relative group"
                                >
                                    {link.name}
                                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-terracotta transition-all group-hover:w-full"></span>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Right Icons */}
                    <div className="hidden md:flex items-center gap-6">
                        <Link to="/cart" className="relative text-indigo-dye hover:text-terracotta transition-colors">
                            <FiShoppingBag size={24} />
                            {cartItems.length > 0 && (
                                <span className="absolute -top-2 -right-2 bg-terracotta text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                                    {cartItems.length}
                                </span>
                            )}
                        </Link>

                        {user ? (
                            <div className="relative group">
                                <button className="flex items-center gap-2 text-indigo-dye hover:text-terracotta transition-colors focus:outline-none">
                                    <div className="w-8 h-8 rounded-full bg-indigo-dye/10 flex items-center justify-center">
                                        <FiUser size={18} />
                                    </div>
                                    <span className="font-medium text-sm max-w-[100px] truncate">{user.name}</span>
                                </button>
                                {/* Dropdown */}
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform origin-top-right z-50">
                                    {user.isAdmin && (
                                        <Link to="/admin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Admin Dashboard</Link>
                                    )}
                                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Your Profile</Link>
                                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2">
                                        <FiLogOut /> Logout
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <Link to="/login" className="bg-indigo-dye text-white px-5 py-2 rounded-full font-medium hover:bg-opacity-90 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                                Login
                            </Link>
                        )}
                    </div>

                    {/* Mobile Cart Icon */}
                    <div className="flex md:hidden items-center gap-4 mr-2">
                        <Link to="/cart" className="relative text-indigo-dye hover:text-terracotta transition-colors">
                            <FiShoppingBag size={24} />
                            {cartItems.length > 0 && (
                                <span className="absolute -top-2 -right-2 bg-terracotta text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                                    {cartItems.length}
                                </span>
                            )}
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="-mr-2 flex md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="bg-indigo-dye/5 inline-flex items-center justify-center p-2 rounded-md text-indigo-dye hover:text-terracotta hover:bg-indigo-dye/10 focus:outline-none"
                        >
                            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-warm-cream border-t border-gray-200 overflow-hidden"
                    >
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    onClick={() => setIsOpen(false)}
                                    className="text-indigo-dye hover:text-terracotta block px-3 py-2 rounded-md text-base font-medium"
                                >
                                    {link.name}
                                </Link>
                            ))}
                            {user ? (
                                <>
                                    <div className="border-t border-gray-200 my-2"></div>
                                    <Link to="/profile" className="text-indigo-dye hover:text-terracotta block px-3 py-2 rounded-md text-base font-medium">Profile</Link>
                                    {user.isAdmin && <Link to="/admin" className="text-indigo-dye hover:text-terracotta block px-3 py-2 rounded-md text-base font-medium">Dashboard</Link>}
                                    <button onClick={handleLogout} className="text-red-600 hover:text-red-700 block w-full text-left px-3 py-2 rounded-md text-base font-medium">Logout</button>
                                </>
                            ) : (
                                <Link to="/login" className="block w-full text-center bg-indigo-dye text-white px-5 py-3 rounded-md font-medium mt-4">Login</Link>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
