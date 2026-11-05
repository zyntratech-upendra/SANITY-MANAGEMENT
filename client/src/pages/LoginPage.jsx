import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Lock, Mail, ArrowRight, UserCheck, CheckCircle2, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, quickLoginAs } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const routeByRole = (role) => {
    switch (role) {
      case 'ADMIN':
        navigate('/admin');
        break;
      case 'MUNICIPAL_LEAD':
        navigate('/lead');
        break;
      case 'WORKER':
        navigate('/worker');
        break;
      case 'CITIZEN':
      default:
        navigate('/citizen');
        break;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter your email and password');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await login(email, password);
      routeByRole(res.user.role);
    } catch (err) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (roleName) => {
    setError('');
    setLoading(true);
    try {
      const res = await quickLoginAs(roleName);
      routeByRole(res.user.role);
    } catch (err) {
      setError(err.message || 'Quick login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-6 animate-in fade-in duration-300">
      {/* Official Government Badge Card */}
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="p-6 bg-gradient-to-b from-emerald-50 to-white border-b border-slate-100 text-center">
          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-600/20">
            <Shield className="w-7 h-7" />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
            Swachh Bharat Urban Portal
          </span>
          <h1 className="text-xl font-black text-slate-900 mt-2">Sign In to Dashboard</h1>
          <p className="text-xs text-slate-500 mt-1">Smart Sanitation & Public Toilet Monitoring</p>
        </div>

        {/* Demo 1-Click Role Switcher */}
        {/* Quick Admin Access */}
        <div className="p-4 bg-slate-50 border-b border-slate-100">
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Production Admin Access:</span>
            </span>
            <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-bold">
              1-Click Fill
            </span>
          </div>

          <button
            type="button"
            onClick={() => handleQuickLogin('ADMIN')}
            className="w-full p-3 bg-white hover:bg-emerald-50/50 border border-emerald-200 hover:border-emerald-400 rounded-xl text-left transition-all cursor-pointer group shadow-xs"
          >
            <div className="text-xs font-black text-slate-900 group-hover:text-emerald-700 flex items-center justify-between">
              <span>👑 Chief Commissioner Admin</span>
              <span className="text-[10px] text-emerald-700 font-mono font-bold bg-emerald-100/70 px-2 py-0.5 rounded-md">
                admin@swachh.gov.in
              </span>
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5 font-medium">
              Click to instantly fill and sign in to the Central Command Directorate
            </div>
          </button>
        </div>

        {/* Standard Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Official Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@swachh.gov.in or user@gmail.com"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In to System</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="p-4 bg-slate-50 border-t border-slate-100 text-center text-xs text-slate-600">
          Citizen without an account?{' '}
          <Link to="/register" className="font-bold text-emerald-700 hover:underline">
            Register Citizen Account
          </Link>
        </div>
      </div>
    </div>
  );
}

