import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/apifetch';
import { toast } from "react-toastify";
import '../assets/App.css'; 

const EditProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    username: '',
    first_name: '',
    last_name: '',
    email: '', 
    profile_pic: null
  });

  const [preview, setPreview] = useState("https://cdn-icons-png.flaticon.com/512/3135/3135715.png");

  useEffect(() => {
    const savedData = localStorage.getItem('userData');
    if (savedData) {
      const user = JSON.parse(savedData);
      console.log("load from local:",user);
      
      setFormData({
        username: user.username || '',
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        profile_pic: null 
      });

      if (user.profile_pic) {
         if(user.profile_pic.startsWith("http")) {
             setPreview(user.profile_pic);
         } else {
             const BASE_URL = "https://unheuristic-chelsea-unschooled.ngrok-free.dev"; 
             setPreview(`${BASE_URL}${user.profile_pic}`);
             
         }
      }
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, profile_pic: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("accessToken");
    if(!token){
      toast.error("are u not log in");
      navigate("/login");
      setLoading(false);
      return;
    }

    const dataToSend = new FormData();
    dataToSend.append('username', formData.username);
    dataToSend.append('first_name', formData.first_name);
    dataToSend.append('last_name', formData.last_name);
    dataToSend.append('email', formData.email);
    
    if (formData.profile_pic) {
        dataToSend.append('profile_pic', formData.profile_pic);
    }

    try {
      const response = await api.put('/edit_profile/', dataToSend, {
        headers: {
             'Content-Type': 'multipart/form-data',
             'Authorization': `Bearer ${token}`
        }
      });

      console.log("Update Success:", response.data);

      const updatedUser = response.data.data || response.data;
      
      const oldLocalStorage = JSON.parse(localStorage.getItem('userData') || "{}");
      
      const newLocalStorageData = { 
          ...oldLocalStorage,
          ...updatedUser, 
          tokens: oldLocalStorage.tokens 
      };

      localStorage.setItem('userData', JSON.stringify(newLocalStorageData));
      
      const displayName = updatedUser.username || updatedUser.first_name;
      if(displayName) localStorage.setItem('username', displayName);

      const successMsg = response?.data?.message || "Profile Updated Successfully!";
      toast.success(successMsg);

      setLoading(false);
      setTimeout(() => navigate('/dashboard'), 400);

    } catch (error) {
      const errMsg = error?.response?.data?.message || error?.message || 'Failed to update profile.';
      toast.error(errMsg);
      if(error.response && error.response.status === 401) {
          toast.error("Session Expired or Unauthorized. Please Login again.");
          navigate('/login');
      } 
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-wrapper">
      <div className="left-panel">
        <h2>Edit Profile</h2>
        <p>Update your personal details and profile picture.</p>
        <button onClick={() => navigate('/dashboard')} className="btn-primary" style={{marginTop: '20px', background: 'transparent', border: '1px solid white'}}>
              &larr; Back to Dashboard
        </button>
      </div>

      <div className="right-panel">
        <div className="form-header">
          <h3>Update Details</h3>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
            <img 
                src={preview} 
                alt="Preview" 
                style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #667eea' }} 
            />
        </div>

        <form onSubmit={handleSubmit} className="form-grid">
          
          <div className="input-group full-width">
            <label>Change Profile Photo</label>
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </div>

          <div className="input-group full-width">
            <label>Username</label>
            <input type="text" name="username" value={formData.username} onChange={handleChange} />
          </div>

          <div className="input-group">
            <label>First Name</label>
            <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} />
          </div>

          <div className="input-group">
            <label>Last Name</label>
            <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} />
          </div>

          <div className="input-group full-width">
            <label>Email (Read Only)</label>
            <input type="email" value={formData.email} disabled style={{ backgroundColor: '#f0f0f0', cursor: 'not-allowed' }} />
          </div>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? "Updating..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;