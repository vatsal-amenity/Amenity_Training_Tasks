import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/apifetch";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import "../assets/App.css";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);


  // const authToken = localStorage.getItem("authToken");
  // const tokenParsed = JSON.parse(authToken);
  // console.log(tokenParsed);

  // useEffect(()=>{
  //   if(tokenParsed){
  //   navigate("/");
  //   }
  // },[tokenParsed]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const emailToSend = formData.email
      ? formData.email.trim().toLowerCase()
      : "";
    try {
      const payload = { ...formData, email: emailToSend };
      const response = await api.post("/login/", payload);
      console.log("Login Full Response:", response.data);

      const apiResponse = response.data;

      // Check Status
      if (apiResponse.status === true) {
        const mainData = apiResponse.data || {};
        const tokens = mainData.tokens;
        const userDetails = mainData.user || {};

        if (tokens && tokens.access) {
          // Tokens Save
          localStorage.setItem("accessToken", tokens.access);
          localStorage.setItem("refreshToken", tokens.refresh);

          console.log("backend user details", userDetails);
          try {
            const userResponse = await api.get("/getuser/", {
              headers: {
                Authorization: `Bearer ${tokens.access}`,
              },
            });
            console.log("full user data:", userResponse.data);
            const userDetails = userResponse.data.data || userResponse.data;

            // User Data Save (Clean structure)
            const cleanUser = {
              username: userDetails.username || "",
              first_name: userDetails.first_name || "",
              last_name: userDetails.last_name || "",
              email: userDetails.email || "",
              user_id: userDetails.user_id,
              profile_pic: userDetails.profile_pic || null,
            };

            console.log("local ma jova:", cleanUser);

            localStorage.setItem("userData", JSON.stringify(cleanUser));

            // Username fallback
            const nameToSave =
              cleanUser.username || cleanUser.first_name || "User";
            localStorage.setItem("username", nameToSave);
            console.log("Clean User Data Saved:", cleanUser);

            toast.success("Login successful");
            navigate("/dashboard");
          } catch (useErr) {
            toast.error(`User Data Fetch Error: ${useErr?.message || useErr}`);
            toast.error("Login success, but failed to fetch user details.");
          }
        } else {
          toast.error("Login failed: Tokens not found.");
        }
      } else {
        toast.error(apiResponse.message || "Login Failed.");
      }
    } catch (err) {
      const errMsg =
        err?.response?.data?.message ||
        err?.message ||
        "Check Password and Email";
      toast.error(errMsg);
      // OTP Verification Error Handling
      if (err.response && err.response.status === 403) {
        const errorMsg = JSON.stringify(err.response.data);
        if (errorMsg.includes("verify") || errorMsg.includes("verified")) {
          toast.error("Your verification is pending. Going to OTP page.");
          navigate("/otp", { state: { email: emailToSend } });
          return;
        }
      }

      if (err.response && err.response.data && err.response.data.message) {
        // detailed message already shown
      } else {
        toast.error(
          err.response?.data?.message ||
            "Invalid Email or Password or Server Error."
        );
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

        <form onSubmit={handleSubmit} className="form-grid">
          <div className="input-group full-width">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              placeholder="Enter your Email"
              onChange={handleChange}
              required
            />
          </div>

          <div
            className="input-group full-width"
            style={{ position: "relative" }}
          >
            <label>Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              placeholder="Enter your Password"
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
          <div
            className="full-width"
            style={{
              display: "flex",          
              justifyContent: "space-between",
              alignItems: "center",       
              marginTop: "10px",         
              marginBottom: "15px"        
            }}
          >
            <Link
              to="/request-reset"
              style={{ color: "#667eea", textDecoration: "none", fontWeight: "bold" }}
            >
              Forgot password?
            </Link>
            <Link
              to="/register"
              style={{ color: "#667eea", textDecoration: "none", fontWeight: "bold" }}
            >
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
