import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import RequestReset from './pages/RequestReset';
import OTP from './pages/OTP';
import Dashboard from './pages/Dashboard';
import ResetPassword from './pages/ResetPassword';  
// import TestConnection from './pages/Registers';




function App() {
  return (
    // <TestConnection />
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/request-reset" element={<RequestReset />} />
        <Route path="/otp" element={<OTP />} />
        <Route path="/password_reset/:uid/:token" element={<ResetPassword />} />
      </Routes>
    </Router>
  );
}

export default App;