import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FiHome, FiBox, FiShoppingBag, FiMenu, FiPercent, FiLogOut
} from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout, reset } from '../../redux/authSlice';
import { BsTicketPerforated } from "react-icons/bs";

const SidebarItem = ({ icon: Icon, label, to, isOpen, onItemClick }) => {
    const location = useLocation();
    const isActive = location.pathname === to;

    return (
        <Link to={to} className="block mb-2" onClick={onItemClick}>
            <motion.div
                className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors duration-200 
                    ${isActive ? 'bg-terracotta text-white shadow-md' : 'text-warm-cream/80 hover:bg-white/10 hover:text-white'}`}
                whileHover={{ scale: 1.02, x: 5 }}
                whileTap={{ scale: 0.98 }}
            >
                <Icon size={22} className={`${isOpen ? 'mr-3' : 'mx-auto'}`} />
                <AnimatePresence>
                    {isOpen && (
                        <motion.span
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: "auto" }}
                            exit={{ opacity: 0, width: 0 }}
                            className="whitespace-nowrap font-medium tracking-wide"
                        >
                            {label}
                        </motion.span>
                    )}
                </AnimatePresence>
            </motion.div>
        </Link>
    );
};

const AdminSidebar = () => {
    const [isOpen, setIsOpen] = useState(window.innerWidth >= 768);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        navigate('/');
        // Delay logout to allow navigation to complete before ProtectedRoute sees null user
        setTimeout(() => {
            dispatch(logout());
            dispatch(reset());
        }, 50);
    };

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            if (!mobile) setIsOpen(true);
            else setIsOpen(false);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleSidebar = () => setIsOpen(!isOpen);

    const sidebarVariants = {
        open: {
            width: isMobile ? "240px" : "250px",
            x: 0,
            transition: { type: "spring", stiffness: 300, damping: 30 }
        },
        closed: {
            width: isMobile ? "0px" : "80px",
            x: isMobile ? "-100%" : 0,
            transition: { type: "spring", stiffness: 300, damping: 30 }
        }
    };

    return (
        <>
            {/* Mobile Overlay */}
            <AnimatePresence>
                {isMobile && isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 bg-black z-40"
                    />
                )}
            </AnimatePresence>

            {/* Mobile Toggle Button (Visible when closed on mobile) */}
            {isMobile && !isOpen && (
                <button
                    onClick={toggleSidebar}
                    className="fixed top-4 left-4 z-50 p-2 bg-indigo-dye text-warm-cream rounded-md shadow-lg"
                >
                    <FiMenu size={24} />
                </button>
            )}

            <motion.div
                className={`bg-indigo-dye h-screen shadow-2xl z-50 flex flex-col overflow-hidden ${isMobile ? 'fixed top-0 left-0' : 'sticky top-0'}`}
                initial={isMobile ? "closed" : "open"}
                animate={isOpen ? "open" : "closed"}
                variants={sidebarVariants}
            >
                {/* Header / Toggle */}
                <div className="flex items-center justify-between p-5 border-b border-white/10">
                    <AnimatePresence>
                        {isOpen && (
                            <motion.h1
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="text-xl font-serif font-bold text-warm-cream tracking-wider"
                            >
                                HOR <span className="text-terracotta text-sm">Admin</span>
                            </motion.h1>
                        )}
                    </AnimatePresence>
                    <button
                        onClick={toggleSidebar}
                        className="p-2 rounded-md hover:bg-white/10 text-warm-cream transition-colors focus:outline-none"
                    >
                        {isOpen ? <FiBox size={20} className="transform rotate-180" /> : <FiMenu size={20} />}
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto py-6 px-3">
                    <SidebarItem icon={FiHome} label="Dashboard" to="/admin" isOpen={isOpen} onItemClick={() => isMobile && setIsOpen(false)} />
                    <SidebarItem icon={FiBox} label="Products" to="/admin/products" isOpen={isOpen} onItemClick={() => isMobile && setIsOpen(false)} />
                    <SidebarItem icon={FiShoppingBag} label="Orders" to="/admin/orders" isOpen={isOpen} onItemClick={() => isMobile && setIsOpen(false)} />
                    <SidebarItem icon={FiPercent} label="Offers" to="/admin/offers" isOpen={isOpen} onItemClick={() => isMobile && setIsOpen(false)} />
                    <SidebarItem icon={BsTicketPerforated } label="Coupons" to="/admin/coupons" isOpen={isOpen} onItemClick={() => isMobile && setIsOpen(false)} />

                    {/* <SidebarItem icon={FiUsers} label="Customers" to="/admin/users" isOpen={isOpen} onItemClick={() => isMobile && setIsOpen(false)} /> */}
                    {/* <SidebarItem icon={FiSettings} label="Settings" to="/admin/settings" isOpen={isOpen} onItemClick={() => isMobile && setIsOpen(false)} /> */}
                </nav>

                {/* Footer / Logout */}
                <div className="p-4 border-t border-white/10">
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full p-3 rounded-lg text-red-300 hover:bg-red-500/10 hover:text-red-200 transition-colors"
                    >
                        <FiLogOut size={22} className={`${isOpen ? 'mr-3' : 'mx-auto'}`} />
                        <AnimatePresence>
                            {isOpen && (
                                <motion.span
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="whitespace-nowrap font-medium"
                                >
                                    Logout
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </button>
                </div>
            </motion.div>
        </>
    );
};

export default AdminSidebar;
