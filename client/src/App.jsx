import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './Components/Common/LandingPage';
import LoginPage from './Components/Common/LoginPage';
import RegisterPage from './Components/Common/RegisterPage';
import CitizenDashboard from './Components/User/CitizenDashboard';
import ReportIssuePage from './Components/User/ReportIssuePage';
import MyReports from './Components/User/MyReports';
import IssueDetails from './Components/User/IssueDetails';
import Notifications from './Components/User/Notifications';
import Settings from './Components/User/Settings';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* User Specific Routes */}
        <Route path="/dashboard" element={<CitizenDashboard />} />
        <Route path="/report-issue" element={<ReportIssuePage />} />
        <Route path="/my-reports" element={<MyReports />} />
        <Route path="/issue" element={<IssueDetails />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;