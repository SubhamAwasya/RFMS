import React from "react";
import { ZoomIn, ZoomOut, RotateCcw, Route, Bot, Square, MapPin } from "lucide-react";

export default function MapToolbar({
  zoom,
  onZoomIn,
  onZoomOut,
  onResetView,
  layers,
  onToggleLayer,
}) {
  const isPathsActive = Boolean(layers?.showPaths);
  const isAgvsActive = Boolean(layers?.showAgvs);
  const isZonesActive = Boolean(layers?.showZones);
  const isStationsActive = Boolean(layers?.showStations);

  return (
    <div
      className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 p-1.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xl transition-all duration-200 select-none pointer-events-auto"
      onMouseDown={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
    >
      {/* Layer Visibility Toggles */}
      {layers && (
        <div className="flex items-center gap-1">
          {/* Zones Toggle */}
          <button
            type="button"
            onClick={() => onToggleLayer("zones")}
            className={`px-2.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 text-xs font-semibold ${
              isZonesActive
                ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 font-bold"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 border border-transparent"
            }`}
            title="Toggle Facility Operational Zones"
          >
            <Square className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Zones</span>
            <span
              className={`w-1.5 h-1.5 rounded-full transition-all ${
                isZonesActive ? "bg-amber-500" : "bg-slate-300 dark:bg-slate-600"
              }`}
            />
          </button>

          {/* Stations Toggle */}
          <button
            type="button"
            onClick={() => onToggleLayer("stations")}
            className={`px-2.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 text-xs font-semibold ${
              isStationsActive
                ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-bold"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 border border-transparent"
            }`}
            title="Toggle Charging & Docking Stations"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Stations</span>
            <span
              className={`w-1.5 h-1.5 rounded-full transition-all ${
                isStationsActive ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-600"
              }`}
            />
          </button>

          {/* Paths Toggle */}
          <button
            type="button"
            onClick={() => onToggleLayer("paths")}
            className={`px-2.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 text-xs font-semibold ${
              isPathsActive
                ? "bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 font-bold"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 border border-transparent"
            }`}
            title="Toggle All Paths Visibility"
          >
            <Route className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Paths</span>
            <span
              className={`w-1.5 h-1.5 rounded-full transition-all ${
                isPathsActive
                  ? "bg-cyan-500 shadow-[0_0_6px_rgba(6,182,212,0.8)]"
                  : "bg-slate-300 dark:bg-slate-600"
              }`}
            />
          </button>

          {/* AGVs Toggle */}
          <button
            type="button"
            onClick={() => onToggleLayer("agvs")}
            className={`px-2.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 text-xs font-semibold ${
              isAgvsActive
                ? "bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30 font-bold"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 border border-transparent"
            }`}
            title="Toggle Fleet AGVs Visibility"
          >
            <Bot className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">AGVs</span>
            <span
              className={`w-1.5 h-1.5 rounded-full transition-all ${
                isAgvsActive
                  ? "bg-blue-500 shadow-[0_0_6px_rgba(59,130,246,0.8)]"
                  : "bg-slate-300 dark:bg-slate-600"
              }`}
            />
          </button>
        </div>
      )}

      {/* Vertical Divider */}
      <div className="h-5 w-px bg-slate-200 dark:bg-slate-800 mx-0.5" />

      {/* Zoom Controls: [ − ] [ 100% ] [ + ] [ ↺ ] */}
      <div className="flex items-center gap-0.5">
        <button
          type="button"
          onClick={onZoomOut}
          className="w-7 h-7 flex items-center justify-center rounded-xl text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 transition-all"
          title="Zoom Out (−)"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>

        <span
          className="px-2 py-0.5 min-w-[46px] text-center text-[11px] font-mono font-bold text-slate-700 dark:text-slate-300 select-none cursor-default"
          title="Current Zoom Level"
        >
          {Math.round(zoom * 100)}%
        </span>

        <button
          type="button"
          onClick={onZoomIn}
          className="w-7 h-7 flex items-center justify-center rounded-xl text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 transition-all"
          title="Zoom In (+)"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={onResetView}
          className="w-7 h-7 flex items-center justify-center rounded-xl text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 transition-all group ml-0.5"
          title="Reset Pan & Zoom (100% & Center)"
        >
          <RotateCcw className="w-3.5 h-3.5 group-hover:rotate-[-45deg] transition-transform" />
        </button>
      </div>
    </div>
  );
}
