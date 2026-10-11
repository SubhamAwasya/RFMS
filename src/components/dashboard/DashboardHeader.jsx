import React from "react";
import { Building, Download } from "lucide-react";

export default function DashboardHeader({
  selectedBldgFilter,
  setSelectedBldgFilter,
  buildings = [],
  onExportData,
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
          Fleet Operations Dashboard
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Executive operational overview, high-level fleet status, and active safety alerts
        </p>
      </div>

      <div className="flex items-center gap-2.5">
        {/* Facility Filter */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs shadow-xs">
          <Building className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={selectedBldgFilter}
            onChange={(e) => setSelectedBldgFilter(e.target.value)}
            className="bg-transparent font-medium text-slate-700 dark:text-slate-200 outline-none cursor-pointer pr-1"
          >
            <option value="ALL">All Facilities & Buildings</option>
            {buildings.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>

        {/* Telemetry Report Export */}
        <button
          onClick={onExportData}
          className="h-8 px-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-xs shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          title="Export current fleet telemetry snapshot (JSON)"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          <span className="hidden sm:inline">Export Report</span>
        </button>
      </div>
    </div>
  );
}
