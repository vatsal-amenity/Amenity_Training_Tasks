import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { verifyOTP, reset } from '../redux/authSlice';
import { toast } from 'sonner';

const OTPVerification = () => {
    const [otp, setOtp] = useState(new Array(6).fill(""));
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const { user, isLoading, isError, isSuccess, message } = useSelector((state) => state.auth);

    const email = location.state?.email;

    useEffect(() => {
        if (!email) {
            toast.error("Email not found. Please register again.");
            navigate('/register');
        }
    }, [email, navigate]);

    useEffect(() => {
        if (isError) {
            toast.error(message);
            dispatch(reset());
        }
        if (isSuccess && user) {
            toast.success("Verification Successful! Redirecting to dashboard...");
            const timer = setTimeout(() => {
                navigate('/'); // Redirect to dashboard
                dispatch(reset());
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [isError, isSuccess, user, message, navigate, dispatch]);

    const handleChange = (element, index) => {
        if (isNaN(element.value)) return false;

        setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

        // Focus next input
        if (element.nextSibling) {
            element.nextSibling.focus();
        }
    };

    const handleVerify = () => {
        const otpCode = otp.join("");
        if (otpCode.length === 6) {
            dispatch(verifyOTP({ email, otp: otpCode }));
        } else {
            toast.error("Please enter a valid 6-digit code.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-warm-cream font-sans p-4">
            <div className="bg-white p-10 rounded-sm shadow-xl w-full max-w-lg border-t-4 border-indigo-dye relative">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] pointer-events-none"></div>

                <div className="text-center mb-8 relative z-10">
                    <h2 className="text-3xl font-serif text-indigo-dye font-bold mb-2">Verify Identity</h2>
                    <p className="text-gray-500">Enter the 6-digit code sent to <span className="font-semibold">{email}</span>.</p>
                </div>

                <div className="flex justify-center gap-2 mb-8 relative z-10">
                    {otp.map((data, index) => (
                        <input
                            className="w-12 h-14 border-2 border-gray-300 text-center text-xl font-bold rounded-sm focus:border-indigo-dye focus:ring-1 focus:ring-indigo-dye outline-none text-indigo-dye transition-colors"
                            type="text"
                            name="otp"
                            maxLength="1"
                            key={index}
                            value={data}
                            onChange={e => handleChange(e.target, index)}
                            onFocus={e => e.target.select()}
                        />
                    ))}
                </div>

                <button
                    onClick={handleVerify}
                    disabled={isLoading}
                    className="w-full bg-indigo-dye text-warm-cream py-4 rounded-sm font-medium hover:bg-[#2E3A59] transition-all shadow-md uppercase tracking-wider text-sm relative z-10"
                >
                    {isLoading ? "Verifying..." : "Verify Code"}
                </button>

                <div className="text-center mt-6 relative z-10">
                    <p className="text-sm text-gray-500">
                        Didn't receive the code?{' '}
                        <button className="text-terracotta font-semibold hover:underline">Resend OTP</button> in 00:30
                    </p>
                </div>
            </div>
        </div>
    );
};

export default OTPVerification;

