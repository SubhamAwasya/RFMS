import React from "react";
import {
  ShieldCheck,
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import { VIEWS, getRobotColorTheme } from "../../constants";

export default function FleetExceptionsCard({
  exceptionRobots,
  filteredAgvs,
  onNavigate,
  onSelectRobot,
  onFixRobotFault,
}) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs p-5 flex flex-col justify-between">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div>
          <span className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Fleet Health &amp; Exceptions</span>
          </span>
          <p className="text-xs text-slate-400 mt-0.5">
            Units requiring immediate operator attention or maintenance
          </p>
        </div>
        <button
          onClick={() => onNavigate?.(VIEWS.ROBOTS)}
          className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5 cursor-pointer"
        >
          All AGVs / Robots <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Content: Fixed height so component size never changes, scrollable when list grows */}
      <div className="py-3 flex-1 flex flex-col justify-center min-h-[260px] max-h-[260px]">
        {exceptionRobots.length > 0 ? (
          <div className="space-y-2.5 overflow-y-auto max-h-[260px] pr-1.5">
            {exceptionRobots.map((robot) => {
              const theme = getRobotColorTheme(robot.id);
              const batt =
                typeof robot.battery === "number" ? Math.round(robot.battery) : 100;
              const isFault =
                robot.status === "Fault" ||
                robot.status === "Stopped" ||
                robot.status === "Obstacle Blocked";

              return (
                <div
                  key={robot.id}
                  className="p-3 rounded-xl bg-red-50/60 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: theme.hex }}
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <span>{robot.id}</span>
                        <span className="text-slate-400 font-normal">({robot.name})</span>
                      </div>
                      <div className="text-[11px] text-red-600 dark:text-red-400 mt-0.5 font-medium flex items-center gap-1.5">
                        <AlertTriangle className="w-3 h-3 shrink-0" />
                        <span>
                          {robot.faultInfo?.reason || robot.status}
                          {batt < 20 ? ` • Critical Battery (${batt}%)` : ""}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {isFault && (
                      <button
                        type="button"
                        onClick={() => onFixRobotFault?.(robot.id)}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] transition-colors cursor-pointer shadow-xs"
                      >
                        Quick Fix
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => onSelectRobot(robot.id)}
                      className="p-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                      title="Locate on Live Map"
                    >
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-4 space-y-2.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                All Fleet Units Operating Nominally
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 max-w-sm mx-auto">
                Zero halted units or critical battery warnings. All {filteredAgvs.length} robots are maintaining scheduled guide routines.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Clean Footer: Real-time status and live map link */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Real-time fleet health monitor</span>
        </span>
        <button
          onClick={() => onNavigate?.(VIEWS.MAP)}
          className="font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer shrink-0"
        >
          <span>Open Live Map</span>
          <ArrowUpRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
