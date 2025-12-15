import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api/apifetch'; 
import { toast ,ToastContainer} from "react-toastify";
import '../assets/App.css';

const OTP = () => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false); 
  
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email || ""; 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if(!email) {
      toast.error("Email not found. Please register again.");
        setLoading(false);
        return;
    }

    try {
      console.log("Verifying OTP for:", email);
      
      // API Call - URL 
      const response = await api.post('/verify_otp/', { 
          email: email, 
          otp: otp
          
      });
      
      const successMsg = response?.data?.message || "Email Verified Successfully! Now please Login.";
      toast.success(successMsg);
      console.log("Success:", response.data);
      
      
      
      setTimeout(() => navigate('/login'), 900);

    } catch (error) {
      console.error("OTP verification error:", error);
      toast.error("Invalid OTP or Verification Failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-wrapper" style={{ maxWidth: '500px', flexDirection: 'column' }}> 
      <div className="right-panel" style={{ textAlign: 'center' }}>
        <h3 style={{ marginBottom: '10px' }}>Verify OTP</h3>
        <p style={{ fontSize: '13px', color: '#666', marginBottom: '20px' }}>
          We have sent a verification code to <br/> <strong>{email}</strong>
        </p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input 
              type="text" maxLength="6" placeholder="Enter 6-digit OTP" 
              style={{ textAlign: 'center', letterSpacing: '5px', fontSize: '20px' }}
              value={otp}
              onChange={(e) => setOtp(e.target.value)} required 
            />
          </div>

          <button type="submit" className="btn-submit" style={{ marginTop: '20px' }} disabled={loading}>
            {loading ? "Verifying..." : "Verify"}
          </button>
          </form>
          <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      </div>
    </div>
  );
};

export default OTP;