import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSanitation } from '../context/SanitationContext';
import StatsOverview from '../components/StatsOverview';
import ToiletMap from '../components/ToiletMap';

export default function CommandCenterPage() {
  const navigate = useNavigate();
  const {
    facilities,
    complaints,
    tasks,
    staffList,
    selectedFacility,
    setSelectedFacility,
    setQrModalFacility,
    startTask,
    completeTask,
  } = useSanitation();

  return (
    <div className="space-y-6">
      {/* Top KPI Metrics Cards */}
      <StatsOverview
        facilities={facilities}
        complaints={complaints}
        tasks={tasks}
        staffList={staffList}
      />

      {/* Interactive Leaflet GIS Map */}
      <ToiletMap
        facilities={facilities}
        selectedFacility={selectedFacility}
        onSelectFacility={setSelectedFacility}
        onOpenReport={(code) => navigate(`/report/${code}`)}
        onOpenQR={(facility) => setQrModalFacility(facility)}
      />

      {/* Live Operations Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Complaints Preview Widget */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                Recent Citizen QR Complaints
              </h3>
              <button
                onClick={() => navigate('/complaints')}
                className="text-xs text-emerald-700 hover:text-emerald-800 font-bold cursor-pointer"
              >
                View Grievance Dashboard ({complaints.length}) →
              </button>
            </div>

            <div className="space-y-2.5">
              {complaints.slice(0, 3).map((c) => (
                <div
                  key={c._id}
                  className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs flex items-center justify-between gap-3"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded border border-amber-200">
                        {c.ticketId}
                      </span>
                      <span className="text-slate-900 font-bold">{c.facilityName}</span>
                    </div>
                    <div className="text-slate-500 text-[11px]">
                      Rating: ★{c.rating}/5 • {c.issues?.slice(0, 2).join(', ').replace(/_/g, ' ') || 'Inspection'}
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      c.status === 'RESOLVED'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-red-50 text-red-700 border-red-200 animate-pulse'
                    }`}
                  >
                    {c.status}
                  </span>
                </div>
              ))}
              {complaints.length === 0 && (
                <div className="text-xs text-slate-400 text-center py-6">
                  No citizen complaints registered.
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => navigate('/kiosk')}
            className="mt-4 w-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold py-2.5 px-3 rounded-xl border border-slate-200 transition-all text-center cursor-pointer"
          >
            Launch Citizen QR Feedback Kiosk →
          </button>
        </div>

        {/* Maintenance Tasks Preview Widget */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                Active Sanitation Tasks & Cleaning SLAs
              </h3>
              <button
                onClick={() => navigate('/staff')}
                className="text-xs text-emerald-700 hover:text-emerald-800 font-bold cursor-pointer"
              >
                View Staff & Tasks Dashboard ({tasks.length}) →
              </button>
            </div>

            <div className="space-y-2.5">
              {tasks.slice(0, 3).map((t) => (
                <div
                  key={t._id}
                  className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs flex items-center justify-between gap-3"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-200">
                        {t.taskId}
                      </span>
                      <span className="text-slate-900 font-bold truncate max-w-[200px]">{t.title}</span>
                    </div>
                    <div className="text-slate-500 text-[11px]">
                      Staff: {t.assignedStaff?.name || 'Unassigned'} • Status: {t.status}
                    </div>
                  </div>

                  {t.status === 'PENDING' && (
                    <button
                      onClick={() => startTask(t._id, t.assignedStaff?.name)}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold py-1 px-2.5 rounded-lg transition-all cursor-pointer shadow-xs"
                    >
                      Start Timer
                    </button>
                  )}
                  {t.status === 'IN_PROGRESS' && (
                    <button
                      onClick={() => completeTask(t._id)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold py-1 px-2.5 rounded-lg transition-all cursor-pointer shadow-xs"
                    >
                      Verify Clean
                    </button>
                  )}
                  {t.status === 'COMPLETED' && (
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      {t.durationMinutes}m duration
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => navigate('/staff-duty')}
            className="mt-4 w-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold py-2.5 px-3 rounded-xl border border-slate-200 transition-all text-center cursor-pointer"
          >
            Open Field Cleaner Mobile App →
          </button>
        </div>
      </div>
    </div>
  );
}
