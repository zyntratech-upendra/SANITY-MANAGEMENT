import React, { useState } from 'react';
import {
  ClipboardList,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Star,
  Search,
  User,
} from 'lucide-react';

export default function ComplaintsView({ complaints = [], onResolveComplaint }) {
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [resolvingId, setResolvingId] = useState(null);
  const [resolutionNotes, setResolutionNotes] = useState('');

  const filtered = complaints.filter((c) => {
    if (statusFilter !== 'ALL' && c.status !== statusFilter) return false;
    if (priorityFilter !== 'ALL' && c.priority !== priorityFilter) return false;
    if (
      search &&
      !c.facilityName?.toLowerCase().includes(search.toLowerCase()) &&
      !c.ticketId?.toLowerCase().includes(search.toLowerCase()) &&
      !c.facilityCode?.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const handleOpenResolve = (complaint) => {
    setResolvingId(complaint._id);
    setResolutionNotes(`Sanitation and inspection completed by duty officer.`);
  };

  const handleConfirmResolve = async () => {
    if (!resolvingId) return;
    await onResolveComplaint(resolvingId, resolutionNotes);
    setResolvingId(null);
    setResolutionNotes('');
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'URGENT':
        return 'bg-red-50 text-red-700 border-red-200 animate-pulse';
      case 'HIGH':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'MEDIUM':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-amber-600" />
            Citizen Cleanliness Feedback & Grievance Hub
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold border border-slate-200">
              {complaints.length} Total Complaints
            </span>
          </h2>
          <p className="text-xs text-slate-500">
            Real-time citizen QR reports automatically linked to maintenance tasks and field cleaners
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Ticket ID (e.g. TKT-10824) or Toilet Name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 text-slate-800 text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-slate-50 text-slate-700 text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 font-medium"
        >
          <option value="ALL">All Statuses</option>
          <option value="ASSIGNED">Assigned / Open</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="RESOLVED">Resolved Only</option>
        </select>

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="bg-slate-50 text-slate-700 text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-500 font-medium"
        >
          <option value="ALL">All Priorities</option>
          <option value="URGENT">Urgent Priority</option>
          <option value="HIGH">High Priority</option>
          <option value="MEDIUM">Medium Priority</option>
        </select>
      </div>

      {/* Complaints List Cards */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 text-center space-y-4 my-2 animate-in fade-in duration-300">
            <div className="flex items-center justify-center gap-4">
              <img
                src="/illustrations/undraw_done.svg"
                alt="No complaints"
                className="h-28 sm:h-36 w-auto object-contain"
              />
              <img
                src="/illustrations/sanitation_cleaning.gif"
                alt="Sanitized verified"
                className="h-14 w-14 rounded-2xl border border-emerald-200 shadow-xs object-cover hidden sm:block"
              />
            </div>
            <div className="max-w-md mx-auto">
              <h3 className="text-base sm:text-lg font-black text-slate-900">Zero Active Grievances</h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                All facilities are maintaining standard hygiene. When citizens scan restroom QR placards and report complaints, they will appear here in real time.
              </p>
            </div>
          </div>
        ) : (
          filtered.map((item) => {
          const isResolved = item.status === 'RESOLVED';
          const priorityBadgeClass = getPriorityBadge(item.priority);

          return (
            <div
              key={item._id}
              className={`bg-white rounded-2xl border p-4 shadow-sm transition-all ${
                isResolved
                  ? 'border-slate-200 opacity-80'
                  : item.priority === 'URGENT'
                  ? 'border-red-300 bg-red-50/20'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                {/* Left Section */}
                <div className="space-y-1.5 flex-1 min-w-[280px]">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 text-amber-800 border border-slate-200">
                      {item.ticketId}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${priorityBadgeClass}`}>
                      {item.priority}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        isResolved
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {item.status}
                    </span>

                    {/* Star Rating */}
                    <div className="flex items-center gap-0.5 text-xs text-amber-600 font-bold ml-2">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <span>{item.rating}/5 Stars</span>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 leading-tight">
                    {item.facilityName} ({item.facilityCode})
                  </h3>

                  {/* Issues chips */}
                  {item.issues?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {item.issues.map((issue) => (
                        <span
                          key={issue}
                          className="text-[10px] font-medium px-2 py-0.5 rounded-lg bg-slate-50 text-slate-700 border border-slate-200"
                        >
                          ⚠️ {issue.replace(/_/g, ' ')}
                        </span>
                      ))}
                    </div>
                  )}

                  {item.description && (
                    <p className="text-xs text-slate-600 italic bg-slate-50 p-2.5 rounded-xl border border-slate-200 mt-2">
                      "{item.description}"
                    </p>
                  )}

                  <div className="flex items-center gap-4 text-[11px] text-slate-500 pt-2 flex-wrap">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3 text-slate-400" />
                      <span>Reported by: <strong>{item.reporterName}</strong></span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{new Date(item.createdAt).toLocaleString()}</span>
                    </span>
                    {item.assignedStaffName && (
                      <span className="text-emerald-700 font-semibold">
                        Assigned to: {item.assignedStaffName}
                      </span>
                    )}
                  </div>
                </div>

                {/* Right Action Section */}
                <div className="flex flex-col items-end gap-2 shrink-0">
                  {isResolved ? (
                    <div className="flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Resolved</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleOpenResolve(item)}
                      className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 px-3.5 rounded-xl transition-all shadow-sm cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Mark Resolved</span>
                    </button>
                  )}

                  {item.resolutionNotes && (
                    <span className="text-[10px] text-slate-500 max-w-[200px] text-right truncate">
                      {item.resolutionNotes}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>

      {/* Resolution Confirmation Modal */}
      {resolvingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-xl">
            <h3 className="text-base font-bold text-slate-900 mb-1">Resolve Citizen Complaint</h3>
            <p className="text-xs text-slate-500 mb-4">
              Enter official resolution notes and confirm that sanitation standards have been verified.
            </p>
            <textarea
              rows="3"
              value={resolutionNotes}
              onChange={(e) => setResolutionNotes(e.target.value)}
              className="w-full bg-slate-50 text-slate-800 text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-500 mb-4"
              placeholder="e.g. Toilet sanitized, water flow restored, soap dispenser refilled."
            />
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setResolvingId(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmResolve}
                className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm cursor-pointer"
              >
                Confirm Resolution
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
