import React from "react";

export default function MapLegend() {
  return (
    <div className="h-12 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 z-20 shrink-0 text-xs text-slate-600 dark:text-slate-400 overflow-x-auto gap-6 font-medium transition-colors">
      <div className="flex items-center gap-5 shrink-0">
        <span className="flex items-center gap-2">
          <span className="w-3.5 h-1 rounded-full bg-blue-600" />
          Path (Active)
        </span>
        <span className="flex items-center gap-2">
          <span className="w-3.5 h-1 border-t-2 border-dashed border-amber-500" />
          Path (Planned)
        </span>
        <span className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          AGV (Moving)
        </span>
        <span className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          AGV (Charging)
        </span>
        <span className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-400 dark:bg-slate-500" />
          AGV (Idle)
        </span>
        <span className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
          Restricted Zone
        </span>
      </div>
    </div>
  );
}
