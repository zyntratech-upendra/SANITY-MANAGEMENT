import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  MapPin,
  Search,
  RotateCcw,
  LocateFixed,
  Layers,
  Maximize2,
  Minimize2,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

export default function ToiletMap({
  facilities = [],
  selectedFacility,
  onSelectFacility,
  onOpenReport,
  onOpenQR,
  isExpanded = false,
  height = '480px',
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({});
  const activeTileLayerRef = useRef(null);
  const userMarkerRef = useRef(null);

  const [zoneFilter, setZoneFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [tileStyle, setTileStyle] = useState('osm'); // 'osm', 'voyager', 'satellite'
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [locating, setLocating] = useState(false);

  // Status color helper
  const getStatusColor = (facility) => {
    const avail = facility.status?.availability;
    const clean = facility.status?.cleanliness;
    const water = facility.telemetry?.waterLevel ?? 80;
    const odor = facility.telemetry?.odorLevelPpm ?? 10;

    if (avail === 'MAINTENANCE_REQUIRED' || clean === 'CRITICAL_UNHYGIENIC' || water <= 20) {
      return { bg: '#ef4444', label: 'Critical Alert', pulse: true };
    }
    if (avail === 'CLEANING_IN_PROGRESS') {
      return { bg: '#f59e0b', label: 'Cleaning In Progress', pulse: true };
    }
    if (avail === 'OCCUPIED') {
      return { bg: '#3b82f6', label: 'Occupied', pulse: false };
    }
    if (clean === 'NEEDS_ATTENTION' || odor >= 35) {
      return { bg: '#eab308', label: 'Needs Attention', pulse: false };
    }
    return { bg: '#10b981', label: 'Available & Clean', pulse: false };
  };

  // Create custom Leaflet HTML DivIcon with vibrant colors
  const createCustomMarker = (facility, isSelected = false) => {
    const { bg, pulse } = getStatusColor(facility);
    const size = isSelected ? 44 : 36;

    const html = `
      <div style="position: relative; width: ${size}px; height: ${size}px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
        ${
          pulse
            ? `<div style="position: absolute; width: 100%; height: 100%; border-radius: 9999px; background-color: ${bg}; opacity: 0.45; animation: status-pulse 1.8s infinite;"></div>`
            : ''
        }
        <div style="
          width: ${size - 4}px; 
          height: ${size - 4}px; 
          border-radius: 9999px; 
          background-color: ${bg}; 
          border: 3px solid #ffffff; 
          box-shadow: 0 4px 12px rgba(0,0,0,0.28); 
          display: flex; 
          align-items: center; 
          justify-content: center;
          color: #ffffff;
          font-weight: 800;
          font-size: ${size > 38 ? '14px' : '12px'};
        ">
          🚽
        </div>
      </div>
    `;

    return L.divIcon({
      className: 'custom-toilet-marker',
      html,
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
      popupAnchor: [0, -size / 2],
    });
  };

  // Initialize Map safely (immune to React StrictMode re-mounts)
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Reset container if Leaflet previously attached to it
    if (mapContainerRef.current._leaflet_id) {
      delete mapContainerRef.current._leaflet_id;
    }

    const map = L.map(mapContainerRef.current, {
      center: [16.9942, 81.7766], // Rajamahendravaram (Pushkar Ghat)
      zoom: 14,
      zoomControl: false,
    });

    // Add zoom controls at bottom-right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Initial tile layer (Standard OpenStreetMap)
    const initialLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    activeTileLayerRef.current = initialLayer;
    mapInstanceRef.current = map;

    // Invalidate size once DOM renders completely
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 250);

    const handleResize = () => map.invalidateSize();
    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Handle Tile Style changes (OSM vs Voyager vs Satellite)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (activeTileLayerRef.current) {
      map.removeLayer(activeTileLayerRef.current);
    }

    let url = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
    let attribution = '&copy; OpenStreetMap contributors';

    if (tileStyle === 'voyager') {
      url = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
      attribution = '&copy; OpenStreetMap &copy; CARTO';
    } else if (tileStyle === 'satellite') {
      url = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      attribution = 'Tiles &copy; Esri';
    }

    const newLayer = L.tileLayer(url, {
      attribution,
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);

    activeTileLayerRef.current = newLayer;
  }, [tileStyle]);

  // Update Markers when facilities or filters change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing markers
    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};

    const filtered = facilities.filter((f) => {
      if (zoneFilter !== 'ALL' && f.zone !== zoneFilter) return false;
      if (statusFilter !== 'ALL' && f.status?.availability !== statusFilter) return false;
      if (
        searchQuery &&
        !f.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !f.code.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !f.address.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      return true;
    });

    filtered.forEach((facility) => {
      if (!facility.location?.lat || !facility.location?.lng) return;

      const isSelected = selectedFacility?._id === facility._id;
      const marker = L.marker([facility.location.lat, facility.location.lng], {
        icon: createCustomMarker(facility, isSelected),
        title: `${facility.name} (${facility.code})`,
      }).addTo(map);

      // Create Light Popup Content
      const { bg, label } = getStatusColor(facility);
      const popupHtml = document.createElement('div');
      popupHtml.className = 'p-1 text-slate-800 min-w-[250px]';
      popupHtml.innerHTML = `
        <div class="flex items-center justify-between border-b border-slate-200 pb-2 mb-2">
          <div>
            <span class="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">${facility.code}</span>
            <div class="text-sm font-bold text-slate-900 mt-1 leading-tight">${facility.name}</div>
          </div>
          <span class="text-[10px] font-bold px-2 py-0.5 rounded-full" style="background-color: ${bg}18; color: ${bg}; border: 1px solid ${bg}44;">
            ${label}
          </span>
        </div>
        <div class="text-xs text-slate-600 mb-2 leading-tight">${facility.address}</div>
        
        <!-- Telemetry Gauges -->
        <div class="grid grid-cols-2 gap-1.5 mb-3 text-[11px] bg-slate-50 p-2 rounded-lg border border-slate-200">
          <div class="flex items-center gap-1.5">
            <span class="text-blue-600 font-semibold">💧 Water:</span>
            <span class="font-bold ${facility.telemetry?.waterLevel <= 20 ? 'text-red-600' : 'text-slate-800'}">
              ${facility.telemetry?.waterLevel ?? 85}%
            </span>
          </div>
          <div class="flex items-center gap-1.5">
            <span class="text-emerald-700 font-semibold">💨 Odor:</span>
            <span class="font-bold ${facility.telemetry?.odorLevelPpm >= 40 ? 'text-red-600' : 'text-slate-800'}">
              ${facility.telemetry?.odorLevelPpm ?? 12} PPM
            </span>
          </div>
          <div class="flex items-center gap-1.5">
            <span class="text-amber-700 font-semibold">🧼 Soap:</span>
            <span class="font-bold text-slate-800">${facility.telemetry?.soapLevel ?? 80}%</span>
          </div>
          <div class="flex items-center gap-1.5">
            <span class="text-purple-700 font-semibold">👥 Today:</span>
            <span class="font-bold text-slate-800">${facility.telemetry?.footfallCountToday ?? 0}</span>
          </div>
        </div>

        <div class="flex items-center gap-1.5 pt-1">
          <button id="btn-report-${facility.code}" class="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-1.5 px-2 rounded-lg transition-all text-center cursor-pointer shadow-sm">
            Report Issue
          </button>
          <button id="btn-qr-${facility.code}" class="bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-xs font-semibold py-1.5 px-2.5 rounded-lg transition-all cursor-pointer">
            QR Sign
          </button>
        </div>
      `;

      marker.bindPopup(popupHtml, { maxWidth: 300 });

      // Handle popup button clicks
      marker.on('popupopen', () => {
        const reportBtn = document.getElementById(`btn-report-${facility.code}`);
        const qrBtn = document.getElementById(`btn-qr-${facility.code}`);

        if (reportBtn) {
          reportBtn.onclick = () => {
            if (onOpenReport) onOpenReport(facility.code);
          };
        }
        if (qrBtn) {
          qrBtn.onclick = () => {
            if (onOpenQR) onOpenQR(facility);
          };
        }
      });

      marker.on('click', () => {
        if (onSelectFacility) onSelectFacility(facility);
      });

      markersRef.current[facility._id] = marker;
    });

    // Auto-fit bounds
    if (filtered.length > 0 && !selectedFacility) {
      const latLngs = filtered.map((f) => [f.location.lat, f.location.lng]);
      const bounds = L.latLngBounds(latLngs);
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
    }
  }, [facilities, zoneFilter, statusFilter, searchQuery, selectedFacility]);

  // Smoothly Fly to Selected Facility when user clicks on a facility
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedFacility?.location?.lat) return;

    map.flyTo([selectedFacility.location.lat, selectedFacility.location.lng], 16, {
      duration: 1.2,
    });

    const marker = markersRef.current[selectedFacility._id];
    if (marker) {
      setTimeout(() => {
        marker.openPopup();
      }, 800);
    }
  }, [selectedFacility]);

  // Recenter / Fit All button
  const handleRecenter = () => {
    if (!mapInstanceRef.current || facilities.length === 0) return;
    const latLngs = facilities.map((f) => [f.location.lat, f.location.lng]);
    const bounds = L.latLngBounds(latLngs);
    mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 13 });
  };

  // HTML5 Geolocation to Locate User on Map
  const handleLocateMe = () => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (navigator.geolocation) {
      setLocating(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocating(false);
          const { latitude, longitude } = pos.coords;

          if (userMarkerRef.current) {
            userMarkerRef.current.remove();
          }

          const userIcon = L.divIcon({
            className: 'user-location-marker',
            html: `
              <div style="position: relative; width: 24px; height: 24px;">
                <div style="position: absolute; width: 100%; height: 100%; border-radius: 9999px; background-color: #3b82f6; opacity: 0.5; animation: status-pulse 1.5s infinite;"></div>
                <div style="width: 16px; height: 16px; margin: 4px; border-radius: 9999px; background-color: #2563eb; border: 2px solid #ffffff; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"></div>
              </div>
            `,
            iconSize: [24, 24],
            iconAnchor: [12, 12],
          });

          const userMarker = L.marker([latitude, longitude], { icon: userIcon })
            .addTo(map)
            .bindPopup('<b>📍 Your Current Location</b>')
            .openPopup();

          userMarkerRef.current = userMarker;
          map.flyTo([latitude, longitude], 14);
        },
        (err) => {
          setLocating(false);
          alert('Could not get your location: ' + err.message);
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  const zones = ['ALL', 'Central Ward', 'North Ward', 'South Ward', 'East Ward'];

  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm transition-all ${
        isFullscreen ? 'fixed inset-4 z-50 overflow-hidden shadow-2xl' : 'mb-6'
      }`}
    >
      {/* Top Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              City-Wide Public Toilet GIS Map
              <span className="text-xs font-semibold text-slate-500">({facilities.length} Live Pins)</span>
            </h2>
            <p className="text-xs text-slate-500">
              Interactive sanitation GPS map with live status, sensor telemetry, and dispatch triggers
            </p>
          </div>
        </div>

        {/* Filter & Control Bar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search facility name or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-50 text-slate-800 text-xs pl-8 pr-3 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:border-emerald-500 w-44 md:w-52"
            />
          </div>

          {/* Zone Selector */}
          <select
            value={zoneFilter}
            onChange={(e) => setZoneFilter(e.target.value)}
            className="bg-slate-50 text-slate-700 text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:border-emerald-500 font-medium cursor-pointer"
          >
            {zones.map((z) => (
              <option key={z} value={z}>
                {z === 'ALL' ? 'All Wards' : z}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 text-slate-700 text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:border-emerald-500 font-medium cursor-pointer"
          >
            <option value="ALL">All Status</option>
            <option value="AVAILABLE">Available</option>
            <option value="OCCUPIED">Occupied</option>
            <option value="CLEANING_IN_PROGRESS">Cleaning</option>
            <option value="MAINTENANCE_REQUIRED">Maintenance</option>
          </select>

          {/* Map Layer Switcher (OSM / Voyager / Satellite) */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
            <button
              onClick={() => setTileStyle('osm')}
              className={`px-2 py-1 rounded-md font-semibold text-[11px] transition-all cursor-pointer ${
                tileStyle === 'osm' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="OpenStreetMap Standard"
            >
              Street
            </button>
            <button
              onClick={() => setTileStyle('voyager')}
              className={`px-2 py-1 rounded-md font-semibold text-[11px] transition-all cursor-pointer ${
                tileStyle === 'voyager' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="CartoDB Voyager Clean"
            >
              Voyager
            </button>
            <button
              onClick={() => setTileStyle('satellite')}
              className={`px-2 py-1 rounded-md font-semibold text-[11px] transition-all cursor-pointer ${
                tileStyle === 'satellite' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Satellite Imagery"
            >
              Satellite
            </button>
          </div>

          {/* Locate My Location */}
          <button
            onClick={handleLocateMe}
            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-blue-600 rounded-lg border border-slate-200 transition-all cursor-pointer"
            title="Locate My GPS Position"
          >
            <LocateFixed className={`w-4 h-4 ${locating ? 'animate-spin' : ''}`} />
          </button>

          {/* Recenter / Fit All */}
          <button
            onClick={handleRecenter}
            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg border border-slate-200 transition-all cursor-pointer"
            title="Fit All Facilities"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={() => {
              setIsFullscreen(!isFullscreen);
              setTimeout(() => {
                mapInstanceRef.current?.invalidateSize();
              }, 200);
            }}
            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg border border-slate-200 transition-all cursor-pointer"
            title={isFullscreen ? 'Exit Fullscreen' : 'Expand Map'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Map Canvas */}
      <div
        style={{ height: isFullscreen ? 'calc(100% - 60px)' : height }}
        className="relative w-full rounded-xl overflow-hidden border border-slate-200"
      >
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* Light Legend Overlay */}
        <div className="absolute bottom-3 left-3 z-[1000] bg-white/95 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-200 shadow-md text-[11px] font-medium flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="text-slate-700">Available</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
            <span className="text-slate-700">Occupied</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span className="text-slate-700">Cleaning</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
            <span className="text-slate-700">Maintenance Alert</span>
          </div>
        </div>
      </div>
    </div>
  );
}
