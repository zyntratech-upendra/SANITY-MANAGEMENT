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
} from 'react-icons/fa6';

export default function PublicNavbar() {
  const navigate = useNavigate();

  const links = [
    { path: '/portal', label: 'Access Portals', icon: FaBuildingColumns },
    { path: '/map', label: 'Public GIS Map', icon: FaMapLocationDot },
    { path: '/kiosk', label: 'Scan Placard QR', icon: FaQrcode },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm w-full">
      {/* Main Public Navbar - Full Width End-to-End & Single Line */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-3 lg:gap-6 flex-nowrap">
        {/* Brand */}
        <div
          onClick={() => navigate('/portal')}
          className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group shrink-0"
        >
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 p-1 flex items-center justify-center shadow-md shadow-emerald-600/25 group-hover:scale-105 transition-transform duration-200 shrink-0">
            <img
              src="/logo.png"
              alt="Sanity Management Logo"
              className="w-full h-full object-contain drop-shadow"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-base sm:text-lg font-black tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors whitespace-nowrap">
                SANITY MANAGEMENT
              </span>
              <span className="text-[9px] sm:text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-300 whitespace-nowrap">
                CIVIC PORTAL
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-500 font-semibold truncate max-w-[220px] sm:max-w-none">
              Smart Public Restroom Monitoring & Sanitation Platform
            </p>
          </div>
        </div>

        {/* Public Links */}
        <nav className="flex items-center gap-1 sm:gap-1.5 bg-slate-100/90 p-1 sm:p-1.5 rounded-2xl border border-slate-200 shrink-0 overflow-x-auto">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20'
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

        {/* Portal Sign In CTA & Logos */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="hidden xl:block">
            <SwachhBharatLogo className="h-7 w-auto" showSlogan={false} />
          </div>

          <Link
            to="/portal"
            className="px-3.5 sm:px-4 py-2 bg-gradient-to-r from-emerald-700 to-teal-700 hover:from-emerald-800 hover:to-teal-800 text-white rounded-xl text-xs sm:text-sm font-black flex items-center gap-2 shadow-sm shadow-emerald-700/20 active:scale-95 cursor-pointer transition-all whitespace-nowrap"
          >
            <FaRightToBracket className="w-3.5 h-3.5" />
            <span>Select Role Portal</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

