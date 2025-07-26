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
import ComplaintRegistrationPage from './pages/Complaints/ComplaintRegistrationPage';
import MyComplaintsPage from './pages/Complaints/MyComplaintsPage';
import ComplaintManagementPage from './pages/Admin/ComplaintManagementPage';
import ReportItemPage from './pages/LostFound/ReportItemPage';
import BrowseItemsPage from './pages/LostFound/BrowseItemsPage';
import ItemDetailsPage from './pages/LostFound/ItemDetailsPage';
import ScheduleFormPage from './pages/Timetable/ScheduleFormPage';
import TimetablePage from './pages/Timetable/TimetablePage';
import ListSkillPage from './pages/Skills/ListSkillPage';
import BrowseSkillsPage from './pages/Skills/BrowseSkillsPage';
import SkillDetailsPage from './pages/Skills/SkillDetailsPage';
import MySkillsPage from './pages/Skills/MySkillsPage';
import MyBookingsPage from './pages/Skills/MyBookingsPage';

const PrivateRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-blue-400 to-purple-400 flex items-center justify-center">
        <div className="glass-card p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white font-medium">Loading...</p>
        </div>
      </div>
    );
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
    <div className="min-h-screen">
      {user && <NavBar />}
      <main className={user ? 'pt-0' : 'pt-0'}>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          {/* Lost & Found Public Routes */}
          <Route path="/lostfound/browse" element={<BrowseItemsPage />} />
          <Route path="/lostfound/:id" element={<ItemDetailsPage />} />
          {/* Protected Lost & Found Route */}
          <Route
            path="/lostfound/report"
            element={
              <PrivateRoute allowedRoles={["student", "admin"]}>
                <ReportItemPage />
              </PrivateRoute>
            }
          />

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
          <Route
            path="/complaints/register"
            element={
              <PrivateRoute allowedRoles={["student", "admin"]}>
                <ComplaintRegistrationPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/complaints/my"
            element={
              <PrivateRoute allowedRoles={["student", "admin"]}>
                <MyComplaintsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/complaints"
            element={
              <PrivateRoute allowedRoles={["admin"]}>
                <ComplaintManagementPage />
              </PrivateRoute>
            }
          />

          {/* Timetable Routes */}
          <Route
            path="/timetable"
            element={
              <PrivateRoute allowedRoles={["student", "admin"]}>
                <TimetablePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/timetable/add"
            element={
              <PrivateRoute allowedRoles={["student", "admin"]}>
                <ScheduleFormPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/timetable/edit/:id"
            element={
              <PrivateRoute allowedRoles={["student", "admin"]}>
                <ScheduleFormPage />
              </PrivateRoute>
            }
          />

          {/* Skills Routes */}
          <Route
            path="/skills/list"
            element={
              <PrivateRoute allowedRoles={["student", "admin"]}>
                <ListSkillPage />
              </PrivateRoute>
            }
          />
          <Route path="/skills/browse" element={<BrowseSkillsPage />} />
          <Route path="/skills/:id" element={<SkillDetailsPage />} />
          <Route
            path="/skills/my-listings"
            element={
              <PrivateRoute allowedRoles={["student", "admin"]}>
                <MySkillsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/skills/my-bookings"
            element={
              <PrivateRoute allowedRoles={["student", "admin"]}>
                <MyBookingsPage />
              </PrivateRoute>
            }
          />

          {/* Default redirect from / to /dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Catch-all route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </div>
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
