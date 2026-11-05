import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSanitation } from '../context/SanitationContext';
import { api } from '../services/api';
import AdminCommandGraphic from '../components/gov/AdminCommandGraphic';
import {
  Building2,
  Users,
  AlertTriangle,
  CheckCircle2,
  PlusCircle,
  Briefcase,
  MapPin,
  Clock,
  Layers,
  Sparkles,
  QrCode,
  CheckCircle,
  AlertCircle,
  Shield,
} from 'lucide-react';

export default function LeadDashboardPage() {
  const { user } = useAuth();
  const { facilities, fetchFacilities, setQrModalFacility } = useSanitation();

  const [activeTab, setActiveTab] = useState('wardCenters'); // 'wardCenters' | 'workers' | 'createWorker' | 'complaints'
  const [workers, setWorkers] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [statusMessage, setStatusMessage] = useState(null);

  // Form: Create Worker
  const [workerForm, setWorkerForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    ward: user?.ward || 'Central Ward',
    allottedFacilities: [],
  });

  // Filter facilities relevant to this Municipal Lead (either assigned directly or by ward)
  const wardFacilities = facilities.filter(
    (f) =>
      f.assignedLead?.userId === user?._id ||
      f.assignedLead?.email === user?.email ||
      f.zone === user?.ward ||
      !user?.ward // Fallback to all if no ward restriction
  );

  const fetchWorkers = async () => {
    try {
      const res = await api.getUsers({ role: 'WORKER' });
      if (res.success) {
        setWorkers(res.data);
      }
    } catch (err) {
      console.error('Error fetching workers:', err);
    }
  };

  const fetchWardComplaints = async () => {
    try {
      const res = await api.getComplaints();
      if (res.success) {
        // Filter complaints for ward centers
        const centerCodes = wardFacilities.map((f) => f.code);
        const filtered = res.data.filter((c) => centerCodes.includes(c.facilityCode));
        setComplaints(filtered.length > 0 ? filtered : res.data);
      }
    } catch (err) {
      console.error('Error fetching complaints:', err);
    }
  };

  useEffect(() => {
    fetchWorkers();
    fetchWardComplaints();
  }, [facilities]);

  const handleCreateWorker = async (e) => {
    e.preventDefault();
    try {
      await api.createWorker({
        ...workerForm,
        ward: user?.ward || workerForm.ward,
      });
      setStatusMessage({ type: 'success', text: `Field Sanitation Worker "${workerForm.name}" created successfully.` });
      setWorkerForm({ name: '', email: '', password: '', phone: '', ward: user?.ward || 'Central Ward', allottedFacilities: [] });
      fetchWorkers();
      fetchFacilities();
      setActiveTab('workers');
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.message || 'Worker creation failed' });
    }
  };

  const handleAllotToWorker = async (workerId, facilityId) => {
    try {
      const targetWorker = workers.find((w) => w._id === workerId);
      const existing = targetWorker?.allottedFacilities?.map((f) => f._id || f) || [];
      const updated = existing.includes(facilityId) ? existing : [...existing, facilityId];

      await api.allotFacilities({
        targetUserId: workerId,
        facilityIds: updated,
      });

      setStatusMessage({ type: 'success', text: 'Toilet center allotted to sanitation worker.' });
      fetchWorkers();
      fetchFacilities();
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.message || 'Allotment failed' });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Lead Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm flex flex-wrap items-center justify-between gap-6 card-interactive relative overflow-hidden">
        {/* Tricolor accent */}
        <div className="absolute top-0 left-0 right-0 h-1 flex">
          <div className="flex-1 bg-[#FF9933]" />
          <div className="flex-1 bg-[#FFFFFF]" />
          <div className="flex-1 bg-[#138808]" />
        </div>

        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center shadow-lg shadow-blue-600/30 animate-float shrink-0">
            <Building2 className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-blue-900 bg-blue-100 px-3 py-0.5 rounded-full border border-blue-200">
                Sanity Management • Municipal Ward Lead
              </span>
              <span className="text-xs text-slate-400 font-semibold">• {user?.ward || 'Central Municipal Ward'}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">{user?.name || 'Zonal Officer'}</h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5 max-w-md">
              Zonal operations: Allotting municipal sanitation complexes to specialists, supervising IoT telemetry & resolving citizen tickets.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-3">
            <AdminCommandGraphic className="h-24 sm:h-28 w-auto" />
            <img
              src="/illustrations/iot_radar_telemetry.gif"
              alt="Live Telemetry Stream"
              className="h-20 w-20 rounded-2xl border border-blue-200 shadow-sm object-cover hidden lg:block"
            />
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-2.5">
            <div className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-center">
              <span className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wide">Ward Centers</span>
              <span className="text-xl sm:text-2xl font-black text-slate-900">{wardFacilities.length}</span>
            </div>
            <div className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-center">
              <span className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wide">Workers</span>
              <span className="text-xl sm:text-2xl font-black text-blue-700">{workers.length}</span>
            </div>
            <div className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-center">
              <span className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wide">Grievances</span>
              <span className="text-xl sm:text-2xl font-black text-amber-700">{complaints.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Status Alert Notification */}
      {statusMessage && (
        <div
          className={`p-4 rounded-2xl border flex items-center justify-between text-sm font-bold ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {statusMessage.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
          <button
            onClick={() => setStatusMessage(null)}
            className="text-slate-400 hover:text-slate-700 cursor-pointer font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap gap-3 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('wardCenters')}
          className={`px-5 py-3 rounded-2xl text-sm sm:text-base font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'wardCenters'
              ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Building2 className="w-4 h-4" /> Allotted Ward Centers ({wardFacilities.length})
        </button>

        <button
          onClick={() => setActiveTab('workers')}
          className={`px-5 py-3 rounded-2xl text-sm sm:text-base font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'workers'
              ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Users className="w-4 h-4" /> Sanitation Workers ({workers.length})
        </button>

        <button
          onClick={() => setActiveTab('createWorker')}
          className={`px-5 py-3 rounded-2xl text-sm sm:text-base font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'createWorker'
              ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/20'
              : 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200'
          }`}
        >
          <PlusCircle className="w-4 h-4" /> Create Sanitation Worker Login
        </button>

        <button
          onClick={() => setActiveTab('complaints')}
          className={`px-5 py-3 rounded-2xl text-sm sm:text-base font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'complaints'
              ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <AlertTriangle className="w-4 h-4" /> Ward Grievances ({complaints.length})
        </button>
      </div>

      {/* TAB 1: WARD SANITATION CENTERS */}
      {activeTab === 'wardCenters' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Ward Public Toilet Centers</h2>
              <p className="text-xs text-slate-500">
                Toilet centers allotted to your jurisdiction. Assign field workers to take charge of each center.
              </p>
            </div>
          </div>

          {wardFacilities.length === 0 ? (
            <div className="p-8 sm:p-12 bg-slate-50 border border-dashed border-slate-300 rounded-3xl text-center space-y-4 my-2">
              <img
                src="/illustrations/undraw_smart_sanitation.svg"
                alt="No facilities"
                className="h-32 sm:h-40 w-auto mx-auto object-contain"
              />
              <div className="max-w-md mx-auto">
                <h3 className="text-base sm:text-lg font-black text-slate-900">No Toilet Centers Allotted Yet</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  The Municipal Commissioner will allocate public restroom complexes to your ward jurisdiction. Once allotted, you can deploy workers and monitor hygiene.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              {wardFacilities.map((facility) => {
              const blocks = facility.blocks && facility.blocks.length > 0
                ? facility.blocks
                : [
                    { blockName: 'Male Section', type: 'Male', stallsCount: 4 },
                    { blockName: 'Female Section', type: 'Female', stallsCount: 4 },
                  ];

              return (
                <div
                  key={facility._id}
                  className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col justify-between hover:bg-white hover:border-blue-300 transition-all shadow-sm"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-mono text-xs font-black text-blue-800 bg-blue-100 px-2.5 py-1 rounded-lg">
                        {facility.code}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          facility.status?.cleanliness === 'EXCELLENT'
                            ? 'bg-emerald-100 text-emerald-800'
                            : facility.status?.cleanliness === 'SATISFACTORY'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {facility.status?.cleanliness}
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-sm mt-2">{facility.name}</h3>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Building: {facility.buildingName || 'Public Restroom Complex'}
                    </p>
                    <p className="text-xs text-slate-600 mt-1 truncate">{facility.address}</p>

                    {/* Telemetry Snapshot */}
                    <div className="grid grid-cols-2 gap-2 mt-3 p-2 bg-white rounded-xl border border-slate-200/60 text-center">
                      <div>
                        <span className="block text-[10px] text-slate-400">Water Supply</span>
                        <span className={`text-xs font-bold ${facility.telemetry?.waterLevel < 25 ? 'text-red-600' : 'text-slate-800'}`}>
                          {facility.telemetry?.waterLevel || 90}%
                        </span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-slate-400">Odor Level</span>
                        <span className={`text-xs font-bold ${facility.telemetry?.odorLevelPpm > 30 ? 'text-red-600' : 'text-emerald-700'}`}>
                          {facility.telemetry?.odorLevelPpm || 12} PPM
                        </span>
                      </div>
                    </div>

                    {/* Assigned Worker */}
                    <div className="mt-3 p-2.5 bg-blue-50/70 border border-blue-200/60 rounded-xl text-xs">
                      <span className="font-semibold text-blue-900">Assigned Sanitation Worker:</span>
                      <p className="font-bold text-slate-800 mt-0.5">
                        {facility.assignedWorker?.name || facility.assignedStaff?.name || '⚠️ Unassigned'}
                      </p>
                    </div>
                  </div>

                  {/* Worker Re-allotment Dropdown */}
                  <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between gap-2">
                    <select
                      onChange={(e) => {
                        if (e.target.value) handleAllotToWorker(e.target.value, facility._id);
                      }}
                      className="flex-1 px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                      defaultValue=""
                    >
                      <option value="" disabled>Change Worker...</option>
                      {workers.map((w) => (
                        <option key={w._id} value={w._id}>
                          {w.name}
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={() => setQrModalFacility(facility)}
                      className="px-2.5 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <QrCode className="w-3.5 h-3.5" /> Placard
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          )}
        </div>
      )}

      {/* TAB 2: FIELD SANITATION WORKERS */}
      {activeTab === 'workers' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Sanitation Field Workers</h2>
              <p className="text-xs text-slate-500">
                Staff responsible for physical cleaning, checklist completion, and restoring hygiene.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('createWorker')}
              className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm cursor-pointer transition-colors"
            >
              <PlusCircle className="w-4 h-4" /> Add Field Worker
            </button>
          </div>

          {workers.length === 0 ? (
            <div className="p-8 sm:p-12 bg-slate-50 border border-dashed border-slate-300 rounded-3xl text-center space-y-4 my-2">
              <img
                src="/illustrations/undraw_clean_up.svg"
                alt="No workers"
                className="h-32 sm:h-40 w-auto mx-auto object-contain"
              />
              <div className="max-w-md mx-auto">
                <h3 className="text-base sm:text-lg font-black text-slate-900">No Field Workers Registered Yet</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Register field sanitation specialists to assign toilet centers, track duty stopwatches, and dispatch rapid cleaning tasks.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('createWorker')}
                className="inline-flex items-center gap-2 px-5 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-lg shadow-amber-600/25 transition-all cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Register First Field Worker</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {workers.map((worker) => (
              <div
                key={worker._id}
                className="p-5 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-full bg-amber-100 text-amber-900">
                      Field Ops • {worker.ward || 'Central Ward'}
                    </span>
                    <span className="text-xs text-slate-400">Worker ID: {worker._id.slice(-6).toUpperCase()}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-base mt-2">{worker.name}</h3>
                  <p className="text-xs text-slate-500">{worker.email}</p>
                  <p className="text-xs text-slate-500">{worker.phone || 'Phone not set'}</p>

                  <div className="mt-3 p-3 bg-white border border-slate-200/80 rounded-xl">
                    <div className="text-[11px] font-bold text-slate-700 mb-1">
                      Assigned Toilet Centers ({worker.allottedFacilities?.length || 0}):
                    </div>
                    {worker.allottedFacilities && worker.allottedFacilities.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {worker.allottedFacilities.map((f) => (
                          <span
                            key={f._id || f}
                            className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[11px] font-mono rounded-md border border-slate-200"
                          >
                            {f.code || f}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-amber-700 italic">No centers allotted yet.</p>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200 flex items-center gap-2">
                  <select
                    onChange={(e) => {
                      if (e.target.value) handleAllotToWorker(worker._id, e.target.value);
                    }}
                    className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
                    defaultValue=""
                  >
                    <option value="" disabled>+ Allot Toilet Center...</option>
                    {wardFacilities.map((f) => (
                      <option key={f._id} value={f._id}>
                        {f.code} - {f.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
          )}
        </div>
      )}

      {/* TAB 3: CREATE WORKER */}
      {activeTab === 'createWorker' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm max-w-xl mx-auto space-y-6">
          <div>
            <h2 className="text-lg font-black text-slate-900">Create Field Sanitation Worker Account</h2>
            <p className="text-xs text-slate-500">
              The worker can log in to view their assigned centers, run cleaning timers, and complete tasks.
            </p>
          </div>

          <form onSubmit={handleCreateWorker} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Worker Name *</label>
              <input
                type="text"
                required
                value={workerForm.name}
                onChange={(e) => setWorkerForm({ ...workerForm, name: e.target.value })}
                placeholder="e.g. Rajesh Kumar"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Official Email / ID *</label>
              <input
                type="email"
                required
                value={workerForm.email}
                onChange={(e) => setWorkerForm({ ...workerForm, email: e.target.value })}
                placeholder="worker.name@swachh.gov.in"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Password *</label>
              <input
                type="password"
                required
                value={workerForm.password}
                onChange={(e) => setWorkerForm({ ...workerForm, password: e.target.value })}
                placeholder="Minimum 6 characters"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Phone Number</label>
              <input
                type="tel"
                value={workerForm.phone}
                onChange={(e) => setWorkerForm({ ...workerForm, phone: e.target.value })}
                placeholder="+91 98765 43210"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-amber-500 focus:bg-white"
              />
            </div>

            <div className="pt-4 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setActiveTab('workers')}
                className="px-4 py-2.5 text-slate-600 hover:text-slate-900 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-amber-600/20 cursor-pointer transition-all"
              >
                Create Worker Login
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 4: WARD GRIEVANCES & COMPLAINTS */}
      {activeTab === 'complaints' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Ward Grievances & Cleanliness Reports</h2>
              <p className="text-xs text-slate-500">
                Citizen QR feedback and automatic maintenance dispatch tracking.
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            {complaints.length === 0 ? (
              <div className="text-center py-10 bg-slate-50 rounded-2xl border border-slate-200">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-800">No Open Grievances</p>
                <p className="text-xs text-slate-500">All toilet facilities in your ward are in clean compliance.</p>
              </div>
            ) : (
              complaints.map((c) => (
                <div
                  key={c._id}
                  className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-wrap items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3">
                    <span className="font-mono text-xs font-bold text-slate-900 bg-white border border-slate-200 px-2.5 py-1 rounded-lg">
                      {c.ticketId}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">{c.facilityName}</span>
                        <span className="text-xs text-slate-500">({c.facilityCode})</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">
                        <span className="font-semibold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 mr-2">
                          Target: {c.targetBlock || 'Entire Complex'}
                        </span>
                        {c.issues?.join(', ') || 'Cleanliness Issue'}
                      </p>
                      {c.description && (
                        <p className="text-xs italic text-slate-500 mt-1">"{c.description}"</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right text-xs">
                      <span className="block text-slate-400 text-[10px]">Assigned Worker</span>
                      <span className="font-semibold text-slate-800">{c.assignedWorkerName || 'Pending'}</span>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        c.status === 'RESOLVED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

