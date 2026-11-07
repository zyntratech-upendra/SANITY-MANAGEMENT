import React from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import SwachhBharatLogo from '../gov/SwachhBharatLogo';
import DigitalIndiaLogo from '../gov/DigitalIndiaLogo';
import {
  FaRestroom,
  FaMapLocationDot,
  FaQrcode,
  FaBuildingColumns,
  FaRightToBracket,
  FaBars,
} from 'react-icons/fa6';

export default function PublicNavbar({ onToggleMobile }) {
  const navigate = useNavigate();

  const links = [
    { path: '/portal', label: 'Access Portals', icon: FaBuildingColumns },
    { path: '/map', label: 'Public GIS Map', icon: FaMapLocationDot },
    { path: '/kiosk', label: 'Scan Placard QR', icon: FaQrcode },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm w-full">
      {/* Main Public Navbar - Guaranteed Single Line & 100% Responsive on All Devices */}
      <div className="w-full px-2.5 sm:px-5 lg:px-6 xl:px-8 py-2 sm:py-2.5 flex items-center justify-between gap-2 sm:gap-3 lg:gap-4 flex-nowrap overflow-x-hidden">
        {/* Brand */}
        <div
          onClick={() => navigate('/portal')}
          className="flex items-center gap-2 sm:gap-2.5 cursor-pointer group shrink-0 min-w-0"
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 p-1 flex items-center justify-center shadow-md shadow-emerald-600/25 group-hover:scale-105 transition-transform duration-200 shrink-0">
            <img
              src="/logo.png"
              alt="Sanity Management Logo"
              className="w-full h-full object-contain drop-shadow"
            />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs sm:text-base lg:text-lg font-black tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors truncate">
                SANITY MANAGEMENT
              </span>
              <span className="text-[8px] sm:text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 px-1.5 sm:px-2 py-0.5 rounded-full border border-emerald-300 shrink-0">
                CIVIC
              </span>
            </div>
            <p className="hidden 2xl:block text-[10px] sm:text-[11px] text-slate-500 font-semibold truncate max-w-[180px] sm:max-w-none">
              Smart Public Restroom Monitoring & Sanitation Platform
            </p>
          </div>
        </div>

        {/* Public Desktop Links */}
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
                <span>{link.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Right CTA & Mobile Toggle */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          <div className="hidden xl:block">
            <SwachhBharatLogo className="h-7 w-auto" showSlogan={false} />
          </div>

          <Link
            to="/portal"
            className="flex px-2.5 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-emerald-700 to-teal-700 hover:from-emerald-800 hover:to-teal-800 text-white rounded-xl text-xs sm:text-sm font-black items-center gap-1.5 sm:gap-2 shadow-sm shadow-emerald-700/20 active:scale-95 cursor-pointer transition-all whitespace-nowrap shrink-0"
          >
            <FaRightToBracket className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline">Select Role Portal</span>
            <span className="sm:hidden">Portals</span>
          </Link>

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

