import React, { useState } from 'react';
import {
  Radio,
  Droplets,
  Wind,
  UserCheck,
  Sparkles,
  Zap,
  Activity,
  CheckCircle2,
} from 'lucide-react';

export default function IoTSimulatorView({
  facilities = [],
  onSimulateEvent,
  onUpdateTelemetry,
}) {
  const [selectedFacilityId, setSelectedFacilityId] = useState(facilities[0]?._id || '');
  const [loadingEvent, setLoadingEvent] = useState(false);

  const currentFacility = facilities.find((f) => f._id === selectedFacilityId) || facilities[0];

  if (facilities.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 text-center space-y-4 max-w-xl mx-auto my-6 animate-in fade-in duration-300">
        <img
          src="/illustrations/undraw_local_server.svg"
          alt="No facilities"
          className="h-36 sm:h-44 w-auto mx-auto object-contain"
        />
        <h2 className="text-lg sm:text-xl font-black text-slate-900">No Toilet Centers Registered Yet</h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
          IoT sensor telemetry and odor simulation requires at least one registered restroom complex in the system. The Chief Commissioner Admin can register facilities from the Admin Console.
        </p>
      </div>
    );
  }

  const handleSimulate = async (eventType) => {
    if (!currentFacility) return;
    try {
      setLoadingEvent(true);
      await onSimulateEvent(currentFacility._id, eventType);
    } catch (err) {
      alert('Simulation error: ' + err.message);
    } finally {
      setLoadingEvent(false);
    }
  };

  const handleSliderChange = async (metric, val) => {
    if (!currentFacility) return;
    await onUpdateTelemetry(currentFacility._id, { [metric]: Number(val) });
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
            </span>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Radio className="w-5 h-5 text-emerald-600" />
              Smart Sanitation IoT Telemetry & Sensor Simulator
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time multi-sensor telemetry monitoring with automated threshold incident dispatch
          </p>
        </div>

        {/* Facility Target Selector */}
        <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
          <span className="text-xs text-slate-500 font-semibold">Target Facility:</span>
          <select
            value={selectedFacilityId}
            onChange={(e) => setSelectedFacilityId(e.target.value)}
            className="bg-white text-slate-800 text-xs px-3 py-1.5 rounded-lg border border-slate-300 font-bold focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            {facilities.map((f) => (
              <option key={f._id} value={f._id}>
                [{f.code}] {f.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Interactive Testing & Simulation Action Control Bar */}
      {currentFacility && (
        <div className="bg-gradient-to-r from-indigo-50/70 via-slate-50 to-emerald-50/70 rounded-3xl p-6 border border-indigo-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900">
                Live Sensor Anomaly Simulation Engine
              </h3>
            </div>
            <span className="text-[11px] text-indigo-800 font-bold bg-indigo-100 px-2.5 py-0.5 rounded-full border border-indigo-200">
              Interactive Test Mode
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Click any trigger below to simulate hardware telemetry anomalies on <strong>{currentFacility.name} ({currentFacility.code})</strong>. 
            The system will instantly evaluate thresholds and automatically create maintenance tasks!
          </p>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-2">
            <button
              onClick={() => handleSimulate('LOW_WATER')}
              disabled={loadingEvent}
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-800 transition-all text-center group cursor-pointer shadow-xs"
            >
              <Droplets className="w-5 h-5 text-red-600 mb-1 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold">Low Water Tank</span>
              <span className="text-[10px] text-red-600 font-medium">Simulate 12% Drop</span>
            </button>

            <button
              onClick={() => handleSimulate('ODOR_SPIKE')}
              disabled={loadingEvent}
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 transition-all text-center group cursor-pointer shadow-xs"
            >
              <Wind className="w-5 h-5 text-amber-600 mb-1 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold">Ammonia / Odor Spike</span>
              <span className="text-[10px] text-amber-600 font-medium">Simulate 58 PPM</span>
            </button>

            <button
              onClick={() => handleSimulate('EMPTY_SOAP')}
              disabled={loadingEvent}
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-800 transition-all text-center group cursor-pointer shadow-xs"
            >
              <Sparkles className="w-5 h-5 text-orange-600 mb-1 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold">Empty Soap Dispenser</span>
              <span className="text-[10px] text-orange-600 font-medium">Simulate 8% Level</span>
            </button>

            <button
              onClick={() => handleSimulate('TOGGLE_OCCUPANCY')}
              disabled={loadingEvent}
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-800 transition-all text-center group cursor-pointer shadow-xs"
            >
              <UserCheck className="w-5 h-5 text-blue-600 mb-1 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold">Toggle Stall Door</span>
              <span className="text-[10px] text-blue-600 font-medium">Occupied / Vacant</span>
            </button>

            <button
              onClick={() => handleSimulate('RESTORE_ALL_GOOD')}
              disabled={loadingEvent}
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 transition-all text-center group cursor-pointer shadow-xs"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-600 mb-1 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold">Restore All Normal</span>
              <span className="text-[10px] text-emerald-600 font-medium">100% Water & Soap</span>
            </button>
          </div>

          {/* Real-time Fine Tuning Sliders */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 shadow-xs">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-700 mb-1.5 font-medium">
                <span className="flex items-center gap-1 font-semibold">
                  <Droplets className="w-3.5 h-3.5 text-blue-600" />
                  Water Tank Level:
                </span>
                <span className="font-mono font-bold text-blue-700">{currentFacility.telemetry?.waterLevel}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={currentFacility.telemetry?.waterLevel ?? 85}
                onChange={(e) => handleSliderChange('waterLevel', e.target.value)}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <span className="text-[10px] text-slate-500 font-medium">Auto-triggers plumbing task below 20%</span>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs text-slate-700 mb-1.5 font-medium">
                <span className="flex items-center gap-1 font-semibold">
                  <Wind className="w-3.5 h-3.5 text-emerald-600" />
                  Ammonia Odor Detector:
                </span>
                <span className="font-mono font-bold text-emerald-700">{currentFacility.telemetry?.odorLevelPpm} PPM</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={currentFacility.telemetry?.odorLevelPpm ?? 12}
                onChange={(e) => handleSliderChange('odorLevelPpm', e.target.value)}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <span className="text-[10px] text-slate-500 font-medium">Auto-flags sanitation alert above 45 PPM</span>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs text-slate-700 mb-1.5 font-medium">
                <span className="flex items-center gap-1 font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  Soap Dispenser Fluid:
                </span>
                <span className="font-mono font-bold text-amber-700">{currentFacility.telemetry?.soapLevel}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={currentFacility.telemetry?.soapLevel ?? 90}
                onChange={(e) => handleSliderChange('soapLevel', e.target.value)}
                className="w-full accent-amber-600 cursor-pointer"
              />
              <span className="text-[10px] text-slate-500 font-medium">Auto-dispatches refill task below 15%</span>
            </div>
          </div>
        </div>
      )}

      {/* City-Wide Telemetry Grid */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-600" />
          Active Sensor Array Telemetry (All Municipal Units)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {facilities.map((f) => {
            const isAlert =
              f.telemetry?.waterLevel <= 20 ||
              f.telemetry?.odorLevelPpm >= 45 ||
              f.status?.availability === 'MAINTENANCE_REQUIRED';

            return (
              <div
                key={f._id}
                className={`bg-white rounded-2xl border p-4 shadow-sm transition-all ${
                  isAlert ? 'border-red-300 bg-red-50/20' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200">
                    {f.code}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      f.telemetry?.isOccupied
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {f.telemetry?.isOccupied ? '🔴 In-Use' : '🟢 Vacant'}
                  </span>
                </div>

                <div className="text-sm font-bold text-slate-900 truncate">{f.name}</div>
                <div className="text-xs text-slate-500 mb-3">{f.zone}</div>

                {/* Gauges */}
                <div className="space-y-2 text-xs">
                  <div>
                    <div className="flex justify-between text-[11px] mb-0.5">
                      <span className="text-slate-500">Water Tank</span>
                      <span
                        className={`font-mono font-bold ${
                          f.telemetry?.waterLevel <= 20 ? 'text-red-600 animate-pulse' : 'text-slate-800'
                        }`}
                      >
                        {f.telemetry?.waterLevel}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          f.telemetry?.waterLevel <= 20 ? 'bg-red-500' : 'bg-blue-600'
                        }`}
                        style={{ width: `${f.telemetry?.waterLevel}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] mb-0.5">
                      <span className="text-slate-500">Odor / Ammonia Air</span>
                      <span
                        className={`font-mono font-bold ${
                          f.telemetry?.odorLevelPpm >= 45 ? 'text-red-600 animate-pulse' : 'text-slate-800'
                        }`}
                      >
                        {f.telemetry?.odorLevelPpm} PPM
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          f.telemetry?.odorLevelPpm >= 45 ? 'bg-red-500' : 'bg-emerald-600'
                        }`}
                        style={{ width: `${Math.min(100, (f.telemetry?.odorLevelPpm / 60) * 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] mb-0.5">
                      <span className="text-slate-500">Soap & Sanitizer</span>
                      <span className="font-mono font-bold text-slate-800">{f.telemetry?.soapLevel}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-amber-500"
                        style={{ width: `${f.telemetry?.soapLevel}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-3 border-t border-slate-100 mt-3 font-medium">
                  <span>Footfall: {f.telemetry?.footfallCountToday} visitors</span>
                  <span className="text-emerald-700 font-bold">● Sensor Online</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
