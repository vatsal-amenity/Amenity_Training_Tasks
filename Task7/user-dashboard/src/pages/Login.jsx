import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/apifetch"; 
import "../assets/App.css";

const Login = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(""); 
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/login/", formData); 

      console.log("Login Success:", response.data);

      // 1. Tokens Save 
      if (response.data.access) {
        localStorage.setItem("accessToken", response.data.access);
        localStorage.setItem("refreshToken", response.data.refresh);
      }
      
      // 2. User Data Save 
      const userNameToSave = response.data.username || response.data.user?.username || formData.email;
      localStorage.setItem("username", userNameToSave);
      if (response.data.user) {
        localStorage.setItem("userData", JSON.stringify(response.data.user));   
        }

      // 3. Dashboard 
      navigate("/dashboard");

    } catch (err) {
      console.error("Login Error:", err);
      
      // OTP Verification Error Handling
      if (err.response && err.response.status === 403) {
          const errorMsg = JSON.stringify(err.response.data);
          if (errorMsg.includes("verify") || errorMsg.includes("verified")) {
              alert("your verification is pending. go OTP page.");
              navigate('/otp', { state: { email: formData.email } });
              return;
          }
      }

      if (err.response && err.response.data) {
        if (err.response.data.detail) {
            setError(err.response.data.detail);
        } else if (err.response.data.error) {
            setError(err.response.data.error);
        } else {
            setError("Invalid Email or Password!");
        }
      } else {
        setError("Network Error: Please check your connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-wrapper">
      <div className="left-panel">
        <h2>Welcome Back!</h2>
        <p>Login to manage users and access the dashboard.</p>
      </div>

      <div className="right-panel">
        <div className="form-header">
          <h3>Login</h3>
        </div>

        {error && (
          <p style={{ 
            color: "#721c24", backgroundColor: "#f8d7da", borderColor: "#f5c6cb",
            padding: "10px", borderRadius: "5px", textAlign: "center", marginBottom: "15px" 
          }}>
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="form-grid">
          <div className="input-group full-width">
            <label>Email Address</label>
            <input
              type="email" name="email" value={formData.email}
              placeholder="Enter your email" onChange={handleChange} required
            />
          </div>

          <div className="input-group full-width">
            <label>Password</label>
            <input
              type="password" name="password" value={formData.password}
              onChange={handleChange} required
            />
          </div>

          <div className="full-width" style={{ textAlign: 'left', fontSize: "13px", marginTop: "-10px" }}>
            <Link to="/request-reset" style={{ color: "#667eea", textDecoration: "none" }}>
              forgot password?
            </Link>
          </div>
          
          <div className="full-width" style={{ textAlign: 'right', fontSize: "13px", marginTop: "-10px" }}>
            <Link to="/register" style={{ color: "#667eea", textDecoration: "none" }}>
              New User? Register
            </Link>
          </div>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;