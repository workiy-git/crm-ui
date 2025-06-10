import React from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import Container from "./components/pages/container";
import Home from "./components/pages/home";
import Loginpage from "./components/pages/login";
import ForgetPassword from "./components/pages/forgetpassword";
import DetailsPage from "./components/pages/details";
import Underconstruction from "./components/pages/underconstruction";
import Header from "./components/organism/header";
import SideMenu from "./components/organism/sidemenu";
import GenerateReportPage from "./components/pages/generate-reports";
import ReportGrid from "./components/organism/reportGrid";
import AssignedTo from "./components/pages/assignedTo";
import SelectedEditComponent from "./components/molecules/selectedEdit";
import ProtectedRoute from "./protectedRoute"; 
import CustomDropdown from "./components/molecules/customDropdown";
import ReportsPage from "./components/pages/ReportsPage";
import ReportDetails from "./components/pages/ReportsDetailsView";
import { AuthProvider } from "./AuthContext"; 

const Layout = ({ children }) => {
  const location = useLocation();
  const hideHeaderAndSideMenu = location.pathname === '/' || location.pathname === '/forget-password';

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {!hideHeaderAndSideMenu && (
        <ProtectedRoute>
        <div style={{ backgroundColor: "#262626" }}>
          <SideMenu />
        </div>
        </ProtectedRoute>
      )}
      <div style={{ width: '100%', overflow: 'hidden' }}>
        {!hideHeaderAndSideMenu && (
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
    <AuthProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Loginpage />} />
          <Route path="/forget-password" element={<ForgetPassword />} />
          <Route path="/home" element={ <ProtectedRoute> <Home /> </ProtectedRoute> } />
          <Route path="/container/:pageName" element={ <ProtectedRoute> <Container /> </ProtectedRoute> } />
          <Route path="/:pageName/view/:id" element={ <ProtectedRoute> <DetailsPage mode="view" /> </ProtectedRoute> } />
          <Route path="/:pageName/edit/:id" element={ <ProtectedRoute> <DetailsPage mode="edit" /> </ProtectedRoute>} />
          <Route path="/:pageName/add" element={ <ProtectedRoute> <DetailsPage mode="add" /> </ProtectedRoute> } />
          <Route path="/users/profile/:id" element={ <ProtectedRoute> <DetailsPage mode="profile" /> </ProtectedRoute> } />
          <Route path="/generate-report" element={ <ProtectedRoute> <GenerateReportPage /> </ProtectedRoute> } />
          <Route path="/view-report" element={ <ProtectedRoute> <ReportGrid /> </ProtectedRoute> } />
          <Route path="/edit-report/:id" element={ <ProtectedRoute> <GenerateReportPage /> </ProtectedRoute> } />
          <Route path="/underconstruction" element={ <ProtectedRoute> <Underconstruction /> </ProtectedRoute> } />
          <Route path="/users/assignedto" element={<ProtectedRoute> <AssignedTo /> </ProtectedRoute>} />
          <Route path="/selected/edit" element={<ProtectedRoute> <SelectedEditComponent /> </ProtectedRoute>} />
          <Route path="/:pageName/customdropdown" element={<ProtectedRoute> <CustomDropdown /> </ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute> <ReportsPage /> </ProtectedRoute>} />
          <Route path="/reports/detailsview" element={<ProtectedRoute> <ReportDetails /> </ProtectedRoute>} />
        </Routes>
      </Layout>
      </AuthProvider>
  );
};

export default App;