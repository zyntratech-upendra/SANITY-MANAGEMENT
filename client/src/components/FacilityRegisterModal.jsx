import React, { useState } from 'react';
import { X, Building2, MapPin, Sparkles, LocateFixed } from 'lucide-react';

export default function FacilityRegisterModal({ staffList = [], onClose, onCreated }) {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    zone: 'Central Ward',
    address: '',
    lat: 28.6289,
    lng: 77.2155,
    type: 'Male/Female Separate',
    maleStalls: 3,
    femaleStalls: 3,
    accessibleStalls: 1,
    accessible: true,
    babyCare: false,
    sanitaryVending: true,
    touchlessSensors: true,
    operatingHours: '24/7',
    assignedStaffId: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            lat: parseFloat(position.coords.latitude.toFixed(5)),
            lng: parseFloat(position.coords.longitude.toFixed(5)),
          }));
        },
        (err) => {
          alert('Could not obtain GPS location: ' + err.message);
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.address) {
      setError('Please provide facility name and address.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const assignedStaffObj = staffList.find((s) => s.staffId === formData.assignedStaffId) || {
        staffId: '',
        name: 'Unassigned',
        phone: '',
      };

      const payload = {
        code: formData.code.trim() || undefined,
        name: formData.name.trim(),
        zone: formData.zone,
        address: formData.address.trim(),
        location: {
          lat: parseFloat(formData.lat),
          lng: parseFloat(formData.lng),
        },
        type: formData.type,
        stallsCount: {
          male: Number(formData.maleStalls),
          female: Number(formData.femaleStalls),
          accessible: Number(formData.accessibleStalls),
        },
        features: {
          accessible: formData.accessible,
          babyCare: formData.babyCare,
          sanitaryVending: formData.sanitaryVending,
          touchlessSensors: formData.touchlessSensors,
        },
        operatingHours: formData.operatingHours,
        assignedStaff: {
          staffId: assignedStaffObj.staffId || '',
          name: assignedStaffObj.name || 'Unassigned',
          phone: assignedStaffObj.phone || '',
        },
      };

      await onCreated(payload);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to register facility.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center border border-emerald-200">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Register Public Toilet Facility</h3>
              <p className="text-xs text-slate-500">Step 1 & 2: Assign unique facility ID and GIS coordinates</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xl font-medium">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Facility Unique Code (Optional)
              </label>
              <input
                type="text"
                name="code"
                placeholder="e.g. TOILET-107 (Auto if empty)"
                value={formData.code}
                onChange={handleChange}
                className="w-full bg-slate-50 text-slate-800 text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-500 uppercase font-mono"
              />
              <span className="text-[10px] text-slate-500">Auto-generates clean ID if left blank</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Municipal Ward / Zone *
              </label>
              <select
                name="zone"
                value={formData.zone}
                onChange={handleChange}
                className="w-full bg-slate-50 text-slate-800 text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-500 font-medium"
              >
                <option value="Central Ward">Central Ward</option>
                <option value="North Ward">North Ward</option>
                <option value="South Ward">South Ward</option>
                <option value="East Ward">East Ward</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Facility Name *
            </label>
            <input
              type="text"
              name="name"
              placeholder="e.g. Connaught Place Circle 4 Restroom Complex"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full bg-slate-50 text-slate-800 text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Exact Address & Landmarks *
            </label>
            <input
              type="text"
              name="address"
              placeholder="e.g. Near Gate 5, Inner Circle Metro Station"
              value={formData.address}
              onChange={handleChange}
              required
              className="w-full bg-slate-50 text-slate-800 text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Geo Coordinates */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                GIS Geo-Coordinates (Lat & Long)
              </span>
              <button
                type="button"
                onClick={handleUseCurrentLocation}
                className="text-[11px] text-emerald-700 hover:text-emerald-800 flex items-center gap-1 font-bold cursor-pointer"
              >
                <LocateFixed className="w-3 h-3" />
                <span>Use My Location</span>
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[10px] text-slate-500 block mb-0.5 font-medium">Latitude</span>
                <input
                  type="number"
                  step="0.0001"
                  name="lat"
                  value={formData.lat}
                  onChange={handleChange}
                  className="w-full bg-white text-slate-800 text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 font-mono"
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block mb-0.5 font-medium">Longitude</span>
                <input
                  type="number"
                  step="0.0001"
                  name="lng"
                  value={formData.lng}
                  onChange={handleChange}
                  className="w-full bg-white text-slate-800 text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 font-mono"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Facility Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full bg-slate-50 text-slate-800 text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-500 font-medium"
              >
                <option value="Male/Female Separate">Male/Female Separate</option>
                <option value="All-Gender">All-Gender</option>
                <option value="Accessible/Family">Accessible/Family</option>
                <option value="Smart Automated Pod">Smart Automated Pod</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Operating Hours</label>
              <input
                type="text"
                name="operatingHours"
                value={formData.operatingHours}
                onChange={handleChange}
                placeholder="24/7 or 06:00 - 23:00"
                className="w-full bg-slate-50 text-slate-800 text-xs px-3 py-2 rounded-xl border border-slate-300"
              />
            </div>
          </div>

          {/* Stalls count */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Stalls / Urinals Count</label>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <span className="text-[10px] text-slate-500 block mb-0.5 font-medium">Male Stalls</span>
                <input
                  type="number"
                  min="0"
                  name="maleStalls"
                  value={formData.maleStalls}
                  onChange={handleChange}
                  className="w-full bg-slate-50 text-slate-800 text-xs px-2.5 py-1.5 rounded-lg border border-slate-300"
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block mb-0.5 font-medium">Female Stalls</span>
                <input
                  type="number"
                  min="0"
                  name="femaleStalls"
                  value={formData.femaleStalls}
                  onChange={handleChange}
                  className="w-full bg-slate-50 text-slate-800 text-xs px-2.5 py-1.5 rounded-lg border border-slate-300"
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block mb-0.5 font-medium">Accessible Stalls</span>
                <input
                  type="number"
                  min="0"
                  name="accessibleStalls"
                  value={formData.accessibleStalls}
                  onChange={handleChange}
                  className="w-full bg-slate-50 text-slate-800 text-xs px-2.5 py-1.5 rounded-lg border border-slate-300"
                />
              </div>
            </div>
          </div>

          {/* Features Checkboxes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Features & Amenities</label>
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-700 font-medium">
              <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  name="accessible"
                  checked={formData.accessible}
                  onChange={handleChange}
                  className="rounded text-emerald-600 focus:ring-0"
                />
                <span>Wheelchair Ramp / Accessible</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  name="babyCare"
                  checked={formData.babyCare}
                  onChange={handleChange}
                  className="rounded text-emerald-600 focus:ring-0"
                />
                <span>Baby Care / Diaper Station</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  name="sanitaryVending"
                  checked={formData.sanitaryVending}
                  onChange={handleChange}
                  className="rounded text-emerald-600 focus:ring-0"
                />
                <span>Sanitary Pad Vending Unit</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  name="touchlessSensors"
                  checked={formData.touchlessSensors}
                  onChange={handleChange}
                  className="rounded text-emerald-600 focus:ring-0"
                />
                <span>Touchless Sensor Taps & Flush</span>
              </label>
            </div>
          </div>

          {/* Assigned Staff */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Assign Primary Sanitation Staff
            </label>
            <select
              name="assignedStaffId"
              value={formData.assignedStaffId}
              onChange={handleChange}
              className="w-full bg-slate-50 text-slate-800 text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-500 font-medium cursor-pointer"
            >
              <option value="">Unassigned (Auto-Dispatch on Alert)</option>
              {staffList.map((s) => (
                <option key={s.staffId} value={s.staffId}>
                  {s.name} ({s.role}) - {s.zone}
                </option>
              ))}
            </select>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm transition-all disabled:opacity-50 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>{loading ? 'Registering...' : 'Register & Generate QR'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
