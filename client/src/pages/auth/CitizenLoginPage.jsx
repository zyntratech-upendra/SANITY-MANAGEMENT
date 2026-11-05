import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import SwachhBharatLogo from '../../components/gov/SwachhBharatLogo';
import {
  FaQrcode,
  FaLock,
  FaEnvelope,
  FaArrowRight,
  FaArrowLeft,
  FaUserPlus,
} from 'react-icons/fa6';

export default function CitizenLoginPage() {
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
      await login(email, password);
      navigate('/citizen');
    } catch (err) {
      setError(err.message || 'Invalid Citizen Credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-6 animate-in fade-in duration-300">
      <div className="mb-3 flex items-center justify-between">
        <Link
          to="/portal"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 font-semibold transition-colors"
        >
          <FaArrowLeft className="w-3 h-3" /> Back to Portals
        </Link>
        <Link
          to="/register"
          className="text-xs text-purple-700 font-bold hover:underline flex items-center gap-1"
        >
          <FaUserPlus className="w-3 h-3" /> New Citizen? Register
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
        <div className="p-6 sm:p-7 bg-gradient-to-b from-purple-50 via-white to-white border-b border-slate-100 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <SwachhBharatLogo className="h-9 w-auto" showSlogan={false} />
            <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-600/20">
              <FaQrcode className="w-6 h-6" />
            </div>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-purple-800 bg-purple-100 px-3 py-1 rounded-full border border-purple-200">
            Sanity Management • Citizen Civic Portal
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
            Citizen & Visitor Portal Login
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Public restroom QR cleanliness reports, nearby toilet locator & grievance receipts
          </p>

          {/* Interactive Illustration + Animated Scan Badge */}
          <div className="mt-4 pt-3 border-t border-purple-100 flex items-center justify-center gap-4">
            <img
              src="/illustrations/undraw_qr_code_scan.svg"
              alt="Citizen Scan unDraw"
              className="h-16 w-auto object-contain"
            />
            <img
              src="/illustrations/scanner_laser.gif"
              alt="Live Scanner Animation"
              className="h-12 w-12 rounded-xl border border-purple-200 shadow-xs object-cover"
            />
          </div>
        </div>

        {/* Citizen Notice & Register Link */}
        <div className="p-4 bg-purple-50/70 border-b border-purple-100 flex items-center justify-between text-xs sm:text-sm">
          <div>
            <span className="block font-bold text-purple-950 text-xs">New to Sanity Management?</span>
            <span className="text-purple-800 text-xs font-medium">Create a citizen account to track live grievance receipts.</span>
          </div>
          <Link
            to="/register"
            className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-xs"
          >
            Register Now
          </Link>
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
              Citizen Email Address
            </label>
            <div className="relative">
              <FaEnvelope className="w-4 h-4 text-slate-400 absolute left-4 top-4" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="citizen@gmail.com"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-800 uppercase tracking-wide mb-2">
              Password
            </label>
            <div className="relative">
              <FaLock className="w-4 h-4 text-slate-400 absolute left-4 top-4" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-purple-600 hover:bg-purple-700 active:scale-[0.99] text-white font-black text-base rounded-2xl shadow-xl shadow-purple-600/20 flex items-center justify-center gap-2.5 transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In to Citizen Hub</span>
                <FaArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="p-4 bg-slate-50 border-t border-slate-100 text-center text-xs sm:text-sm text-slate-600">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-purple-700 hover:underline">
            Register New Citizen Profile
          </Link>
        </div>
      </div>
    </div>
  );
}

