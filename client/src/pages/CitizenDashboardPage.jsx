import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSanitation } from '../context/SanitationContext';
import { useLocationCoords } from '../context/LocationContext';
import { api } from '../services/api';
import QrScannerModal from '../components/QrScannerModal';
import CitizenScanningGraphic from '../components/gov/CitizenScanningGraphic';
import SwachhBharatLogo from '../components/gov/SwachhBharatLogo';
import {
  FaQrcode,
  FaLocationDot,
  FaCamera,
  FaStar,
  FaCircleCheck,
  FaRoute,
  FaLocationCrosshairs,
  FaShieldHalved,
  FaArrowRight,
  FaPaperPlane,
} from 'react-icons/fa6';
import {
  AlertTriangle,
  Building2,
  Layers,
  MapPin,
  CheckCircle2,
} from 'lucide-react';

const COMMON_ISSUES = [
  { id: 'NO_WATER', label: 'No Running Water' },
  { id: 'FOUL_ODOR', label: 'Unbearable Odor' },
  { id: 'DIRTY_FLOOR_STALLS', label: 'Dirty Floors & Stalls' },
  { id: 'NO_SOAP_SANITIZER', label: 'Soap Dispenser Empty' },
  { id: 'CLOGGED_FLUSH', label: 'Clogged Flush / Toilet' },
  { id: 'BROKEN_LIGHTING_OR_DOOR', label: 'Broken Door / Lock' },
  { id: 'OVERFLOWING_BIN', label: 'Overflowing Trash Bin' },
];

export default function CitizenDashboardPage() {
  const { user } = useAuth();
  const { facilities, fetchFacilities } = useSanitation();
  const { coords, hasLiveGps, requestLocation, getDistanceToFacility } = useLocationCoords();

  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [targetBlock, setTargetBlock] = useState('Entire Complex');
  const [rating, setRating] = useState(2);
  const [selectedIssues, setSelectedIssues] = useState(['DIRTY_FLOOR_STALLS']);
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState(null);
  const [myComplaints, setMyComplaints] = useState([]);

  // Set default selected facility
  useEffect(() => {
    if (facilities.length > 0 && !selectedFacility) {
      setSelectedFacility(facilities[0]);
    }
  }, [facilities]);

  const fetchMyComplaints = async () => {
    try {
      const res = await api.getComplaints(user?._id ? { citizenId: user._id } : {});
      if (res.success) {
        setMyComplaints(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch citizen complaints:', err);
    }
  };

  useEffect(() => {
    fetchMyComplaints();
  }, [user]);

  // Handle QR scan detection
  const handleQrDetected = (code) => {
    const matched = facilities.find((f) => f.code.toUpperCase() === code.toUpperCase());
    if (matched) {
      setSelectedFacility(matched);
      setTargetBlock('Entire Complex');
      setSubmittedTicket(null);
      // Smooth scroll to form
      document.getElementById('report-form-section')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const toggleIssue = (issueId) => {
    setSelectedIssues((prev) =>
      prev.includes(issueId) ? prev.filter((i) => i !== issueId) : [...prev, issueId]
    );
  };

  const handleSubmitReport = async (e) => {
    e.preventDefault();
    if (!selectedFacility) {
      alert('No public restroom complex has been registered yet. Please check back later or contact municipal authorities.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.createComplaint({
        facilityCode: selectedFacility.code,
        targetBlock,
        rating,
        issues: selectedIssues,
        description,
        citizenId: user?._id,
        reporterName: user?.name || 'Citizen User',
        reporterPhone: user?.phone || '',
        reporterEmail: user?.email || '',
      });

      setSubmittedTicket({
        ticketId: res.ticketId,
        facilityName: selectedFacility.name,
        targetBlock,
        task: res.task,
      });

      setDescription('');
      setSelectedIssues([]);
      fetchMyComplaints();
      fetchFacilities();
    } catch (err) {
      alert(err.message || 'Failed to submit report');
    } finally {
      setSubmitting(false);
    }
  };

  const blocks = selectedFacility?.blocks && selectedFacility.blocks.length > 0
    ? selectedFacility.blocks
    : [
        { blockName: 'Male Section (Stalls & Urinals)' },
        { blockName: 'Female Section' },
        { blockName: 'Divyang / Accessible Stall' },
      ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Citizen Welcome Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm flex flex-wrap items-center justify-between gap-6 card-interactive relative overflow-hidden">
        {/* Tricolor line */}
        <div className="absolute top-0 left-0 right-0 h-1 flex">
          <div className="flex-1 bg-[#FF9933]" />
          <div className="flex-1 bg-[#FFFFFF]" />
          <div className="flex-1 bg-[#138808]" />
        </div>

        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-700 text-white flex items-center justify-center shadow-lg shadow-purple-600/30 animate-float shrink-0">
            <FaQrcode className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-purple-900 bg-purple-100 px-3 py-0.5 rounded-full border border-purple-200">
                Sanity Management • Citizen Hygiene Portal
              </span>
              <span className="text-xs text-slate-400 font-semibold">• Public Restroom Sanitation</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              Namaste, {user?.name || 'Citizen'}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5 max-w-lg">
              Scan any public restroom QR placard to submit cleanliness feedback, report sanitation requirements, or locate nearby sanitized complexes.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-3">
            <CitizenScanningGraphic className="h-24 sm:h-28 w-auto" />
            <img
              src="/illustrations/scanner_laser.gif"
              alt="Live QR Laser Scanner"
              className="h-20 w-20 rounded-2xl border border-purple-200 shadow-sm object-cover hidden lg:block"
            />
          </div>

          {/* PRIMARY CTA: CAMERA QR SCANNER */}
          <button
            onClick={() => setIsScannerOpen(true)}
            className="px-6 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-sm rounded-2xl shadow-lg shadow-emerald-600/25 flex items-center gap-2.5 active:scale-95 transition-all cursor-pointer"
          >
            <FaCamera className="w-4 h-4" />
            <span>Scan Toilet QR Code</span>
          </button>
        </div>
      </div>

      {/* QR SCANNER MODAL */}
      <QrScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScanSuccess={handleQrDetected}
      />

      {/* SUCCESS TICKET RECEIPT MODAL / CARD */}
      {submittedTicket && (
        <div className="p-6 bg-emerald-50 border-2 border-emerald-300 rounded-3xl animate-in zoom-in-95 duration-200">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-200 px-2.5 py-0.5 rounded-full">
                Grievance Registered Successfully
              </span>
              <h2 className="text-lg font-black text-slate-900 mt-1">
                Ticket #{submittedTicket.ticketId} Created
              </h2>
              <p className="text-xs text-slate-600 mt-0.5">
                Target Facility: <span className="font-bold">{submittedTicket.facilityName}</span> • Target Section:{' '}
                <span className="font-bold">{submittedTicket.targetBlock}</span>
              </p>
              <p className="text-xs text-emerald-800 font-semibold mt-2">
                ✓ A sanitation maintenance task has been automatically dispatched to the field worker.
              </p>
            </div>
            <button
              onClick={() => setSubmittedTicket(null)}
              className="text-slate-400 hover:text-slate-700 font-bold text-xs"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* REPORTING & FACILITY SELECTOR GRID */}
      <div id="report-form-section" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT 2 COLS: CLEANLINESS GRIEVANCE FORM */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-5">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
                <AlertTriangle className="w-6 h-6 text-amber-500" />
                Report Sanitation Issue
              </h2>
              <p className="text-sm text-slate-500 font-medium mt-0.5">
                Reports apply to the entire toilet center with an optional section focus.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsScannerOpen(true)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-bold rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
            >
              <FaQrcode className="w-4 h-4 text-emerald-700" /> Scan QR
            </button>
          </div>

          <form onSubmit={handleSubmitReport} className="space-y-6">
            {/* FACILITY SELECTOR */}
            <div>
              <label className="block text-sm sm:text-base font-extrabold text-slate-800 uppercase tracking-wide mb-2">
                1. Select Public Toilet Center Facility *
              </label>
              <select
                value={selectedFacility?.code || ''}
                onChange={(e) => {
                  const f = facilities.find((item) => item.code === e.target.value);
                  setSelectedFacility(f);
                }}
                disabled={facilities.length === 0}
                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-300 rounded-2xl text-base font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:bg-white disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {facilities.length === 0 ? (
                  <option value="">No toilet complexes registered yet (Awaiting Admin setup)</option>
                ) : (
                  facilities.map((f) => {
                    const dist = getDistanceToFacility(f);
                    return (
                      <option key={f._id} value={f.code}>
                        {f.code} — {f.name} {dist ? `(${dist} km away)` : `(${f.zone})`}
                      </option>
                    );
                  })
                )}
              </select>
            </div>

            {/* TARGET BLOCK / SECTION SELECTOR */}
            <div>
              <label className="block text-sm sm:text-base font-extrabold text-slate-800 uppercase tracking-wide mb-2 flex items-center gap-2">
                <Layers className="w-5 h-5 text-emerald-600" />
                2. Target Section / Room (Inside this Center)
              </label>
              <select
                value={targetBlock}
                onChange={(e) => setTargetBlock(e.target.value)}
                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-300 rounded-2xl text-base font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              >
                <option value="Entire Complex">Entire Sanitation Complex (All Sections)</option>
                {blocks.map((b, i) => (
                  <option key={i} value={b.blockName}>
                    {b.blockName}
                  </option>
                ))}
              </select>
            </div>

            {/* STAR RATING */}
            <div>
              <label className="block text-sm sm:text-base font-extrabold text-slate-800 uppercase tracking-wide mb-2">
                3. Overall Hygiene & Cleanliness Rating *
              </label>
              <div className="flex flex-wrap items-center gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-2.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 cursor-pointer transition-transform hover:scale-125 focus:outline-none"
                    >
                      <FaStar
                        className={`w-9 h-9 ${
                          star <= rating
                            ? 'text-amber-400 drop-shadow-md'
                            : 'text-slate-200'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <span className="text-sm sm:text-base font-extrabold text-slate-800">
                  {rating === 1
                    ? '1/5 — Critical / Unusable'
                    : rating === 2
                    ? '2/5 — Poor / Needs Immediate Cleaning'
                    : rating === 3
                    ? '3/5 — Average / Fair'
                    : rating === 4
                    ? '4/5 — Good'
                    : '5/5 — Pristine / Excellent'}
                </span>
              </div>
            </div>

            {/* COMMON ISSUE CHIPS */}
            <div>
              <label className="block text-sm sm:text-base font-extrabold text-slate-800 uppercase tracking-wide mb-2.5">
                4. Identify Specific Cleanliness Issues
              </label>
              <div className="flex flex-wrap gap-2.5">
                {COMMON_ISSUES.map((issue) => {
                  const isSelected = selectedIssues.includes(issue.id);
                  return (
                    <button
                      key={issue.id}
                      type="button"
                      onClick={() => toggleIssue(issue.id)}
                      className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-red-50 text-red-800 border-red-300 shadow-sm scale-102 font-extrabold'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                      }`}
                    >
                      {isSelected ? '✓ ' : '+ '}
                      {issue.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ADDITIONAL DESCRIPTION */}
            <div>
              <label className="block text-sm sm:text-base font-extrabold text-slate-800 uppercase tracking-wide mb-2">
                5. Additional Observations / Feedback
              </label>
              <textarea
                rows="3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Wash basin tap leaking, floor wet, soap dispenser empty."
                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-300 rounded-2xl text-base text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:bg-white resize-none font-medium"
              />
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 active:scale-[0.99] text-white font-black text-base sm:text-lg rounded-2xl shadow-xl shadow-emerald-700/25 flex items-center justify-center gap-3 transition-all cursor-pointer disabled:opacity-50"
            >
              {submitting ? (
                <span>Dispatching Grievance Task...</span>
              ) : (
                <>
                  <FaPaperPlane className="w-5 h-5" />
                  <span>Submit Cleanliness Report & Dispatch Task</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* RIGHT COL: SELECTED COMPLEX SNAPSHOT */}
        <div className="space-y-4">
          {selectedFacility && (
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-black text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-lg">
                  {selectedFacility.code}
                </span>
                <span className="text-xs text-slate-400">{selectedFacility.zone}</span>
              </div>

              <h3 className="font-bold text-slate-900 text-sm leading-snug">
                {selectedFacility.name}
              </h3>
              <p className="text-xs text-slate-500">
                Building: {selectedFacility.buildingName || 'Main Public Facility'}
              </p>
              <p className="text-xs text-slate-600 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{selectedFacility.address}</span>
              </p>

              {/* Distance from GPS */}
              {getDistanceToFacility(selectedFacility) !== null && (
                <div className="p-2 bg-purple-50 rounded-xl border border-purple-200 flex items-center justify-between text-xs">
                  <span className="text-purple-800 font-semibold flex items-center gap-1.5">
                    <FaLocationCrosshairs className="w-3.5 h-3.5 text-purple-600" />
                    <span>Distance from your GPS:</span>
                  </span>
                  <span className="font-mono font-bold text-purple-900">
                    {getDistanceToFacility(selectedFacility)} km
                  </span>
                </div>
              )}

              {/* QR Code Placard Preview */}
              {selectedFacility.qrCodeData && (
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                  <img
                    src={selectedFacility.qrCodeData}
                    alt={selectedFacility.code}
                    className="w-28 h-28 mx-auto rounded-lg shadow-inner"
                  />
                  <p className="text-[10px] text-slate-400 mt-1 font-mono">
                    Entrance Placard Code
                  </p>
                </div>
              )}

              {/* Sections Breakdown */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Complex Sections
                </span>
                <div className="space-y-1 text-xs text-slate-700">
                  {blocks.map((b, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span className="truncate">• {b.blockName}</span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {b.stallsCount || 2} stalls
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {!selectedFacility && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm text-center space-y-3">
              <img
                src="/illustrations/undraw_navigation.svg"
                alt="No facility mapped"
                className="h-28 sm:h-36 w-auto mx-auto object-contain"
              />
              <h3 className="text-base font-bold text-slate-800">No Restroom Facility Selected</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                Scan any restroom QR placard or wait for municipal authorities to publish smart complexes in your sector.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* CITIZEN GRIEVANCE HISTORY */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">My Cleanliness Grievances & Status</h2>
          <p className="text-xs text-slate-500">
            Real-time tracking of tasks dispatched for your reports.
          </p>
        </div>

        <div className="space-y-3 pt-1">
          {myComplaints.length === 0 ? (
            <div className="text-center py-8 bg-slate-50 rounded-2xl border border-slate-200">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2 opacity-70" />
              <p className="text-sm font-bold text-slate-800">No Active Complaints</p>
              <p className="text-xs text-slate-500">You haven't filed any complaints yet.</p>
            </div>
          ) : (
            myComplaints.map((c) => (
              <div
                key={c._id}
                className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-wrap items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3">
                  <span className="font-mono text-xs font-bold text-slate-900 bg-white border border-slate-200 px-2.5 py-1 rounded-lg">
                    {c.ticketId}
                  </span>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{c.facilityName}</h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      <span className="font-semibold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 mr-2">
                        Section: {c.targetBlock || 'Entire Center'}
                      </span>
                      {c.issues?.join(', ') || 'Cleanliness Grievance'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right text-xs">
                    <span className="block text-slate-400 text-[10px]">Duty Sanitizer</span>
                    <span className="font-semibold text-slate-800">{c.assignedWorkerName || 'Dispatched'}</span>
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
    </div>
  );
}

