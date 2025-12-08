import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/apifetch';
import '../assets/App.css';

const RequestReset = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    try {
      // 1. send request to backend
      const response = await api.post('/password_reset/', { email });
      setMessage("please check your email for the reset link.");
      
    } catch (err) {
      console.error(err);
      setError("This email is not registered or there is an error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-wrapper">
      <div className="left-panel">
        <h2>Forgot Password?</h2>
        <p>Don't worry! Enter your email and we will send you a reset link or OTP.</p>
      </div>

      <div className="right-panel">
        <div className="form-header">
          <h3>Reset Password</h3>
        </div>

        <form onSubmit={handleSubmit} className="form-grid">
          <div className="input-group full-width">
            <label>Registered Email</label>
            <input 
              type="email" 
              name="email" 
              placeholder="Enter your email" 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>

          <button type="submit" className="btn-submit" disabled={loading}>{loading ? "sending..." : "send reset link"}</button>

          <div className="full-width" style={{ textAlign: 'center', marginTop: '15px', fontSize: '13px' }}>
            <Link to="/login" style={{ color: '#667eea', textDecoration: 'none' }}>Back to Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestReset;