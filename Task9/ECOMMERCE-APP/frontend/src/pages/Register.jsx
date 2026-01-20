import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { register, reset } from '../redux/authSlice';
import { toast } from 'sonner';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const { name, phone, email, password, confirmPassword } = formData;
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);

    useEffect(() => {
        if (isError) toast.error(message);
        if (isSuccess) {
            navigate('/otp', { state: { email } });
            dispatch(reset());
        }
    }, [user, isError, isSuccess, message, navigate, dispatch, email]);

    const onChange = (e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const onSubmit = (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }
        dispatch(register({ name, phone, email, password }));
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-warm-cream font-sans">
            {/* LEFT HALF: The Vibe */}
            <div className="hidden md:flex w-full md:w-1/2 bg-indigo-dye relative overflow-hidden items-center justify-center">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-80"
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1596205244503-4554b7c61c23?q=80&w=2574&auto=format&fit=crop')" }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-dye/90 via-indigo-dye/40 to-transparent"></div>

                <div className="relative z-10 text-center p-12 text-warm-cream max-w-lg">
                    <h2 className="text-4xl font-serif font-bold mb-4 tracking-wider">Join Our Community</h2>
                    <p className="text-lg font-light tracking-wide opacity-90">
                        Be the first to know about new handloom collections and exclusive artisan stories.
                    </p>
                </div>
            </div>

            {/* RIGHT HALF: The Function */}
            <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-16 relative">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]"></div>

                <div className="w-full max-w-md z-10">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-serif font-bold text-indigo-dye mb-2">Create Account</h1>
                        <p className="text-terracotta text-sm uppercase tracking-widest">House of Ratan Global</p>
                    </div>

                    <form onSubmit={onSubmit} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-charcoal tracking-wide ml-1">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={name}
                                onChange={onChange}
                                placeholder="Your Name"
                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-sm focus:outline-none focus:border-indigo-dye focus:ring-1 focus:ring-indigo-dye transition-all"
                                required
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-charcoal tracking-wide ml-1">Phone</label>
                            <input
                                type="tel"
                                name="phone"
                                value={phone}
                                onChange={onChange}
                                placeholder="Enter your phone number"
                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-sm focus:outline-none focus:border-indigo-dye focus:ring-1 focus:ring-indigo-dye transition-all"
                                required
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-charcoal tracking-wide ml-1">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={email}
                                onChange={onChange}
                                placeholder="name@example.com"
                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-sm focus:outline-none focus:border-indigo-dye focus:ring-1 focus:ring-indigo-dye transition-all"
                                required
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-charcoal tracking-wide ml-1">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={password}
                                onChange={onChange}
                                placeholder="Create a password"
                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-sm focus:outline-none focus:border-indigo-dye focus:ring-1 focus:ring-indigo-dye transition-all"
                                required
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-charcoal tracking-wide ml-1">Confirm Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={confirmPassword}
                                onChange={onChange}
                                placeholder="Confirm password"
                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-sm focus:outline-none focus:border-indigo-dye focus:ring-1 focus:ring-indigo-dye transition-all"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-indigo-dye text-warm-cream py-4 rounded-sm font-medium hover:bg-[#2E3A59] transition-all shadow-md hover:shadow-lg uppercase tracking-wider text-sm mt-4"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Creating Account...' : 'Register'}
                        </button>
                    </form>

                    <p className="text-center text-sm text-gray-500 mt-8">
                        Already have an account?{' '}
                        <Link to="/login" className="text-indigo-dye font-semibold hover:text-terracotta border-b border-transparent hover:border-terracotta transition-all ml-1">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
