import React from "react";
import { X } from "lucide-react";

export default function RouteTimeline({
  waypoints,
  totalMeters,
  estMinutes,
  onDeleteWaypoint,
}) {
  return (
    <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-slate-700 dark:text-slate-300">
          Route Checkpoints
        </span>
        <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 text-[11px]">
          <span>
            Distance:{" "}
            <strong className="text-slate-800 dark:text-slate-200">
              {totalMeters} m
            </strong>
          </span>
          <span>•</span>
          <span>
            Transit:{" "}
            <strong className="text-slate-800 dark:text-slate-200">
              ~{estMinutes} min
            </strong>
          </span>
        </div>
      </div>

      {/* Horizontal Waypoint Timeline Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {waypoints.map((w, idx) => (
          <div
            key={w.id}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border shrink-0 ${
              w.type === "start"
                ? "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-800 dark:text-emerald-300"
                : w.type === "end"
                ? "bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20 text-red-800 dark:text-red-300"
                : "bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                w.type === "start"
                  ? "bg-emerald-500"
                  : w.type === "end"
                  ? "bg-red-500"
                  : "bg-blue-500"
              }`}
            />
            <span className="font-semibold">{w.label}</span>
            <span className="text-[10px] text-slate-400 font-mono">
              ({w.x},{w.y})
            </span>
            {w.type === "mid" && (
              <button
                type="button"
                onClick={(e) => onDeleteWaypoint?.(w.id, e)}
                className="ml-1 p-0.5 rounded text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/20 transition-colors"
                title="Remove waypoint"
              >
                <X className="w-3 h-3" />
              </button>
            )}
            {idx < waypoints.length - 1 && (
              <span className="text-slate-400 ml-1">→</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
