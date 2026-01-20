import React from 'react';
import { Link } from 'react-router-dom';
import { FiInstagram, FiFacebook, FiTwitter, FiMapPin, FiPhone, FiMail } from 'react-icons/fi';

const Footer = () => {
    return (
        <footer className="bg-indigo-dye text-warm-cream pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    {/* Brand */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-warm-cream rounded-full flex items-center justify-center text-indigo-dye">
                                <span className="font-serif font-bold text-lg">H</span>
                            </div>
                            <span className="font-serif text-2xl font-bold">House of Saree</span>
                        </div>
                        <p className="text-warm-cream/70 text-sm leading-relaxed">
                            Crafting elegance with organic cotton. We bring you the finest traditional sarees with a modern touch.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h3 className="font-serif text-lg font-semibold mb-6 text-terracotta">Shop</h3>
                        <ul className="space-y-3 text-sm text-warm-cream/80">
                            <li><Link to="/shop" className="hover:text-terracotta transition-colors">All Products</Link></li>
                            <li><Link to="/shop?category=cotton" className="hover:text-terracotta transition-colors">Cotton Sarees</Link></li>
                            <li><Link to="/shop?category=new" className="hover:text-terracotta transition-colors">New Arrivals</Link></li>
                            <li><Link to="/popular" className="hover:text-terracotta transition-colors">Best Sellers</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="font-serif text-lg font-semibold mb-6 text-terracotta">Support</h3>
                        <ul className="space-y-3 text-sm text-warm-cream/80">
                            <li><Link to="/contact" className="hover:text-terracotta transition-colors">Contact Us</Link></li>
                            <li><Link to="/shipping" className="hover:text-terracotta transition-colors">Shipping & Returns</Link></li>
                            <li><Link to="/faq" className="hover:text-terracotta transition-colors">FAQs</Link></li>
                            <li><Link to="/privacy" className="hover:text-terracotta transition-colors">Privacy Policy</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="font-serif text-lg font-semibold mb-6 text-terracotta">Contact</h3>
                        <ul className="space-y-4 text-sm text-warm-cream/80">
                            <li className="flex items-start gap-3">
                                <FiMapPin className="mt-1 flex-shrink-0" />
                                <span>123 Heritage Lane, Textile City, India 380001</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <FiPhone className="flex-shrink-0" />
                                <span>+91 98765 43210</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <FiMail className="flex-shrink-0" />
                                <span>hello@houseofsaree.com</span>
                            </li>
                        </ul>
                        <div className="flex gap-4 mt-6">
                            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-terracotta transition-colors"><FiInstagram /></a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-terracotta transition-colors"><FiFacebook /></a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-terracotta transition-colors"><FiTwitter /></a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/10 mt-16 pt-8 text-center text-sm text-warm-cream/50">
                    <p>&copy; {new Date().getFullYear()} House of Saree. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
