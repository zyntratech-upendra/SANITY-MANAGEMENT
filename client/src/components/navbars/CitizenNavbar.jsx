import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import SwachhBharatLogo from '../gov/SwachhBharatLogo';
import {
  FaQrcode,
  FaMapLocationDot,
  FaMobileScreenButton,
  FaArrowRightFromBracket,
  FaBars,
} from 'react-icons/fa6';

export default function CitizenNavbar({ onToggleMobile }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const links = [
    { path: '/citizen', label: 'Scan QR & Report', icon: FaQrcode },
    { path: '/map', label: 'Nearby Toilets Map', icon: FaMapLocationDot },
    { path: '/kiosk', label: 'Public Kiosk', icon: FaMobileScreenButton },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-purple-200 shadow-sm w-full">
      {/* Main Citizen Navbar - Guaranteed Single Line & 100% Responsive on All Devices */}
      <div className="w-full px-2.5 sm:px-5 lg:px-6 xl:px-8 py-2 sm:py-2.5 flex items-center justify-between gap-2 sm:gap-3 lg:gap-4 flex-nowrap overflow-x-hidden">
        {/* Brand */}
        <div
          onClick={() => navigate('/citizen')}
          className="flex items-center gap-2 sm:gap-2.5 cursor-pointer group shrink-0 min-w-0"
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-purple-600 p-1 flex items-center justify-center shadow-md shadow-purple-600/25 group-hover:scale-105 transition-transform duration-200 shrink-0">
            <img
              src="/logo.png"
              alt="Sanity Management Logo"
              className="w-full h-full object-contain drop-shadow"
            />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs sm:text-base lg:text-lg font-black tracking-tight text-slate-900 group-hover:text-purple-700 transition-colors truncate">
                SANITY MANAGEMENT
              </span>
              <span className="text-[8px] sm:text-[10px] font-black uppercase bg-purple-100 text-purple-800 px-1.5 sm:px-2 py-0.5 rounded-full border border-purple-300 shrink-0">
                CITIZEN
              </span>
            </div>
            <p className="hidden 2xl:block text-[10px] sm:text-[11px] text-slate-500 font-semibold truncate max-w-[200px] sm:max-w-none">
              Public Sanitation & QR Grievance Hub
            </p>
          </div>
        </div>

        {/* Citizen Links */}
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
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                  }`
                }
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{link.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Citizen Profile & Logout */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          <div className="hidden xl:block text-right">
            <span className="block text-xs sm:text-sm font-extrabold text-slate-800 leading-tight truncate max-w-[140px] 2xl:max-w-none">
              {user?.name || 'Citizen'}
            </span>
            <span className="text-[11px] text-purple-700 font-mono font-bold">
              Verified Citizen
            </span>
          </div>

          <button
            onClick={() => {
              logout();
              navigate('/portal');
            }}
            className="flex px-2.5 sm:px-3.5 py-1.5 bg-slate-100 hover:bg-red-50 hover:text-red-700 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-700 items-center gap-1.5 cursor-pointer transition-colors active:scale-95 shrink-0 shadow-2xs"
            title="Sign Out"
          >
            <FaArrowRightFromBracket className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>

          {/* Mobile/Tablet Sidebar Toggle Button */}
          <button
            type="button"
            onClick={onToggleMobile}
            className="lg:hidden p-2 sm:p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer flex items-center justify-center border border-slate-200 shadow-2xs shrink-0"
            aria-label="Open mobile navigation menu"
          >
            <FaBars className="w-4 h-4 sm:w-5 sm:h-5 text-slate-800" />
          </button>
        </div>
      </div>
    </header>
  );
}

