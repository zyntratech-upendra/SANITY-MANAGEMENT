import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSanitation } from '../context/SanitationContext';
import {
  FaQrcode,
  FaMapLocationDot,
  FaClipboardList,
  FaUser,
  FaBroom,
  FaClock,
  FaBuildingColumns,
  FaUsers,
  FaUserShield,
  FaRightToBracket,
} from 'react-icons/fa6';

export default function MobileBottomBar() {
  const { user, role, isAuthenticated } = useAuth();
  const { complaints } = useSanitation();
  const location = useLocation();

  const pendingComplaints = complaints.filter((c) => c.status !== 'RESOLVED').length;

  // Generate role-specific bottom navigation tabs
  const getTabs = () => {
    if (!isAuthenticated || !user) {
      return [
        { path: '/portal', label: 'Portals', icon: FaBuildingColumns },
        { path: '/map', label: 'Map', icon: FaMapLocationDot },
        { path: '/kiosk', label: 'Scan QR', icon: FaQrcode },
        { path: '/login', label: 'Sign In', icon: FaRightToBracket },
      ];
    }

    switch (role) {
      case 'CITIZEN':
        return [
          { path: '/citizen', label: 'Scan & Report', icon: FaQrcode },
          { path: '/map', label: 'Nearby Map', icon: FaMapLocationDot },
          { path: '/kiosk', label: 'Kiosk', icon: FaClipboardList },
          { path: '/portal', label: 'Portal', icon: FaUser },
        ];
      case 'WORKER':
        return [
          { path: '/worker', label: 'Cleaning Tasks', icon: FaBroom },
          { path: '/staff-duty', label: 'Shift Timer', icon: FaClock },
          { path: '/map', label: 'Route Map', icon: FaMapLocationDot },
          { path: '/portal', label: 'Profile', icon: FaUser },
        ];
      case 'MUNICIPAL_LEAD':
        return [
          { path: '/lead', label: 'Ward Centers', icon: FaBuildingColumns },
          { path: '/complaints', label: 'Grievances', icon: FaClipboardList, badge: pendingComplaints },
          { path: '/staff', label: 'Field Staff', icon: FaUsers },
          { path: '/map', label: 'Ward Map', icon: FaMapLocationDot },
        ];
      case 'ADMIN':
        return [
          { path: '/admin', label: 'Admin Console', icon: FaUserShield },
          { path: '/facilities', label: 'Registry', icon: FaBuildingColumns },
          { path: '/complaints', label: 'Grievances', icon: FaClipboardList, badge: pendingComplaints },
          { path: '/map', label: 'City Map', icon: FaMapLocationDot },
        ];
      default:
        return [
          { path: '/portal', label: 'Portals', icon: FaBuildingColumns },
          { path: '/map', label: 'Map', icon: FaMapLocationDot },
          { path: '/citizen', label: 'Report', icon: FaQrcode },
          { path: '/login', label: 'Sign In', icon: FaRightToBracket },
        ];
    }
  };

  const tabs = getTabs();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-2xl px-2 py-2 flex items-center justify-around md:hidden safe-area-bottom">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = location.pathname === tab.path;

        return (
          <NavLink
            key={tab.path}
            to={tab.path}
            className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-2xl transition-all cursor-pointer relative min-h-[56px] active:scale-95 ${
              isActive
                ? 'text-emerald-700 font-black'
                : 'text-slate-500 hover:text-slate-900 font-semibold'
            }`}
          >
            <div className="relative">
              <Icon className={`w-6 h-6 transition-transform duration-200 ${isActive ? 'scale-115 text-emerald-700' : 'text-slate-500'}`} />
              {tab.badge > 0 && (
                <span className="absolute -top-1.5 -right-2.5 px-2 py-0.5 bg-red-500 text-white text-[10px] font-black rounded-full animate-pulse shadow-md">
                  {tab.badge}
                </span>
              )}
            </div>
            <span className={`text-xs mt-1 leading-tight tracking-tight whitespace-nowrap ${isActive ? 'font-black text-emerald-800' : 'font-medium'}`}>
              {tab.label}
            </span>
          </NavLink>
        );
      })}
    </nav>
  );
}
