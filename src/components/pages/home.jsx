// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import Header from '../organism/header';
// import MenuComponent from "../organism/menu";
// import SideMenu from "../organism/sidemenu";
// import Submenu from '../organism/submenu';
// import BackgroundColorChanger from '../atoms/BackgroundColorChanger';
// import Footer from '../atoms/Footer';
// import config from '../../config/config';

// function Home() {
//   const [backgroundColor, setBackgroundColor] = useState(() => {
//     return sessionStorage.getItem('backgroundColor') || '#d9d9d9';
//   });

//   const [selectedWidgets, setSelectedWidgets] = useState([]);
//   const [homeData, setHomeData] = useState(null);

//   useEffect(() => {
//     document.title = 'Home';

//     axios.get(`${config.apiUrl}/pages`)
//       .then((response) => {
//         console.log('Data received:', response.data);
//         const pages = response.data.data;
//         const homeDoc = pages.find(doc => doc.title === 'Home');
//         if (homeDoc) {
//           setHomeData(homeDoc);
//         }
//       })
//       .catch((error) => {
//         console.error('Error fetching data:', error);
//       });

//     return () => {
//       document.title = 'Default Title';
//     };
//   }, []);

//   const handleSaveSelectedText = (texts) => {
//     setSelectedWidgets(texts);
//   };

//   const handleColorChange = (color) => {
//     setBackgroundColor(color);
//     sessionStorage.setItem('backgroundColor', color);
//   };

//   const randomGradientColors = [];
//   function generateRandomLightColor() {
//     const r = Math.floor(Math.random() * 128) + 128;
//     const g = Math.floor(Math.random() * 128) + 128;
//     const b = Math.floor(Math.random() * 128) + 128;
//     return '#' + r.toString(16).padStart(2, '0') + g.toString(16).padStart(2, '0') + b.toString(16).padStart(2, '0');
//   }
//   for (let i = 0; i < 30; i++) {
//     const color1 = generateRandomLightColor();
//     const color2 = generateRandomLightColor();
//     const linearGradient = `linear-gradient(145deg, ${color1}, ${color2})`;
//     randomGradientColors.push(linearGradient);
//   }

//   if (!homeData) {
//     return
//   }

//   return (
//     <div style={{ height: '100vh', display: "flex", flexDirection: "column", overflow: 'hidden', backgroundColor: "#dde1e9", paddingLeft: 0 }}>
//       <div style={{ display: 'flex', height: '-webkit-fill-available', overflow: 'hidden' }}>
//         <div style={{ backgroundColor: "#121A2C" }}>
//           <SideMenu backgroundColor={backgroundColor} />
//         </div>
//         <div style={{ width: '100%', marginRight: "-10px", backgroundColor: backgroundColor, overflow: 'hidden' }}>
//           <div>
//             <Header backgroundColor={backgroundColor} />
//           </div>
//           <div>
//             <MenuComponent onSaveSelectedText={handleSaveSelectedText} backgroundColor={backgroundColor} />
//           </div>
//           <div>
//             <Submenu backgroundColor={backgroundColor} />
//           </div>

//         </div>
//       </div>
//       <Footer />
//     </div>
//   );
// }

// export default Home;
import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../organism/header";
import MenuComponent from "../organism/menu";
import SideMenu from "../organism/sidemenu";
import Submenu from "../organism/submenu";
import BackgroundColorChanger from "../atoms/BackgroundColorChanger";
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
    } else {
      console.log("User is logged in with accessToken:", accessToken);
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
