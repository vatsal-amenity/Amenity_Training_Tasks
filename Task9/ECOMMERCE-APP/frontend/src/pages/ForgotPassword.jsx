import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { forgotPassword, reset } from '../redux/authSlice';
import { toast } from 'sonner';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const dispatch = useDispatch();
    const { isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);

    useEffect(() => {
        if (isError) {
            toast.error(message);
            dispatch(reset());
        }
        if (isSuccess) {
            toast.success(message);
            dispatch(reset());
        }
    }, [isError, isSuccess, message, dispatch]);

    const onSubmit = (e) => {
        e.preventDefault();
        dispatch(forgotPassword(email));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-warm-cream font-sans p-4">
            {/* Background Image Absolute */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-terracotta/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-indigo-dye/5 rounded-full blur-3xl"></div>
            </div>

            <div className="bg-white p-10 rounded-sm shadow-xl w-full max-w-md border border-gray-100 relative z-10">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] pointer-events-none"></div>

                <div className="text-center mb-8 relative z-10">
                    <h2 className="text-3xl font-serif text-indigo-dye font-bold mb-2">Forgot Password?</h2>
                    <p className="text-gray-500 text-sm">Don't worry, it happens. Please enter the email address associated with your account.</p>
                </div>

                <form onSubmit={onSubmit} className="relative z-10">
                    <div className="space-y-1 mb-6">
                        <label className="text-sm font-medium text-charcoal tracking-wide ml-1">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="name@example.com"
                            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-sm focus:outline-none focus:border-indigo-dye focus:ring-1 focus:ring-indigo-dye transition-all"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-indigo-dye text-warm-cream py-4 rounded-sm font-medium hover:bg-[#2E3A59] transition-all shadow-md uppercase tracking-wider text-sm"
                    >
                        {isLoading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                </form>

                <div className="text-center mt-6 relative z-10">
                    <Link to="/login" className="text-sm text-gray-500 hover:text-indigo-dye transition-colors flex items-center justify-center gap-1">
                        ← Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;

