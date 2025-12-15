import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/apifetch";
import { toast , ToastContainer} from "react-toastify";
import "../assets/App.css";

const RequestReset = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      // send request to backend
      const response = await api.post("/password_reset/", { email });
      toast.success(
        "Success! We have sent a reset link to your email. Please check it."
      );
    } catch (err) {
      console.error("RequestReset Error:", err);
      // Prefer server-provided messages if available
      if (err.response && err.response.data) {
        const respData = err.response.data;
        const msg = respData.message || respData.detail || JSON.stringify(respData);
        toast.error(msg);
      } else {
        toast.error("This email is not registered or there is an error.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-wrapper">
      <div className="left-panel">
        <h2>Forgot Password?</h2>
        <p>
          Don't worry! Enter your email and we will send you a reset link or
          OTP.
        </p>
      </div>

      <div className="right-panel">
        <div className="form-header">
          <h3>Reset Password</h3>
        </div>

        {message && (
          <p style={{ color: '#155724', backgroundColor: '#d4edda', padding: '10px', borderRadius: '5px', textAlign: 'center' }}>
            {message}
          </p>
        )}

        {/* {error && (
          <p style={{ color: '#721c24', backgroundColor: '#f8d7da', padding: '10px', borderRadius: '5px', textAlign: 'center' }}>
            {error}
          </p>
        )} */}

        <form onSubmit={handleSubmit} className="form-grid">
          <div className="input-group full-width">
            <label>Registered Email</label>
            <input
              type="email"
              name="email"
              value={email}
              placeholder="Enter your Email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? "sending..." : "send reset link"}
          </button>

          <div
            className="full-width"
            style={{ textAlign: "center", marginTop: "15px", fontSize: "13px" }}
          >
            <Link
              to="/login"
              style={{ color: "#667eea", textDecoration: "none" }}
            >
              Back to Login
            </Link>
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
          </div>
        </form>
        
      </div>
    </div>
  );
};

export default RequestReset;
