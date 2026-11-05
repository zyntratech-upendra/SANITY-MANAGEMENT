import React from 'react';
import {
  Building2,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Droplets,
  Flame,
} from 'lucide-react';

export default function StatsOverview({ facilities = [], complaints = [], tasks = [], staffList = [] }) {
  const total = facilities.length;
  const available = facilities.filter((f) => f.status?.availability === 'AVAILABLE').length;
  const occupied = facilities.filter((f) => f.status?.availability === 'OCCUPIED').length;
  const cleaning = facilities.filter((f) => f.status?.availability === 'CLEANING_IN_PROGRESS').length;
  const maintenance = facilities.filter(
    (f) =>
      f.status?.availability === 'MAINTENANCE_REQUIRED' ||
      f.status?.cleanliness === 'CRITICAL_UNHYGIENIC' ||
      f.telemetry?.waterLevel <= 20 ||
      f.telemetry?.odorLevelPpm >= 45
  ).length;

  const openComplaints = complaints.filter((c) => c.status !== 'RESOLVED').length;
  const completedTasks = tasks.filter((t) => t.status === 'COMPLETED');
  const avgDuration =
    completedTasks.length > 0
      ? Math.round(completedTasks.reduce((sum, t) => sum + (t.durationMinutes || 0), 0) / completedTasks.length)
      : 16;

  const avgWater =
    facilities.length > 0
      ? Math.round(facilities.reduce((sum, f) => sum + (f.telemetry?.waterLevel || 80), 0) / facilities.length)
      : 85;

  const stats = [
    {
      title: 'Total Monitored Units',
      value: total,
      subtext: 'Registered across wards',
      icon: Building2,
      color: 'from-blue-600 to-indigo-600',
      badge: `${total} Facilities`,
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    {
      title: 'Available & Clean',
      value: available,
      subtext: `${total ? Math.round((available / total) * 100) : 0}% operational readiness`,
      icon: CheckCircle2,
      color: 'from-emerald-600 to-teal-600',
      badge: 'Online',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      title: 'Maintenance & Alerts',
      value: maintenance,
      subtext: maintenance > 0 ? 'Urgent attention required' : 'All facilities optimal',
      icon: AlertTriangle,
      color: maintenance > 0 ? 'from-rose-600 to-red-600' : 'from-slate-400 to-slate-500',
      badge: maintenance > 0 ? 'Action Needed' : 'Nominal',
      badgeColor: maintenance > 0 ? 'bg-red-50 text-red-700 border-red-200' : 'bg-slate-100 text-slate-600',
    },
    {
      title: 'Active Citizen Reports',
      value: openComplaints,
      subtext: `${complaints.length} total reports logged`,
      icon: Flame,
      color: 'from-amber-600 to-orange-600',
      badge: openComplaints > 0 ? `${openComplaints} Open` : '0 Open',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    {
      title: 'Avg. Cleaning SLA Time',
      value: `${avgDuration}m`,
      subtext: 'Dispatch to verification',
      icon: Clock,
      color: 'from-purple-600 to-violet-600',
      badge: 'Target <25m',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    },
    {
      title: 'City Water Reserves',
      value: `${avgWater}%`,
      subtext: 'Smart reservoir telemetry',
      icon: Droplets,
      color: avgWater < 30 ? 'from-red-600 to-amber-600' : 'from-cyan-600 to-blue-600',
      badge: avgWater < 30 ? 'Low Tank Alert' : 'Normal',
      badgeColor: avgWater < 30 ? 'bg-red-50 text-red-700 border-red-200' : 'bg-cyan-50 text-cyan-700 border-cyan-200',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div
            key={idx}
            className="relative overflow-hidden bg-white rounded-2xl p-4 border border-slate-200/90 hover:border-slate-300 transition-all shadow-sm hover:shadow group"
          >
            {/* Top accent line */}
            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.color}`}></div>

            <div className="flex items-center justify-between mb-2">
              <div
                className={`w-9 h-9 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${stat.badgeColor}`}>
                {stat.badge}
              </span>
            </div>

            <div className="text-2xl font-black text-slate-900 tracking-tight">{stat.value}</div>
            <div className="text-xs font-bold text-slate-700 truncate mt-0.5">{stat.title}</div>
            <div className="text-[11px] text-slate-500 mt-0.5 truncate">{stat.subtext}</div>
          </div>
        );
      })}
    </div>
  );
}
