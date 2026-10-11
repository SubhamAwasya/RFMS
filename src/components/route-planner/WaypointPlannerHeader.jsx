import React from "react";
import { Navigation, RotateCcw, Trash2, Sparkles } from "lucide-react";
import { ROUTE_PRESETS } from "../../constants";

export default function WaypointPlannerHeader({
  waypoints,
  onUndo,
  onResetWaypoints,
  activePreset,
  onApplyPreset,
  floorStations = [],
  onSnapToStation,
}) {
  const midPointsCount = waypoints.filter((w) => w.type === "mid").length;

  return (
    <>
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Navigation className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-bold text-slate-900 dark:text-white">
              Waypoint Route Planner
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold border border-blue-200 dark:border-blue-500/20">
              {waypoints.length} / 10 Points
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            Click map to add waypoint • Drag pins to reposition
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onUndo}
            disabled={midPointsCount === 0}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1 transition-colors"
            title="Undo last added waypoint"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Undo</span>
          </button>
          <button
            type="button"
            onClick={onResetWaypoints}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-500/15 flex items-center gap-1 transition-colors"
            title="Reset waypoints to Start and End only"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Quick Preset Corridors */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-400 shrink-0 flex items-center gap-1 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Presets:
        </span>
        {ROUTE_PRESETS.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => onApplyPreset(preset)}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium border shrink-0 transition-colors ${
              activePreset === preset.id
                ? "bg-blue-50 text-blue-700 border-blue-300 dark:bg-blue-500/15 dark:text-blue-300 dark:border-blue-500/30 font-semibold"
                : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
            }`}
          >
            {preset.name}
          </button>
        ))}
      </div>

      {/* Placed Floor Stations Bar */}
      {floorStations.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-400 shrink-0 font-medium">
            Facility Stations:
          </span>
          {floorStations.map((stn) => (
            <button
              key={stn.id}
              type="button"
              onClick={() => onSnapToStation(stn)}
              className="px-2.5 py-1 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-amber-400 dark:hover:border-amber-500/40 hover:bg-amber-50/50 dark:hover:bg-amber-500/10 shrink-0 flex items-center gap-1.5 transition-colors"
              title={`Snap route to ${stn.name}`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  stn.type === "charger"
                    ? "bg-emerald-500"
                    : stn.type === "elevator"
                    ? "bg-purple-500"
                    : "bg-blue-500"
                }`}
              />
              <span>{stn.name}</span>
            </button>
          ))}
        </div>
      )}
    </>
  );
}
