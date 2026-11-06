import React from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLocationCoords } from '../context/LocationContext';
import { useSanitation } from '../context/SanitationContext';
import SwachhBharatLogo from './gov/SwachhBharatLogo';
import DigitalIndiaLogo from './gov/DigitalIndiaLogo';
import {
  FaXmark,
  FaBuildingColumns,
  FaMapLocationDot,
  FaQrcode,
  FaUserShield,
  FaUsers,
  FaClipboardList,
  FaChartLine,
  FaRadio,
  FaBroom,
  FaClock,
  FaRightToBracket,
  FaArrowRightFromBracket,
  FaLocationCrosshairs,
  FaShieldHalved,
  FaUser,
  FaCircleCheck,
} from 'react-icons/fa6';

export default function MobileSidebarDrawer({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { user, role, isAuthenticated, logout } = useAuth();
  const { coords, hasLiveGps, requestLocation } = useLocationCoords();
  const { complaints } = useSanitation();

  const pendingComplaints = complaints.filter((c) => c.status !== 'RESOLVED').length;

  if (!isOpen) return null;

  // Role-specific drawer links
  const getLinks = () => {
    if (!isAuthenticated || !user) {
      return [
        { path: '/portal', label: 'Access Portals Gateway', icon: FaBuildingColumns },
        { path: '/map', label: 'Public GIS Restroom Map', icon: FaMapLocationDot },
        { path: '/kiosk', label: 'Scan Placard QR Code', icon: FaQrcode },
        { path: '/citizen', label: 'Citizen Grievance Hub', icon: FaClipboardList },
      ];
    }

    switch (role) {
      case 'ADMIN':
        return [
          { path: '/admin', label: 'Admin Command Console', icon: FaUserShield },
          { path: '/map', label: 'City Public Restroom GIS', icon: FaMapLocationDot },
          { path: '/facilities', label: 'Toilet Complexes Registry', icon: FaBuildingColumns },
          { path: '/complaints', label: 'Citizen Grievances', icon: FaClipboardList, badge: pendingComplaints },
          { path: '/command', label: 'Executive Analytics', icon: FaChartLine },
          { path: '/iot', label: 'IoT Odor Telemetry Stream', icon: FaRadio },
          { path: '/staff', label: 'Sanitation Staff Directory', icon: FaUsers },
        ];
      case 'MUNICIPAL_LEAD':
        return [
          { path: '/lead', label: 'Ward Sanitation Centers', icon: FaBuildingColumns },
          { path: '/map', label: 'Ward GIS Restroom Map', icon: FaMapLocationDot },
          { path: '/complaints', label: 'Ward Grievances', icon: FaClipboardList, badge: pendingComplaints },
          { path: '/staff', label: 'Sanitation Staff Management', icon: FaUsers },
        ];
      case 'WORKER':
        return [
          { path: '/worker', label: 'Cleaning Tasks & Timer', icon: FaBroom },
          { path: '/map', label: 'Facility Route Map', icon: FaMapLocationDot },
          { path: '/staff-duty', label: 'Duty Shift Log', icon: FaClock },
        ];
      case 'CITIZEN':
        return [
          { path: '/citizen', label: 'Scan & Report Grievance', icon: FaQrcode },
          { path: '/map', label: 'Nearby Restrooms GIS', icon: FaMapLocationDot },
          { path: '/kiosk', label: 'Quick QR Placard Scanner', icon: FaClipboardList },
          { path: '/portal', label: 'Civic Portals Hub', icon: FaBuildingColumns },
        ];
      default:
        return [
          { path: '/portal', label: 'Access Portals', icon: FaBuildingColumns },
          { path: '/map', label: 'Public GIS Map', icon: FaMapLocationDot },
        ];
    }
  };

  const links = getLinks();

  const getRoleBadge = () => {
    switch (role) {
      case 'ADMIN':
        return { label: 'CHIEF COMMISSIONER', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
      case 'MUNICIPAL_LEAD':
        return { label: 'MUNICIPAL WARD LEAD', color: 'bg-blue-100 text-blue-800 border-blue-300' };
      case 'WORKER':
        return { label: 'FIELD SANITATION SPECIALIST', color: 'bg-amber-100 text-amber-900 border-amber-300' };
      case 'CITIZEN':
        return { label: 'VERIFIED CITIZEN', color: 'bg-purple-100 text-purple-800 border-purple-300' };
      default:
        return { label: 'PUBLIC GUEST ACCESS', color: 'bg-slate-100 text-slate-700 border-slate-300' };
    }
  };

  const roleBadge = getRoleBadge();

  return (
    <div className="fixed inset-0 z-50 overflow-hidden select-none animate-in fade-in duration-200">
      {/* Dark Translucent Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
      />

      {/* Slide-over Drawer (Width: 320px - 85vw) */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10 z-50">
        <div className="w-80 max-w-[85vw] bg-white shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-300">
          
          {/* Drawer Header */}
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 p-1 flex items-center justify-center shrink-0 shadow-md">
                <img
                  src="/logo.png"
                  alt="Sanity Management Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="block text-sm font-black tracking-tight text-white leading-tight">
                  SANITY MANAGEMENT
                </span>
                <span className="text-[10px] text-emerald-400 font-semibold tracking-wide">
                  Smart Sanitation OS
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Close Navigation Sidebar"
            >
              <FaXmark className="w-5 h-5" />
            </button>
          </div>

          {/* User Profile / Guest Strip */}
          <div className="p-4 bg-slate-50 border-b border-slate-200">
            {isAuthenticated && user ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-sm">
                    {user.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-black text-slate-900 truncate">{user.name}</div>
                    <div className="text-xs text-slate-500 font-medium truncate">{user.email}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${roleBadge.color}`}>
                    {roleBadge.label}
                  </span>
                  {user.ward && (
                    <span className="text-[11px] font-bold text-slate-600">
                      {user.ward}
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <span className="block text-xs font-black text-slate-800 uppercase tracking-wider">
                    Public Civic Navigation
                  </span>
                  <span className="text-[11px] text-slate-500">Citizen & Municipal Services</span>
                </div>
                <Link
                  to="/portal"
                  onClick={onClose}
                  className="px-3 py-1.5 bg-emerald-700 text-white rounded-xl text-xs font-bold hover:bg-emerald-800 transition-colors shadow-xs"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>

          {/* Nav Links Scrollable Section */}
          <div className="flex-1 overflow-y-auto p-3 space-y-1">
            <div className="px-2 py-1 text-[10px] font-black uppercase tracking-wider text-slate-400">
              Menu Navigation
            </div>

            {links.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{link.label}</span>
                  </div>
                  {link.badge > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-red-500 text-white">
                      {link.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}

            {/* Quick Access Portals for Authenticated users */}
            {isAuthenticated && (
              <div className="pt-3 border-t border-slate-100 space-y-1">
                <div className="px-2 py-1 text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Switch Role / Portal
                </div>
                <Link
                  to="/portal"
                  onClick={onClose}
                  className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  <FaBuildingColumns className="w-3.5 h-3.5 text-slate-400" />
                  <span>Portal Gateway</span>
                </Link>
                <Link
                  to="/map"
                  onClick={onClose}
                  className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  <FaMapLocationDot className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Public Restrooms Map</span>
                </Link>
              </div>
            )}
          </div>

          {/* Drawer Footer Controls */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-3">
            {/* GPS Indicator */}
            <button
              type="button"
              onClick={requestLocation}
              className="w-full py-2 px-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between text-xs text-slate-600 hover:text-slate-900 transition-colors shadow-2xs"
            >
              <span className="flex items-center gap-2">
                <FaLocationCrosshairs className={`w-3.5 h-3.5 ${hasLiveGps ? 'text-emerald-600 animate-pulse' : 'text-amber-500'}`} />
                <span className="font-semibold">GPS:</span>
              </span>
              <span className="font-mono font-bold text-slate-800">
                {coords.lat.toFixed(3)}°, {coords.lng.toFixed(3)}°
              </span>
            </button>

            {/* Logout / Switch Role CTA */}
            {isAuthenticated ? (
              <button
                type="button"
                onClick={() => {
                  logout();
                  onClose();
                  navigate('/portal');
                }}
                className="w-full py-2.5 px-4 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <FaArrowRightFromBracket className="w-3.5 h-3.5" />
                <span>Sign Out of Account</span>
              </button>
            ) : (
              <Link
                to="/portal"
                onClick={onClose}
                className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <FaRightToBracket className="w-3.5 h-3.5" />
                <span>Sign In to Role Portal</span>
              </Link>
            )}

            {/* Sponsoring Authority Tag */}
            <div className="pt-1 flex items-center justify-center gap-2 text-[10px] text-slate-400 text-center">
              <span>Swachh Bharat 2.0</span>
              <span>•</span>
              <span>RMC × RTIH</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

