import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import SwachhBharatLogo from '../gov/SwachhBharatLogo';
import {
  FaBroom,
  FaMapLocationDot,
  FaClock,
  FaArrowRightFromBracket,
} from 'react-icons/fa6';

export default function WorkerNavbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const links = [
    { path: '/worker', label: 'Cleaning Tasks & Timer', icon: FaBroom },
    { path: '/map', label: 'Facility Route Map', icon: FaMapLocationDot },
    { path: '/staff-duty', label: 'Duty Shift Log', icon: FaClock },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-200 shadow-sm w-full">
      {/* Main Worker Navbar - End to End & Single Line */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-3 lg:gap-6 flex-nowrap">
        {/* Brand */}
        <div
          onClick={() => navigate('/worker')}
          className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group shrink-0"
        >
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-amber-600 p-1 flex items-center justify-center shadow-md shadow-amber-600/25 group-hover:scale-105 transition-transform duration-200 shrink-0">
            <img
              src="/logo.png"
              alt="Sanity Management Logo"
              className="w-full h-full object-contain drop-shadow"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-base sm:text-lg font-black tracking-tight text-slate-900 group-hover:text-amber-700 transition-colors whitespace-nowrap">
                SANITY MANAGEMENT
              </span>
              <span className="text-[9px] sm:text-[10px] font-black uppercase bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full border border-amber-300 whitespace-nowrap">
                FIELD CREW
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-500 font-semibold truncate max-w-[200px] sm:max-w-none">
              Sanitation Worker Duty & Rapid Ops App
            </p>
          </div>
        </div>

        {/* Worker Links */}
        <nav className="flex items-center gap-1 sm:gap-1.5 bg-slate-100/90 p-1 sm:p-1.5 rounded-2xl border border-slate-200 shrink-0 overflow-x-auto">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                  }`
                }
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{link.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Worker Profile & Sign Out */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="hidden sm:block text-right">
            <span className="block text-sm font-extrabold text-slate-800 leading-tight">
              {user?.name || 'Sanitation Specialist'}
            </span>
            <span className="text-xs text-emerald-700 font-mono font-bold flex items-center justify-end gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              On Duty
            </span>
          </div>

          <button
            onClick={() => {
              logout();
              navigate('/portal');
            }}
            className="px-3.5 py-1.5 bg-slate-100 hover:bg-red-50 hover:text-red-700 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-600 flex items-center gap-2 cursor-pointer transition-colors active:scale-95"
            title="Sign Out"
          >
            <FaArrowRightFromBracket className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">End Shift</span>
          </button>
        </div>
      </div>
    </header>
  );
}

