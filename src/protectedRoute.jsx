  import React from "react";
  import { Navigate } from "react-router-dom";
  import { useAuth } from "./AuthContext"; // Adjust the import path as necessary

  const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
      
      return <Navigate to="/" replace />;
    }

    return children;
  };

  export default ProtectedRoute;