import React from "react";
import { Search } from "lucide-react";
import AddRobotModal from "./AddRobotModal";

export default function RobotsToolbar({
  searchTerm,
  setSearchTerm,
  buildingFilter,
  setBuildingFilter,
  buildings = [],
  typeFilter,
  setTypeFilter,
  availableTypes = [],
  agvCount,
  onAddAgv,
}) {
  return (
    <div className="shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search AGV by ID, type, location..."
          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm"
        />
      </div>

      <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
        {/* Building / Facility Filter */}
        {buildings.length > 0 && (
          <select
            value={buildingFilter}
            onChange={(e) => setBuildingFilter(e.target.value)}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none shadow-sm cursor-pointer"
            title="Filter by Facility"
          >
            <option value="ALL">All Facilities</option>
            {buildings.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        )}

        {/* Vehicle Type Filter */}
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none shadow-sm cursor-pointer"
          title="Filter by Vehicle Type"
        >
          <option value="ALL">All Types</option>
          {availableTypes.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        {/* Add AGV Modal Button */}
        <AddRobotModal agvCount={agvCount} onAddAgv={onAddAgv} />
      </div>
    </div>
  );
}
