
import React, { useEffect, useState } from "react";
import axios from "axios";
import MenuComponent from "../organism/menu";
import Submenu from "../organism/submenu";
import Footer from "../atoms/Footer";
import config from "../../config/config";
import Loader from "../molecules/loader";

function Home() {
  const [backgroundColor, setBackgroundColor] = useState(() => {
    return sessionStorage.getItem("backgroundColor") || "#d9d9d9";
  });

  const [selectedWidgets, setSelectedWidgets] = useState([]);
  const [homeData, setHomeData] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  useEffect(() => {
    document.title = "Home";
    const isLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";
    const accessToken = sessionStorage.getItem("accessToken");

    if (!isLoggedIn) {
      // Redirect to login page
      window.location.href = "/";
    }

    axios
      .get(`${config.apiUrl}/pages`)
      .then((response) => {
        console.log("Data received:", response.data);
        const pages = response.data.data;
        const homeDoc = pages.find((doc) => doc.title === "Home");
        if (homeDoc) {
          setHomeData(homeDoc);
        }
        setIsLoading(false); // Stop loading when data is fetched
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setIsLoading(false); // Stop loading even if there's an error
      });

    return () => {
      document.title = "Default Title";
    };
  }, []);

  const handleSaveSelectedText = (texts) => {
    setSelectedWidgets(texts);
  };

  if (isLoading) {
    return (
      <Loader />
    );
  }

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        backgroundColor: "#dde1e9",
        paddingLeft: 0,
      }}
    >
      <div
        style={{
          display: "flex",
          height: "-webkit-fill-available",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: "100%",
            backgroundColor: backgroundColor,
            overflow: "hidden",
          }}
        >
          <div>
            <MenuComponent
              onSaveSelectedText={handleSaveSelectedText}
              backgroundColor={backgroundColor}
            />
          </div>
          <div>
            <Submenu backgroundColor={backgroundColor} />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Home;
