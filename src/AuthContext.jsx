import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);
const INACTIVITY_LIMIT = 1 * 60 * 1000; // 15 minutes in milliseconds

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Initialize as loading
  let navigate = useNavigate();
  let inactivityTimeout = null;

  const clearInactivityTimeout = () => {
    if (inactivityTimeout) {
      clearTimeout(inactivityTimeout);
    }
  };

  const setInactivityTimeout = () => {
    clearInactivityTimeout(); // Clear any existing timeout
    inactivityTimeout = setTimeout(() => {
      logout(); // Log the user out after 15 minutes of inactivity
    }, INACTIVITY_LIMIT);
  };

  const logout = () => {
    setIsAuthenticated(false);
    sessionStorage.clear(); // Clear session storage
    localStorage.clear(); // Clear local storage
    setIsLoading(false);
    navigate("/"); // Redirect to login page
  };

  const login = async (token) => {
    setIsLoading(true);
    sessionStorage.setItem("accessToken", token);
    sessionStorage.setItem("isLoggedIn", "true");
    setIsAuthenticated(true);
    setIsLoading(false); // End loading
    navigate("/home"); // Redirect to dashboard after login
  };

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";
    if (isLoggedIn) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }

    setIsLoading(false); // Done checking, set loading to false

    const resetTimeout = () => setInactivityTimeout(); // Reset inactivity timeout on user activity

    // Add event listeners to track user activity
    window.addEventListener("mousemove", resetTimeout);
    window.addEventListener("keydown", resetTimeout);

    // Set the initial inactivity timeout
    setInactivityTimeout();

    // Clean up event listeners and timeouts on component unmount
    return () => {
      clearInactivityTimeout();
      window.removeEventListener("mousemove", resetTimeout);
      window.removeEventListener("keydown", resetTimeout);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, isLoading }}>
      {isLoading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
