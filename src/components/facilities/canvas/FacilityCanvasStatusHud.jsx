import React from "react";

export default function FacilityCanvasStatusHud({
  activeTool,
  cursorCoords,
}) {
  return (
    <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-300 shadow-md pointer-events-none font-mono">
      <span
        className={`w-2 h-2 rounded-full animate-pulse ${
          activeTool === "pan"
            ? "bg-blue-500"
            : activeTool === "station"
            ? "bg-emerald-500"
            : activeTool === "draw-zone"
            ? "bg-amber-500"
            : "bg-red-500"
        }`}
      />
      <span className="font-semibold text-slate-800 dark:text-slate-200">
        {activeTool === "pan"
          ? "Inspect"
          : activeTool === "station"
          ? "Station"
          : activeTool === "draw-zone"
          ? "Zone"
          : "Delete"}
      </span>
      <span className="text-slate-300 dark:text-slate-700">|</span>
      <span>
        X: {cursorCoords.meterX}m, Y: {cursorCoords.meterY}m
      </span>
    </div>
  );
}
