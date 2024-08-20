import React from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import WelcomePage from "./components/pages/welcome";
import Container from "./components/pages/container";  // Ensure this path is correct
import Home from "./components/pages/home";
import Loginpage from "./components/pages/login"; 
import DetailsPage from "./components/pages/details";
import Users from "./components/pages/users";
import UserForm from "./components/organism/usersForm";
import Underconstruction from "./components/pages/underconstruction";
import Header from "./components/organism/header";
import SideMenu from "./components/organism/sidemenu";
import ProtectedRoute from "./protectedRoute";

const Layout = ({ children }) => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/";

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
      <Layout>
        <Routes>
          <Route path="/" element={<Loginpage />} />
          {/* <Route path="/welcome" element={<WelcomePage />} /> */}
          <Route path="/home" 
            element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>} 
          />
         <Route path="/container/:pageName" 
            element={
              <ProtectedRoute>
                <Container />{" "}
              </ProtectedRoute>} 
          />
          <Route path="/:pageName/view/:id" 
            element={
              <ProtectedRoute>
                <DetailsPage mode="view" />{" "}
              </ProtectedRoute>} 
          />
          <Route path="/:pageName/edit/:id" 
            element={
              <ProtectedRoute>
                <DetailsPage mode="edit" />{" "}
              </ProtectedRoute>} 
          />
          <Route path="/:pageName/add" 
            element={
              <ProtectedRoute>
                <DetailsPage mode="add" />{" "}
              </ProtectedRoute>} 
          />
          <Route path="/users/profile/:id" 
            element={
              <ProtectedRoute>
                <DetailsPage mode="profile" />{" "}
              </ProtectedRoute>} 
          />
          <Route path="/users" 
            element={
              <ProtectedRoute>
                <Users />{" "}
              </ProtectedRoute>} 
          />
          <Route path="/adduser" 
            element={
              <ProtectedRoute>
                <UserForm />{" "}
              </ProtectedRoute>} 
          />
          <Route path="/underconstruction" 
            element={
              <ProtectedRoute>
                <Underconstruction />{" "}
              </ProtectedRoute>} 
          />
        </Routes>
      </Layout>
  );
};

export default App;
