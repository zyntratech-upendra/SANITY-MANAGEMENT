import React from 'react';
import { useAuth } from '../context/AuthContext';
import AdminNavbar from './navbars/AdminNavbar';
import LeadNavbar from './navbars/LeadNavbar';
import WorkerNavbar from './navbars/WorkerNavbar';
import CitizenNavbar from './navbars/CitizenNavbar';
import PublicNavbar from './navbars/PublicNavbar';

export default function RoleBasedNavbar() {
  const { user, role, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return <PublicNavbar />;
  }

  switch (role) {
    case 'ADMIN':
      return <AdminNavbar />;
    case 'MUNICIPAL_LEAD':
      return <LeadNavbar />;
    case 'WORKER':
      return <WorkerNavbar />;
    case 'CITIZEN':
      return <CitizenNavbar />;
    default:
      return <PublicNavbar />;
  }
}

