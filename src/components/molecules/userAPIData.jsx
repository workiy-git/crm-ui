import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import config from "../../config/config";

export const useUserData = () => {
  const [userData, setUserData] = useState(null);
  const [userName, setUserName] = useState("");
  const [jwtToken, setJwtToken] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("accessToken");
    console.log("token", token);
    if (token) {
      setJwtToken(token);
      const decodedToken = jwtDecode(token);
      const user = decodedToken.username;

      axios
        .post(
          `${config.apiUrl}/appdata/retrieve`,
          [
            {
              $match: {
                pageName: "users",
                username: user,
              },
            },
          ],
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
              Access: "true",
            },
          }
        )
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

  return { userData, userName, jwtToken };
};
