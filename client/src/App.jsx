import React, { Suspense, lazy } from 'react';
import { Navigate, Outlet, Route, Routes, BrowserRouter, useLocation } from 'react-router-dom';
import LandingPage from './Components/Common/LandingPage';
import { getRoleHomePath } from './lib/api';
import { useAuth } from './lib/auth';

const LoginPage = lazy(() => import('./Components/Common/LoginPage'));
const RegisterPage = lazy(() => import('./Components/Common/RegisterPage'));
const AnonymousReport = lazy(() => import('./Components/Common/AnonymousReport'));
const TrackIssue = lazy(() => import('./Components/Common/TrackIssue'));

const CitizenDashboard = lazy(() => import('./Components/User/CitizenDashboard'));
const ReportIssuePage = lazy(() => import('./Components/User/ReportIssuePage'));
const MyReports = lazy(() => import('./Components/User/MyReports'));
const IssueDetails = lazy(() => import('./Components/User/IssueDetails'));
const Notifications = lazy(() => import('./Components/User/Notifications'));
const Settings = lazy(() => import('./Components/User/Settings'));

const AdminDashboard = lazy(() => import('./Components/Admin/AdminDashboard'));
const IssueManagement = lazy(() => import('./Components/Admin/IssueManagement'));
const AdminIssueDetails = lazy(() => import('./Components/Admin/AdminIssueDetails'));
const DepartmentsPage = lazy(() => import('./Components/Admin/Departments'));
const DeptDetails = lazy(() => import('./Components/Admin/DeptDetails'));
const UserRoleManagementPage = lazy(() => import('./Components/Admin/UserRoleManagement'));
const AuditLogsPage = lazy(() => import('./Components/Admin/AuditLogs'));
const AnalyticsReports = lazy(() => import('./Components/Admin/AnalyticsReport'));
const AdminSettingsPage = lazy(() => import('./Components/Admin/AdminSettings'));

const WorkerDashboard = lazy(() => import('./Components/Worker/WorkerDashboard'));
const MyTasks = lazy(() => import('./Components/Worker/MyTasks'));
const TaskDetails = lazy(() => import('./Components/Worker/TaskDetails'));
const Communications = lazy(() => import('./Components/Worker/Communications'));
const WorkerSettings = lazy(() => import('./Components/Worker/WorkerSettings'));
const WorkerNotifications = lazy(() => import('./Components/Worker/WorkerNotifications'));

function FullScreenLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 text-sm font-semibold text-slate-200">
      Loading CivicConnect...
    </div>
  );
}

function ProtectedRoute({ allowedRoles }) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <FullScreenLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to={getRoleHomePath(user?.role)} replace />;
  }

  return <Outlet />;
}

function PublicOnlyRoute() {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return <FullScreenLoader />;
  }

  if (isAuthenticated) {
    return <Navigate to={getRoleHomePath(user?.role)} replace />;
  }

  return <Outlet />;
}

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<FullScreenLoader />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route element={<PublicOnlyRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>
          <Route path="/anonymousreport" element={<AnonymousReport />} />
          <Route path="/trackissue" element={<TrackIssue />} />

          <Route element={<ProtectedRoute allowedRoles={['citizen']} />}>
            <Route path="/user/dashboard" element={<CitizenDashboard />} />
            <Route path="/user/report-issue" element={<ReportIssuePage />} />
            <Route path="/user/my-reports" element={<MyReports />} />
            <Route path="/user/issue/:id" element={<IssueDetails />} />
            <Route path="/user/notifications" element={<Notifications />} />
            <Route path="/user/settings" element={<Settings />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/issues" element={<IssueManagement />} />
            <Route path="/admin/issuedetails" element={<AdminIssueDetails />} />
            <Route path="/admin/departments" element={<DepartmentsPage />} />
            <Route path="/admin/deptdetails" element={<DeptDetails />} />
            <Route path="/admin/users" element={<UserRoleManagementPage />} />
            <Route path="/admin/analytics" element={<AnalyticsReports />} />
            <Route path="/admin/auditlogs" element={<AuditLogsPage />} />
            <Route path="/admin/adminsettings" element={<AdminSettingsPage />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['worker', 'supervisor', 'department_head']} />}>
            <Route path="/worker/dashboard" element={<WorkerDashboard />} />
            <Route path="/worker/tasks" element={<MyTasks />} />
            <Route path="/worker/taskdetails/:taskCode" element={<TaskDetails />} />
            <Route path="/worker/communications" element={<Communications />} />
            <Route path="/worker/notifications" element={<WorkerNotifications />} />
            <Route path="/worker/settings" element={<WorkerSettings />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
