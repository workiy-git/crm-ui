import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Button, Typography, TextField, Grid, OutlinedInput, InputLabel, InputAdornment, IconButton, FormControl } from "@mui/material";
import config from "../../config/config";
import "../../assets/styles/loginpage.css";

function Loginpage() {
  const [inputType] = useState("password");
  const [companyName, setCompanyName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [companylogoData, setcompanylogoData] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [allFieldsFilled, setAllFieldsFilled] = useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleLogin = () => {
    if (!companyName.trim() || !username.trim() || !password.trim()) {
      setErrorMessage("Please fill in all required fields.");
    } else {
      setErrorMessage("");
      // Navigate to the home page
      // You can add your navigation logic here
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
    // Check if all required fields are filled
    setAllFieldsFilled(companyName.trim() && username.trim() && password.trim());
  }, [companyName, username, password]);

  return (
    <div>
      {companylogoData && companylogoData.background ? (
        <div className="login-container">
          <img
            src={companylogoData.background.BG}
            alt="background"
            className="login-background-image"
          />

          <div className="login-left-section">
            <div></div>
          </div>

          <div className="login-right-section">
            <Typography variant="h6" className="login-title">
              {companylogoData.login?.title}
            </Typography>
            <Typography className="login-sub-title" variant="h6">
              {companylogoData.welcome?.title}
            </Typography>
            <Grid>
              <Grid item xs={12} sm={6} className="login-form-group">
                <div className="login-align-items">
                  <img
                    src={companylogoData.company?.logo}
                    alt="logo"
                    className="login-logo"
                  />
                </div>
                <input type="text" className="login-text-field" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required placeholder={companylogoData.company.placeholder}/>
              </Grid>
              <Grid item xs={12} sm={6} className="login-form-group">
                <div className="login-align-items">
                  <img
                    src={companylogoData.username.logo}
                    alt="logo"
                    className="login-logo"
                  />
                </div>
                <input type="text" className="login-text-field"   value={username}   onChange={(e) => setUsername(e.target.value)} required placeholder={companylogoData.username?.placeholder}/>
              </Grid>
              <Grid item xs={12} className="login-form-group">
                <div className="login-align-items">
                  <img
                    src={companylogoData.password?.logo}
                    alt="logo"
                    className="login-logo"
                  />
                </div>
                <FormControl
                  type={inputType}
                  required
                >
                  <div style={{display:"flex"}}>
                  <input
                    placeholder="Password"
                    className=" login-text-field"
                    id="outlined-adornment-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    
                  />
                      <InputAdornment style={{display:"contents"}} position="end">
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
              <Typography
                variant="body2"
                className="login-forgot-password"
              >
                {companylogoData.forget?.title}
              </Typography>
            </div>
            <div className="login-center">
              {errorMessage && (
                <Typography
                  variant="body2"
                  className="login-error-message"
                >
                  {errorMessage}
                </Typography>
              )}
            </div>
            <div className="login-center">
              {allFieldsFilled ? (
                <Link to="/welcome" className="login-link">
                  <Button
                    variant="contained"
                    color="primary"
                    className="login-button"
                    id="login-button"
                    onClick={handleLogin}
                  >
                    {companylogoData.button?.title}
                  </Button>
                </Link>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  className="login-button-disabled"
                  id="login-button"
                  onClick={handleLogin}
                >
                  {companylogoData.button?.title}
                </Button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div >
          <img src=""  alt=  "load"/>

        </div>
      )}
    </div>
  );
}

export default Loginpage;
