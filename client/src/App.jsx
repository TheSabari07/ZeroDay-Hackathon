import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import TaskManagementPage from './pages/Tasks/TaskManagementPage';
import AdminDashboardPage from './pages/Admin/AdminDashboardPage';
import NotFoundPage from './pages/NotFoundPage';
import NavBar from './components/NavBar';
import AnnouncementManagementPage from './pages/Admin/AnnouncementManagementPage';
import AnnouncementsPage from './pages/Announcements/AnnouncementsPage';

const PrivateRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If user is not authorized for this route
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function AppRoutes() {
  const { user } = useAuth();
  return (
    <>
      {user && <NavBar />}
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute allowedRoles={["student", "admin"]}>
              <DashboardPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/tasks"
          element={
            <PrivateRoute allowedRoles={["student", "admin"]}>
              <TaskManagementPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <AdminDashboardPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/announcements"
          element={
            <PrivateRoute allowedRoles={["student", "admin"]}>
              <AnnouncementsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/announcements"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <AnnouncementManagementPage />
            </PrivateRoute>
          }
        />

        {/* Default redirect from / to /dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Catch-all route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
