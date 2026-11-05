import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useSanitation } from '../context/SanitationContext';
import { useAuth } from '../context/AuthContext';
import {
  ShieldAlert,
  Building2,
  MapPin,
  ClipboardList,
  Users,
  Activity,
  QrCode,
  Radio,
  Clock,
  Sparkles,
  Smartphone,
  Wrench,
  ShieldCheck,
  User,
  LogOut,
  LogIn,
  ChevronDown,
} from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { complaints } = useSanitation();
  const { user, role, isAuthenticated, logout, quickLoginAs } = useAuth();
  const [timeStr, setTimeStr] = useState('');
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);

  const alertCount = complaints.filter((c) => c.status !== 'RESOLVED').length;

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const navLinks = [
    { path: '/command', label: 'Command Center', icon: Activity },
    { path: '/map', label: 'Live GIS Map', icon: MapPin },
    { path: '/admin', label: 'Admin Console', icon: ShieldCheck, roleRequired: 'ADMIN' },
    { path: '/lead', label: 'Municipal Lead', icon: Building2, roleRequired: 'MUNICIPAL_LEAD' },
    { path: '/worker', label: 'Worker Ops', icon: Wrench, roleRequired: 'WORKER' },
    { path: '/citizen', label: 'Citizen Hub', icon: QrCode },
    { path: '/facilities', label: 'All Centers', icon: Building2 },
    { path: '/complaints', label: 'Grievances', icon: ClipboardList, badge: alertCount },
  ];

  const handleRoleSwitch = async (targetRole) => {
    setIsRoleMenuOpen(false);
    try {
      await quickLoginAs(targetRole);
      if (targetRole === 'ADMIN') navigate('/admin');
      else if (targetRole === 'MUNICIPAL_LEAD') navigate('/lead');
      else if (targetRole === 'WORKER') navigate('/worker');
      else if (targetRole === 'CITIZEN') navigate('/citizen');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 text-slate-800 shadow-sm">
      {/* Top Official Gov Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 px-4 py-1.5 border-b border-emerald-700 text-xs flex flex-wrap items-center justify-between text-slate-100">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
          </span>
          <span className="font-semibold tracking-wider uppercase text-emerald-300">
            Swachh Bharat Urban • Smart Public Toilet Monitoring System
          </span>
          <span className="hidden md:inline text-slate-400">|</span>
          <span className="hidden md:inline text-slate-300">Municipal Operations & Grievance Redressal</span>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono text-slate-200">
          <div className="flex items-center gap-1.5 bg-white/10 px-2 py-0.5 rounded border border-white/20">
            <Radio className="w-3.5 h-3.5 text-emerald-300 animate-pulse" />
            <span className="text-emerald-300 font-medium">GIS & IoT Live</span>
          </div>
          <div className="flex items-center gap-1 text-slate-200">
            <Clock className="w-3.5 h-3.5 text-teal-300" />
            <span>{timeStr || 'Active'}</span>
          </div>
        </div>
      </div>

      {/* Main Navbar - End to End & Single Line */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between gap-3 flex-nowrap">
        {/* Brand Logo */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate('/command')}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 p-0.5 flex items-center justify-center shadow-md shadow-emerald-600/20 shrink-0">
            <img
              src="/logo.png"
              alt="Sanity Management"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-black tracking-tight text-slate-900">
                SANITY MANAGEMENT
              </span>
              <span className="text-[9px] uppercase font-bold tracking-wider bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded border border-emerald-300">
                OFFICIAL
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium">
              Restroom Monitoring & Sanitation Directorate
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 overflow-x-auto max-w-full">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-150 whitespace-nowrap cursor-pointer relative ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{item.label}</span>
                {item.badge > 0 && (
                  <span
                    className={`ml-1 px-1.5 py-0.2 rounded-full text-[9px] font-bold ${
                      isActive ? 'bg-white text-slate-900' : 'bg-red-500 text-white animate-pulse'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Auth / Role Switcher Profile Button */}
        <div className="flex items-center gap-2 relative">
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              {/* Role Dropdown Toggle */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-left cursor-pointer transition-colors"
                >
                  <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                    {user?.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div className="hidden sm:block">
                    <span className="block text-xs font-bold text-slate-800 leading-tight">
                      {user?.name || 'User'}
                    </span>
                    <span className="text-[10px] font-bold uppercase text-emerald-700 bg-emerald-50 px-1 rounded">
                      {role}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {isRoleMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in">
                    <div className="px-3 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900 truncate">{user?.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                    </div>

                    <div className="py-1">
                      <span className="block px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Switch Role Login:
                      </span>
                      <button
                        onClick={() => handleRoleSwitch('ADMIN')}
                        className="w-full px-3 py-1.5 text-left text-xs font-semibold hover:bg-slate-50 rounded-lg flex items-center justify-between cursor-pointer"
                      >
                        <span>👑 Chief Admin</span>
                        {role === 'ADMIN' && <span className="text-emerald-600 text-[10px]">Active</span>}
                      </button>
                      <button
                        onClick={() => handleRoleSwitch('MUNICIPAL_LEAD')}
                        className="w-full px-3 py-1.5 text-left text-xs font-semibold hover:bg-slate-50 rounded-lg flex items-center justify-between cursor-pointer"
                      >
                        <span>🏢 Municipal Lead</span>
                        {role === 'MUNICIPAL_LEAD' && <span className="text-emerald-600 text-[10px]">Active</span>}
                      </button>
                      <button
                        onClick={() => handleRoleSwitch('WORKER')}
                        className="w-full px-3 py-1.5 text-left text-xs font-semibold hover:bg-slate-50 rounded-lg flex items-center justify-between cursor-pointer"
                      >
                        <span>👷 Sanitation Worker</span>
                        {role === 'WORKER' && <span className="text-emerald-600 text-[10px]">Active</span>}
                      </button>
                      <button
                        onClick={() => handleRoleSwitch('CITIZEN')}
                        className="w-full px-3 py-1.5 text-left text-xs font-semibold hover:bg-slate-50 rounded-lg flex items-center justify-between cursor-pointer"
                      >
                        <span>👤 Citizen / Visitor</span>
                        {role === 'CITIZEN' && <span className="text-emerald-600 text-[10px]">Active</span>}
                      </button>
                    </div>

                    <div className="pt-1 border-t border-slate-100">
                      <button
                        onClick={() => {
                          setIsRoleMenuOpen(false);
                          logout();
                          navigate('/login');
                        }}
                        className="w-full px-3 py-1.5 text-left text-xs font-bold text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-1.5 cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <Link
                to="/login"
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm cursor-pointer transition-colors"
              >
                <LogIn className="w-3.5 h-3.5" /> Sign In
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
