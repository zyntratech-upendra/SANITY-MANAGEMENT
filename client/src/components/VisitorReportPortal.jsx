import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Star,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  ShieldCheck,
  Send,
  Building2,
  Phone,
  User,
  ArrowLeft,
} from 'lucide-react';

export default function VisitorReportPortal({
  facilities = [],
  initialFacilityCode = '',
  onBack,
  onSubmitSuccess,
}) {
  const [selectedCode, setSelectedCode] = useState(
    initialFacilityCode || (facilities[0]?.code ?? '')
  );
  const [targetBlock, setTargetBlock] = useState('Entire Complex');
  const [rating, setRating] = useState(2);
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedIssues, setSelectedIssues] = useState(['DIRTY_FLOOR_STALLS', 'FOUL_ODOR']);
  const [description, setDescription] = useState('');
  const [reporterName, setReporterName] = useState('');
  const [reporterPhone, setReporterPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState(null);

  const currentFacility = facilities.find((f) => f.code === selectedCode) || facilities[0];

  if (facilities.length === 0) {
    return (
      <div className="max-w-xl mx-auto py-10 px-4 animate-in fade-in duration-300">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-md text-center space-y-4">
          <img
            src="/illustrations/undraw_customer_survey.svg"
            alt="No restrooms registered"
            className="h-36 sm:h-44 w-auto mx-auto object-contain"
          />
          <h2 className="text-xl font-black text-slate-900">No Restroom Facilities Registered Yet</h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
            The civic sanitation kiosk requires at least one registered public restroom facility in the database. Please contact municipal administrators to register facilities.
          </p>
          {onBack && (
            <button
              onClick={onBack}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer"
            >
              &larr; Return to Dashboard
            </button>
          )}
        </div>
      </div>
    );
  }

  const issueOptions = [
    { id: 'FOUL_ODOR', label: 'Foul Odor / Stench', icon: '💨' },
    { id: 'NO_WATER', label: 'No Water / Dry Taps', icon: '🚰' },
    { id: 'DIRTY_FLOOR_STALLS', label: 'Dirty Floors / Stalls', icon: '🧽' },
    { id: 'CLOGGED_FLUSH', label: 'Clogged Toilet / Flush', icon: '🚽' },
    { id: 'NO_SOAP_SANITIZER', label: 'Empty Soap Dispenser', icon: '🧴' },
    { id: 'NO_TOILET_PAPER', label: 'No Toilet Paper', icon: '🧻' },
    { id: 'BROKEN_LIGHTING_OR_DOOR', label: 'Broken Lock / Light', icon: '💡' },
    { id: 'LITTER_OVERFLOW', label: 'Overflowing Waste Bin', icon: '🗑️' },
  ];

  const toggleIssue = (issueId) => {
    setSelectedIssues((prev) =>
      prev.includes(issueId) ? prev.filter((i) => i !== issueId) : [...prev, issueId]
    );
  };

  const getRatingLabel = (stars) => {
    switch (stars) {
      case 1:
        return '🤢 Extremely Unhygienic (Critical Alert)';
      case 2:
        return '⚠️ Needs Urgent Cleaning';
      case 3:
        return '😐 Mediocre / Needs Attention';
      case 4:
        return '😊 Clean & Acceptable';
      case 5:
        return '✨ Pristine & 5-Star Clean';
      default:
        return '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentFacility) return;

    try {
      setSubmitting(true);
      const payload = {
        facilityCode: currentFacility.code,
        targetBlock,
        rating: Number(rating),
        issues: selectedIssues,
        description: description.trim(),
        reporterName: reporterName.trim() || 'Anonymous Citizen',
        reporterPhone: reporterPhone.trim(),
      };

      const result = await onSubmitSuccess(payload);

      // Confetti animation
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });

      setSubmittedTicket(result);
    } catch (err) {
      alert('Error submitting report: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (submittedTicket) {
    return (
      <div className="max-w-xl mx-auto py-6 px-4">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-md text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4 border border-emerald-200">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            Action Dispatched Automatically
          </span>

          {/* Success Graphic & Animated Verification GIF */}
          <div className="flex items-center justify-center gap-4 my-3">
            <img
              src="/illustrations/undraw_done.svg"
              alt="Submitted Successfully unDraw"
              className="h-20 w-auto object-contain"
            />
            <img
              src="/illustrations/sanitation_cleaning.gif"
              alt="Hygiene Verified"
              className="h-16 w-16 rounded-2xl border border-emerald-200 shadow-xs object-cover"
            />
          </div>

          <h2 className="text-xl font-black text-slate-900 mt-2">
            Thank You for Reporting!
          </h2>
          <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto">
            Your complaint has been automatically registered and a rapid sanitation task has been dispatched.
          </p>

          {/* Ticket Receipt Box */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 my-5 text-left text-xs space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="text-slate-500 font-medium">Tracking Ticket ID:</span>
              <span className="font-mono font-bold text-emerald-700 text-sm">
                {submittedTicket.ticketId || 'TKT-LIVE'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">Restroom Facility:</span>
              <span className="font-semibold text-slate-800">{currentFacility?.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">Priority Level:</span>
              <span className="font-bold text-red-600">
                {submittedTicket.task?.priority || 'URGENT'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">Auto-Generated Task:</span>
              <span className="font-mono text-blue-700 font-bold">{submittedTicket.task?.taskId || 'TSK-AUTO'}</span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-slate-200">
              <span className="text-slate-500 font-medium">Assigned Field Cleaner:</span>
              <span className="font-bold text-slate-800">
                {submittedTicket.task?.assignedStaff?.name || currentFacility.assignedStaff?.name || 'Duty Cleaner'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setSubmittedTicket(null);
                setRating(4);
                setSelectedIssues([]);
                setDescription('');
              }}
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-2.5 px-4 rounded-xl border border-slate-200 transition-all cursor-pointer"
            >
              Submit Another Report
            </button>
            {onBack && (
              <button
                onClick={onBack}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition-all shadow-sm cursor-pointer"
              >
                Return to Dashboard
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-4 px-4 space-y-4">
      {/* Top Banner */}
      <div className="flex items-center justify-between">
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors font-medium cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>
        )}
        <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold">
          <ShieldCheck className="w-4 h-4" />
          <span>Official Citizen Feedback Kiosk</span>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-700 via-teal-800 to-slate-900 p-5 text-white">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white text-emerald-800 flex items-center justify-center font-bold shadow-sm">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-black tracking-tight">Public Toilet Cleanliness Feedback</h2>
                <p className="text-xs text-emerald-100">
                  Help us keep our public sanitation hygienic, clean and functional
                </p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <img
                src="/illustrations/scanner_laser.gif"
                alt="Scanner Active"
                className="h-10 w-10 rounded-xl border border-emerald-400/40 object-cover"
              />
            </div>
          </div>

          {/* Facility Selector Dropdown */}
          <div className="mt-4 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 flex flex-wrap items-center justify-between gap-3 text-white">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-300" />
              <span className="text-xs font-semibold text-slate-100">Current Facility:</span>
            </div>
            <select
              value={selectedCode}
              onChange={(e) => setSelectedCode(e.target.value)}
              className="bg-white text-slate-800 text-xs px-3 py-1.5 rounded-xl border border-white/40 font-semibold focus:outline-none cursor-pointer"
            >
              {facilities.map((f) => (
                <option key={f.code} value={f.code}>
                  [{f.code}] {f.name}
                </option>
              ))}
            </select>
          </div>

          {currentFacility && (
            <div className="mt-2 text-xs text-emerald-100 px-1 flex items-center justify-between">
              <span>📍 {currentFacility.address} ({currentFacility.zone})</span>
              <span className="text-emerald-300 font-semibold">Staff: {currentFacility.assignedStaff?.name}</span>
            </div>
          )}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Target Section inside Complex */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Specific Room / Section inside this Center
            </label>
            <select
              value={targetBlock}
              onChange={(e) => setTargetBlock(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 text-slate-800 text-xs px-3.5 py-2.5 rounded-xl font-medium focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="Entire Complex">Entire Sanitation Center (All Blocks)</option>
              {currentFacility?.blocks?.map((b, i) => (
                <option key={i} value={b.blockName}>
                  {b.blockName} ({b.type} — {b.stallsCount || 2} stalls)
                </option>
              ))}
            </select>
          </div>

          {/* Star Rating Section */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              1. How clean and hygienic is this toilet right now? *
            </label>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center">
              <div className="flex items-center justify-center gap-3">
                {[1, 2, 3, 4, 5].map((star) => {
                  const active = (hoverRating || rating) >= star;
                  return (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 transition-transform hover:scale-125 focus:outline-none cursor-pointer"
                    >
                      <Star
                        className={`w-9 h-9 ${
                          active
                            ? 'text-amber-500 fill-amber-500 drop-shadow-sm'
                            : 'text-slate-300'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
              <div className="mt-2 text-xs font-bold text-slate-700">
                {getRatingLabel(hoverRating || rating)}
              </div>
            </div>
          </div>

          {/* Issue Chips Multi-select */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              2. Select any issues you noticed (Select all that apply)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {issueOptions.map((opt) => {
                const isSelected = selectedIssues.includes(opt.id);
                return (
                  <button
                    type="button"
                    key={opt.id}
                    onClick={() => toggleIssue(opt.id)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-semibold border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-400 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-base">{opt.icon}</span>
                    <span className="leading-tight">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Comments */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              3. Additional Comments or Details
            </label>
            <textarea
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Stall #2 has no water pressure and door latch is loose..."
              className="w-full bg-slate-50 text-slate-800 text-xs p-3 rounded-2xl border border-slate-200 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Optional Citizen Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1 flex items-center gap-1">
                <User className="w-3 h-3" />
                <span>Your Name (Optional)</span>
              </label>
              <input
                type="text"
                value={reporterName}
                onChange={(e) => setReporterName(e.target.value)}
                placeholder="Citizen Name"
                className="w-full bg-white text-slate-800 text-xs px-3 py-1.5 rounded-xl border border-slate-300"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1 flex items-center gap-1">
                <Phone className="w-3 h-3" />
                <span>Mobile Number (For status SMS)</span>
              </label>
              <input
                type="text"
                value={reporterPhone}
                onChange={(e) => setReporterPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full bg-white text-slate-800 text-xs px-3 py-1.5 rounded-xl border border-slate-300"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm py-3 px-4 rounded-2xl shadow-sm transition-all cursor-pointer disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>{submitting ? 'Dispatching Sanitation Crew...' : 'Submit Report & Dispatch Sanitation'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
