import React, { useState } from 'react';
import {
  Users,
  CheckCircle2,
  Clock,
  Play,
  Sparkles,
  AlertTriangle,
  UserCheck,
  Search,
  Filter,
} from 'lucide-react';

export default function StaffTasksView({
  tasks = [],
  staffList = [],
  onStartTask,
  onCompleteTask,
  onOpenCreateTask,
}) {
  const [taskTab, setTaskTab] = useState('ALL');
  const [search, setSearch] = useState('');

  const filteredTasks = tasks.filter((t) => {
    if (taskTab !== 'ALL' && t.status !== taskTab) return false;
    if (
      search &&
      !t.title.toLowerCase().includes(search.toLowerCase()) &&
      !t.facilityName.toLowerCase().includes(search.toLowerCase()) &&
      !t.taskId.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'IN_PROGRESS':
        return 'bg-blue-50 text-blue-700 border-blue-200 animate-pulse';
      case 'COMPLETED':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Staff Roster / Leaderboard Cards */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-600" />
              On-Duty Sanitation Staff & Completion Metrics
            </h2>
            <p className="text-xs text-slate-500">
              Real-time worker response times, tasks completed today, and quality SLA adherence
            </p>
          </div>

          <div className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
            {staffList.filter((s) => s.status === 'ON_DUTY' || s.status === 'BUSY').length} Active Field Staff
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {staffList.map((staff) => (
            <div
              key={staff.staffId}
              className="bg-slate-50 p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-white text-purple-700 border border-slate-200 shadow-xs">
                    {staff.staffId}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      staff.status === 'BUSY'
                        ? 'bg-blue-100 text-blue-800 animate-pulse'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    ● {staff.status}
                  </span>
                </div>

                <div className="text-sm font-bold text-slate-900">{staff.name}</div>
                <div className="text-xs text-slate-600 mt-0.5 font-medium">{staff.role}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">📍 {staff.zone}</div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-200 text-[11px]">
                <div>
                  <span className="text-slate-500 block text-[10px]">Completed</span>
                  <span className="font-bold text-emerald-700 text-sm">{staff.completedTasksCount} Tasks</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Avg Duration</span>
                  <span className="font-bold text-purple-700 text-sm">{staff.avgCleaningDurationMins}m</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Maintenance Tasks Board */}
      <div className="space-y-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              Sanitation Maintenance & Dispatched Tasks
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold border border-slate-200">
                {tasks.length} Total
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              Duration tracking, checklist verification, and citizen complaint remediation
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
            {['ALL', 'PENDING', 'IN_PROGRESS', 'COMPLETED'].map((tab) => (
              <button
                key={tab}
                onClick={() => setTaskTab(tab)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  taskTab === tab
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Tasks Grid */}
        <div className="space-y-3">
          {filteredTasks.map((task) => {
            const isCompleted = task.status === 'COMPLETED';
            const isInProgress = task.status === 'IN_PROGRESS';

            return (
              <div
                key={task._id}
                className="bg-white rounded-2xl border border-slate-200/90 hover:border-slate-300 p-4 shadow-sm transition-all"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-1.5 flex-1 min-w-[280px]">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 text-emerald-700 border border-slate-200">
                        {task.taskId}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(task.status)}`}>
                        {task.status.replace('_', ' ')}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                        {task.type}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">
                        Source: {task.source}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 leading-tight">{task.title}</h3>
                    <div className="text-xs text-slate-500 font-medium">
                      📍 {task.facilityName} ({task.facilityCode})
                    </div>

                    {/* Checklist Display */}
                    {task.checklist?.length > 0 && (
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 my-2 text-xs space-y-1">
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                          Cleaning Checklist:
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-1 text-[11px]">
                          {task.checklist.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-1.5 text-slate-700">
                              <span className={item.completed ? 'text-emerald-600 font-bold' : 'text-slate-400'}>
                                {item.completed ? '✓' : '○'}
                              </span>
                              <span className={item.completed ? 'line-through text-slate-400' : ''}>
                                {item.taskItem}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Staff & Completion Times */}
                    <div className="flex items-center gap-4 text-xs text-slate-500 pt-1 flex-wrap">
                      <span>
                        👷 Staff: <strong className="text-slate-800">{task.assignedStaff?.name || 'Unassigned'}</strong>
                      </span>

                      {task.startedAt && (
                        <span>
                          ⏱️ Started: {new Date(task.startedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}

                      {isCompleted && (
                        <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          ✨ Completed in {task.durationMinutes} mins
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions for supervisors/cleaners */}
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    {task.status === 'PENDING' && (
                      <button
                        onClick={() => onStartTask(task._id, task.assignedStaff?.name)}
                        className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2 px-3.5 rounded-xl transition-all shadow-sm cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Start Cleaning Timer</span>
                      </button>
                    )}

                    {task.status === 'IN_PROGRESS' && (
                      <button
                        onClick={() => onCompleteTask(task._id)}
                        className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 px-3.5 rounded-xl transition-all shadow-sm cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Complete & Verify Clean</span>
                      </button>
                    )}

                    {isCompleted && (
                      <div className="text-xs text-slate-500 text-right font-medium">
                        Verified at: {new Date(task.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {filteredTasks.length === 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 shadow-sm">
              <CheckCircle2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-700">No Tasks in this Filter</h3>
              <p className="text-xs text-slate-500 mt-1">All routine or complaint-driven tasks are handled.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
