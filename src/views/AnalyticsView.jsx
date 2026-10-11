import React from "react";

export default function AnalyticsView() {
  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto p-4 sm:p-6 space-y-6">
      <div className="pb-3 border-b border-slate-200 dark:border-slate-800">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Fleet Analytics
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          OEE metrics, kinematic speed distributions, and energy throughput
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400">OEE Utilization</div>
          <div className="text-3xl font-bold text-slate-900 dark:text-white my-1.5">92.4%</div>
          <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">+3.2% vs last month</div>
        </div>
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Average Cycle Time</div>
          <div className="text-3xl font-bold text-slate-900 dark:text-white my-1.5">6.2 min</div>
          <div className="text-xs text-blue-600 dark:text-blue-400 font-semibold">-45s benchmark</div>
        </div>
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Tonnage Moved</div>
          <div className="text-3xl font-bold text-slate-900 dark:text-white my-1.5">142.8 T</div>
          <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">Today</div>
        </div>
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Mean Time Between Failures</div>
          <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 my-1.5">1,420 h</div>
          <div className="text-xs text-slate-400">Zero critical collisions</div>
        </div>
      </div>

      {/* Speed Distribution */}
      <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm space-y-4">
        <div className="text-sm font-bold text-slate-900 dark:text-white">
          Fleet Velocity Profile Distribution
        </div>
        <div className="h-28 flex items-end justify-between gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-2">
          {[20, 35, 60, 85, 95, 70, 50, 30, 15, 5].map((val, idx) => (
            <div key={idx} className="flex-1 bg-blue-500 hover:bg-blue-600 rounded-t transition-all" style={{ height: `${val}%` }} />
          ))}
        </div>
        <div className="flex justify-between text-xs text-slate-400">
          <span>0.0 m/s (Idle)</span>
          <span>1.0 m/s</span>
          <span>2.0 m/s (Max Cruising Speed)</span>
        </div>
      </div>
    </div>
  );
}
