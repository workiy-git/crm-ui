import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Assuming you're using react-router for navigation

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Check local storage to set the initial authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // State to track loading
  let navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsAuthenticated(isLoggedIn);
    if (!isLoggedIn) {
      // Redirect to login page if not logged in
      navigate("/");
    }
  }, [navigate]);

  const login = async () => {
    setIsLoading(true); // Start loading
    // Simulate login operation (replace with actual login logic)
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsAuthenticated(true);
    setIsLoading(false); // End loading
    navigate("/home"); // Redirect to dashboard after login
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("accessToken"); // Ensure to remove the access token on logout
    setIsLoading(false); // End loading

    // Redirect to login page after logout
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, isLoading }}>
      {isLoading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
