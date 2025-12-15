import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import RequestReset from './pages/RequestReset';
import OTP from './pages/OTP';
import Dashboard from './pages/Dashboard';
import EditProfile from './pages/EditProfile';
import ChangePassword from './pages/ChangePassword';
import  ProtectedRoute  from './components/ProtectedRoute';
import ResetPassword from './pages/ResetPassword';  
// import EditProfile from './pages/EditProfile';
// import ChangePassword from './pages/ChangePassword';
// import TestConnection from './pages/Registers';




function App() {
  return (
    // <TestConnection />
    <Router>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/login"/>} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/edit-profile"
          element={
            <ProtectedRoute>
              <EditProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/change-password"
          element={
            <ProtectedRoute>
              <ChangePassword />
            </ProtectedRoute>
          }
        />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/request-reset" element={<RequestReset />} />
        <Route path="/otp" element={<OTP />} />
        <Route path="/password_reset_confirm/:uid" element={<ResetPassword />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/change-password" element={<ChangePassword />} />
        
      </Routes>
    </Router>
  );
}

export default App;