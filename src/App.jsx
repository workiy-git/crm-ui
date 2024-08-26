import React from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import WelcomePage from "./components/pages/welcome";
import Container from "./components/pages/container";  // Ensure this path is correct
import Home from "./components/pages/home";
import Loginpage from "./components/pages/login"; 
import DetailsPage from "./components/pages/details";
import Underconstruction from "./components/pages/underconstruction";
import Header from "./components/organism/header";
import SideMenu from "./components/organism/sidemenu";

const Layout = ({ children }) => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/';

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {!isLoginPage && (
        <div style={{ backgroundColor: "#121A2C" }}>
          <SideMenu />
        </div>
      )}
      <div style={{ width: '100%', overflow: 'hidden' }}>
        {!isLoginPage && (
          <div>
            <Header />
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Loginpage />} />
          <Route path="/welcome" element={<WelcomePage />} />
          <Route path="/home" element={<Home />} />
          <Route path="/container/:pageName" element={<Container />} />
          <Route path="/:pageName/view/:id" element={<DetailsPage mode="view" />} />
          <Route path="/:pageName/edit/:id" element={<DetailsPage mode="edit" />} />
          <Route path="/:pageName/add" element={<DetailsPage mode="add" />} />
          <Route path="/users/profile/:id" element={<DetailsPage mode="profile" />} />
          <Route path="/underconstruction" element={<Underconstruction />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
