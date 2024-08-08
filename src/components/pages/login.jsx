import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  Button,
  Typography,
  Grid,
  InputAdornment,
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

function Loginpage() {
  const [inputType] = useState("password");
  const [companyName, setCompanyName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [companylogoData, setcompanylogoData] = useState({});
  const [allFieldsFilled, setAllFieldsFilled] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); 

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

    if (!companyName.trim() || !username.trim() || !password.trim()) {
      setErrorMessage("Please fill in all required fields.");
      setIsSubmitting(false);
    } else {
      setErrorMessage("");
      
      const usernameVal = username.trim();
      const passwordVal = password.trim();

      const authenticationData = {
        Username: usernameVal,
        Password: passwordVal,
      };

      const authenticationDetails = new AuthenticationDetails(
        authenticationData
      );

      const userData = {
        Username: username,
        Pool: userPool,
      };

      const cognitoUser = new CognitoUser(userData);

      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: async (result) => {
          try {
            const response = await fetch(`${config.apiUrl}users/${username}`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: result.getAccessToken().getJwtToken(),
              },
            });

            if (!response.ok) {
              throw new Error("User verification failed");
            }

            const userData = await response.json();

            if (userData && userData.data.company === companyName) {
              sessionStorage.setItem("isLoggedIn", "true");
              sessionStorage.setItem(
                "accessToken",
                result.getAccessToken().getJwtToken()
              );

              window.location.href = "/home";
            } else {
              throw new Error(
                "User not found in the database or company mismatch"
              );
            }
          } catch (error) {
            console.error("User verification failed", error);
            setErrorMessage("Invalid username or password. Please try again.");
            setIsSubmitting(false);
          }
        },
        onFailure: (err) => {
          console.error("Authentication failed", err);
          setErrorMessage("Invalid username or password. Please try again.");
          setIsSubmitting(false);
        },
        newPasswordRequired: (userAttributes, requiredAttributes) => {
          const newPassword = prompt("Please enter your new password:");
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
              },
              onFailure: (err) => {
                console.error("Failed to change password", err);
                setErrorMessage(err.message || JSON.stringify(err));
                setIsSubmitting(false);
              },
            }
          );
        },
      });
    }
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
    setAllFieldsFilled(
      companyName.trim() && username.trim() && password.trim()
    );
  }, [companyName, username, password]);

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleLogin(event);
    }
  };

  return (
    <div>
      {companylogoData && companylogoData.background ? (
        <div
          className="login-container"
          style={{ backgroundImage: `url(${companylogoData.background.BG})` }}
          onKeyPress={handleKeyPress}
        >
          <div className="login-main">
            <div className="login-left-section">
              <img
                src={companylogoData.background.bot}
                alt="background"
                className="login-background-image"
              />
            </div>
            <div className="login-right-section">
              <div className="login-right-section-main">
                <div className="login-title-block">
                  <img src={companylogoData.login?.icon} alt="" />
                  <Typography variant="h6" className="login-title">
                    {companylogoData.login?.title}
                  </Typography>
                </div>
                <Grid>
                  <Grid item xs={12} sm={6} className="login-form-group">
                    <div className="login-align-items">
                      <img
                        src={companylogoData.company?.logo}
                        alt="logo"
                        className="login-logo"
                      />
                    </div>
                    <input
                      type="text"
                      className="login-text-field"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      required
                      placeholder={companylogoData.company.placeholder}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} className="login-form-group">
                    <div className="login-align-items">
                      <img
                        src={companylogoData.username.logo}
                        alt="logo"
                        className="login-logo"
                      />
                    </div>
                    <input
                      type="text"
                      className="login-text-field"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      placeholder={companylogoData.username?.placeholder}
                    />
                  </Grid>
                  <Grid item xs={12} className="login-form-group">
                    <div className="login-align-items">
                      <img
                        src={companylogoData.password?.logo}
                        alt="logo"
                        className="login-logo"
                      />
                    </div>
                    <FormControl type={inputType} required>
                      <div style={{ display: "flex" }}>
                        <input
                          placeholder="Password"
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
                  </Grid>
                </Grid>
                <div className="login-center login-submit-block">
                  <a
                    className="login-forgot-password"
                    href={companylogoData.forget?.url || "/"}
                  >
                    {companylogoData.forget?.title}
                  </a>
                </div>
                <div className="login-center">
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
