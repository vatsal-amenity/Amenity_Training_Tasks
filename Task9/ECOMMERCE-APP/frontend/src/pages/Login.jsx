import { Link, useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { login, reset } from '../redux/authSlice';
import { FaGoogle, FaFacebookF } from 'react-icons/fa';
import { useState } from "react";
import { useEffect } from "react";


const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: "" });
    const { email, password } = formData;

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);

    useEffect(() => {
        if (isError) toast.error(message);
        if (isSuccess || user) {
            toast.success("welcome back to House of saree");
            if (user?.isAdmin || user?.email === 'saykokiller45@gmail.com') {
                navigate('/admin');
            } else {
                navigate('/');
            }
        }
        dispatch(reset());
    }, [user, isError, isSuccess, message, navigate, dispatch]);

    const onChange = (e) => setFormData((prev) => ({
        ...prev, [e.target.name]: e.target.value
    }));
    const onSubmit = (e) => {
        e.preventDefault();
        dispatch(login({ email, password }));
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-warm-cream font-sans">
            {/* LEFT HALF: The Vibe (Hidden on small screens) */}
            <div className="hidden md:flex w-full md:w-1/2 bg-indigo-dye relative overflow-hidden items-center justify-center">
                {/* Background Image Layer */}
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-80"
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=2574&auto=format&fit=crop')" }}
                ></div>

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-dye/90 via-indigo-dye/40 to-transparent"></div>

                {/* Text Content */}
                <div className="relative z-10 text-center p-12 text-warm-cream">
                    <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 tracking-wider">Handloom Heritage</h2>
                    <p className="text-lg md:text-xl font-light tracking-wide opacity-90">
                        Experience the luxury of authentic cotton, woven with tradition and grace.
                    </p>
                </div>
            </div>

            {/* RIGHT HALF: The Function (Login Form) */}
            <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-16 relative">
                {/* Texture Background (Subtle) */}
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]"></div>

                <div className="w-full max-w-md z-10">
                    {/* Header */}
                    <div className="text-center mb-10">
                        <div className="flex items-center justify-center mb-4 text-indigo-dye">
                            {/* Simple Loom/Flower Icon SVG Placeholder */}
                            <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2L14.5 9H21L15.5 13L17.5 20L12 16L6.5 20L8.5 13L3 9H9.5L12 2Z" />
                            </svg>
                        </div>
                        <h1 className="text-4xl font-serif font-bold text-indigo-dye mb-2">House of Ratan</h1>
                        <p className="text-terracotta font-medium tracking-widest text-sm uppercase">Welcome Back</p>
                    </div>

                    <form onSubmit={onSubmit} className="space-y-6">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-charcoal tracking-wide ml-1">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={email}
                                onChange={onChange}
                                placeholder="name@example.com"
                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-sm focus:outline-none focus:border-indigo-dye focus:ring-1 focus:ring-indigo-dye transition-all placeholder-gray-400"
                                required
                            />
                        </div>

                        <div className="space-y-1">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-sm font-medium text-charcoal tracking-wide">Password</label>
                                <Link to="/forgot-password" className="text-xs text-indigo-dye hover:text-terracotta transition-colors">Forgot Password?</Link>
                            </div>
                            <input
                                type="password"
                                name="password"
                                value={password}
                                onChange={onChange}
                                placeholder="••••••••"
                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-sm focus:outline-none focus:border-indigo-dye focus:ring-1 focus:ring-indigo-dye transition-all placeholder-gray-400"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-indigo-dye text-warm-cream py-4 rounded-sm font-medium hover:bg-[#2E3A59] transition-all shadow-md hover:shadow-lg uppercase tracking-wider text-sm flex justify-center items-center gap-2"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Verifying...' : 'Sign In'}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="my-8 flex items-center gap-4">
                        <div className="h-px bg-gray-300 flex-1"></div>
                        <span className="text-gray-400 text-xs uppercase tracking-widest">Or continue with</span>
                        <div className="h-px bg-gray-300 flex-1"></div>
                    </div>

                    {/* Social Login */}
                    <div className="grid grid-cols-2 gap-4">
                        <button className="flex items-center justify-center gap-2 py-3 border border-gray-300 rounded-sm hover:bg-gray-50 transition-colors text-sm text-charcoal">
                            <FaGoogle className="text-ocher" /> <span>Google</span>
                        </button>
                        <button className="flex items-center justify-center gap-2 py-3 border border-gray-300 rounded-sm hover:bg-gray-50 transition-colors text-sm text-charcoal">
                            <FaFacebookF className="text-indigo-dye" /> <span>Facebook</span>
                        </button>
                    </div>

                    {/* Register Link */}
                    <p className="text-center text-sm text-gray-500 mt-8">
                        New to House of Ratan?{' '}
                        <Link to="/register" className="text-indigo-dye font-semibold hover:text-terracotta border-b border-transparent hover:border-terracotta transition-all ml-1">
                            Register Now
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
