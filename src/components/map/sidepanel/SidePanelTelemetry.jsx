import React from "react";
import { Compass, Battery, Gauge, ShieldAlert, MapPin } from "lucide-react";

export default function SidePanelTelemetry({
  agv,
  theme,
  activeSpeed,
  frontDist,
  isDangerRadar,
  isWarnRadar,
}) {
  const headingVal = Math.round(
    (((agv.position?.headingDeg ?? agv.heading ?? 0) % 360) + 360) % 360
  );
  const battVal =
    typeof agv.battery === "number" ? agv.battery : 100;

  return (
    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-2.5">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          Status & Sensors
        </span>
        <span
          className="text-[11px] font-bold px-2 py-0.5 rounded-full"
          style={{
            backgroundColor: `${theme?.hex || "#06b6d4"}20`,
            color: theme?.hex || "#06b6d4",
            border: `1px solid ${theme?.hex || "#06b6d4"}40`,
          }}
        >
          {agv.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center gap-2 p-2 rounded-lg bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/50">
          <Compass className="w-4 h-4 text-blue-500 shrink-0" />
          <div>
            <div className="text-[10px] text-slate-400">Heading</div>
            <div className="font-semibold text-slate-800 dark:text-slate-100 font-mono">
              {headingVal}°
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 p-2 rounded-lg bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/50">
          <Battery
            className={`w-4 h-4 shrink-0 ${
              battVal < 25
                ? "text-red-500"
                : battVal < 50
                ? "text-amber-500"
                : "text-emerald-500"
            }`}
          />
          <div>
            <div className="text-[10px] text-slate-400">Battery</div>
            <div
              className={`font-semibold font-mono text-xs ${
                battVal < 25
                  ? "text-red-600 dark:text-red-400"
                  : battVal < 50
                  ? "text-amber-600 dark:text-amber-400"
                  : "text-emerald-600 dark:text-emerald-400"
              }`}
            >
              {battVal.toFixed(1)}%
            </div>
            <div className="text-[9px] text-slate-400 font-mono">
              {agv.status === "Charging"
                ? "⚡ Charging"
                : `-${((agv.batteryDrainRate || 0.014) * 20).toFixed(2)}%/s`}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 p-2 rounded-lg bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/50">
          <Gauge className="w-4 h-4 text-cyan-500 shrink-0" />
          <div>
            <div className="text-[10px] text-slate-400">Live Speed</div>
            <div className="font-semibold text-slate-800 dark:text-slate-100">
              {activeSpeed.toFixed(1)} m/s
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 p-2 rounded-lg bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/50">
          <ShieldAlert
            className={`w-4 h-4 shrink-0 ${
              isDangerRadar
                ? "text-red-500 animate-bounce"
                : isWarnRadar
                ? "text-amber-500"
                : "text-emerald-500"
            }`}
          />
          <div>
            <div className="text-[10px] text-slate-400">LiDAR Proximity</div>
            <div
              className={`font-mono font-bold ${
                isDangerRadar
                  ? "text-red-500"
                  : isWarnRadar
                  ? "text-amber-500"
                  : "text-emerald-500"
              }`}
            >
              {frontDist}m
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5 pt-1 text-[11px] text-slate-500 dark:text-slate-400">
        <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
        <span className="truncate">{agv.location || "Ground Floor Floor Grid"}</span>
      </div>
    </div>
  );
}
