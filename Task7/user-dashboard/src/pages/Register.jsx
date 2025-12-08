import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/apifetch'; 
import '../assets/App.css'; 

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    password_2: '', 
    phone: '',
    profile_pic: null
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
    setError('');

    if (formData.password !== formData.password_2) {
      setError("Passwords do not match!");
      setLoading(false);
      return;
    }

    const data = new FormData();
    data.append('username', formData.username);
    data.append('email', formData.email);
    data.append('first_name', formData.first_name);
    data.append('last_name', formData.last_name);
    data.append('phone', formData.phone); 
    data.append('password', formData.password);
    data.append('password2', formData.password_2); 
    
    if (formData.profile_pic) {
      data.append('profile_pic', formData.profile_pic);
    }

    try {
      const response = await api.post('/register/', data);

      console.log("Registration Success:", response.data);
      console.log(data);
      alert("Registration Successful!");
      
      navigate('/otp', { state: { email: formData.email } });

    } catch (err) {
      console.error("Full Error Object:", err);
      
      if (err.response && err.response.data) {
        if (err.response.data.password2) {
             setError(`Password Error: ${err.response.data.password2[0]}`);
        } 
        else if (err.response.data.profile_pic) {
             setError(`Image Error: ${err.response.data.profile_pic[0]}`);
        }
        else if (err.response.data.detail) {
             setError(err.response.data.detail);
        } else {
             setError(JSON.stringify(err.response.data));
        }
      } else {
        setError("Backend Network Error:");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-wrapper">
      <div className="left-panel">
        <h2>Welcome Back!</h2>
        <p>To keep connected with us please register with your personal info.</p>
      </div>

      <div className="right-panel">
        <div className="form-header">
          <h3>Create Account</h3>
        </div>

        {error && (
            <p style={{ 
                color: 'red', 
                textAlign: 'center', 
                marginBottom: '10px', 
                backgroundColor: '#ffebee', 
                padding: '10px',
                borderRadius: '5px' 
            }}>
                {error}
            </p>
        )}

        <form onSubmit={handleSubmit} className="form-grid">
          
          <div className="input-group full-width">
            <label>Username</label>
            <input type="text" name="username" onChange={handleChange} required />
          </div>
          
          <div className="input-group full-width">
            <label>Email Address</label>
            <input type="email" name="email" onChange={handleChange} required />
          </div>

          <div className="input-group">
            <label>First Name</label>
            <input type="text" name="first_name" onChange={handleChange} />
          </div>

          <div className="input-group">
            <label>Last Name</label>
            <input type="text" name="last_name" onChange={handleChange} />
          </div>
          
          <div className="input-group full-width">
            <label>Phone</label>
            <input type="tel" name="phone" onChange={handleChange} />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input type="password" name="password" onChange={handleChange} required />
          </div>

          <div className="input-group">
            <label>Confirm Password</label>
            <input type="password" name="password_2" onChange={handleChange} required />
          </div>

          <div className="input-group full-width">
            <label>Profile Picture</label>
            <input type="file" name="profile_pic" accept="image/*" onChange={handleFileChange} />
          </div>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? "Registering..." : "Register Now"}
          </button>
          
          <div className="full-width" style={{ textAlign: 'center', marginTop: '15px', fontSize: '13px' }}>
            Already have an account? <Link to="/login" style={{ color: '#667eea', textDecoration: 'none' }}>Login here</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;