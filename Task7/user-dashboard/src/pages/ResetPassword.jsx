import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/apifetch';
import '../assets/App.css'; 

const ResetPassword = () => {
  const navigate = useNavigate();
  const { uid, token } = useParams(); 

  const [passwords, setPasswords] = useState({ new: '', confirm: '' });
  const [status, setStatus] = useState({ loading: false, error: '', success: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: '', success: '' });

    // 1.frontend validation
    if (passwords.new !== passwords.confirm) {
      setStatus({ loading: false, error: 'Both passwords do not match!', success: '' });
      return;
    }

    const data = new FormData();
    data.append('password', passwords.new);
    data.append('password2', passwords.confirm);
    data.append('uid', uid);     
    data.append('token', token);


    try {
      // 2. API Call 
      await api.post(`/password_reset_confirm/${uid}/${token}/`,data);

      setStatus({ loading: false, error: '', success: 'Password Reset Successful! Redirecting...' });
      setTimeout(() => navigate('/login'), 3000);

    } catch (err) {
      console.error("API error:", err);
      
      let errorMsg = 'Link Expired or Invalid.';
      if (err.response && err.response.data) {
        if(err.response.data.detail) errorMsg = err.response.data.detail;
        else if (err.response.data.error) errorMsg = err.response.data.error;
        else if (err.response.data.password) errorMsg = err.response.data.password[0];
        else errorMsg = JSON.stringify(err.response.data);
      }

      setStatus({ 
        loading: false, 
        error: errorMsg, 
        success: '' 
      });
    }
  };

  return (
    <div className="register-wrapper">
      <div className="left-panel">
        <h2>Secure Your Account</h2>
        <p>Create a strong password to protect your profile.</p>
      </div>

      <div className="right-panel">
        <div className="form-header">
          <h3>Set New Password</h3>
        </div>

        {status.error && (
          <div style={{ padding: '10px', background: '#fee2e2', color: 'red', borderRadius: '5px', marginBottom: '10px', textAlign: 'center' }}>
            {status.error}
          </div>
        )}
        {status.success && (
          <div style={{ padding: '10px', background: '#dcfce7', color: 'green', borderRadius: '5px', marginBottom: '10px', textAlign: 'center' }}>
            {status.success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="form-grid">
          <div className="input-group full-width">
            <label>New Password</label>
            <input 
              type="password" 
              placeholder="Enter new password"
              onChange={(e) => setPasswords({...passwords, new: e.target.value})}
              required
            />
          </div>

          <div className="input-group full-width">
            <label>Confirm Password</label>
            <input 
              type="password" 
              placeholder="Confirm new password"
              onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
              required
            />
          </div>

          <button type="submit" className="btn-submit" disabled={status.loading}>
            {status.loading ? "Updating..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;