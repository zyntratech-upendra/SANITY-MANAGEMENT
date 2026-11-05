import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLocationCoords } from '../context/LocationContext';
import SanitationHeroIllustration from '../components/gov/SanitationHeroIllustration';
import SwachhBharatLogo from '../components/gov/SwachhBharatLogo';
import DigitalIndiaLogo from '../components/gov/DigitalIndiaLogo';
import EmblemOfIndia from '../components/gov/EmblemOfIndia';
import {
  FaUserShield,
  FaBuildingColumns,
  FaBroom,
  FaQrcode,
  FaArrowRight,
  FaLocationCrosshairs,
  FaShieldHalved,
  FaMapLocationDot,
  FaCircleCheck,
  FaTowerBroadcast,
  FaStar,
} from 'react-icons/fa6';

export default function PortalGatewayPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { coords, hasLiveGps, requestLocation } = useLocationCoords();

  const portals = [
    {
      id: 'admin',
      role: 'ADMIN',
      title: 'Chief Commissioner Admin Portal',
      subtitle: 'RMC & RTIH Executive Command',
      description: 'Register city public toilet complexes, allocate zones, configure smart sensors, supervise municipal leads, and ensure urban sanitation compliance.',
      icon: FaUserShield,
      color: 'emerald',
      loginRoute: '/login/admin',
      badge: 'RMC Directorate',
      accessBadge: 'admin@swachh.gov.in / admin123',
      illustration: '/illustrations/undraw_dashboard.svg',
      gif: '/illustrations/iot_radar_telemetry.gif',
    },
    {
      id: 'lead',
      role: 'MUNICIPAL_LEAD',
      title: 'Municipal Ward Lead Portal',
      subtitle: 'Municipal Zonal Ward Supervision',
      description: 'Supervise allotted ward sanitation blocks, dispatch rapid cleaning teams, and oversee citizen grievance resolutions in real time.',
      icon: FaBuildingColumns,
      color: 'blue',
      loginRoute: '/login/lead',
      badge: 'Zonal Lead Officer',
      accessBadge: 'Allotted by Chief Commissioner',
      illustration: '/illustrations/undraw_co_workers.svg',
      gif: '/illustrations/iot_radar_telemetry.gif',
    },
    {
      id: 'worker',
      role: 'WORKER',
      title: 'Sanitation Worker Duty App',
      subtitle: 'Field Operations & Rapid Cleaning',
      description: 'Run live cleaning stopwatches, complete 5-point toilet inspection checklists, replenish consumables, and keep facilities pristine.',
      icon: FaBroom,
      color: 'amber',
      loginRoute: '/login/worker',
      badge: 'Field Duty Crew',
      accessBadge: 'Registered by Zonal Lead',
      illustration: '/illustrations/undraw_clean_up.svg',
      gif: '/illustrations/worker_dispatch.gif',
    },
    {
      id: 'citizen',
      role: 'CITIZEN',
      title: 'Citizen & Public Hygiene Portal',
      subtitle: 'Public Restroom QR Grievances & Navigation',
      description: 'Scan public toilet placards, find nearest clean restrooms via GPS, submit cleanliness ratings, and view city hygiene facilities.',
      icon: FaQrcode,
      color: 'purple',
      loginRoute: '/login/citizen',
      badge: 'Public Citizen Access',
      accessBadge: 'Open Citizen Registration',
      illustration: '/illustrations/undraw_qr_code_scan.svg',
      gif: '/illustrations/scanner_laser.gif',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto py-2 space-y-6 animate-in fade-in duration-300">
      {/* Official Government Hero Section with unDraw Vector Illustration */}
      <div className="bg-gradient-to-br from-white via-slate-50 to-emerald-50/40 rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm relative overflow-hidden">
        {/* Tricolor Accent Top Line */}
        <div className="absolute top-0 left-0 right-0 h-1 flex">
          <div className="flex-1 bg-[#FF9933]" />
          <div className="flex-1 bg-[#FFFFFF]" />
          <div className="flex-1 bg-[#138808]" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left Hero Column */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-[11px] font-black uppercase tracking-wider text-emerald-900 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300 inline-flex items-center gap-1.5 shadow-xs">
                <FaShieldHalved className="w-3.5 h-3.5 text-emerald-700" /> Swachh Bharat Mission (Urban 2.0)
              </span>
              <span className="text-xs text-slate-700 font-bold bg-amber-100/80 text-amber-900 px-2.5 py-0.5 rounded-full border border-amber-300">
                Rajamahendravaram Municipal Corporation Initiative
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-tight tracking-tight">
              <span className="text-emerald-700 block text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
                Smart Public Sanitation & Restroom Monitoring Platform
              </span>
              <span className="block text-xl sm:text-2xl lg:text-3xl text-slate-700 font-extrabold mt-1.5">
                Civic Hygiene Intelligence, IoT Odor Telemetry & Rapid Worker Dispatch
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium max-w-xl">
              An AI- and IoT-enabled civic intelligence infrastructure connecting citizens, municipal ward supervisors, and rapid-response sanitation specialists through QR grievances, IoT odor telemetry, and automated task dispatch across public restrooms and sacred ghat corridors.
            </p>

            {/* Quick Action Pills & GPS Status */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <div className="bg-white border border-slate-200 px-3.5 py-2 rounded-2xl flex items-center gap-2.5 shadow-xs text-xs">
                <FaLocationCrosshairs className={`w-4 h-4 ${hasLiveGps ? 'text-emerald-600' : 'text-amber-500'}`} />
                <div>
                  <span className="block text-[10px] font-extrabold uppercase text-slate-400">
                    {hasLiveGps ? 'Live GPS Active' : 'Rajamahendravaram Ghats'}
                  </span>
                  <span className="font-mono font-bold text-slate-900 text-xs">
                    {coords.lat.toFixed(4)}° N, {coords.lng.toFixed(4)}° E
                  </span>
                </div>
                {!hasLiveGps && (
                  <button
                    onClick={requestLocation}
                    className="ml-1 px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-[10px] font-bold cursor-pointer transition-colors"
                  >
                    Sync GPS
                  </button>
                )}
              </div>

              <Link
                to="/map"
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold rounded-2xl flex items-center gap-2 shadow-xs cursor-pointer transition-colors"
              >
                <FaMapLocationDot className="w-3.5 h-3.5 text-emerald-400" />
                <span>Explore City Restrooms Map</span>
              </Link>
            </div>
          </div>

          {/* Right Hero Column: unDraw Vector Illustration */}
          <div className="lg:col-span-5 flex justify-center">
            <SanitationHeroIllustration className="w-full max-w-md h-auto" />
          </div>
        </div>
      </div>

      {/* 4 Separate Portal Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {portals.map((portal) => {
          const Icon = portal.icon;
          const isCurrentUserRole = user?.role === portal.role;

          return (
            <div
              key={portal.id}
              onClick={() => navigate(portal.loginRoute)}
              className="card-interactive group bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 hover:border-emerald-500 shadow-xs hover:shadow-xl cursor-pointer flex flex-col justify-between relative overflow-hidden transition-all duration-300"
            >
              <div className="flex items-start justify-between gap-4">
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-md transition-all duration-300 group-hover:scale-105 ${
                    portal.color === 'emerald'
                      ? 'bg-gradient-to-br from-emerald-600 to-teal-700 shadow-emerald-600/25'
                      : portal.color === 'blue'
                      ? 'bg-gradient-to-br from-blue-600 to-indigo-700 shadow-blue-600/25'
                      : portal.color === 'amber'
                      ? 'bg-gradient-to-br from-amber-500 to-orange-600 shadow-amber-600/25'
                      : 'bg-gradient-to-br from-purple-600 to-violet-700 shadow-purple-600/25'
                  }`}
                >
                  <Icon className="w-7 h-7" />
                </div>

                <div className="flex flex-col items-end">
                  <span
                    className={`text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full ${
                      portal.color === 'emerald'
                        ? 'bg-emerald-100 text-emerald-800'
                        : portal.color === 'blue'
                        ? 'bg-blue-100 text-blue-800'
                        : portal.color === 'amber'
                        ? 'bg-amber-100 text-amber-900'
                        : 'bg-purple-100 text-purple-800'
                    }`}
                  >
                    {portal.badge}
                  </span>
                  {isCurrentUserRole && (
                    <span className="text-[11px] text-emerald-700 font-extrabold mt-1.5 flex items-center gap-1 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      <FaCircleCheck className="w-3 h-3" /> Active Session
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest block">
                  {portal.subtitle}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1 group-hover:text-emerald-700 transition-colors leading-tight">
                  {portal.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed font-medium">
                  {portal.description}
                </p>
              </div>

              {/* unDraw Illustration & Animated GIF Preview */}
              <div className="mt-4 p-3 bg-slate-50/80 rounded-2xl border border-slate-100 flex items-center justify-between gap-3 group-hover:bg-slate-100/70 transition-colors">
                <div className="flex items-center gap-2.5">
                  <img
                    src={portal.illustration}
                    alt={`${portal.title} unDraw`}
                    className="h-16 w-auto max-w-[130px] object-contain transition-transform group-hover:scale-105"
                    loading="lazy"
                  />
                  <span className="text-[11px] font-bold text-slate-500">
                    Smart Operations
                  </span>
                </div>
                <img
                  src={portal.gif}
                  alt={`${portal.title} Animated`}
                  className="h-14 w-14 rounded-xl border border-slate-200 shadow-xs object-cover shrink-0"
                  loading="lazy"
                />
              </div>

              <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs sm:text-sm font-bold text-slate-700">
                <span className="text-slate-500 text-xs font-medium flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-slate-700 font-semibold">{portal.accessBadge}</span>
                </span>
                <span
                  className={`flex items-center gap-1.5 text-xs sm:text-sm font-black transition-all group-hover:translate-x-1 ${
                    portal.color === 'emerald'
                      ? 'text-emerald-700'
                      : portal.color === 'blue'
                      ? 'text-blue-700'
                      : portal.color === 'amber'
                      ? 'text-amber-700'
                      : 'text-purple-700'
                  }`}
                >
                  <span>Enter Portal</span>
                  <FaArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

