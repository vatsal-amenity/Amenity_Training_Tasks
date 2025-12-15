import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/App.css'; 
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Eye icons import
import api from '../api/apifetch';

const ChangePassword = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // 3 Passwords joiye: Juno, Navo, ane Confirm
    const [formData, setFormData] = useState({
        old_password: '',
        new_password: '',
        confirm_new_password: ''
    });

    // Eye Toggle States
    const [showOld, setShowOld] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // 1. Validation
        if (formData.new_password !== formData.confirm_new_password) {
            toast.error("New password and confirm password do not match!");
            setLoading(false);
            return;
        }

        if (formData.new_password.length < 6) {
            toast.error("Password must be at least 6 characters.");
            setLoading(false);
            return;
        }

        // 2. Token Check
        const token = localStorage.getItem("accessToken");
        if (!token) {
            toast.error("You are not logged in!");
            navigate('/login');
            return;
        }

        try {
            // 3. API Call
            const response = await api.post('/change_password/', formData, {
                headers: {
                    'Authorization': `Bearer ${token}` 
                }
            });

            console.log("Password Changed:", response.data);
            toast.success("Password Changed Successfully!");
            
            // Success thaya pachi form clear kari do
            setFormData({ old_password: '', new_password: '', confirm_new_password: '' });
            
            // Thodi vaar ma dashboard par moklo
            setTimeout(() => navigate('/dashboard'), 2000);

        } catch (error) {
            console.error("Error:", error);
            if (error.response && error.response.data) {
                const errData = error.response.data;
                if(errData.old_password) toast.error(errData.old_password[0]);
                else if(errData.new_password) toast.error(errData.new_password[0]);
                else if(errData.detail) toast.error(errData.detail);
                else toast.error("Failed to change password.");
            } else {
                toast.error("Server Error.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-wrapper">
            <div className="left-panel">
                <h2>Security Settings</h2>
                <p>Ensure your account stays secure by updating your password regularly.</p>
                <button onClick={() => navigate('/dashboard')} className="btn-primary" style={{marginTop: '20px', background: 'transparent', border: '1px solid white'}}>
                     &larr; Back to Dashboard
                </button>
            </div>

            <div className="right-panel">
                <div className="form-header">
                    <h3>Old Password</h3>
                </div>

                <form onSubmit={handleSubmit} className="form-grid">
                    
                    
                    <div className="input-group full-width" style={{ position: "relative" }}>
                        <label>Current Password</label>
                        <input 
                            placeholder="Old Password Here"
                            type={showOld ? "text" : "password"} 
                            name="old_password" 
                            value={formData.old_password} 
                            onChange={handleChange} 
                            style={{ paddingRight: "45px" }}
                            required 
                        />
                        <span onClick={() => setShowOld(!showOld)} style={iconStyle}>
                            {showOld ? <FaEye /> : <FaEyeSlash />}
                        </span>
                    </div>

                    {/* 2. New Password */}
                    <div className="input-group full-width" style={{ position: "relative" }}>
                        <label>New Password</label>
                        <input 
                            placeholder='Enter New Password'
                            type={showNew ? "text" : "password"} 
                            name="new_password" 
                            value={formData.new_password} 
                            onChange={handleChange} 
                            style={{ paddingRight: "45px" }}
                            required 
                        />
                        <span onClick={() => setShowNew(!showNew)} style={iconStyle}>
                            {showNew ?  <FaEye />:<FaEyeSlash /> }
                        </span>
                    </div>

                    {/* 3. Confirm Password */}
                    <div className="input-group full-width" style={{ position: "relative" }}>
                        <label>Confirm New Password</label>
                        <input 
                            placeholder='Enter Confirm Password'
                            type={showConfirm ? "text" : "password"} 
                            name="confirm_new_password" 
                            value={formData.confirm_new_password} 
                            onChange={handleChange} 
                            style={{ paddingRight: "45px" }}
                            required 
                        />
                        <span onClick={() => setShowConfirm(!showConfirm)} style={iconStyle}>
                            {showConfirm ?  <FaEye /> : <FaEyeSlash /> }
                        </span>
                    </div>

                    <button type="submit" className="btn-submit" disabled={loading}>
                        {loading ? "Updating Password..." : "Update Password"}
                    </button>
                    
                    <ToastContainer position="top-right" autoClose={3000} />
                </form>
            </div>
        </div>
    );
};

const iconStyle = {
    position: "absolute",
    top: "35px",
    right: "15px",
    cursor: "pointer",
    color: "#666",
    fontSize: "18px",
    zIndex: 10
};


export default ChangePassword;