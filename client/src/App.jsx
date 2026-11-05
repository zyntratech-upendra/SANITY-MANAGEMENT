import React, { useState, useEffect } from 'react';
import { BrowserRouter, useLocation, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SanitationProvider, useSanitation } from './context/SanitationContext';
import { LocationProvider, useLocationCoords } from './context/LocationContext';

import RoleBasedNavbar from './components/RoleBasedNavbar';
import MobileBottomBar from './components/MobileBottomBar';
import SplashScreen from './components/SplashScreen';
import EmblemOfIndia from './components/gov/EmblemOfIndia';
import SwachhBharatLogo from './components/gov/SwachhBharatLogo';
import DigitalIndiaLogo from './components/gov/DigitalIndiaLogo';
import AppRoutes from './routes/AppRoutes';
import FacilityRegisterModal from './components/FacilityRegisterModal';
import QRCodeModal from './components/QRCodeModal';

import { ShieldAlert, AlertTriangle, CheckCircle2, X } from 'lucide-react';
import { FaLocationCrosshairs, FaSatellite, FaShieldHalved } from 'react-icons/fa6';

function AppLayout() {
  const {
    staffList,
    isRegisterOpen,
    setIsRegisterOpen,
    createFacility,
    qrModalFacility,
    setQrModalFacility,
    liveToast,
    setLiveToast,
  } = useSanitation();

  const { coords, hasLiveGps, requestLocation } = useLocationCoords();
  const location = useLocation();

  // Dynamic Document Title for SEO and Browser Tabs
  useEffect(() => {
    const path = location.pathname;
    if (path.startsWith('/admin')) {
      document.title = 'Sanity Management | Chief Commissioner Admin Console';
    } else if (path.startsWith('/lead')) {
      document.title = 'Sanity Management | Municipal Ward Lead Portal';
    } else if (path.startsWith('/worker')) {
      document.title = 'Sanity Management | Sanitation Worker Duty App';
    } else if (path.startsWith('/citizen')) {
      document.title = 'Sanity Management | Citizen Public Sanitation Portal';
    } else if (path.startsWith('/map')) {
      document.title = 'Sanity Management | Public GIS Sanitation & Restroom Map';
    } else if (path.startsWith('/login')) {
      document.title = 'Sanity Management | Government Portal Login';
    } else {
      document.title = 'Sanity Management | Smart Public Restroom & Sanitation Platform';
    }
  }, [location.pathname]);

  // Flash / Splash Screen State
  const [showSplash, setShowSplash] = useState(() => {
    return !sessionStorage.getItem('swachh_splash_seen');
  });

  const handleSplashComplete = () => {
    sessionStorage.setItem('swachh_splash_seen', 'true');
    setShowSplash(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col font-sans selection:bg-emerald-600 selection:text-white">
      {/* Animated Flash / Splash Screen */}
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}

      {/* Role-Separated Header Navigation */}
      <RoleBasedNavbar />

      {/* Real-time Toast Alert Notification */}
      {liveToast && (
        <div className="fixed top-20 right-4 z-50 max-w-sm animate-in slide-in-from-top-4 duration-300">
          <div
            className={`p-4 rounded-2xl border shadow-xl backdrop-blur-md flex items-start gap-3 bg-white ${
              liveToast.type === 'alert'
                ? 'border-red-300 text-red-900 shadow-red-100'
                : liveToast.type === 'warning'
                ? 'border-amber-300 text-amber-900 shadow-amber-100'
                : 'border-emerald-300 text-emerald-900 shadow-emerald-100'
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {liveToast.type === 'alert' ? (
                <ShieldAlert className="w-5 h-5 text-red-600" />
              ) : liveToast.type === 'warning' ? (
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              )}
            </div>
            <div className="flex-1">
              <div className="text-xs font-bold leading-tight text-slate-900">{liveToast.title}</div>
              <div className="text-[11px] text-slate-600 mt-1 leading-snug">{liveToast.message}</div>
            </div>
            <button
              onClick={() => setLiveToast(null)}
              className="p-1 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Separate Dashboard Views via AppRoutes */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 pb-28 md:pb-8">
        <AppRoutes />
      </main>

      {/* Mobile Bottom Navigation Bar (Visible only on mobile devices) */}
      <MobileBottomBar />

      {/* Modal: Register New Facility (Step 1 & 2) */}
      {isRegisterOpen && (
        <FacilityRegisterModal
          staffList={staffList}
          onClose={() => setIsRegisterOpen(false)}
          onCreated={createFacility}
        />
      )}

      {/* Modal: View & Print Official QR Code Placard (Step 3) */}
      {qrModalFacility && (
        <QRCodeModal
          facility={qrModalFacility}
          onClose={() => setQrModalFacility(null)}
        />
      )}

      {/* Redesigned Modern Civic Footer */}
      <footer className="mt-auto bg-slate-950 text-slate-300 border-t border-slate-800/80 select-none pb-20 md:pb-0">
        {/* Subtle Top Gradient Accent Line */}
        <div className="h-1 w-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600" />

        {/* Main Footer Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 lg:py-14">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Col 1: Brand, Identity & Mission (Span 5) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 p-1.5 flex items-center justify-center shadow-lg shadow-emerald-900/40 shrink-0 border border-emerald-500/30">
                  <img
                    src="/logo.png"
                    alt="Sanity Management"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-black tracking-tight text-white">
                      SANITY MANAGEMENT
                    </span>
                    <span className="text-[10px] font-black uppercase bg-emerald-950 text-emerald-300 border border-emerald-700/60 px-2 py-0.5 rounded-full">
                      CIVIC OS
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-medium">Smart Public Restroom & Sanitation Platform</p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal max-w-md">
                Empowering municipal corporations with real-time IoT odor and water telemetry, geospatial citizen grievance resolution, automated worker dispatch, and civic hygiene benchmarks.
              </p>

              {/* Live Operational Status Pill */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400" />
                <span className="font-semibold text-emerald-400">All Systems Operational</span>
                <span className="text-slate-600">•</span>
                <span className="font-mono text-[11px] text-slate-400">Cloud IoT Telemetry Active</span>
              </div>
            </div>

            {/* Col 2: Fast Portals & Navigation (Span 3) */}
            <div className="lg:col-span-3 space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-200">
                Portals & Navigation
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm">
                <li>
                  <Link to="/portal" className="text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/60" />
                    Access Portals Gateway
                  </Link>
                </li>
                <li>
                  <Link to="/map" className="text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/60" />
                    Public Restroom GIS Map
                  </Link>
                </li>
                <li>
                  <Link to="/kiosk" className="text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/60" />
                    Scan Placard QR Code
                  </Link>
                </li>
                <li>
                  <Link to="/citizen" className="text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/60" />
                    Citizen Grievance Portal
                  </Link>
                </li>
                <li>
                  <Link to="/login/admin" className="text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/60" />
                    Admin Command Console
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 3: Official Partner & Mission Badges (Span 4) */}
            <div className="lg:col-span-4 space-y-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-200">
                Civic Governance & Partners
              </h4>

              <div className="space-y-3">
                {/* Government of India & RMC Collaboration */}
                <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center gap-3">
                  <EmblemOfIndia className="h-10 w-auto shrink-0 brightness-110" variant="gold" />
                  <div className="text-xs leading-tight">
                    <div className="font-extrabold text-white">Government of India</div>
                    <div className="text-[11px] text-emerald-400 font-semibold mt-0.5">
                      Rajamahendravaram Municipal Corporation × RTIH
                    </div>
                  </div>
                </div>

                {/* Swachh Bharat & Digital India Combined Strip */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col items-center justify-center text-center">
                    <SwachhBharatLogo className="h-7 w-auto mb-1 brightness-110" showSlogan={false} />
                    <span className="text-[10px] font-extrabold text-emerald-300 uppercase tracking-wide">
                      Mission Urban 2.0
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col items-center justify-center text-center">
                    <DigitalIndiaLogo className="h-6 w-auto mb-1 brightness-110" />
                    <span className="text-[10px] font-extrabold text-blue-300 uppercase tracking-wide">
                      Digital India
                    </span>
                  </div>
                </div>

                {/* Live GPS Button */}
                <button
                  type="button"
                  onClick={requestLocation}
                  className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-xs font-mono text-slate-300 flex items-center justify-between transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-1.5">
                    <FaLocationCrosshairs className={`w-3.5 h-3.5 ${hasLiveGps ? 'text-emerald-400 animate-pulse' : 'text-amber-400'}`} />
                    <span className="font-sans font-semibold text-slate-400">Live GPS:</span>
                  </span>
                  <span className="font-bold text-white">
                    {coords.lat.toFixed(4)}° N, {coords.lng.toFixed(4)}° E
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Sub-footer */}
        <div className="border-t border-slate-900 bg-black/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <div>
              © 2027 <span className="text-slate-300 font-bold">Sanity Management</span> • Rajamahendravaram Municipal Corporation (RMC) & Ratan Tata Innovation Hub (RTIH).
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  setShowSplash(true);
                }}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                Replay Splash
              </button>
              <span>•</span>
              <span className="text-emerald-500/80 font-mono text-[11px]">
                MongoDB Atlas • WebSockets Live
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <LocationProvider>
        <AuthProvider>
          <SanitationProvider>
            <AppLayout />
          </SanitationProvider>
        </AuthProvider>
      </LocationProvider>
    </BrowserRouter>
  );
}
