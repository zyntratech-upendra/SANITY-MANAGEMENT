import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSanitation } from '../context/SanitationContext';
import { useLocationCoords } from '../context/LocationContext';
import ToiletMap from '../components/ToiletMap';
import UndrawGisMap from '../components/gov/UndrawGisMap';
import {
  MapPin,
  Search,
  Filter,
  Droplets,
  Wind,
  Sparkles,
  ExternalLink,
  QrCode,
  Building2,
  Navigation,
} from 'lucide-react';
import { FaLocationCrosshairs, FaRoute } from 'react-icons/fa6';

export default function MapDashboardPage() {
  const navigate = useNavigate();
  const {
    facilities,
    selectedFacility,
    setSelectedFacility,
    setQrModalFacility,
  } = useSanitation();

  const { coords, hasLiveGps, requestLocation, getDistanceToFacility } = useLocationCoords();

  const [sidebarSearch, setSidebarSearch] = useState('');
  const [selectedZone, setSelectedZone] = useState('ALL');
  const [sortByProximity, setSortByProximity] = useState(false);

  let filtered = facilities.filter((f) => {
    if (selectedZone !== 'ALL' && f.zone !== selectedZone) return false;
    if (
      sidebarSearch &&
      !f.name.toLowerCase().includes(sidebarSearch.toLowerCase()) &&
      !f.code.toLowerCase().includes(sidebarSearch.toLowerCase()) &&
      !f.address.toLowerCase().includes(sidebarSearch.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  if (sortByProximity) {
    filtered = [...filtered].sort((a, b) => {
      const distA = getDistanceToFacility(a) ?? 9999;
      const distB = getDistanceToFacility(b) ?? 9999;
      return distA - distB;
    });
  }

  const getStatusBadge = (avail) => {
    switch (avail) {
      case 'AVAILABLE':
        return { label: 'Available', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'OCCUPIED':
        return { label: 'Occupied', color: 'bg-blue-50 text-blue-700 border-blue-200' };
      case 'CLEANING_IN_PROGRESS':
        return { label: 'Cleaning', color: 'bg-amber-50 text-amber-700 border-amber-200' };
      case 'MAINTENANCE_REQUIRED':
        return { label: 'Maintenance', color: 'bg-red-50 text-red-700 border-red-200' };
      default:
        return { label: avail, color: 'bg-slate-100 text-slate-700 border-slate-200' };
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm flex flex-wrap items-center justify-between gap-4 relative overflow-hidden">
        {/* Tricolor accent */}
        <div className="absolute top-0 left-0 right-0 h-1 flex">
          <div className="flex-1 bg-[#FF9933]" />
          <div className="flex-1 bg-[#FFFFFF]" />
          <div className="flex-1 bg-[#138808]" />
        </div>

        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
              Sanity Management • Public Restroom GIS
            </span>
            <span className="text-xs text-slate-400 font-medium">• City Public Restrooms & Transit Corridors</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-600" />
            Live Public Restrooms & City Sanitation GIS Map
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Geospatial tracking of public toilet complexes and transit hubs with live telemetry, cleanliness status, and GPS turn-by-turn routing.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-3">
            <UndrawGisMap className="h-16 w-auto" />
            <img
              src="/illustrations/sanitation_cleaning.gif"
              alt="Sanitized Restroom Network"
              className="h-16 w-16 rounded-2xl border border-emerald-200 shadow-sm object-cover hidden lg:block"
            />
          </div>
          <span className="text-xs sm:text-sm font-bold px-3.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-xs">
            {facilities.length} Toilet Complexes Plotted
          </span>
        </div>
      </div>

      {/* Main Split Layout: Left Directory Drawer + Right GIS Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Sidebar Directory */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 p-5 shadow-sm flex flex-col h-[680px]">
          <div className="mb-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-extrabold text-slate-900 uppercase tracking-wide">Facility Directory</span>
              <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">{filtered.length} Centers</span>
            </div>

            {/* Search Box */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search facility name or ID..."
                value={sidebarSearch}
                onChange={(e) => setSidebarSearch(e.target.value)}
                className="w-full bg-slate-50 text-slate-800 text-sm pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              />
            </div>

            {/* Zone Filter & Proximity Sort */}
            <div className="flex items-center gap-2">
              <select
                value={selectedZone}
                onChange={(e) => setSelectedZone(e.target.value)}
                className="flex-1 bg-slate-50 text-slate-800 text-xs sm:text-sm px-3 py-2 rounded-xl border border-slate-300 focus:outline-none font-bold cursor-pointer"
              >
                <option value="ALL">All Wards</option>
                <option value="Central Ward">Central Ward</option>
                <option value="North Ward">North Ward</option>
                <option value="South Ward">South Ward</option>
                <option value="East Ward">East Ward</option>
              </select>

              <button
                type="button"
                onClick={() => {
                  if (!hasLiveGps) requestLocation();
                  setSortByProximity(!sortByProximity);
                }}
                className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs ${
                  sortByProximity
                    ? 'bg-purple-600 text-white border-purple-600'
                    : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
                title="Sort by nearest to current GPS"
              >
                <FaRoute className="w-3.5 h-3.5" />
                <span>{sortByProximity ? 'Near GPS' : 'Distance'}</span>
              </button>
            </div>
          </div>

          {/* Facilities Scrollable List */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {filtered.length === 0 ? (
              <div className="text-center py-16 px-4 bg-slate-50/70 rounded-2xl border border-dashed border-slate-200 space-y-3">
                <img
                  src="/illustrations/undraw_navigation.svg"
                  alt="No facilities"
                  className="h-28 w-auto mx-auto object-contain"
                />
                <p className="text-sm font-bold text-slate-800">No Toilet Centers Plotted</p>
                <p className="text-xs text-slate-500 leading-relaxed">
                  No public restroom complexes found. Municipal administrators can register and plot centers on the map.
                </p>
              </div>
            ) : (
              filtered.map((facility) => {
              const isSelected = selectedFacility?._id === facility._id;
              const statusBadge = getStatusBadge(facility.status?.availability);
              const distanceKm = getDistanceToFacility(facility);

              return (
                <div
                  key={facility._id}
                  onClick={() => setSelectedFacility(facility)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-50/80 border-emerald-400 shadow-xs'
                      : 'bg-slate-50/70 hover:bg-slate-100 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-white text-slate-800 border border-slate-200">
                        {facility.code}
                      </span>
                      {distanceKm !== null && (
                        <span className="text-[10px] font-bold text-purple-700 bg-purple-50 border border-purple-200 px-1.5 py-0.5 rounded font-mono">
                          {distanceKm} km
                        </span>
                      )}
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusBadge.color}`}>
                      {statusBadge.label}
                    </span>
                  </div>

                  <div className="text-xs font-bold text-slate-900 leading-tight mb-1">
                    {facility.name}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate mb-2">
                    📍 {facility.address}
                  </div>

                  {/* Telemetry pill */}
                  <div className="flex items-center justify-between text-[10px] text-slate-600 bg-white p-1.5 rounded-lg border border-slate-200">
                    <span className="flex items-center gap-1 font-semibold">
                      <Droplets className="w-3 h-3 text-blue-500" />
                      <span>{facility.telemetry?.waterLevel}%</span>
                    </span>
                    <span className="flex items-center gap-1 font-semibold">
                      <Wind className="w-3 h-3 text-emerald-600" />
                      <span>{facility.telemetry?.odorLevelPpm} PPM</span>
                    </span>
                    <span className="text-emerald-700 font-bold flex items-center gap-0.5">
                      <Navigation className="w-3 h-3" />
                      <span>Fly to Pin</span>
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
        </div>

        {/* Right Map Canvas (640px height) */}
        <div className="lg:col-span-8">
          <ToiletMap
            facilities={facilities}
            selectedFacility={selectedFacility}
            onSelectFacility={setSelectedFacility}
            onOpenReport={(code) => navigate(`/report/${code}`)}
            onOpenQR={(facility) => setQrModalFacility(facility)}
            height="640px"
          />
        </div>
      </div>
    </div>
  );
}

