import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSanitation } from '../context/SanitationContext';
import { api } from '../services/api';
import confetti from 'canvas-confetti';
import WorkerShiftGraphic from '../components/gov/WorkerShiftGraphic';
import {
  Wrench,
  Play,
  CheckCircle2,
  Clock,
  Sparkles,
  Droplets,
  Layers,
  ShieldCheck,
  CheckSquare,
  Square,
  AlertCircle,
  QrCode,
  Building2,
} from 'lucide-react';

export default function WorkerDashboardPage() {
  const { user } = useAuth();
  const { facilities, fetchFacilities, setQrModalFacility } = useSanitation();

  const [tasks, setTasks] = useState([]);
  const [activeTaskId, setActiveTaskId] = useState(null);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [currentChecklist, setCurrentChecklist] = useState([]);
  const [soapRefilled, setSoapRefilled] = useState(true);
  const [waterRefilled, setWaterRefilled] = useState(true);
  const [completionNotes, setCompletionNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  // Filter facilities assigned to this worker
  const assignedFacilities = facilities.filter(
    (f) =>
      f.assignedWorker?.userId === user?._id ||
      f.assignedStaff?.staffId === user?._id?.toString() ||
      user?.allottedFacilities?.some((af) => (af._id || af) === f._id)
  );

  const fetchTasks = async () => {
    try {
      const res = await api.getTasks();
      if (res.success) {
        // Filter tasks assigned to worker or for their facilities
        const facilityCodes = assignedFacilities.map((f) => f.code);
        const relevantTasks = res.data.filter(
          (t) =>
            t.assignedWorker?.userId === user?._id ||
            t.assignedStaff?.staffId === user?._id?.toString() ||
            facilityCodes.includes(t.facilityCode) ||
            t.status !== 'COMPLETED'
        );
        setTasks(relevantTasks);

        // Resume active in-progress task if one exists
        const inProgress = relevantTasks.find((t) => t.status === 'IN_PROGRESS');
        if (inProgress && !activeTaskId) {
          setActiveTaskId(inProgress._id);
          setCurrentChecklist(inProgress.checklist || []);
          if (inProgress.startedAt) {
            const elapsed = Math.floor((Date.now() - new Date(inProgress.startedAt).getTime()) / 1000);
            setTimerSeconds(Math.max(0, elapsed));
            setIsTimerRunning(true);
          }
        }
      }
    } catch (err) {
      console.error('Error fetching tasks:', err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [facilities]);

  // Stopwatch interval
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

  const formatTimer = (totalSec) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Start Cleaning Task
  const handleStartTask = async (task) => {
    try {
      setLoading(true);
      await api.startTask(task._id, { staffName: user?.name });
      setActiveTaskId(task._id);
      setCurrentChecklist(
        task.checklist?.length > 0
          ? task.checklist
          : [
              { taskItem: 'Inspect target block & reported issues', completed: false },
              { taskItem: 'Perform sanitary scrub and disinfection', completed: false },
              { taskItem: 'Replenish consumables (Soap, Paper, Sanitizer)', completed: false },
              { taskItem: 'Verify water supply pressure & flush mechanism', completed: false },
              { taskItem: 'Log air freshening / odor clearance check', completed: false },
            ]
      );
      setTimerSeconds(0);
      setIsTimerRunning(true);
      setStatusMessage({ type: 'success', text: `Cleaning started for ${task.facilityName}. Timer running!` });
      fetchTasks();
      if (typeof fetchFacilities === 'function') fetchFacilities();
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.message || 'Failed to start task' });
    } finally {
      setLoading(false);
    }
  };

  // Toggle checklist item
  const handleToggleChecklist = (index) => {
    setCurrentChecklist((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], completed: !updated[index].completed };
      return updated;
    });
  };

  // Complete Cleaning Task
  const handleCompleteTask = async () => {
    if (!activeTaskId) return;
    try {
      setLoading(true);
      const res = await api.completeTask(activeTaskId, {
        checklist: currentChecklist,
        soapRefilled,
        waterRefilled,
        notes: completionNotes || 'Cleaned and sanitized per Swachh protocols',
      });

      // Confetti burst
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });

      setStatusMessage({
        type: 'success',
        text: `Task successfully completed! Facility marked 100% clean and available. Duration: ${res.durationMinutes} mins.`,
      });

      setIsTimerRunning(false);
      setActiveTaskId(null);
      setTimerSeconds(0);
      setCompletionNotes('');
      fetchTasks();
      if (typeof fetchFacilities === 'function') fetchFacilities();
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.message || 'Failed to complete task' });
    } finally {
      setLoading(false);
    }
  };

  const activeTask = tasks.find((t) => t._id === activeTaskId);

  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-300">
      {/* Banner */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-7 border border-slate-200/90 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6 card-interactive relative overflow-hidden">
        {/* Tricolor accent */}
        <div className="absolute top-0 left-0 right-0 h-1 flex">
          <div className="flex-1 bg-[#FF9933]" />
          <div className="flex-1 bg-[#FFFFFF]" />
          <div className="flex-1 bg-[#138808]" />
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center shadow-lg shadow-amber-500/30 animate-float shrink-0">
            <Wrench className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-amber-950 bg-amber-100 px-2.5 sm:px-3 py-0.5 rounded-full border border-amber-200 whitespace-nowrap">
                Sanity Management • Field Duty
              </span>
              <span className="text-[11px] text-slate-400 font-semibold">• Sanitation Crew</span>
            </div>
            <h1 className="text-lg sm:text-xl lg:text-2xl font-black text-slate-900 mt-1">{user?.name || 'Sanitation Worker'}</h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5 max-w-md">
              Allotted public toilet pavilions, live cleaning stopwatch timer, and 5-point quality checklist.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
          <div className="hidden xl:flex items-center gap-3">
            <WorkerShiftGraphic className="h-20 lg:h-24 w-auto" />
            <img
              src="/illustrations/worker_dispatch.gif"
              alt="Worker Dispatch Active"
              className="h-16 w-16 rounded-2xl border border-amber-200 shadow-sm object-cover"
            />
          </div>

          {/* Quick Stats Pill - Responsive Full Width Grid on Mobile */}
          <div className="grid grid-cols-2 sm:flex sm:items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
            <div className="px-3 sm:px-4 py-2 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl text-center">
              <span className="block text-[9px] sm:text-[10px] font-extrabold text-slate-500 uppercase tracking-wide">My Centers</span>
              <span className="text-lg sm:text-xl lg:text-2xl font-black text-slate-900">
                {assignedFacilities.length > 0 ? assignedFacilities.length : facilities.length}
              </span>
            </div>
            <div className="px-3 sm:px-4 py-2 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl text-center">
              <span className="block text-[9px] sm:text-[10px] font-extrabold text-slate-500 uppercase tracking-wide">Pending Tasks</span>
              <span className="text-lg sm:text-xl lg:text-2xl font-black text-amber-700">
                {tasks.filter((t) => t.status === 'PENDING').length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Status Alert Notification */}
      {statusMessage && (
        <div
          className={`p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border flex items-center justify-between text-xs sm:text-sm font-semibold ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{statusMessage.text}</span>
          </div>
          <button
            onClick={() => setStatusMessage(null)}
            className="text-slate-400 hover:text-slate-700 cursor-pointer font-bold ml-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* ACTIVE CLEANING STOPWATCH & CHECKLIST CARD */}
      {activeTaskId && activeTask && (
        <div className="bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 text-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl shadow-amber-600/30 animate-in slide-in-from-top-4 duration-300 space-y-5">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-amber-400/50 pb-4 sm:pb-5">
            <div>
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest bg-white/20 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full inline-block">
                ● Live Cleaning Shift in Progress
              </span>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black mt-2">{activeTask.facilityName}</h2>
              <p className="text-xs sm:text-sm text-amber-100 mt-1 font-medium">
                Target Section: <span className="font-bold underline text-white">{activeTask.targetBlock || 'Entire Complex'}</span> • Code: {activeTask.facilityCode}
              </p>
            </div>

            {/* LIVE DIGITAL STOPWATCH - 100% Responsive */}
            <div className="w-full sm:w-auto bg-black/55 backdrop-blur-md px-5 sm:px-8 py-3 sm:py-4 rounded-2xl sm:rounded-3xl border border-white/30 text-center shadow-2xl animate-glow">
              <span className="block text-[10px] sm:text-xs uppercase font-extrabold text-amber-200 tracking-widest mb-0.5 sm:mb-1">
                Live Shift Stopwatch
              </span>
              <span className="font-mono text-4xl sm:text-5xl lg:text-6xl font-black tracking-wider text-white drop-shadow-lg">
                {formatTimer(timerSeconds)}
              </span>
            </div>
          </div>

          {/* 5-POINT CHECKLIST */}
          <div className="space-y-3">
            <h3 className="text-xs sm:text-sm lg:text-base font-extrabold uppercase tracking-wider text-amber-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-200 shrink-0" /> 5-Point Quality Verification Checklist (Tap to Verify)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3">
              {currentChecklist.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleToggleChecklist(idx)}
                  className={`p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border flex items-center gap-3 text-left transition-all cursor-pointer min-h-[50px] sm:min-h-[56px] ${
                    item.completed
                      ? 'bg-white text-slate-900 border-white font-bold shadow-md'
                      : 'bg-black/25 text-amber-50 border-white/15 hover:bg-black/35 font-semibold'
                  }`}
                >
                  {item.completed ? (
                    <CheckSquare className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600 shrink-0" />
                  ) : (
                    <Square className="w-5 h-5 sm:w-6 sm:h-6 opacity-60 shrink-0" />
                  )}
                  <span className="text-xs sm:text-sm lg:text-base leading-snug">{item.taskItem}</span>
                </button>
              ))}
            </div>
          </div>

          {/* CONSUMABLES REFILL TOGGLES & COMPLETE BUTTON */}
          <div className="pt-4 border-t border-amber-400/50 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-5 text-xs sm:text-sm lg:text-base">
              <label className="flex items-center gap-2.5 cursor-pointer font-bold">
                <input
                  type="checkbox"
                  checked={soapRefilled}
                  onChange={(e) => setSoapRefilled(e.target.checked)}
                  className="w-5 h-5 accent-white rounded cursor-pointer"
                />
                <span>Liquid Soap Restocked (100%)</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer font-bold">
                <input
                  type="checkbox"
                  checked={waterRefilled}
                  onChange={(e) => setWaterRefilled(e.target.checked)}
                  className="w-5 h-5 accent-white rounded cursor-pointer"
                />
                <span>Overhead Water Tank Full (100%)</span>
              </label>
            </div>

            <button
              onClick={handleCompleteTask}
              disabled={loading}
              className="w-full lg:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-white text-amber-950 hover:bg-amber-50 active:scale-95 font-black text-sm sm:text-base rounded-xl sm:rounded-2xl shadow-xl flex items-center justify-center gap-2.5 transition-all cursor-pointer disabled:opacity-50 shrink-0"
            >
              <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
              <span>Complete & Restore Center</span>
            </button>
          </div>
        </div>
      )}

      {/* TASKS QUEUE */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900">Assigned Maintenance & Cleaning Queue</h2>
            <p className="text-xs text-slate-500">
              Tasks automatically triggered by citizen QR reports or scheduled sanitation duty.
            </p>
          </div>
        </div>

        <div className="space-y-3 pt-1">
          {tasks.length === 0 ? (
            <div className="text-center py-8 sm:py-10 bg-slate-50 rounded-2xl border border-slate-200">
              <CheckCircle2 className="w-9 h-9 sm:w-10 sm:h-10 text-emerald-600 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-800">No Pending Tasks</p>
              <p className="text-xs text-slate-500">All allotted toilet centers are clean and well-maintained.</p>
            </div>
          ) : (
            tasks.map((task) => (
              <div
                key={task._id}
                className="p-3.5 sm:p-4 bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 hover:border-slate-300 transition-all"
              >
                <div className="flex items-start gap-2.5 sm:gap-3">
                  <span
                    className={`font-mono text-[11px] sm:text-xs font-black px-2 sm:px-2.5 py-1 rounded-lg shrink-0 ${
                      task.priority === 'URGENT'
                        ? 'bg-red-100 text-red-800'
                        : task.priority === 'HIGH'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {task.taskId}
                  </span>
                  <div>
                    <h3 className="font-bold text-xs sm:text-sm text-slate-900">{task.title}</h3>
                    <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
                      Complex: <span className="font-semibold text-slate-800">{task.facilityName}</span> ({task.facilityCode}) • Section: {task.targetBlock || 'Entire Center'}
                    </p>
                    {task.notes && (
                      <p className="text-[11px] sm:text-xs italic text-slate-600 mt-1">"{task.notes}"</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2.5 sm:gap-3 w-full sm:w-auto shrink-0">
                  {task.status === 'COMPLETED' ? (
                    <span className="w-full sm:w-auto justify-center px-3 py-1.5 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Cleaned ({task.durationMinutes || 15}m)
                    </span>
                  ) : task.status === 'IN_PROGRESS' ? (
                    <span className="w-full sm:w-auto justify-center px-3 py-1.5 bg-amber-500 text-white text-xs font-bold rounded-xl animate-pulse flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> Cleaning Now
                    </span>
                  ) : (
                    <button
                      onClick={() => handleStartTask(task)}
                      disabled={isTimerRunning}
                      className="w-full sm:w-auto justify-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md shadow-emerald-600/20 cursor-pointer transition-all"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" /> Start Cleaning
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ALLOTTED TOILET CENTERS */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-sm space-y-4">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-slate-900">My Allotted Toilet Complexes</h2>
          <p className="text-xs text-slate-500">
            Facilities assigned to your daily cleanliness and sanitation route.
          </p>
        </div>

        {(assignedFacilities.length > 0 || facilities.length > 0) ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4 pt-1">
            {(assignedFacilities.length > 0 ? assignedFacilities : facilities.slice(0, 3)).map((facility) => (
              <div
                key={facility._id}
                className="p-3.5 sm:p-4 bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-slate-900 bg-white border border-slate-200 px-2 py-0.5 rounded">
                      {facility.code}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        facility.status?.cleanliness === 'EXCELLENT'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {facility.status?.cleanliness}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 mt-2">{facility.name}</h3>
                  <p className="text-xs text-slate-500 truncate mt-0.5">{facility.address}</p>

                  <div className="mt-3 p-2 bg-white rounded-xl border border-slate-200/70 grid grid-cols-2 gap-2 text-center text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Water</span>
                      <span className="font-bold text-slate-800">{facility.telemetry?.waterLevel || 90}%</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Soap</span>
                      <span className="font-bold text-slate-800">{facility.telemetry?.soapLevel || 85}%</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between">
                  <button
                    onClick={() => setQrModalFacility(facility)}
                    className="px-2.5 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <QrCode className="w-3.5 h-3.5" /> Placard QR
                  </button>
                  <span className="text-[11px] text-slate-400">
                    {facility.blocks?.length || 3} Blocks
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 sm:p-12 bg-slate-50 border border-dashed border-slate-300 rounded-3xl text-center space-y-3 my-2">
            <img
              src="/illustrations/undraw_clean_up.svg"
              alt="No facilities"
              className="h-32 sm:h-40 w-auto mx-auto object-contain"
            />
            <h3 className="text-base sm:text-lg font-black text-slate-900">No Restroom Complexes Allotted Yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Your Municipal Ward Lead will allot restroom facilities to your daily duty roster. Please contact your zonal supervisor.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

