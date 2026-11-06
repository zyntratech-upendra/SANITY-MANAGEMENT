import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSanitation } from '../../context/SanitationContext';
import SwachhBharatLogo from '../gov/SwachhBharatLogo';
import {
  FaUserShield,
  FaBuildingColumns,
  FaMapLocationDot,
  FaClipboardList,
  FaChartLine,
  FaRadio,
  FaArrowRightFromBracket,
  FaBars,
} from 'react-icons/fa6';

export default function AdminNavbar({ onToggleMobile }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { complaints } = useSanitation();

  const pendingComplaints = complaints.filter((c) => c.status !== 'RESOLVED').length;

  const links = [
    { path: '/admin', label: 'Admin Console', shortLabel: 'Console', icon: FaUserShield },
    { path: '/map', label: 'City GIS Map', shortLabel: 'GIS Map', icon: FaMapLocationDot },
    { path: '/facilities', label: 'Toilet Complexes', shortLabel: 'Complexes', icon: FaBuildingColumns },
    { path: '/complaints', label: 'Grievances', shortLabel: 'Grievances', icon: FaClipboardList, badge: pendingComplaints },
    { path: '/command', label: 'Analytics', shortLabel: 'Analytics', icon: FaChartLine },
    { path: '/iot', label: 'IoT Stream', shortLabel: 'IoT Stream', icon: FaRadio },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-200 shadow-sm w-full">
      {/* Main Admin Navbar - Guaranteed Single Line on Laptop & Desktop */}
      <div className="w-full px-3 sm:px-5 lg:px-6 xl:px-8 py-2 sm:py-2.5 flex items-center justify-between gap-2 sm:gap-3 lg:gap-4 flex-nowrap">
        {/* Brand */}
        <div
          onClick={() => navigate('/admin')}
          className="flex items-center gap-2 sm:gap-2.5 cursor-pointer group shrink-0"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-emerald-700 p-1 flex items-center justify-center shadow-md shadow-emerald-700/25 group-hover:scale-105 transition-transform duration-200 shrink-0">
            <img
              src="/logo.png"
              alt="Sanity Management Logo"
              className="w-full h-full object-contain drop-shadow"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm sm:text-base lg:text-lg font-black tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors whitespace-nowrap">
                SANITY MANAGEMENT
              </span>
              <span className="text-[9px] sm:text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 px-1.5 sm:px-2 py-0.5 rounded-full border border-emerald-300 whitespace-nowrap">
                ADMIN
              </span>
            </div>
            <p className="hidden 2xl:block text-[10px] sm:text-[11px] text-slate-500 font-semibold truncate max-w-[200px] sm:max-w-none">
              Chief Commissioner Command Directorate
            </p>
          </div>
        </div>

        {/* Admin Specific Links (Visible on Laptop >= 1024px & Desktop) */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-100/90 p-1 rounded-2xl border border-slate-200 shrink-0">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-2.5 xl:px-3.5 py-1.5 rounded-xl text-xs xl:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                  }`
                }
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden xl:inline">{link.label}</span>
                <span className="xl:hidden">{link.shortLabel}</span>
                {link.badge > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 text-[10px] font-black rounded-full bg-red-500 text-white animate-pulse">
                    {link.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Admin Profile & Logout */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="hidden xl:block text-right">
            <span className="block text-xs sm:text-sm font-extrabold text-slate-800 leading-tight truncate max-w-[140px] 2xl:max-w-none">
              {user?.name || 'Chief Commissioner'}
            </span>
            <span className="text-[11px] text-emerald-700 font-mono font-bold">
              Directorate Lead
            </span>
          </div>

          <button
            onClick={() => {
              logout();
              navigate('/portal');
            }}
            className="flex px-3 sm:px-3.5 py-1.5 bg-slate-100 hover:bg-red-50 hover:text-red-700 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-700 items-center gap-1.5 sm:gap-2 cursor-pointer transition-colors active:scale-95 shrink-0 shadow-2xs"
            title="Sign Out"
          >
            <FaArrowRightFromBracket className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>

          {/* Mobile/Tablet Sidebar Toggle Button */}
          <button
            type="button"
            onClick={onToggleMobile}
            className="lg:hidden p-2 sm:p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer flex items-center justify-center border border-slate-200 shadow-2xs shrink-0"
            aria-label="Open mobile navigation menu"
          >
            <FaBars className="w-5 h-5 text-slate-800" />
          </button>
        </div>
      </div>
    </header>
  );
}

