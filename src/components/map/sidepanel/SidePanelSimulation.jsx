import React from "react";
import { Zap, AlertTriangle, Battery, Bell } from "lucide-react";

export default function SidePanelSimulation({ agv, fleetCtx }) {
  if (!agv) return null;

  return (
    <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 rounded-xl space-y-2.5">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-amber-500" />
          <span>State Machine Simulation</span>
        </span>
        <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
          Interactive
        </span>
      </div>

      {/* Dynamic Active State Indicator Banner */}
      {agv.status === "Fault" && (
        <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 space-y-1">
          <div className="flex items-center justify-between font-bold text-[11px]">
            <span className="flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 animate-bounce" />
              <span>Hardware / Sensor Fault</span>
            </span>
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-red-600 text-white animate-pulse">
              AUTO-WATCHDOG
            </span>
          </div>
          <p className="text-[10px] text-slate-700 dark:text-slate-300">
            Reason: <strong>{agv.faultInfo?.reason || "Drive Actuator Motor Stall"}</strong>
          </p>
          <div className="flex items-center justify-between pt-1">
            <span className="text-[9px] text-slate-500 dark:text-slate-400">
              Vehicle halted (0.0 m/s). Self-repair in ~8s...
            </span>
            <button
              type="button"
              onClick={() => fleetCtx?.fixRobotFault?.(agv.id)}
              className="px-2 py-0.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] transition-colors cursor-pointer"
            >
              Quick Fix
            </button>
          </div>
        </div>
      )}

      {agv.status === "Charging" && (
        <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 space-y-1.5">
          <div className="flex items-center justify-between font-bold text-[11px]">
            <span className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 animate-pulse text-amber-500" />
              <span>Docked at Charger (Fast Charging)</span>
            </span>
            <span className="font-mono text-xs font-black">
              {Math.round(typeof agv.battery === "number" ? agv.battery : 100)}%
            </span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full transition-all duration-300"
              style={{ width: `${Math.min(100, Math.round(agv.battery ?? 100))}%` }}
            />
          </div>
          <p className="text-[9.5px] text-slate-500 dark:text-slate-400">
            Movement halted (0.0 m/s). Will auto-undock and resume loop at 100%.
          </p>
        </div>
      )}

      {agv.status === "Returning to Charger" && (
        <div className="p-2.5 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-yellow-700 dark:text-yellow-400 space-y-1">
          <div className="flex items-center justify-between font-bold text-[11px]">
            <span className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
              <span>En Route to Floor Charger</span>
            </span>
            <span className="font-mono text-xs font-bold">
              {Math.round(typeof agv.battery === "number" ? agv.battery : 100)}%
            </span>
          </div>
          <p className="text-[9.5px] text-slate-500 dark:text-slate-400">
            Low battery (&lt;10%) detected. Autonomously navigating to charging pad. Will halt and dock upon arrival.
          </p>
        </div>
      )}

      {/* Simulation Action Triggers */}
      <div className="space-y-1.5">
        <button
          type="button"
          onClick={() => fleetCtx?.simulateLowBattery?.(agv.id)}
          className="w-full py-1.5 px-2.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-800 dark:text-amber-300 font-semibold text-[11px] transition-colors flex items-center justify-between group cursor-pointer"
          title="Drops battery to 8%. AGV automatically halts path, routes to charger, docks, stops moving (0.0 m/s), fast-charges to 100%, and resumes route!"
        >
          <span className="flex items-center gap-1.5">
            <Battery className="w-3.5 h-3.5 text-amber-500" />
            <span>Simulate Low Battery (&lt;10%)</span>
          </span>
          <span className="text-[10px] text-amber-600 dark:text-amber-400 group-hover:translate-x-0.5 transition-transform font-mono">
            [8% Test] →
          </span>
        </button>

        <button
          type="button"
          onClick={() => fleetCtx?.simulateRobotFault?.(agv.id)}
          className="w-full py-1.5 px-2.5 rounded-lg bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-800 dark:text-red-300 font-semibold text-[11px] transition-colors flex items-center justify-between group cursor-pointer"
          title="Simulates hardware fault. Vehicle halts immediately (0.0 m/s), sends critical alert, and auto-fixes after 8 seconds!"
        >
          <span className="flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
            <span>Simulate Fault &amp; Auto-Fix</span>
          </span>
          <span className="text-[10px] text-red-600 dark:text-red-400 group-hover:translate-x-0.5 transition-transform font-mono">
            [8s Watchdog] →
          </span>
        </button>

        <button
          type="button"
          onClick={() => fleetCtx?.generateRandomAlert?.(agv.id)}
          className="w-full py-1.5 px-2.5 rounded-lg bg-blue-500/15 hover:bg-blue-500/25 border border-blue-500/30 text-blue-800 dark:text-blue-300 font-semibold text-[11px] transition-colors flex items-center justify-between group cursor-pointer"
          title="Generates a realistic randomized telemetry event/alert specifically for this robot."
        >
          <span className="flex items-center gap-1.5">
            <Bell className="w-3.5 h-3.5 text-blue-500" />
            <span>Simulate Random Alert</span>
          </span>
          <span className="text-[10px] text-blue-600 dark:text-blue-400 group-hover:translate-x-0.5 transition-transform font-mono">
            [Telemetry] →
          </span>
        </button>
      </div>
    </div>
  );
}
