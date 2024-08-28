import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import {
  Button,
  Typography,
  TextField,
  Grid,
  OutlinedInput,
  InputLabel,
  InputAdornment,
  IconButton,
  FormControl,
  CircularProgress,
} from "@mui/material";
import config from "../../config/config";
import "../../assets/styles/loginpage.css";
import {
  CognitoUserPool,
  AuthenticationDetails,
  CognitoUser,
} from "amazon-cognito-identity-js";

// Add a debounce utility function
const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

function Loginpage() {
  const [inputType] = useState("password");
  const [companyName, setCompanyName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [companylogoData, setcompanylogoData] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [allFieldsFilled, setAllFieldsFilled] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [jwtToken, setJwtToken] = useState("");
  const timeoutRef = useRef(null);
  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  // Define your Cognito User Pool Data
  // Cognito User Pool Data
  const poolData = {
    UserPoolId: "us-east-1_AEdwzu9Xx", // Your user pool id here
    ClientId: "6258t5vdisgcu7rjkuc5c94ba9", // Your client id here
  };
  const userPool = new CognitoUserPool(poolData);

  const handleLogin = (event) => {
    event.preventDefault();

    if (isSubmitting) return;
    setIsSubmitting(true);

     // Clear existing session before login
  userPool.getCurrentUser()?.signOut();

    if (!companyName.trim() || !username.trim() || !password.trim()) {
      setErrorMessage("Please fill in all required fields.");
      setIsSubmitting(false);
      return;
    } 
      setErrorMessage("");
      // Navigate to the home page
      // You can add your navigation logic here

      // Assuming you have the username and password from your form fields
      const usernameVal = username.trim();
      const passwordVal = password.trim();
      console.log("Trimmed Username:", usernameVal);
      console.log("Untrimmed Username:", username);


      const authenticationData = {
        Username: usernameVal,
        Password: passwordVal,
      };

      const authenticationDetails = new AuthenticationDetails(
        authenticationData
      );

      const userData = {
        Username: usernameVal,
        Pool: userPool,
      };

      const cognitoUser = new CognitoUser(userData);

      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: async (result) => {
          console.log("JWT Token:", result.getAccessToken().getJwtToken());
          
          try {
            const response = await fetch(`${config.apiUrl}appdata/retrieve`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: result.getAccessToken().getJwtToken(),
              },
              body: JSON.stringify([
                {
                  "$match": {
                    "pageName": "users",
                    "username": usernameVal, // dynamically include the username
                  }
                }
              ]),
            });

            const userData = await response.json();
            console.log("User data retrieved:", userData); // Add this log
            
            if (userData && userData.data[0].company === companyName) {
              sessionStorage.setItem("isLoggedIn", "true");
              sessionStorage.setItem(
                "accessToken",
                result.getAccessToken().getJwtToken()
              );
              startSessionTimeout();

              // Redirect to home or another page
              // window.location.href = "/home";
              navigate("/home"); // Redirect to a home page or dashboard after login
            } else {
              throw new Error(
                "User not found in the database or company mismatch"
              );
            }
          } catch (error) {
            console.error("User verification failed", error);
            setErrorMessage(
              "Entered Company Name does not match with the user. Please try again.");
            setIsSubmitting(false);
          }
        },
        onFailure: (err) => {
          console.error("Authentication failed", err);
          setErrorMessage("Invalid username or password. Please try again.");
          setIsSubmitting(false);
          // Handle login failure
        },
        newPasswordRequired: (userAttributes, requiredAttributes) => {
          console.log("New password required");
          // delete userAttributes.email_verified; // We don't need this
          // Prompt the user for their new password

          const newPassword = prompt("Please enter your new password:");
          // You might also need to collect any required attributes here
          cognitoUser.completeNewPasswordChallenge(
            newPassword,
            {},
            {
              onSuccess: (result) => {
                console.log("Password changed successfully", result);
                setErrorMessage(
                  "Password changed successfully. Please login with your new password."
                );
                setIsSubmitting(false);

                // Navigate to the home page or another page
              },
              onFailure: (err) => {
                console.error("Failed to change password", err);
                setErrorMessage(err.message || JSON.stringify(err));
                setIsSubmitting(false);
                // Handle failure to change password, show error message to user
              },
            }
          );
        },
      });
  };

  useEffect(() => {
    axios
      .get(`${config.apiUrl}/pages/Login`)
      .then((response) => {
        console.log("Data received:", response.data);
        setcompanylogoData(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    console.log("Checking if all required fields are filled");
    // Check if all required fields are filled
    setAllFieldsFilled(
      companyName.trim() && username.trim() && password.trim()
    );
  }, [companyName, username, password]);
  useEffect(() => {
    const token = sessionStorage.getItem("accessToken");
    if (token) {
      setJwtToken(token);
      startSessionTimeout();
    }
  }, []);

  useEffect(() => {
    const refreshInterval = setInterval(refreshSession, 5 * 60 * 1000); // Refresh every 5 minutes
    return () => clearInterval(refreshInterval);
  }, []);

  const refreshSession = () => {
    const token = sessionStorage.getItem("accessToken");
    if (token) {
      sessionStorage.setItem("accessToken", token); // Refresh the token
    }   // Reset the timeout
  };

  const startSessionTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    console.log("Starting session timeout");
    timeoutRef.current = setTimeout(() => {
      console.log("Session expired, clearing storage and redirecting");
      sessionStorage.clear();
      navigate("/login"); // Redirect to login page
    }, 15 * 60 * 1000); // 15 minutes
  };

  // Create a debounced version of the user action handler
  const handleUserAction = debounce(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current); // Only reset if there's already a timeout
      console.log("User action detected, resetting timeout");
    }
      startSessionTimeout(); // Reset the timeout on user action
    
  }, 1000); // Adjust the debounce wait time as necessary

  useEffect(() => {
    window.addEventListener("click", handleUserAction);
    window.addEventListener("keydown", handleUserAction);
    return () => {
      window.removeEventListener("click", handleUserAction);
      window.removeEventListener("keydown", handleUserAction);
    }
  }, []);

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleLogin(event);
    }
  };

  return (
    <div>
      {companylogoData && companylogoData.background ? (
        <div className="login-container" onKeyPress={handleKeyPress}>
          <div className="login-main">
            <div className="login-left-section">
              <Typography className="login-welcome-text">
              {companylogoData.welcome.log}
              </Typography>
              <div className="login-background-image-block">
              <img
                src={companylogoData.login?.icon}
                alt="background"
                className="login-background-image"
              /> 
              <Typography className="login-quotes-text">
              {companylogoData.welcome.quotes}
              </Typography>
              </div>
              
            </div>
            <div className="login-right-section">
              <div className="login-right-section-main">
                <div className="login-title-block">
                  <Typography variant="h6" className="login-title">
                  {companylogoData.login.title}
                  </Typography>
                </div>
                <Grid className="Login-input">
                  <Grid item xs={12} sm={6} className="login-form-group">
                    <div className="login-align-items">
                    <Typography  className="login-lable"> {companylogoData.company.lable}</Typography>
                    <input
                      type="text"
                      className="login-text-field"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      required
                      placeholder={companylogoData.company.placeholder}
                    />
                    </div>                  
                    </Grid>
                  <Grid item xs={12} sm={6} className="login-form-group">
                    <div className="login-align-items">
                    <Typography  className="login-lable">{companylogoData.username.lable}</Typography>
                    <input
                      type="text"
                      className="login-text-field"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      placeholder={companylogoData.username?.placeholder}
                    />
                    </div>
                  </Grid>
                  <Grid item xs={12} className="login-form-group">
                    <div className="login-align-items">
                    <Typography  className="login-lable"> {companylogoData.password.lable}</Typography>
                    <FormControl type={inputType} required>
                      <div style={{ display: "flex" }}>
                        <input
                          placeholder={companylogoData.password.placeholder}
                          className=" login-text-field"
                          id="outlined-adornment-password"
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <InputAdornment
                          style={{ display: "contents" }}
                          position="end"
                        >
                          <div
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                            className="imgdiv"
                          >
                            {showPassword ? (
                              <img
                                alt="eyeOff"
                                className="login-pwd-eye"
                                src={companylogoData.password?.eyeOff}
                              />
                            ) : (
                              <img
                                alt="eyeOpen"
                                className="login-pwd-eye"
                                src={companylogoData.password?.eyeOpen}
                              />
                            )}
                          </div>
                        </InputAdornment>
                      </div>
                    </FormControl>
                    </div>
                  </Grid>
                </Grid>
                <div className="login-center login-error">
                  {errorMessage && (
                    <Typography variant="body2" className="login-error-message">
                      {errorMessage}
                    </Typography>
                  )}
                </div>
                <div className="login-center">
                      <Button
                        variant="contained"
                        color="primary"
                        className={
                            allFieldsFilled ? "login-button" : "login-button-disabled"
                          }
                        id="login-button"
                        onClick={handleLogin}
                        disabled={!allFieldsFilled || isSubmitting}
                    style={{
                      cursor: allFieldsFilled ? "pointer" : "not-allowed",
                      opacity: isSubmitting ? 0.7 : 1,
                      pointerEvents: isSubmitting ? "none" : "auto",
                    }}
                      >
                        {isSubmitting ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                        companylogoData.button?.title
                    )}
                      </Button>                       
                      </div>
                <div className="login-center login-submit-block">
                  <a
                    className="login-forgot-password"
                    href={companylogoData.forget?.url || "/"}
                  >
                    {companylogoData.forget?.title}
                  </a>
                </div>
                <div className="login-center login-submit-block">
                  <Typography
                   className="login-footer" 
                    >
                      {companylogoData.footer.title}
                    </Typography>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}
export default Loginpage;