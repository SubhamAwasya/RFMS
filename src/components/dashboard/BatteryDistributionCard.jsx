import React from "react";
import { Zap, ChevronRight } from "lucide-react";
import { VIEWS } from "../../constants";

export default function BatteryDistributionCard({
  filteredAgvs,
  batteryBrackets,
  chargingAgvs,
  onNavigate,
}) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs p-5 flex flex-col justify-between">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <div>
          <span className="text-sm font-bold text-slate-900 dark:text-white">
            Battery Fleet Distribution
          </span>
          <p className="text-xs text-slate-400 mt-0.5">
            Realtime state-of-charge brackets across active robots
          </p>
        </div>
      </div>

      {/* Progress Bars for Battery Brackets */}
      <div className="py-3 space-y-3">
        {[
          {
            label: "Optimal Charge (75% – 100%)",
            count: batteryBrackets.high,
            color: "bg-emerald-500",
            textColor: "text-emerald-500",
          },
          {
            label: "Cruising Range (50% – 74%)",
            count: batteryBrackets.mid,
            color: "bg-cyan-500",
            textColor: "text-cyan-500",
          },
          {
            label: "Low Reserve (20% – 49%)",
            count: batteryBrackets.low,
            color: "bg-amber-500",
            textColor: "text-amber-500",
          },
          {
            label: "Critical / Docking (< 20%)",
            count: batteryBrackets.critical,
            color: "bg-red-500",
            textColor: "text-red-500",
          },
        ].map((bracket, idx) => {
          const total = filteredAgvs.length;
          const pct = total > 0 ? Math.round((bracket.count / total) * 100) : 0;
          return (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-300 font-medium flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${bracket.color}`} />
                  <span>{bracket.label}</span>
                </span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                  {bracket.count} units ({pct}%)
                </span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full ${bracket.color} rounded-full transition-all duration-500`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Charging Bays Status Bar */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-amber-500" />
          <span>
            Charging Bays:{" "}
            <strong className="text-slate-900 dark:text-white">
              {chargingAgvs.length} Active
            </strong>
          </span>
        </div>
        <button
          type="button"
          onClick={() => onNavigate?.(VIEWS.ROBOTS)}
          className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5 cursor-pointer"
        >
          Manage in AGVs / Robots <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
