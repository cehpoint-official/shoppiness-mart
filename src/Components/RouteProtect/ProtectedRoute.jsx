import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const token = localStorage.getItem("jwtToken");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (token && location.pathname.startsWith("/user-dashboard")) {
    return children;
  }
  
  if (token && location.pathname.startsWith("/services-dashboard")) {
    return children;
  }
};

export default ProtectedRoute;
