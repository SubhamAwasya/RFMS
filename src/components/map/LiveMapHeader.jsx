import React from "react";

export default function LiveMapHeader({
  activeFloor,
  buildings,
  activeBuildingId,
  onSelectBuilding,
  floors,
  activeFloorId,
  onSelectFloor,
}) {
  return (
    <div className="h-14 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-3 sm:px-5 z-20 shrink-0 gap-2 transition-colors">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
          Live Map — {activeFloor.name}
        </span>
        <span className="hidden md:inline text-xs text-slate-400 font-mono">
          [{activeFloor.widthMeters}m × {activeFloor.lengthMeters}m]
        </span>
      </div>

      {/* Facility & Floor Switcher */}
      <div className="flex items-center gap-2 sm:gap-3 text-xs shrink-0">
        {/* Building Selector */}
        <select
          value={activeBuildingId || "bldg-1"}
          onChange={(e) => onSelectBuilding?.(e.target.value)}
          className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 sm:px-3 py-1.5 text-slate-800 dark:text-slate-200 focus:outline-none transition-colors hidden sm:block"
        >
          {(buildings || []).map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>

        {/* Floor Selector */}
        <select
          value={activeFloorId || "floor-g"}
          onChange={(e) => onSelectFloor?.(e.target.value)}
          className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 sm:px-3 py-1.5 text-slate-800 dark:text-slate-200 focus:outline-none transition-colors"
        >
          {(floors || []).map((f) => (
            <option key={f.id} value={f.id}>
              {f.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
