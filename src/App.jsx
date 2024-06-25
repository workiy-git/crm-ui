import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import WelcomePage from "./components/pages/welcome"; // Ensure this path is correct
import Calls from "./components/pages/calls";
import Home from "./components/pages/home";
import Loginpage from "./components/pages/login"; // Ensure this path is correct

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Loginpage />} />
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/calls" element={<Calls />} />
      </Routes>
    </Router>
  );
};

export default App;
