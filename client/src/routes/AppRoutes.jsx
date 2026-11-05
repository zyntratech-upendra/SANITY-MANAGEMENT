import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Dedicated Portals & Auth Pages
import PortalGatewayPage from '../pages/PortalGatewayPage';
import AdminLoginPage from '../pages/auth/AdminLoginPage';
import LeadLoginPage from '../pages/auth/LeadLoginPage';
import WorkerLoginPage from '../pages/auth/WorkerLoginPage';
import CitizenLoginPage from '../pages/auth/CitizenLoginPage';
import RegisterPage from '../pages/RegisterPage';

// Dedicated Role Dashboards
import AdminDashboardPage from '../pages/AdminDashboardPage';
import LeadDashboardPage from '../pages/LeadDashboardPage';
import WorkerDashboardPage from '../pages/WorkerDashboardPage';
import CitizenDashboardPage from '../pages/CitizenDashboardPage';

// Municipal & Public Views
import CommandCenterPage from '../pages/CommandCenterPage';
import MapDashboardPage from '../pages/MapDashboardPage';
import FacilitiesPage from '../pages/FacilitiesPage';
import ComplaintsPage from '../pages/ComplaintsPage';
import StaffTasksPage from '../pages/StaffTasksPage';
import IoTSimulatorPage from '../pages/IoTSimulatorPage';
import VisitorKioskPage from '../pages/VisitorKioskPage';
import StaffDutyPage from '../pages/StaffDutyPage';

// Smart Home Route based on Role
function HomeRedirect() {
  const { user, isAuthenticated, role } = useAuth();
  if (!isAuthenticated || !user) {
    return <Navigate to="/portal" replace />;
  }
  switch (role) {
    case 'ADMIN':
      return <Navigate to="/admin" replace />;
    case 'MUNICIPAL_LEAD':
      return <Navigate to="/lead" replace />;
    case 'WORKER':
      return <Navigate to="/worker" replace />;
    case 'CITIZEN':
      return <Navigate to="/citizen" replace />;
    default:
      return <Navigate to="/portal" replace />;
  }
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />
      <Route path="/portal" element={<PortalGatewayPage />} />
      <Route path="/login" element={<Navigate to="/portal" replace />} />

      {/* 4 Dedicated Separate Login Pages */}
      <Route path="/login/admin" element={<AdminLoginPage />} />
      <Route path="/login/lead" element={<LeadLoginPage />} />
      <Route path="/login/worker" element={<WorkerLoginPage />} />
      <Route path="/login/citizen" element={<CitizenLoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* 4 Dedicated Role Dashboards */}
      <Route path="/admin" element={<AdminDashboardPage />} />
      <Route path="/lead" element={<LeadDashboardPage />} />
      <Route path="/worker" element={<WorkerDashboardPage />} />
      <Route path="/citizen" element={<CitizenDashboardPage />} />

      {/* Core Public & Municipal Views */}
      <Route path="/map" element={<MapDashboardPage />} />
      <Route path="/command" element={<CommandCenterPage />} />
      <Route path="/facilities" element={<FacilitiesPage />} />
      <Route path="/complaints" element={<ComplaintsPage />} />
      <Route path="/staff" element={<StaffTasksPage />} />
      <Route path="/iot" element={<IoTSimulatorPage />} />
      <Route path="/kiosk" element={<VisitorKioskPage />} />
      <Route path="/report/:code" element={<VisitorKioskPage />} />
      <Route path="/staff-duty" element={<StaffDutyPage />} />

      <Route path="*" element={<HomeRedirect />} />
    </Routes>
  );
}
