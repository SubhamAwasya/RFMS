import React from "react";
import { Building2, Layers } from "lucide-react";

export default function LiveMapHeader({
  activeFloor,
  buildings,
  activeBuildingId,
  onSelectBuilding,
  floors,
  activeFloorId,
  onSelectFloor,
  agvCount,
}) {
  const buildingFloors = (floors || []).filter((f) => f.buildingId === activeBuildingId);

  return (
    <div className="h-12 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-3 sm:px-4 z-20 shrink-0 gap-2 transition-colors">
      {/* LEFT: Live Map Title & Facility / Floor Dropdowns */}
      <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-xs sm:text-sm font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
            Live Map
          </span>
        </div>

        <span className="text-slate-300 dark:text-slate-700 hidden sm:inline select-none">/</span>

        {/* Building Selector Dropdown */}
        <div className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200/70 dark:bg-slate-800 dark:hover:bg-slate-700/70 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 transition-colors">
          <Building2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
          <select
            value={activeBuildingId || ""}
            onChange={(e) => onSelectBuilding?.(e.target.value)}
            className="bg-transparent text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer font-medium text-xs pr-1 max-w-[130px] sm:max-w-[180px] md:max-w-[220px] truncate"
            title="Select Building"
          >
            {(buildings || []).map((b) => (
              <option key={b.id} value={b.id} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                {b.name}
              </option>
            ))}
          </select>
        </div>

        {/* Floor Selector Dropdown */}
        <div className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200/70 dark:bg-slate-800 dark:hover:bg-slate-700/70 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 transition-colors">
          <Layers className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          <select
            value={activeFloorId || ""}
            onChange={(e) => onSelectFloor?.(e.target.value)}
            className="bg-transparent text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer font-medium text-xs pr-1 max-w-[130px] sm:max-w-[180px] md:max-w-[220px] truncate"
            title="Select Floor"
          >
            {buildingFloors.length > 0 ? (
              buildingFloors.map((f) => (
                <option key={f.id} value={f.id} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                  {f.name}
                </option>
              ))
            ) : (
              <option value="" disabled className="bg-white dark:bg-slate-900 text-slate-400">
                No floors in this building
              </option>
            )}
          </select>
        </div>
      </div>

      {/* RIGHT: Dimensions & Active Fleet Info */}
      <div className="flex items-center gap-2 text-xs shrink-0">
        {activeFloor?.widthMeters && (
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100/70 dark:bg-slate-800/70 border border-slate-200/60 dark:border-slate-700/60 text-[11px] text-slate-500 dark:text-slate-400 font-mono shrink-0">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {activeFloor.widthMeters}m × {activeFloor.lengthMeters}m
            </span>
            <span>•</span>
            <span>{(activeFloor.widthMeters * activeFloor.lengthMeters).toLocaleString()} m²</span>
          </div>
        )}

        {typeof agvCount === "number" && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>{agvCount} AGVs Online</span>
          </div>
        )}
      </div>
    </div>
  );
}
