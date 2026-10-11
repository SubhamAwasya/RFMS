import React from "react";

export default function FleetStatusDonut({ agvs = [] }) {
  const autoLoop = agvs.filter((a) => a.status === "Auto-Pilot (Looping)" || a.status === "In Mission").length;
  const charging = agvs.filter((a) => a.status === "Charging").length;
  const idle = agvs.filter((a) => a.status === "Idle").length;
  const maintenance = agvs.filter((a) => a.status === "Stopped" || a.status === "Obstacle Blocked").length;
  const total = agvs.length || 1;

  return (
    <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm flex flex-col justify-between">
      <div className="text-sm font-bold text-slate-900 dark:text-white mb-4">
        AGV Status
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-around gap-4 flex-1">
        {/* SVG Donut */}
        <div className="relative w-36 h-36 shrink-0">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            <circle
              cx="50"
              cy="50"
              r="38"
              fill="none"
              className="stroke-slate-100 dark:stroke-slate-800"
              strokeWidth="12"
            />
            {/* In Mission (Blue) */}
            <circle
              cx="50"
              cy="50"
              r="38"
              fill="none"
              stroke="#2563eb"
              strokeWidth="12"
              strokeDasharray="145 93"
              strokeDashoffset="0"
            />
            {/* Charging (Amber) */}
            <circle
              cx="50"
              cy="50"
              r="38"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="12"
              strokeDasharray="40 198"
              strokeDashoffset="-145"
            />
            {/* Idle (Green) */}
            <circle
              cx="50"
              cy="50"
              r="38"
              fill="none"
              stroke="#10b981"
              strokeWidth="12"
              strokeDasharray="26 212"
              strokeDashoffset="-185"
            />
            {/* Maintenance (Purple) */}
            <circle
              cx="50"
              cy="50"
              r="38"
              fill="none"
              stroke="#8b5cf6"
              strokeWidth="12"
              strokeDasharray="26 212"
              strokeDashoffset="-211"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-bold text-slate-900 dark:text-white leading-none">
              {total}
            </span>
            <span className="text-[10px] text-slate-400 uppercase font-medium mt-0.5">
              AGVs
            </span>
          </div>
        </div>

        {/* Donut Legend */}
        <div className="grid grid-cols-2 gap-x-5 gap-y-2 text-xs w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 shrink-0" />
            <span className="text-slate-600 dark:text-slate-400">Auto Looping</span>
            <span className="font-bold text-slate-900 dark:text-white ml-auto">
              {autoLoop}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
            <span className="text-slate-600 dark:text-slate-400">Idle</span>
            <span className="font-bold text-slate-900 dark:text-white ml-auto">
              {idle}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
            <span className="text-slate-600 dark:text-slate-400">Charging</span>
            <span className="font-bold text-slate-900 dark:text-white ml-auto">
              {charging}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shrink-0" />
            <span className="text-slate-600 dark:text-slate-400">Maintenance</span>
            <span className="font-bold text-slate-900 dark:text-white ml-auto">
              {maintenance}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
