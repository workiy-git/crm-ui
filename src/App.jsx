import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Welcome from "./components/pages/welcome";
import Calls from "./components/pages/calls";
import Login from "./components/pages/login";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Welcome" element={<Welcome />} />
        <Route path="/calls" element={<Calls />} />
      </Routes>
    </Router>
  );
};

export default App;
