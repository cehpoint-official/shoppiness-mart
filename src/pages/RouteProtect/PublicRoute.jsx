import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const PublicRoute = ({ children }) => {
  const location = useLocation();
  const token = localStorage.getItem("jwtToken");

  if (!token) {
    return children;
  }
  
  const decodedTokenId = jwtDecode(token).user_id;

  if (token) {
    return <Navigate to={`/user-dashboard/${decodedTokenId}`} replace />;
  }

  return children;
};

export default PublicRoute;
