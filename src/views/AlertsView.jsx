import React, { useState } from "react";
import { AlertTriangle, Clock } from "lucide-react";
import { useFleet } from "../context/FleetContext";
import { useNavigation } from "../context/NavigationContext";

export default function AlertsView({
  alerts: propAlerts,
  onAcknowledgeAlert: propOnAcknowledgeAlert,
  onSelectAgv: propOnSelectAgv,
}) {
  let fleetCtx = null;
  let navCtx = null;

  try {
    fleetCtx = useFleet();
  } catch (e) {}

  try {
    navCtx = useNavigation();
  } catch (e) {}

  const alerts = propAlerts ?? fleetCtx?.alerts ?? [];
  const onAcknowledgeAlert =
    propOnAcknowledgeAlert ?? fleetCtx?.acknowledgeAlert;
  const onSelectAgv = propOnSelectAgv ?? navCtx?.selectAgv;

  const [filter, setFilter] = useState("ALL");

  const filtered = alerts.filter((a) => {
    if (filter === "ALL") return true;
    return a.level === filter;
  });

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto p-4 sm:p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            Safety & Fleet Alerts
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Active obstacle detections, telemetry warnings, and LiDAR safety interlocks
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-semibold overflow-x-auto max-w-full">
          {["ALL", "danger", "warning", "info"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap shrink-0 transition-colors ${
                filter === f
                  ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {f === "ALL" ? "All Alerts" : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Alert List */}
      <div className="space-y-3">
        {filtered.map((alert) => (
          <div
            key={alert.id}
            className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
              alert.level === "danger"
                ? "bg-red-50/50 dark:bg-red-950/20 border-red-200 dark:border-red-900/40"
                : alert.level === "warning"
                ? "bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/40"
                : "bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/40"
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                  alert.level === "danger"
                    ? "bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400"
                    : alert.level === "warning"
                    ? "bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400"
                    : "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400"
                }`}
              >
                <AlertTriangle className="w-4 h-4" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onSelectAgv?.(alert.agv)}
                    className="text-xs font-bold text-slate-900 dark:text-white hover:underline cursor-pointer"
                  >
                    {alert.agv}
                  </button>
                  <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    {alert.level}
                  </span>
                </div>
                <div className="text-xs text-slate-700 dark:text-slate-300 mt-1 font-medium">
                  {alert.message}
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-1.5">
                  <Clock className="w-3 h-3" />
                  <span>{alert.time}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                onClick={() => onSelectAgv?.(alert.agv)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 transition-colors"
              >
                Locate Unit
              </button>
              <button
                onClick={() => onAcknowledgeAlert?.(alert.id)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 shadow-sm transition-colors"
              >
                Acknowledge
              </button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="p-12 text-center text-slate-400 text-xs">
            No active alerts matching the selected filter.
          </div>
        )}
      </div>
    </div>
  );
}
