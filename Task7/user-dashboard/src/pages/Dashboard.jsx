import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/App.css'; 
import { toast } from "react-toastify";
import api from '../api/apifetch';

const Dashboard = () => {
  const navigate = useNavigate();
  
  // Default values
  const [user, setUser] = useState({ 
      username: 'User', 
      first_name: '', 
      last_name:'',
      email: '', 
      profile_pic: null 
  });

  
  const [showMenu, setShowMenu] = useState(false);


  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const savedUserData = localStorage.getItem('userData'); 

    if (!token) {
      navigate('/login');
    } else {
      if (savedUserData) {
        try {
            const parsedUser = JSON.parse(savedUserData);
            console.log("Dashboard Display Data:", parsedUser); 
            setUser(parsedUser);
            } catch (e) {
            toast.error(e?.message || "JSON Error");
        }
      }
    }
  }, [navigate]);

  const handleLogout = async () => {
    if (!window.confirm('Are you sure you want to Delete Account & Logout?')) {
      return;
    }
    const token = localStorage.getItem("accessToken");
      if (!token) {
    localStorage.clear();
    navigate('/login');
    toast.success("Logged out successfully");
        return;
    }

    try {
      // 3. API Call with HEADERS (Aa main fix che)
      // Delete request ma data nahi, pan 'headers' mokalva pade
      const response = await api.delete('/delete_account/', {
         headers: {
            'Authorization': `Bearer ${token}` 
         }
      });
      
      // 4. Success Message
      toast.success(response?.data?.message || 'Account Deleted & Logged Out.');

      // 5. Safai Abhiyan (Badhu clear karo)
      localStorage.clear();
      
      // 6. Login/Register page par moklo
      navigate('/login');

    } catch (error) {
      console.error('Delete error:', error);
      
      localStorage.clear();
      navigate('/login');
      
      if(error.response && error.response.status === 401) {
          toast.error("Session expired.");
      } else {
          toast.error('Failed to delete account form server.');
      }
    }
  };

  let profileImage = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"; 
   
  if (user.profile_pic) {
    if (user.profile_pic.startsWith("http")) {
          profileImage = user.profile_pic;
      } else {
          profileImage = `https://unheuristic-chelsea-unschooled.ngrok-free.dev/api${user.profile_pic}`;
      }
  }

  

  const displayName = user.username || user.first_name || "User";

  return (
    <div className="dashboard-container">
      
      <nav className="dashboard-navbar">
        <div className="nav-brand">MyDashboard</div>

        <div className="nav-user-section">
          <div className="user-info">
            <span className="user-name">{displayName}</span>
            <span className="user-role">User</span>
          </div>

          <div className="profile-pic-container" onClick={() => setShowMenu(!showMenu)}>
            <img 
                src={profileImage} 
                alt="Profile" 
                className="profile-pic" 
                onError={(e) => { 
                    e.target.onerror = null; 
                    e.target.src = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png" 
                }}
            />
          </div>

          {showMenu && (
            <div className="dropdown-menu">
              <div className="menu-item" onClick={ () => navigate('/edit-profile')}>Edit Profile</div>
              {/* <div className="menu-item" onClick={handleLogout}>Logout</div> */}
              <div className="menu-item" onClick={()=>navigate('/change-password')}>Change Password</div>
              <div className="menu-item" onClick={handleLogout} style={{ color: 'red', borderTop: '1px solid #eee' }}>Logout</div>
              
            </div>
          )}
        </div>
      </nav>

      <div className="dashboard-content">
        <h2 className="dashboard-title">Dashboard Dummy Data</h2>
        
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-info">
              <h3>Total Users</h3>
              <p>1,240</p>
            </div>
            <div className="stat-icon" style={{ backgroundColor: '#e0e7ff', color: '#4f46e5' }}>👥</div>
          </div>
          
          <div className="stat-card">
             <div className="stat-info">
               <h3>Active Now</h3><p style={{ color: '#10b981' }}>98</p>
             </div>
             <div className="stat-icon" style={{ backgroundColor: '#d1fae5', color: '#10b981' }}>🟢</div>
          </div>

          <div className="stat-card">
             <div className="stat-info">
               <h3>Pending</h3><p style={{ color: '#f59e0b' }}>12</p>
             </div>
             <div className="stat-icon" style={{ backgroundColor: '#fef3c7', color: '#f59e0b' }}>⚠️</div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;