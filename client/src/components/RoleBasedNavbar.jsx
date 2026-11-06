import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AdminNavbar from './navbars/AdminNavbar';
import LeadNavbar from './navbars/LeadNavbar';
import WorkerNavbar from './navbars/WorkerNavbar';
import CitizenNavbar from './navbars/CitizenNavbar';
import PublicNavbar from './navbars/PublicNavbar';
import MobileSidebarDrawer from './MobileSidebarDrawer';

export default function RoleBasedNavbar() {
  const { user, role, isAuthenticated } = useAuth();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const location = useLocation();

  // Automatically close mobile drawer when navigating to a new page
  useEffect(() => {
    setIsDrawerOpen(false);
  }, [location.pathname]);

  const toggleMobile = () => setIsDrawerOpen((prev) => !prev);
  const closeDrawer = () => setIsDrawerOpen(false);

  const renderNavbar = () => {
    if (!isAuthenticated || !user) {
      return <PublicNavbar onToggleMobile={toggleMobile} />;
    }

    switch (role) {
      case 'ADMIN':
        return <AdminNavbar onToggleMobile={toggleMobile} />;
      case 'MUNICIPAL_LEAD':
        return <LeadNavbar onToggleMobile={toggleMobile} />;
      case 'WORKER':
        return <WorkerNavbar onToggleMobile={toggleMobile} />;
      case 'CITIZEN':
        return <CitizenNavbar onToggleMobile={toggleMobile} />;
      default:
        return <PublicNavbar onToggleMobile={toggleMobile} />;
    }
  };

  return (
    <>
      {renderNavbar()}
      <MobileSidebarDrawer isOpen={isDrawerOpen} onClose={closeDrawer} />
    </>
  );
}
