import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/apifetch";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "../assets/App.css";

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    password: "",
    password_2: "",
    phone: "",
    profile_pic: null,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, profile_pic: e.target.files[0] });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (formData.password !== formData.password_2) {
      toast.error("Passwords do not match!");
      setLoading(false);
      return;
    }

    const data = new FormData();
    data.append("username", formData.username);
    data.append("email", formData.email);
    data.append("first_name", formData.first_name);
    data.append("last_name", formData.last_name);
    data.append("phone", formData.phone);
    data.append("password", formData.password);
    data.append("password2", formData.password_2);

    if (formData.profile_pic) {
      data.append("profile_pic", formData.profile_pic);
    }

    try {
      const response = await api.post("/register/", data);

      console.log("Registration Success:", response.data);
      console.log(data);
      toast.success("Registration Successful!");
      // Give the user a moment to see the success toast, then navigate
      setTimeout(() => navigate("/otp", { state: { email: formData.email } }), 1200);
    } catch (err) {
      console.error("Full Error Object:", err);

      if (err.response && err.response.data) {
        // Prefer explicit messages for clearer toasts
        if (err.response.data.password2) {
          toast.error(`Password Error: ${err.response.data.password2[0]}`);
        } else if (err.response.data.profile_pic) {
          toast.error(`Image Error: ${err.response.data.profile_pic[0]}`);
        } else if (err.response.data.phone) {
          const phoneError = Array.isArray(err.response.data.phone)
            ? err.response.data.phone[0]
            : err.response.data.phone;

          toast.error(`Phone number required: ${phoneError}`);
        } else if (err.response.data.detail) {
          toast.error(err.response.data.detail);
        } else if (err.response.data.message) {
          // Some APIs return a top-level message
          toast.error(err.response.data.message);
        } else {
          toast.error(JSON.stringify(err.response.data));
        }
      } else {
        toast.error("Backend Network Error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-wrapper">
      <div className="left-panel">
        <h2>Welcome Back!</h2>
        <p>
          To keep connected with us please register with your personal info.
        </p>
      </div>

      <div className="right-panel">
        <div className="form-header">
          <h3>Create Account</h3>
        </div>

        <form onSubmit={handleSubmit} className="form-grid">
          <div className="input-group full-width">
            <label>Username</label>
            <input
              placeholder="Enter Your Username"
              type="text"
              name="username"
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group full-width">
            <label>Email Address</label>
            <input placeholder="Enter your Email" type="email" name="email" onChange={handleChange} required />
          </div>

          <div className="input-group">
            <label>First Name</label>
            <input
              placeholder="Enter Firt Name"
              type="text"
              name="first_name"
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Last Name</label>
            <input
              placeholder="Enter Last Name"
              type="text"
              name="last_name"
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group full-width">
            <label>Phone</label>
            <input
              placeholder="Enter Your Phone Number 10 Digit"
              type="tel"
              name="phone"
              onChange={handleChange}
              // maxLength={10}
              required
            />
          </div>

          <div className="input-group" style={{ position: "relative" }}>
            <label>Password</label>
            <input
              placeholder="Enter Password"
              type={showPassword ? "text" : "password"}
              name="password"
              onChange={handleChange}
              style={{ paddingRight: "45px" }}
              required
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                top: "30px",
                right: "15px",
                cursor: "pointer",
                color: "#666",
                fontSize: "18px",
                margin: "8px",
              }}
            >
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>

          <div className="input-group" style={{ position: "relative" }}>
            <label>Confirm Password</label>
            <input
              placeholder="Enter RePassword"
              type={showPassword1 ? "text" : "password"}
              name="password_2"
              onChange={handleChange}
              style={{ paddingRight: "45px" }}
              required
            />
            <span
              onClick={() => setShowPassword1(!showPassword1)}
              style={{
                position: "absolute",
                top: "30px",
                right: "15px",
                cursor: "pointer",
                color: "#666",
                fontSize: "18px",
                margin: "8px",
              }}
            >
              {showPassword1 ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>

          <div className="input-group full-width">
            <label>Profile Picture</label>
            <input
              type="file"
              name="profile_pic"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? "Registering..." : "Register Now"}
          </button>

          <div
            className="full-width"
            style={{ 
              textAlign: "right",   
              marginTop: "15px", 
              fontSize: "13px" 
            }}
          >
           
            <Link
              to="/login"
              style={{ color: "#667eea", textDecoration: "none", fontWeight: "bold" }}
            >
              Already have an account? 
              <br/>
              Login here
            </Link>
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
