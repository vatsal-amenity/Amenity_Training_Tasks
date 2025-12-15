import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import api from "../api/apifetch";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../assets/App.css";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { uid } = useParams();

  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const emailFromState = location.state?.email || "";
  const isOtpMode = !uid ;

  const [otp, setOtp] = useState("");
  const [passwords, setPasswords] = useState({ new: "", confirm: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOtpMode && !emailFromState) {
      toast.error("Session expired. Please request reset link again.");
      setTimeout(() => navigate("/request-reset"), 2000); 
    }
  }, [isOtpMode, emailFromState, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validation
    if (passwords.new !== passwords.confirm) {
      toast.error("Passwords do not match!");
      setLoading(false);
      return;
    }

    if (passwords.new.length < 6) {
        toast.error("Password must be at least 6 characters.");
        setLoading(false);
        return;
    }

    const payload = {
      password: passwords.new,
      password2: passwords.confirm,
    };

    try {
      let apiUrl = "";

      if (isOtpMode) {
        apiUrl = "/password_reset/verify_otp/";
        payload.email = emailFromState;
        payload.otp = otp;
        const otpTrim = (otp || "").trim();
        if (!/^\d{6}$/.test(otpTrim)) {
          toast.error("Please enter a 6-digit OTP.");
          setLoading(false);
          return;
        }
        payload.otp = otpTrim;
      } else {
        apiUrl = `/password_reset_confirm/${uid}/`;
        payload.uid = uid;
        if (otp && otp.trim()) {
          payload.otp = otp.trim();
        }
      }

      console.log("Sending Data:", payload);

      const response = await api.post(apiUrl, payload);
      
      console.log("Success:", response.data);
      toast.success("Password Reset Successful! Redirecting...");
      
     setTimeout(() => navigate("/login"), 3000);

    } catch (err) {
      console.error("API error:", err);
      
      if (err.response && err.response.data) {
          const errorData = err.response.data;

          if (errorData.detail) {
              toast.error(errorData.detail);
          } 
          else if (errorData.otp) {
              const otpMsg = Array.isArray(errorData.otp) ? errorData.otp[0] : errorData.otp;
            if (/invalid|expired|incorrect|wrong/i.test(otpMsg)) {
            toast.error('OTP is invalid or expired. Please request a new one.');
            console.log(errorData.otp);
            
            } else {
            toast.error(otpMsg);
            } 
          }
          else if (errorData.password) {
              toast.error(`Password Error: ${errorData.password[0]}`);
          }
          else if (errorData.token) {
              toast.error("Invalid or Expired Token. Please try again.");
          }
          else if (errorData.non_field_errors) {
            const nf = Array.isArray(errorData.non_field_errors) ? errorData.non_field_errors[0] : errorData.non_field_errors;
            if (/invalid otp|otp invalid|invalid token|invalid|expired/i.test(nf)) {
            toast.error('OTP is invalid or expired. Please request a new one.');
            } else {
            toast.error(nf);
            }
          }
          else {
              toast.error("Invalid OTP");
          }
      } else {
          toast.error("Server Error: Please check your internet connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-wrapper">
      <div className="left-panel">
        <h2>Secure Your Account</h2>
        <p>
          {isOtpMode
            ? `Enter the OTP sent to ${emailFromState}`
            : "Create a strong password to protect your profile."}
        </p>
      </div>

      <div className="right-panel">
        <div className="form-header">
          <h3>{isOtpMode ? "Reset via OTP" : "Set New Password"}</h3>
        </div>

        <form onSubmit={handleSubmit} className="form-grid">
          
            <div className="input-group full-width">
                <label>Enter OTP</label>
                <input
                type="text"
                placeholder="6-digit OTP"
                maxLength="6"
                style={{ letterSpacing: "3px", fontWeight: "bold"}}
                onChange={(e) => setOtp(e.target.value)}
                required
                />
            </div>

          <div className="input-group full-width" style={{ position: "relative" }}>
            <label>New Password</label>
            <input
              type={showNewPass ? "text" : "password"}
              placeholder="New Password"
              onChange={(e) =>
                setPasswords({ ...passwords, new: e.target.value })
              }
              style={{ paddingRight: "45px" }}
              required
            />
            <span
              onClick={() => setShowNewPass(!showNewPass)}
              style={{
                position: "absolute",
                top: "35px", 
                right: "15px",
                cursor: "pointer",
                color: "#666",
                fontSize: "18px",
                zIndex: 10 
              }}
            >
              {showNewPass ?  <FaEye />: <FaEyeSlash />}
            </span>
          </div>

          <div className="input-group full-width" style={{ position: "relative" }}>
            <label>Confirm Password</label>
            <input
              type={showConfirmPass ? "text" : "password"}
              placeholder="Confirm Password"
              onChange={(e) =>
                setPasswords({ ...passwords, confirm: e.target.value })
              }
              style={{ paddingRight: "45px" }}
              required
            />
            <span
              onClick={() => setShowConfirmPass(!showConfirmPass)}
              style={{
                position: "absolute",
                top: "35px",
                right: "15px",
                cursor: "pointer",
                color: "#666",
                fontSize: "18px",
                zIndex: 10
              }}
            >
              {showConfirmPass ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>

          <button
            type="submit"
            className="btn-submit"
            disabled={loading}
          >
            {loading ? "Processing..." : "Reset Password"}
          </button>
          
          <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;