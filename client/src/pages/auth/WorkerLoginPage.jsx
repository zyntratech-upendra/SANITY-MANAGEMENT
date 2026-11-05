import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import SwachhBharatLogo from '../../components/gov/SwachhBharatLogo';
import {
  FaBroom,
  FaLock,
  FaEnvelope,
  FaArrowRight,
  FaShieldHalved,
  FaArrowLeft,
  FaClock,
} from 'react-icons/fa6';

export default function WorkerLoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await login(email, password);
      if (res.user.role !== 'WORKER' && res.user.role !== 'ADMIN') {
        setError(`This portal is for Field Sanitation Staff. You are signed in as ${res.user.role}.`);
        return;
      }
      navigate('/worker');
    } catch (err) {
      setError(err.message || 'Invalid Sanitation Worker Credentials');
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
        <div className="p-6 sm:p-7 bg-gradient-to-b from-amber-50 via-white to-white border-b border-slate-100 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <SwachhBharatLogo className="h-9 w-auto" showSlogan={false} />
            <div className="w-12 h-12 rounded-2xl bg-amber-600 text-white flex items-center justify-center shadow-md shadow-amber-600/20">
              <FaBroom className="w-6 h-6" />
            </div>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-amber-950 bg-amber-100 px-3 py-1 rounded-full inline-flex items-center gap-1.5 border border-amber-300">
            <FaClock className="w-3 h-3 text-amber-800" /> Sanity Management • Field Duty Ops
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
            Sanitation Field Worker Login
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Allotted public toilet pavilions, live cleaning stopwatches & 5-point quality verification
          </p>

          {/* Interactive Illustration + Animated Duty Badge */}
          <div className="mt-4 pt-3 border-t border-amber-100 flex items-center justify-center gap-4">
            <img
              src="/illustrations/undraw_clean_up.svg"
              alt="Sanitation Worker unDraw"
              className="h-16 w-auto object-contain"
            />
            <img
              src="/illustrations/worker_dispatch.gif"
              alt="Worker Dispatch Animation"
              className="h-12 w-12 rounded-xl border border-amber-200 shadow-xs object-cover"
            />
          </div>
        </div>

        {/* Official Field Staff Notice */}
        <div className="p-4 bg-amber-50/70 border-b border-amber-100 flex items-start gap-3 text-xs sm:text-sm">
          <FaClock className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
          <div>
            <span className="block font-bold text-amber-950 text-xs">Field Specialist Access:</span>
            <span className="text-amber-900 text-xs font-medium">Log in with the duty credentials provided by your Zonal Ward Lead or Municipal Admin.</span>
          </div>
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
              Worker Official ID / Email
            </label>
            <div className="relative">
              <FaEnvelope className="w-4 h-4 text-slate-400 absolute left-4 top-4" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="worker.name@swachh.gov.in"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-800 uppercase tracking-wide mb-2">
              Security Password
            </label>
            <div className="relative">
              <FaLock className="w-4 h-4 text-slate-400 absolute left-4 top-4" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-amber-600 hover:bg-amber-700 active:scale-[0.99] text-white font-black text-base rounded-2xl shadow-xl shadow-amber-600/20 flex items-center justify-center gap-2.5 transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Start Cleaning Shift</span>
                <FaArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="p-4 bg-slate-50 border-t border-slate-100 text-center text-xs text-slate-500">
          Mobile-Friendly Field Operations • Swachh Bharat Fast Response
        </div>
      </div>
    </div>
  );
}

