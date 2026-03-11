import React from 'react';
import { Edit } from 'lucide-react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './Components/Common/LandingPage';
import LoginPage from './Components/Common/LoginPage';
import RegisterPage from './Components/Common/RegisterPage';
import AnonymousReport from './Components/Common/AnonymousReport';
import TrackIssue from './Components/Common/TrackIssue';

import CitizenDashboard from './Components/User/CitizenDashboard';
import ReportIssuePage from './Components/User/ReportIssuePage';
import MyReports from './Components/User/MyReports';
import IssueDetails from './Components/User/IssueDetails';
import Notifications from './Components/User/Notifications';
import Settings from './Components/User/Settings';

import AdminDashboard from './Components/Admin/AdminDashboard';
import IssueManagement from './Components/Admin/IssueManagement';
import AdminIssueDetails from './Components/Admin/AdminIssueDetails';
import DepartmentsPage from './Components/Admin/Departments';
import DeptDetails from './Components/Admin/DeptDetails';
import UserRoleManagementPage from './Components/Admin/UserRoleManagement';
import AuditLogsPage from './Components/Admin/AuditLogs';
import AnalyticsReports from './Components/Admin/AnalyticsReport';
import AdminSettingsPage from './Components/Admin/AdminSettings';

import WorkerDashboard from './Components/Worker/WorkerDashboard';
import MyTasks from './Components/Worker/MyTasks';
import TaskDetails from './Components/Worker/TaskDetails';
import Communications from './Components/Worker/Communications';
import WorkerSettings from './Components/Worker/WorkerSettings';
import WorkerNotifications from './Components/Worker/WorkerNotifications';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/anonymousreport" element={<AnonymousReport />} />
        <Route path="/trackissue" element={<TrackIssue />} />
        
        {/* User Specific Routes */}
        <Route path="/user/dashboard" element={<CitizenDashboard />} />
        <Route path="/user/report-issue" element={<ReportIssuePage />} />
        <Route path="/user/my-reports" element={<MyReports />} />
        <Route path="/user/issue" element={<IssueDetails />} />
        <Route path="/user/notifications" element={<Notifications />} />
        <Route path="/user/settings" element={<Settings />} />

        {/* Admin Specific Routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/issues" element={<IssueManagement />} />
        <Route path="/admin/issuedetails" element={<AdminIssueDetails />} />
        <Route path="/admin/departments" element={<DepartmentsPage />} />
        <Route path="/admin/deptdetails" element={<DeptDetails />} />
        <Route path="/admin/users" element={<UserRoleManagementPage />} />
        <Route path="/admin/analytics" element={<AnalyticsReports />} />
        <Route path="/admin/auditlogs" element={<AuditLogsPage />} />
        <Route path="/admin/adminsettings" element={<AdminSettingsPage />} />

        {/* Worker Specific Routes */}
        <Route path="/worker/dashboard" element={<WorkerDashboard />} />
        <Route path="/worker/tasks" element={<MyTasks />} />
        <Route path="/worker/taskdetails" element={<TaskDetails />} />
        <Route path="/worker/communications" element={<Communications />} />
        <Route path="/worker/notifications" element={<WorkerNotifications />} />
        <Route path="/worker/settings" element={<WorkerSettings />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;