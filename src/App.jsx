import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import WelcomePage from "./components/pages/welcome"; // Ensure this path is correct
import Calls from "./components/pages/calls";
import Home from "./components/pages/home";
import Loginpage from "./components/pages/login"; // Ensure this path is correct
import Edit from "./components/pages/edit"; // Ensure this path is correct
import Grid from "./components/organism/grid";
import DetailsPage from "./components/pages/details";
import Users from "./components/pages/users";
import UserForm from "./components/organism/usersForm";
import Enquiry from "./components/pages/enquiry";
import Leads from "./components/pages/leads";
import Reports from "./components/pages/reports";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Loginpage />} />
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/calls" element={<Calls />} />
        <Route path="/enquiry" element={<Enquiry />} />
        <Route path="/leads" element={<Leads />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/grid" element={<Grid endpoint="/users" />} />
        <Route path="/edit/:id" element={<Edit endpoint="/users" />} />
        <Route path="/details/:id" element={<DetailsPage endpoint="/users" />} />
        <Route path="/users" element={<Users />} />
        <Route path="/adduser" element={<UserForm />} />
      </Routes>
    </Router>
  );
};

export default App;