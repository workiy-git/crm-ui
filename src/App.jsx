import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import WelcomePage from "./components/pages/welcome";
import Container from "./components/pages/container";  // Ensure this path is correct
import Home from "./components/pages/home";
import Loginpage from "./components/pages/login"; 
import Edit from "./components/pages/edit"; 
import Grid from "./components/organism/grid";
import DetailsPage from "./components/pages/details";
import Users from "./components/pages/users";
import UserForm from "./components/organism/usersForm";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Loginpage />} />
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/container/:pageName" element={<Container />} />
        <Route path="/grid" element={<Grid />} />
        <Route path="/edit/:id" element={<Edit />} />
        <Route path="/details/:id" element={<DetailsPage />} />
        <Route path="/users" element={<Users />} />
        <Route path="/adduser" element={<UserForm />} />
      </Routes>
    </Router>
  );
};

export default App;
