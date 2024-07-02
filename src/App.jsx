import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import WelcomePage from "./components/pages/welcome"; // Ensure this path is correct
import Calls from "./components/pages/calls";
import Home from "./components/pages/home";
import Loginpage from "./components/pages/login"; // Ensure this path is correct
import Edit from "./components/pages/edit"; // Ensure this path is correct
import Grid from "./components/organism/grid";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Loginpage />} />
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/calls" element={<Calls />} />
        <Route path="/grid" element={<Grid endpoint="/users" />} />
        <Route path="/edit/:id" element={<Edit endpoint="/users" />} />
      </Routes>
    </Router>
  );
};

export default App;