import React, { useState, useEffect } from 'react';
import { useSanitation } from '../context/SanitationContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import AdminCommandGraphic from '../components/gov/AdminCommandGraphic';
import {
  Building2,
  Users,
  MapPin,
  PlusCircle,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  Layers,
  Sparkles,
  QrCode,
  Search,
  ExternalLink,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const { facilities, fetchFacilities, setQrModalFacility } = useSanitation();

  const [activeTab, setActiveTab] = useState('centers'); // 'centers' | 'leads' | 'createCenter' | 'createLead'
  const [leads, setLeads] = useState([]);
  const [loadingLeads, setLoadingLeads] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  // Form: Create Center (Complex with Blocks)
  const [centerForm, setCenterForm] = useState({
    code: '',
    name: '',
    buildingName: '',
    zone: 'Central Ward',
    address: '',
    lat: '28.6328',
    lng: '77.2197',
    blocks: [
      { blockName: 'Male Section (Stalls & Urinals)', type: 'Male', stallsCount: 4, urinalsCount: 4 },
      { blockName: 'Female Section (Private Cabins)', type: 'Female', stallsCount: 5, urinalsCount: 0 },
      { blockName: 'Divyang / Accessible & Baby Care', type: 'Accessible', stallsCount: 2, urinalsCount: 0 },
    ],
  });

  // Form: Create Municipal Lead
  const [leadForm, setLeadForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    ward: 'Central Ward',
    allottedFacilities: [],
  });

  // Form: Allot Center to Lead
  const [selectedLeadId, setSelectedLeadId] = useState('');
  const [selectedFacilityIds, setSelectedFacilityIds] = useState([]);

  // Fetch Municipal Leads
  const fetchLeads = async () => {
    setLoadingLeads(true);
    try {
      const res = await api.getUsers({ role: 'MUNICIPAL_LEAD' });
      if (res.success) {
        setLeads(res.data);
      }
    } catch (err) {
      console.error('Error fetching leads:', err);
    } finally {
      setLoadingLeads(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // Block Helpers
  const handleAddBlock = () => {
    setCenterForm((prev) => ({
      ...prev,
      blocks: [
        ...prev.blocks,
        { blockName: `Section ${prev.blocks.length + 1}`, type: 'All-Gender', stallsCount: 2, urinalsCount: 0 },
      ],
    }));
  };

  const handleRemoveBlock = (index) => {
    setCenterForm((prev) => ({
      ...prev,
      blocks: prev.blocks.filter((_, i) => i !== index),
    }));
  };

  const handleBlockChange = (index, field, value) => {
    setCenterForm((prev) => {
      const updated = [...prev.blocks];
      updated[index][field] = value;
      return { ...prev, blocks: updated };
    });
  };

  // Submit Center Creation
  const handleCreateCenter = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        code: centerForm.code || undefined,
        name: centerForm.name,
        buildingName: centerForm.buildingName || 'Main Complex',
        zone: centerForm.zone,
        address: centerForm.address,
        location: {
          lat: parseFloat(centerForm.lat) || 28.6139,
          lng: parseFloat(centerForm.lng) || 77.209,
        },
        blocks: centerForm.blocks,
      };

      await api.createFacility(payload);
      setStatusMessage({ type: 'success', text: `Toilet Center "${centerForm.name}" registered successfully with QR code placard.` });
      fetchFacilities();
      setActiveTab('centers');
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.message || 'Failed to create center' });
    }
  };

  // Submit Lead Creation
  const handleCreateLead = async (e) => {
    e.preventDefault();
    try {
      await api.createLead(leadForm);
      setStatusMessage({ type: 'success', text: `Municipal Lead "${leadForm.name}" registered successfully.` });
      setLeadForm({ name: '', email: '', password: '', phone: '', ward: 'Central Ward', allottedFacilities: [] });
      fetchLeads();
      setActiveTab('leads');
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.message || 'Failed to create municipal lead' });
    }
  };

  // Allot Facilities to Lead
  const handleAllotFacilities = async (leadId) => {
    try {
      await api.allotFacilities({
        targetUserId: leadId,
        facilityIds: selectedFacilityIds,
      });
      setStatusMessage({ type: 'success', text: 'Toilet centers allotted successfully to Municipal Lead.' });
      fetchLeads();
      fetchFacilities();
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.message || 'Allotment failed' });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm flex flex-wrap items-center justify-between gap-6 card-interactive relative overflow-hidden">
        {/* Tricolor accent */}
        <div className="absolute top-0 left-0 right-0 h-1 flex">
          <div className="flex-1 bg-[#FF9933]" />
          <div className="flex-1 bg-[#FFFFFF]" />
          <div className="flex-1 bg-[#138808]" />
        </div>

        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center shadow-lg shadow-emerald-700/30 animate-float shrink-0">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-emerald-900 bg-emerald-100 px-3 py-0.5 rounded-full border border-emerald-200">
                Sanity Management • Central Command Directorate
              </span>
              <span className="text-xs text-slate-400 font-semibold">• Municipal Command Console</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              {user?.name || 'Municipal Commissioner'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5 max-w-md">
              City-wide restroom registration, zonal supervisor lead allocations, IoT sensor configurations & executive analytics.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-3">
            <AdminCommandGraphic className="h-24 sm:h-28 w-auto" />
            <img
              src="/illustrations/iot_radar_telemetry.gif"
              alt="Live Telemetry Stream"
              className="h-20 w-20 rounded-2xl border border-slate-200 shadow-sm object-cover hidden lg:block"
            />
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-3">
            <div className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-center">
              <span className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wide">Sanitation Centers</span>
              <span className="text-xl sm:text-2xl font-black text-slate-900">{facilities.length}</span>
            </div>
            <div className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-center">
              <span className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wide">Municipal Leads</span>
              <span className="text-xl sm:text-2xl font-black text-emerald-700">{leads.length}</span>
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
          onClick={() => setActiveTab('centers')}
          className={`px-5 py-3 rounded-2xl text-sm sm:text-base font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'centers'
              ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Building2 className="w-4 h-4" /> All Toilet Centers ({facilities.length})
        </button>

        <button
          onClick={() => setActiveTab('leads')}
          className={`px-5 py-3 rounded-2xl text-sm sm:text-base font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'leads'
              ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Users className="w-4 h-4" /> Municipal Leads ({leads.length})
        </button>

        <button
          onClick={() => setActiveTab('createCenter')}
          className={`px-5 py-3 rounded-2xl text-sm sm:text-base font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'createCenter'
              ? 'bg-emerald-700 text-white shadow-lg shadow-emerald-700/20'
              : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
          }`}
        >
          <PlusCircle className="w-4 h-4" /> Register New Complex
        </button>

        <button
          onClick={() => setActiveTab('createLead')}
          className={`px-5 py-3 rounded-2xl text-sm sm:text-base font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'createLead'
              ? 'bg-blue-700 text-white shadow-md'
              : 'bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200'
          }`}
        >
          <Users className="w-4 h-4" /> Create Municipal Lead
        </button>
      </div>

      {/* TAB 1: ALL CENTERS & BLOCKS */}
      {activeTab === 'centers' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">Registered Public Toilet Centers</h2>
              <p className="text-xs text-slate-500">
                Each center holds multiple blocks/sections under one unified QR code & location.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('createCenter')}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm cursor-pointer transition-colors"
            >
              <PlusCircle className="w-4 h-4" /> Add Center
            </button>
          </div>

          {facilities.length === 0 ? (
            <div className="p-8 sm:p-12 bg-slate-50 border border-dashed border-slate-300 rounded-3xl text-center space-y-4 my-2">
              <img
                src="/illustrations/undraw_smart_sanitation.svg"
                alt="No facilities"
                className="h-36 sm:h-44 w-auto mx-auto object-contain"
              />
              <div className="max-w-md mx-auto">
                <h3 className="text-lg font-black text-slate-900">No Toilet Centers Registered Yet</h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                  As the Municipal Commissioner, you can register and plot your city's public restroom complexes, set up sanitary block counts, and allot them to Ward Leads.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('createCenter')}
                className="inline-flex items-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-lg shadow-emerald-600/25 transition-all cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Register First Toilet Center</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              {facilities.map((facility) => {
              const blocks = facility.blocks && facility.blocks.length > 0
                ? facility.blocks
                : [
                    { blockName: 'Male Section', type: 'Male', stallsCount: facility.stallsCount?.male || 2 },
                    { blockName: 'Female Section', type: 'Female', stallsCount: facility.stallsCount?.female || 2 },
                    { blockName: 'Accessible Unit', type: 'Accessible', stallsCount: facility.stallsCount?.accessible || 1 },
                  ];

              return (
                <div
                  key={facility._id}
                  className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col justify-between hover:border-emerald-300 hover:bg-white transition-all shadow-sm group"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-mono text-xs font-black text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-lg">
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
                        {facility.status?.cleanliness || 'SATISFACTORY'}
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-sm mt-2 leading-snug group-hover:text-emerald-700 transition-colors">
                      {facility.name}
                    </h3>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                      Building: {facility.buildingName || 'Municipal Facility Complex'}
                    </p>
                    <p className="text-xs text-slate-600 mt-1 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{facility.address}</span>
                    </p>

                    {/* Block Breakout */}
                    <div className="mt-3 bg-white p-2.5 rounded-xl border border-slate-200/70">
                      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                        <Layers className="w-3 h-3 text-emerald-600" />
                        <span>Center Sections ({blocks.length} Blocks):</span>
                      </div>
                      <div className="space-y-1">
                        {blocks.map((b, i) => (
                          <div key={i} className="flex items-center justify-between text-xs text-slate-700">
                            <span className="truncate">• {b.blockName}</span>
                            <span className="text-[10px] text-slate-500 font-mono">
                              {b.stallsCount || 0} stalls {b.urinalsCount ? `| ${b.urinalsCount} urinals` : ''}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Assigned Municipal Lead & Worker */}
                    <div className="mt-2.5 text-[11px] text-slate-500 space-y-0.5">
                      <div>
                        <span className="font-semibold text-slate-700">Lead: </span>
                        <span>{facility.assignedLead?.name || 'Unassigned Lead'}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-slate-700">Worker: </span>
                        <span>{facility.assignedWorker?.name || facility.assignedStaff?.name || 'Unassigned Worker'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between">
                    <button
                      onClick={() => setQrModalFacility(facility)}
                      className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <QrCode className="w-3.5 h-3.5" /> Placard QR
                    </button>
                    <span className="text-[11px] font-mono text-slate-400">
                      GPS: {facility.location?.lat?.toFixed(3)}, {facility.location?.lng?.toFixed(3)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          )}
        </div>
      )}

      {/* TAB 2: MUNICIPAL LEADS & ALLOTMENT */}
      {activeTab === 'leads' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">Municipal Ward Leads</h2>
              <p className="text-xs text-slate-500">
                Designated ward officers responsible for supervising facilities and deploying workers.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('createLead')}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm cursor-pointer transition-colors"
            >
              <PlusCircle className="w-4 h-4" /> Create Municipal Lead
            </button>
          </div>

          {leads.length === 0 ? (
            <div className="p-8 sm:p-12 bg-slate-50 border border-dashed border-slate-300 rounded-3xl text-center space-y-4 my-2">
              <img
                src="/illustrations/undraw_co_workers.svg"
                alt="No leads"
                className="h-36 sm:h-44 w-auto mx-auto object-contain"
              />
              <div className="max-w-md mx-auto">
                <h3 className="text-lg font-black text-slate-900">No Municipal Ward Leads Created Yet</h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                  Create Ward Lead accounts to empower zonal supervisors to manage facilities, allot field cleaners, and resolve citizen grievances.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('createLead')}
                className="inline-flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-lg shadow-blue-600/25 transition-all cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Create First Municipal Ward Lead</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {leads.map((lead) => (
              <div
                key={lead._id}
                className="p-5 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-full bg-blue-100 text-blue-800">
                      {lead.ward || 'Central Ward'}
                    </span>
                    <span className="text-xs text-slate-400">Officer ID: {lead._id.slice(-6).toUpperCase()}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-base mt-2">{lead.name}</h3>
                  <p className="text-xs text-slate-500">{lead.email}</p>
                  <p className="text-xs text-slate-500">{lead.phone || 'Phone not set'}</p>

                  <div className="mt-3 p-3 bg-white border border-slate-200/80 rounded-xl">
                    <div className="text-[11px] font-bold text-slate-700 mb-1">
                      Allotted Toilet Centers ({lead.allottedFacilities?.length || 0}):
                    </div>
                    {lead.allottedFacilities && lead.allottedFacilities.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {lead.allottedFacilities.map((f) => (
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

                {/* Allotment Control */}
                <div className="mt-4 pt-3 border-t border-slate-200 flex items-center gap-2">
                  <select
                    onChange={(e) => {
                      const val = e.target.value;
                      if (!val) return;
                      const existing = lead.allottedFacilities?.map((f) => f._id || f) || [];
                      const updated = existing.includes(val) ? existing : [...existing, val];
                      setSelectedFacilityIds(updated);
                      handleAllotFacilities(lead._id);
                    }}
                    className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    defaultValue=""
                  >
                    <option value="" disabled>+ Allot Toilet Center...</option>
                    {facilities.map((f) => (
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

      {/* TAB 3: REGISTER NEW TOILET CENTER & BLOCKS */}
      {activeTab === 'createCenter' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm max-w-3xl mx-auto space-y-6">
          <div>
            <h2 className="text-lg font-black text-slate-900">Register Public Toilet Center Complex</h2>
            <p className="text-xs text-slate-500">
              Create a physical building complex with multiple blocks/cabins. Generates a unique Swachh ID & QR Code.
            </p>
          </div>

          <form onSubmit={handleCreateCenter} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Center Name *</label>
                <input
                  type="text"
                  required
                  value={centerForm.name}
                  onChange={(e) => setCenterForm({ ...centerForm, name: e.target.value })}
                  placeholder="e.g. Connaught Place Circle 4 Complex"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Building / Landmark</label>
                <input
                  type="text"
                  value={centerForm.buildingName}
                  onChange={(e) => setCenterForm({ ...centerForm, buildingName: e.target.value })}
                  placeholder="e.g. Metro Exit 3 Arcade"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Ward Zone *</label>
                <select
                  value={centerForm.zone}
                  onChange={(e) => setCenterForm({ ...centerForm, zone: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                >
                  <option value="Central Ward">Central Ward</option>
                  <option value="North Ward">North Ward</option>
                  <option value="South Ward">South Ward</option>
                  <option value="East Ward">East Ward</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Custom Code (Optional)</label>
                <input
                  type="text"
                  value={centerForm.code}
                  onChange={(e) => setCenterForm({ ...centerForm, code: e.target.value.toUpperCase() })}
                  placeholder="Leave empty for auto-code (TOILET-xxx)"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono focus:ring-2 focus:ring-emerald-500 focus:bg-white uppercase"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Street Address *</label>
                <input
                  type="text"
                  required
                  value={centerForm.address}
                  onChange={(e) => setCenterForm({ ...centerForm, address: e.target.value })}
                  placeholder="e.g. Sector 12 Outer Ring Road, Near Bus Terminus"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">GIS Latitude *</label>
                <input
                  type="text"
                  required
                  value={centerForm.lat}
                  onChange={(e) => setCenterForm({ ...centerForm, lat: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">GIS Longitude *</label>
                <input
                  type="text"
                  required
                  value={centerForm.lng}
                  onChange={(e) => setCenterForm({ ...centerForm, lng: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                />
              </div>
            </div>

            {/* BLOCK ARCHITECTURE BUILDER */}
            <div className="pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-emerald-700" /> Complex Blocks & Sub-Sections
                  </h3>
                  <p className="text-xs text-slate-500">
                    Define the internal toilet rooms/sections of this building.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddBlock}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                >
                  + Add Section
                </button>
              </div>

              <div className="space-y-2">
                {centerForm.blocks.map((b, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex flex-wrap items-center gap-3 text-xs"
                  >
                    <input
                      type="text"
                      value={b.blockName}
                      onChange={(e) => handleBlockChange(idx, 'blockName', e.target.value)}
                      placeholder="Section Name"
                      className="flex-1 min-w-[150px] px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-800 font-medium"
                    />

                    <select
                      value={b.type}
                      onChange={(e) => handleBlockChange(idx, 'type', e.target.value)}
                      className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-800"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Accessible">Accessible</option>
                      <option value="All-Gender">All-Gender</option>
                      <option value="Urinal-Only">Urinal-Only</option>
                    </select>

                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-500">Stalls:</span>
                      <input
                        type="number"
                        min="0"
                        value={b.stallsCount}
                        onChange={(e) => handleBlockChange(idx, 'stallsCount', parseInt(e.target.value) || 0)}
                        className="w-14 px-2 py-1 bg-white border border-slate-300 rounded-lg text-center font-mono"
                      />
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-500">Urinals:</span>
                      <input
                        type="number"
                        min="0"
                        value={b.urinalsCount}
                        onChange={(e) => handleBlockChange(idx, 'urinalsCount', parseInt(e.target.value) || 0)}
                        className="w-14 px-2 py-1 bg-white border border-slate-300 rounded-lg text-center font-mono"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveBlock(idx)}
                      disabled={centerForm.blocks.length <= 1}
                      className="p-1.5 text-red-500 hover:text-red-700 disabled:opacity-30 cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setActiveTab('centers')}
                className="px-4 py-2.5 text-slate-600 hover:text-slate-900 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/20 cursor-pointer transition-all"
              >
                Register Complex & Generate QR
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 4: CREATE MUNICIPAL LEAD */}
      {activeTab === 'createLead' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm max-w-xl mx-auto space-y-6">
          <div>
            <h2 className="text-lg font-black text-slate-900">Create Municipal Lead Account</h2>
            <p className="text-xs text-slate-500">
              Municipal Leads supervise designated wards and assign cleaning workers to toilet centers.
            </p>
          </div>

          <form onSubmit={handleCreateLead} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Lead Name *</label>
              <input
                type="text"
                required
                value={leadForm.name}
                onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                placeholder="e.g. Er. Meenakshi Sundaram"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Official Email *</label>
              <input
                type="email"
                required
                value={leadForm.email}
                onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                placeholder="lead.ward@swachh.gov.in"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Password *</label>
              <input
                type="password"
                required
                value={leadForm.password}
                onChange={(e) => setLeadForm({ ...leadForm, password: e.target.value })}
                placeholder="Minimum 6 characters"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Phone Number</label>
              <input
                type="tel"
                value={leadForm.phone}
                onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                placeholder="+91 98111 22233"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Designated Ward *</label>
              <select
                value={leadForm.ward}
                onChange={(e) => setLeadForm({ ...leadForm, ward: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white"
              >
                <option value="Central Ward">Central Ward</option>
                <option value="North Ward">North Ward</option>
                <option value="South Ward">South Ward</option>
                <option value="East Ward">East Ward</option>
              </select>
            </div>

            <div className="pt-4 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setActiveTab('leads')}
                className="px-4 py-2.5 text-slate-600 hover:text-slate-900 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/20 cursor-pointer transition-all"
              >
                Create Municipal Lead
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

