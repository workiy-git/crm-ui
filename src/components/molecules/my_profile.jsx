import React, { useState, useEffect } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography"; // Corrected import for Typography
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import config from "../../config/config";
import "../../assets/styles/header.css";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import {headers} from '../atoms/Authorization'

const theme = createTheme({
  components: {
    MuiListItemButton: {
      defaultProps: {
        disableTouchRipple: true,
      },
    },
  },
  palette: {},
});

export default function Myprofile({ backgroundColor, value }) {
  const [open, setOpen] = useState(false);
  const [myprofileData, setMyprofileData] = useState({});
  const [userData, setUserData] = useState({});
  const navigate = useNavigate();
  const [jwtToken, setJwtToken] = useState("");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const token = sessionStorage.getItem("accessToken");
    if (token) {
      setJwtToken(token);
      const decodedToken = jwtDecode(token);
      const user = decodedToken.username;

      axios
        .post(`${config.apiUrl}appdata/retrieve`, [
          {
            "$match": {
              "pageName": "users",
              "username": user,
            }
          },
        ], {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
            Access:'true'
          },
        })
        .then((response) => {
          setUserData(response.data.data[0]);
          setUserName(user);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    } else {
      // Redirect or handle the absence of the token as needed
      navigate("/login"); // Redirect to login if no token found
    }
  }, [navigate]);

  useEffect(() => {
    axios
      .get(`${config.apiUrl}/menus/header`, {headers})
      .then((response) => {
        setMyprofileData(response.data.data.myprofile);
      })
      .catch((error) => {
        console.error("Error fetching menu data:", error);
      });
  }, []);

  const handleToggle = () => {
    setOpen((prev) => !prev);
  };

  const handleMenuItemClick = (path) => {
    if (path === "/") {
      sessionStorage.clear();
      localStorage.clear();
      window.location.href = path;
    } else {
      window.location.href = path;
    }
  };

  const handleNavigate = (mode) => {
    if (userData) {
      setOpen(false);
      navigate(`/users/${mode}/${userData._id}`, {
        state: { rowData: userData, pageName: "users", mode },
      });
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "left" }}>
      <ThemeProvider theme={theme}>
        <div elevation={0} sx={{ maxWidth: 256, backgroundColor: "transparent" }}>
          <List component="nav" disablePadding>
            <ListItemButton
              alignItems="flex-start"
              onClick={handleToggle}
              sx={{
                "&:hover, &:focus": {
                  "& svg": { opacity: open ? 1 : 0 },
                  background: "none",
                },
              }}
              style={{ padding: "15px" }}
            >
              <Avatar
                alt="Profile"
                src={userData.profile_img}
                sx={{ width: 30, height: 30, outline: "white 2px solid" }}
              />
              <div className="myprofile-username-main">
                <Typography className={`myprofile-username  ${value}`}>
                  {userData.first_name} {userData.last_name}
                </Typography>
                <Typography className={`myprofile-username myprofile-username-role ${value}`}>
                  {userData.job_role}
                </Typography>
              </div>
            </ListItemButton>
            {open && (
              <Box
                sx={{
                  bgcolor: "white",
                  borderRadius: "10px",
                  pb: 2,
                  pt: 2,
                  position: "absolute",
                  boxShadow: "2px 2px 19px 0px black",
                  zIndex: 10,
                  marginLeft: "20px",
                  width: "max-content",
                }}
              >
                <Box style={{ display: "grid", padding: "15px" }}>
                  <ListItemButton
                    onClick={() => handleNavigate("profile")}
                    style={{
                      borderBottom: "1px dashed black",
                      paddingBottom: "10px",
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        color: "inherit",
                        minWidth: "fit-content",
                        marginRight: "15px",
                      }}
                    >
                      <img
                        style={{ height: "40px", width: "40px", borderRadius: '100px' }}
                        src={userData.profile_img}
                        alt={userData.username}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={userData.username}
                      primaryTypographyProps={{
                        fontSize: 14,
                        fontWeight: "medium",
                        color: "black",
                      }}
                    />
                  </ListItemButton>
                  {Object.keys(myprofileData || userData)
                    .filter((key) => key !== "profile_image")
                    .map((key, index) => (
                      <ListItemButton
                        key={index}
                        sx={{
                          py: 0,
                          minHeight: 32,
                          color: "rgba(255,255,255,.8)",
                        }}
                        onClick={() => handleMenuItemClick(myprofileData[key].path)}
                      >
                        <ListItemIcon
                          sx={{
                            color: "inherit",
                            minWidth: "fit-content",
                            marginRight: "15px",
                          }}
                        >
                          <img
                            src={myprofileData[key].icon}
                            alt={myprofileData[key].title}
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={myprofileData[key].title}
                          primaryTypographyProps={{
                            fontSize: 14,
                            fontWeight: "medium",
                            color: "black",
                          }}
                        />
                      </ListItemButton>
                    ))}
                </Box>
              </Box>
            )}
          </List>
        </div>
      </ThemeProvider>
    </Box>
  );
}
