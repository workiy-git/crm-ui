import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import Text from "@mui/material/Typography";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import config from "../../config/config";
import "../../assets/styles/header.css";
import { jwtDecode } from "jwt-decode";
import { useLocation, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";


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
  const menuRef = useRef(null);
  const [myprofileData, setMyprofileData] = useState({});
  const [userData, setUserData] = useState({});
  const navigate = useNavigate();
  const [jwtToken, setJwtToken] = useState("");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const token = sessionStorage.getItem("accessToken"); // Use sessionStorage instead of localStorage
    if (token) {
      setJwtToken(token);
      const decodedToken = jwtDecode(token);
      const user = decodedToken.username; // Assuming the username is stored in the token
      axios
        .get(`${config.apiUrl}/users/${user}`)
        .then((response) => {
          setUserData(response.data.data); // Update with the fetched user data
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
      setUserName(user);
    }
  }, []);

  useEffect(() => {
    axios
      .get(`${config.apiUrl}/menus/header`)
      .then((response) => {
        setMyprofileData(response.data.data.myprofile);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (open && menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.body.addEventListener("click", handleClickOutside);
    return () => {
      document.body.removeEventListener("click", handleClickOutside);
    };
  }, [open]);

  const handleToggle = () => {
    setOpen(!open);
  };

  const handleMenuItemClick = (path) => {
    const url = `${path}`;
    window.location.href = url;
  };

  const handleProfileClick = () => {
    const url = `/underconstruction`;
    window.location.href = url;
  };

  const handleNavigate = (mode) => {
    if (userData) {
        navigate(`/users/${mode}/${userData._id}`, {
            state: { rowData: userData, mode },
        });
        console.log("userData", userData);
        console.log("userData ID", userData._id);

    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "left" }}>
      <ThemeProvider theme={theme}>
        <div
          elevation={0}
          sx={{ maxWidth: 256, backgroundColor: "transparent" }}
        >
          <List component="nav" disablePadding ref={menuRef}>
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
                sx={{ width: 40, height: 40, outline: "white 2px solid" }}
              />
              <div className="myprofile-username-main">
                <Text className={`myprofile-username  ${value}`}>
                  {userData.username}
                </Text>
                <Text
                  className={`myprofile-username myprofile-username-role ${value}`}
                >
                  {userData.job_role}
                </Text>
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
                    // onClick={() => handleProfileClick()}
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
                      style={{ height: "40px", width: "40px", padding: "0px" }}
                    >
                      <img
                        style={{ width: "100%", borderRadius: "100px" }}
                        src={userData.profile_img}
                        alt={userData.profile_img}
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
                        onClick={() =>
                          handleMenuItemClick(myprofileData[key].path)
                        }
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
