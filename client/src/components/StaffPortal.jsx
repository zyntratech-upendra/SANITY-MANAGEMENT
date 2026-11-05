import React, { useState, useEffect } from 'react';
import {
  Wrench,
  Sparkles,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Play,
  ArrowLeft,
} from 'lucide-react';

export default function StaffPortal({
  facilities = [],
  staffList = [],
  tasks = [],
  onStartTask,
  onCompleteTask,
  onUpdateFacilityStatus,
  onBack,
}) {
  const [selectedStaffId, setSelectedStaffId] = useState(staffList[0]?.staffId || 'STF-01');
  const [activeTask, setActiveTask] = useState(null);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Checklist state
  const [checklist, setChecklist] = useState({
    floorMop: true,
    bowlDisinfect: true,
    soapRefilled: true,
    waterChecked: true,
    odorNeutralized: true,
  });

  const [notes, setNotes] = useState('');
  const [selectedFacilityId, setSelectedFacilityId] = useState(facilities[0]?._id || '');

  const currentStaff = staffList.find((s) => s.staffId === selectedStaffId) || staffList[0];
  const currentFacility = facilities.find((f) => f._id === selectedFacilityId) || facilities[0];

  if (facilities.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 text-center space-y-4 max-w-xl mx-auto my-6 animate-in fade-in duration-300">
        <img
          src="/illustrations/undraw_clean_up.svg"
          alt="No facilities"
          className="h-36 sm:h-44 w-auto mx-auto object-contain"
        />
        <h2 className="text-lg sm:text-xl font-black text-slate-900">No Toilet Centers Registered Yet</h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
          Field staff operations and cleaning timers require at least one registered restroom complex in the system.
        </p>
      </div>
    );
  }

  useEffect(() => {
    const inProgress = tasks.find(
      (t) => t.status === 'IN_PROGRESS' && t.assignedStaff?.staffId === selectedStaffId
    );
    if (inProgress) {
      setActiveTask(inProgress);
      setIsTimerRunning(true);
      if (inProgress.startedAt) {
        const elapsed = Math.floor((Date.now() - new Date(inProgress.startedAt).getTime()) / 1000);
        setTimerSeconds(Math.max(0, elapsed));
      }
    } else {
      setActiveTask(null);
      setIsTimerRunning(false);
      setTimerSeconds(0);
    }
  }, [tasks, selectedStaffId]);

  useEffect(() => {
    let interval = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleStartCleaning = async (taskIdToStart) => {
    if (!taskIdToStart) {
      const pendingTask = tasks.find((t) => t.status === 'PENDING');
      if (pendingTask) {
        await onStartTask(pendingTask._id, currentStaff?.name);
      } else {
        alert('No pending maintenance tasks found for automatic timer. You can update facility status directly below.');
      }
    } else {
      await onStartTask(taskIdToStart, currentStaff?.name);
    }
  };

  const handleFinishCleaning = async () => {
    if (activeTask) {
      await onCompleteTask(activeTask._id, {
        notes: notes || 'Sanitation protocol completed as per municipal standard.',
        soapRefilled: checklist.soapRefilled,
        waterRefilled: checklist.waterChecked,
      });
    } else if (currentFacility) {
      await onUpdateFacilityStatus(currentFacility._id, {
        availability: 'AVAILABLE',
        cleanliness: 'EXCELLENT',
        staffName: currentStaff?.name,
        notes: 'Routine sanitation logged by duty worker.',
        soapLevel: 100,
        waterLevel: 95,
      });
      alert(`[${currentFacility.code}] marked as Pristine Clean and Available.`);
    }
    setTimerSeconds(0);
    setIsTimerRunning(false);
    setNotes('');
  };

  const handleDirectStatusUpdate = async (availability, cleanliness) => {
    if (!currentFacility) return;
    await onUpdateFacilityStatus(currentFacility._id, {
      availability,
      cleanliness,
      staffName: currentStaff?.name,
      notes: `Updated by ${currentStaff?.name}`,
    });
  };

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
        <div className="flex items-center gap-1.5 text-xs text-amber-700 font-semibold">
          <Wrench className="w-4 h-4" />
          <span>Sanitation Field Worker Interface</span>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        {/* Worker Header */}
        <div className="bg-gradient-to-r from-amber-600 to-amber-700 p-5 text-white">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-white text-amber-700 flex items-center justify-center font-bold shadow-sm">
                <Wrench className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-black tracking-tight">Sanitation Worker Terminal</h2>
                <p className="text-xs text-amber-100">Step 4 & 8: Update Cleanliness & Record Completion SLA</p>
              </div>
            </div>

            {/* Worker Switcher */}
            <select
              value={selectedStaffId}
              onChange={(e) => setSelectedStaffId(e.target.value)}
              className="bg-white text-slate-800 text-xs px-3 py-2 rounded-xl border border-white/40 font-bold focus:outline-none cursor-pointer"
            >
              {staffList.map((s) => (
                <option key={s.staffId} value={s.staffId}>
                  {s.name} ({s.role}) - {s.zone}
                </option>
              ))}
            </select>
          </div>

          {currentStaff && (
            <div className="grid grid-cols-3 gap-2 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 text-xs">
              <div>
                <span className="text-[10px] text-amber-100 block font-medium">Duty Zone</span>
                <span className="font-bold text-white">{currentStaff.zone}</span>
              </div>
              <div>
                <span className="text-[10px] text-amber-100 block font-medium">Cleaned Today</span>
                <span className="font-bold text-white">{currentStaff.completedTasksCount} Restrooms</span>
              </div>
              <div>
                <span className="text-[10px] text-amber-100 block font-medium">Avg Duration</span>
                <span className="font-bold text-white">{currentStaff.avgCleaningDurationMins} Mins</span>
              </div>
            </div>
          )}
        </div>

        {/* Live Cleaning Stopwatch Card */}
        <div className="p-6 space-y-6">
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 text-center relative overflow-hidden">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Active Cleaning Duration Stopwatch
            </div>
            <div className="font-mono text-4xl md:text-5xl font-black text-emerald-700 tracking-tight my-2">
              {formatTimer(timerSeconds)}
            </div>
            <div className="text-xs text-slate-500 font-medium">
              {isTimerRunning
                ? 'Cleaning timer active • Duration tracking in progress'
                : 'Timer stopped • Ready to start cleaning session'}
            </div>

            <div className="mt-4 flex items-center justify-center gap-3">
              {!isTimerRunning ? (
                <button
                  onClick={() => handleStartCleaning(activeTask?._id)}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 px-6 rounded-xl transition-all shadow-sm cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Start Cleaning Session</span>
                </button>
              ) : (
                <button
                  onClick={handleFinishCleaning}
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 px-6 rounded-xl transition-all shadow-sm cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Complete Cleaning & Mark Clean</span>
                </button>
              )}
            </div>
          </div>

          {/* Sanitation Verification Checklist */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Field Sanitation Checklist
            </label>
            <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer font-medium">
                <input
                  type="checkbox"
                  checked={checklist.floorMop}
                  onChange={(e) => setChecklist({ ...checklist, floorMop: e.target.checked })}
                  className="rounded text-emerald-600 focus:ring-0"
                />
                <span>Floors thoroughly scrubbed with chemical disinfectant</span>
              </label>

              <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer font-medium">
                <input
                  type="checkbox"
                  checked={checklist.bowlDisinfect}
                  onChange={(e) => setChecklist({ ...checklist, bowlDisinfect: e.target.checked })}
                  className="rounded text-emerald-600 focus:ring-0"
                />
                <span>Toilet bowls, seats and urinals sanitized</span>
              </label>

              <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer font-medium">
                <input
                  type="checkbox"
                  checked={checklist.soapRefilled}
                  onChange={(e) => setChecklist({ ...checklist, soapRefilled: e.target.checked })}
                  className="rounded text-emerald-600 focus:ring-0"
                />
                <span>Liquid soap dispensers refilled (Resets soap to 100%)</span>
              </label>

              <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer font-medium">
                <input
                  type="checkbox"
                  checked={checklist.waterChecked}
                  onChange={(e) => setChecklist({ ...checklist, waterChecked: e.target.checked })}
                  className="rounded text-emerald-600 focus:ring-0"
                />
                <span>Water tank inlet & tap flow verified (Resets tank to 100%)</span>
              </label>

              <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer font-medium">
                <input
                  type="checkbox"
                  checked={checklist.odorNeutralized}
                  onChange={(e) => setChecklist({ ...checklist, odorNeutralized: e.target.checked })}
                  className="rounded text-emerald-600 focus:ring-0"
                />
                <span>Exhaust ventilation checked & deodorizer fragrance misted</span>
              </label>
            </div>
          </div>

          {/* Quick Facility Status Override */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">
                Direct Facility Status & Availability Update
              </span>
              <select
                value={selectedFacilityId}
                onChange={(e) => setSelectedFacilityId(e.target.value)}
                className="bg-white text-slate-800 text-xs px-2.5 py-1.5 rounded-xl border border-slate-300 font-medium cursor-pointer"
              >
                {facilities.map((f) => (
                  <option key={f._id} value={f._id}>
                    [{f.code}] {f.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleDirectStatusUpdate('AVAILABLE', 'EXCELLENT')}
                className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold py-2 px-2 rounded-xl transition-all cursor-pointer"
              >
                ✓ Available & Clean
              </button>

              <button
                type="button"
                onClick={() => handleDirectStatusUpdate('CLEANING_IN_PROGRESS', 'SATISFACTORY')}
                className="bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 text-xs font-bold py-2 px-2 rounded-xl transition-all cursor-pointer"
              >
                ⏱ In Progress
              </button>

              <button
                type="button"
                onClick={() => handleDirectStatusUpdate('MAINTENANCE_REQUIRED', 'NEEDS_ATTENTION')}
                className="bg-red-50 hover:bg-red-100 text-red-800 border border-red-300 text-xs font-bold py-2 px-2 rounded-xl transition-all cursor-pointer"
              >
                ⚠️ Maintenance
              </button>

              <button
                type="button"
                onClick={() => handleDirectStatusUpdate('OUT_OF_SERVICE', 'CRITICAL_UNHYGIENIC')}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-xs font-bold py-2 px-2 rounded-xl transition-all cursor-pointer"
              >
                ✕ Out of Service
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
