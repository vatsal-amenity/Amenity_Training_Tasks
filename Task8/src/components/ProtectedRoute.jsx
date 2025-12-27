import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  // Redux mathi sate check karva
  const { isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    // if not register to redirect to register page
    return <Navigate to="/" replace />;
  }

  return children; // if register then redirect next page
};

export default ProtectedRoute;