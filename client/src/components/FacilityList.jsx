import React, { useState } from 'react';
import {
  Building2,
  Plus,
  QrCode,
  MapPin,
  Clock,
  Droplets,
  Wind,
  Sparkles,
  Search,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  ExternalLink,
} from 'lucide-react';

export default function FacilityList({
  facilities = [],
  onOpenRegister,
  onOpenQR,
  onOpenReport,
  onViewOnMap,
  onDeleteFacility,
  onQuickClean,
}) {
  const [search, setSearch] = useState('');
  const [zone, setZone] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filtered = facilities.filter((f) => {
    if (zone !== 'ALL' && f.zone !== zone) return false;
    if (statusFilter !== 'ALL' && f.status?.availability !== statusFilter) return false;
    if (
      search &&
      !f.name.toLowerCase().includes(search.toLowerCase()) &&
      !f.code.toLowerCase().includes(search.toLowerCase()) &&
      !f.address.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const getCleanlinessBadge = (cleanliness) => {
    switch (cleanliness) {
      case 'EXCELLENT':
        return { label: '5★ Pristine', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'SATISFACTORY':
        return { label: 'Satisfactory', color: 'bg-blue-50 text-blue-700 border-blue-200' };
      case 'NEEDS_ATTENTION':
        return { label: 'Needs Cleaning', color: 'bg-amber-50 text-amber-700 border-amber-200' };
      case 'CRITICAL_UNHYGIENIC':
        return { label: 'Critical Alert', color: 'bg-red-50 text-red-700 border-red-200' };
      default:
        return { label: cleanliness, color: 'bg-slate-100 text-slate-700 border-slate-200' };
    }
  };

  const getAvailabilityBadge = (avail) => {
    switch (avail) {
      case 'AVAILABLE':
        return { label: 'Available', dot: 'bg-emerald-500' };
      case 'OCCUPIED':
        return { label: 'Occupied', dot: 'bg-blue-500' };
      case 'CLEANING_IN_PROGRESS':
        return { label: 'Cleaning In Progress', dot: 'bg-amber-500 animate-ping' };
      case 'MAINTENANCE_REQUIRED':
        return { label: 'Maintenance Required', dot: 'bg-red-500 animate-ping' };
      default:
        return { label: avail, dot: 'bg-slate-400' };
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Action Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-600" />
            Public Toilet Facilities Registry & Assets
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold border border-slate-200">
              {filtered.length} of {facilities.length} registered
            </span>
          </h2>
          <p className="text-xs text-slate-500">
            Municipal sanitation inventory, QR signage generation, GIS coordinates and telemetry monitoring
          </p>
        </div>

        <button
          onClick={onOpenRegister}
          className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Register New Facility</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by facility name, code (e.g. TOILET-101), or address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 text-slate-800 text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <select
          value={zone}
          onChange={(e) => setZone(e.target.value)}
          className="bg-slate-50 text-slate-700 text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 font-medium"
        >
          <option value="ALL">All Municipal Wards</option>
          <option value="Central Ward">Central Ward</option>
          <option value="North Ward">North Ward</option>
          <option value="South Ward">South Ward</option>
          <option value="East Ward">East Ward</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-slate-50 text-slate-700 text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 font-medium"
        >
          <option value="ALL">All Statuses</option>
          <option value="AVAILABLE">Available</option>
          <option value="OCCUPIED">Occupied</option>
          <option value="CLEANING_IN_PROGRESS">Cleaning In Progress</option>
          <option value="MAINTENANCE_REQUIRED">Maintenance Required</option>
        </select>
      </div>

      {/* Facilities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((facility) => {
          const cleanBadge = getCleanlinessBadge(facility.status?.cleanliness);
          const availBadge = getAvailabilityBadge(facility.status?.availability);
          const water = facility.telemetry?.waterLevel ?? 80;
          const odor = facility.telemetry?.odorLevelPpm ?? 12;

          return (
            <div
              key={facility._id}
              className="bg-white rounded-2xl border border-slate-200/90 hover:border-slate-300 p-5 shadow-sm transition-all flex flex-col justify-between group hover:shadow-md"
            >
              <div>
                {/* Header row */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-lg bg-slate-100 text-slate-800 border border-slate-200">
                      {facility.code}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${cleanBadge.color}`}>
                      {cleanBadge.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-200 text-[11px] font-semibold text-slate-700">
                    <span className={`w-2 h-2 rounded-full ${availBadge.dot}`}></span>
                    <span>{availBadge.label}</span>
                  </div>
                </div>

                {/* Facility Name & Ward */}
                <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug mb-1">
                  {facility.name}
                </h3>
                <div className="flex items-center gap-1 text-xs text-slate-500 mb-3">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{facility.address}</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-600 shrink-0 font-medium">{facility.zone}</span>
                </div>

                {/* Telemetry Sensor Bar */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 mb-3 grid grid-cols-2 gap-2.5 text-xs">
                  <div>
                    <div className="text-[10px] font-semibold text-slate-500 mb-1 flex items-center gap-1">
                      <Droplets className="w-3 h-3 text-blue-500" />
                      <span>Water Tank</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            water <= 20 ? 'bg-red-500' : water <= 40 ? 'bg-amber-500' : 'bg-blue-600'
                          }`}
                          style={{ width: `${water}%` }}
                        ></div>
                      </div>
                      <span className={`font-mono font-bold text-xs ${water <= 20 ? 'text-red-600' : 'text-slate-700'}`}>
                        {water}%
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] font-semibold text-slate-500 mb-1 flex items-center gap-1">
                      <Wind className="w-3 h-3 text-emerald-600" />
                      <span>Air / Odor Sensor</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            odor >= 45 ? 'bg-red-500' : odor >= 25 ? 'bg-amber-500' : 'bg-emerald-600'
                          }`}
                          style={{ width: `${Math.min(100, (odor / 60) * 100)}%` }}
                        ></div>
                      </div>
                      <span className={`font-mono font-bold text-xs ${odor >= 45 ? 'text-red-600' : 'text-slate-700'}`}>
                        {odor}PPM
                      </span>
                    </div>
                  </div>
                </div>

                {/* Cleaner and Rating */}
                <div className="flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100 pt-2 mb-3">
                  <div className="flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                    <span>Staff:</span>
                    <span className="font-semibold text-slate-700">
                      {facility.assignedStaff?.name || 'Unassigned'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Rating:</span>
                    <span className="font-bold text-amber-600">★ {facility.ratings?.average || 4.5}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-4 gap-1.5 pt-2 border-t border-slate-100 text-xs">
                {/* View on Map Button */}
                <button
                  onClick={() => onViewOnMap && onViewOnMap(facility)}
                  className="flex items-center justify-center gap-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold py-2 px-1.5 rounded-xl border border-emerald-200 transition-all cursor-pointer"
                  title="View and track on GIS Map"
                >
                  <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Map</span>
                </button>

                <button
                  onClick={() => onOpenQR(facility)}
                  className="flex items-center justify-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2 px-1.5 rounded-xl border border-slate-200 transition-all cursor-pointer"
                  title="View / Print QR Code"
                >
                  <QrCode className="w-3.5 h-3.5 text-slate-600" />
                  <span>QR Sign</span>
                </button>

                <button
                  onClick={() => onOpenReport(facility.code)}
                  className="flex items-center justify-center gap-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold py-2 px-1.5 rounded-xl border border-blue-200 transition-all cursor-pointer"
                  title="Test Citizen QR Feedback"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Report</span>
                </button>

                <button
                  onClick={() => onQuickClean(facility)}
                  className="flex items-center justify-center gap-1 bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold py-2 px-1.5 rounded-xl border border-teal-200 transition-all cursor-pointer"
                  title="Sanitation Staff Action"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Clean</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 shadow-sm">
          <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-700">No Toilet Facilities Found</h3>
          <p className="text-xs text-slate-500 mt-1">Try adjusting your ward filter or search keywords.</p>
        </div>
      )}
    </div>
  );
}
