import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import EmblemOfIndia from '../../components/gov/EmblemOfIndia';
import SwachhBharatLogo from '../../components/gov/SwachhBharatLogo';
import {
  FaUserShield,
  FaLock,
  FaEnvelope,
  FaArrowRight,
  FaShieldHalved,
  FaArrowLeft,
  FaKey,
} from 'react-icons/fa6';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('admin@swachh.gov.in');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await login(email, password);
      if (res.user.role !== 'ADMIN') {
        setError(`This portal is strictly for Chief Administrators. You are signed in as ${res.user.role}.`);
        return;
      }
      navigate('/admin');
    } catch (err) {
      setError(err.message || 'Invalid Administrator Credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-6 animate-in fade-in duration-300">
      <div className="mb-3">
        <Link
          to="/portal"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 font-semibold transition-colors"
        >
          <FaArrowLeft className="w-3 h-3" /> Back to Portals
        </Link>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden relative">
        {/* 3px Tricolor Ribbon */}
        <div className="h-1 w-full flex">
          <div className="flex-1 bg-[#FF9933]" />
          <div className="flex-1 bg-[#FFFFFF]" />
          <div className="flex-1 bg-[#138808]" />
        </div>

        {/* Official Header */}
        <div className="p-6 sm:p-7 bg-gradient-to-b from-emerald-50 via-white to-white border-b border-slate-100 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <EmblemOfIndia className="h-10 w-auto" variant="gold" />
            <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white flex items-center justify-center shadow-md shadow-emerald-700/20">
              <FaUserShield className="w-6 h-6" />
            </div>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full inline-flex items-center gap-1.5 border border-emerald-300">
            <FaShieldHalved className="w-3 h-3" /> Sanity Management • Central Command Directorate
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
            Chief Commissioner Admin Console
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            City public restroom complex registry, blocks configuration & zonal lead allotment
          </p>

          {/* Interactive Illustration + Animated Shield Badge */}
          <div className="mt-4 pt-3 border-t border-emerald-100 flex items-center justify-center gap-4">
            <img
              src="/illustrations/undraw_dashboard.svg"
              alt="Admin Command unDraw"
              className="h-16 w-auto object-contain"
            />
            <img
              src="/illustrations/sanitation_cleaning.gif"
              alt="Hygiene Verified Animation"
              className="h-12 w-12 rounded-xl border border-emerald-200 shadow-xs object-cover"
            />
          </div>
        </div>

        {/* 1-Click Fill Box */}
        <div className="p-4 bg-emerald-50/70 border-b border-emerald-100 flex items-center justify-between text-xs sm:text-sm">
          <div>
            <span className="block font-bold text-emerald-950 text-xs">Production Admin Credentials:</span>
            <span className="text-emerald-800 font-mono text-xs font-semibold">admin@swachh.gov.in / admin123</span>
          </div>
          <button
            type="button"
            onClick={() => {
              setEmail('admin@swachh.gov.in');
              setPassword('admin123');
            }}
            className="px-3 py-1.5 bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer hover:bg-emerald-800 transition-colors shadow-xs"
          >
            Auto-Fill
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
          {error && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl text-sm text-red-700 font-medium">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-slate-800 uppercase tracking-wide mb-2">
              Admin Email ID
            </label>
            <div className="relative">
              <FaEnvelope className="w-4 h-4 text-slate-400 absolute left-4 top-4" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@swachh.gov.in"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-800 uppercase tracking-wide mb-2">
              Admin Security Password
            </label>
            <div className="relative">
              <FaLock className="w-4 h-4 text-slate-400 absolute left-4 top-4" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-emerald-700 hover:bg-emerald-800 active:scale-[0.99] text-white font-black text-base rounded-2xl shadow-xl shadow-emerald-700/20 flex items-center justify-center gap-2.5 transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Access Admin Directorate</span>
                <FaArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="p-4 bg-slate-50 border-t border-slate-100 text-center text-xs text-slate-500">
          Swachh Bharat Mission (Urban) • Municipal Security Clearance Required
        </div>
      </div>
    </div>
  );
}

