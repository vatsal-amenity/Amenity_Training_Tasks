import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/App.css'; 

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ username: '', profile_pic: null });
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const savedUserData = localStorage.getItem('userData'); 

    if (!token) {
      navigate('/login');
    } else {
      if (savedUserData) {
        setUser(JSON.parse(savedUserData));
      }
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const profileImage = user.profile_pic 
    ? `http://localhost:8000${user.profile_pic}` 
    : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

  return (
    <div className="dashboard-container">
      
      <nav className="dashboard-navbar">
        <div className="nav-brand">MyDashboard</div>

        <div className="nav-user-section">
          <div className="user-info">
            <span className="user-name">{user.username || 'User'}</span>
            <span className="user-role">Admin</span>
          </div>

          <div 
            className="profile-pic-container" 
            onClick={() => setShowMenu(!showMenu)}
          >
            <img src={profileImage} alt="Profile" className="profile-pic" />
          </div>

          {showMenu && (
            <div className="dropdown-menu">
              <div className="menu-item" onClick={() => navigate('/edit-profile')}>
                Edit Profile
              </div>
              <div className="menu-item logout" onClick={handleLogout}>
                Logout
              </div>
            </div>
          )}
        </div>
      </nav>

      <div className="dashboard-content">
        <h2 className="dashboard-title">Dashboard Overview</h2>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-info">
              <h3>Total Users</h3>
              <p>1,240</p>
            </div>
            <div className="stat-icon" style={{ backgroundColor: '#e0e7ff', color: '#4f46e5' }}>
              👥
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-info">
              <h3>Active Now</h3>
              <p style={{ color: '#10b981' }}>98</p>
            </div>
            <div className="stat-icon" style={{ backgroundColor: '#d1fae5', color: '#10b981' }}>
              🟢
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-info">
              <h3>Pending</h3>
              <p style={{ color: '#f59e0b' }}>12</p>
            </div>
            <div className="stat-icon" style={{ backgroundColor: '#fef3c7', color: '#f59e0b' }}>
              ⚠️
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;