import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLocationCoords } from '../context/LocationContext';
import {
  FaUserPlus,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaLock,
  FaArrowRight,
  FaShieldHalved,
  FaLocationCrosshairs,
} from 'react-icons/fa6';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { registerCitizen } = useAuth();
  const { coords, hasLiveGps, requestLocation } = useLocationCoords();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill all required fields');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setError('');
    setLoading(true);
    try {
      await registerCitizen({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });
      navigate('/citizen');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-6 animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-gradient-to-b from-purple-50 to-white border-b border-slate-100 text-center">
          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-lg shadow-purple-600/20">
            <FaUserPlus className="w-7 h-7" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-purple-800 bg-purple-100 px-3 py-1 rounded-full inline-flex items-center gap-1">
            <FaShieldHalved className="w-3 h-3" /> Citizen Registration
          </span>
          <h1 className="text-xl font-black text-slate-900 mt-2">Create Citizen Account</h1>
          <p className="text-xs text-slate-500 mt-1">
            Report public restroom cleanliness, scan QR placards & locate facilities
          </p>

          <div className="mt-3 pt-2 border-t border-purple-100 flex items-center justify-center gap-3">
            <img
              src="/illustrations/undraw_customer_survey.svg"
              alt="Citizen Registration"
              className="h-14 w-auto object-contain"
            />
            <img
              src="/illustrations/sanitation_cleaning.gif"
              alt="Civic Verified"
              className="h-10 w-10 rounded-xl border border-purple-200 shadow-xs object-cover"
            />
          </div>
        </div>

        {/* GPS Detection Bar */}
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <FaLocationCrosshairs className={`w-3.5 h-3.5 ${hasLiveGps ? 'text-emerald-600' : 'text-slate-400'}`} />
            <span className="text-slate-600 text-[11px]">
              GPS Location: {coords.lat.toFixed(3)}°, {coords.lng.toFixed(3)}°
            </span>
          </div>
          {!hasLiveGps && (
            <button
              type="button"
              onClick={requestLocation}
              className="text-[10px] text-purple-700 font-bold hover:underline"
            >
              Grant GPS
            </button>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Full Name *
            </label>
            <div className="relative">
              <FaUser className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Aarav Patel"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Email Address *
            </label>
            <div className="relative">
              <FaEnvelope className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="aarav@gmail.com"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Phone Number
            </label>
            <div className="relative">
              <FaPhone className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Password *
            </label>
            <div className="relative">
              <FaLock className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Minimum 6 characters"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Confirm Password *
            </label>
            <div className="relative">
              <FaLock className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Repeat password"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 active:scale-[0.99] text-white font-bold text-sm rounded-xl shadow-lg shadow-purple-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <span>Creating Account...</span>
            ) : (
              <>
                <span>Complete Registration</span>
                <FaArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        <div className="p-4 bg-slate-50 border-t border-slate-100 text-center text-xs text-slate-600">
          Already registered?{' '}
          <Link to="/login/citizen" className="font-bold text-purple-700 hover:underline">
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
}
