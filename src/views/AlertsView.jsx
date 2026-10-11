import React, { useState } from "react";
import { AlertTriangle, Clock, Zap, Trash2, Bell, CheckCircle2 } from "lucide-react";
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
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-red-500/10 text-red-500 dark:text-red-400">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Fleet Alerts &amp; Telemetry
              {alerts.length > 0 && (
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800">
                  {alerts.length}
                </span>
              )}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Live automated sensor warnings, safety field violations, and energy telemetry
            </p>
          </div>
        </div>

        {/* Action Controls & Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Quick Trigger Random Alert */}
          <button
            type="button"
            onClick={() => fleetCtx?.generateRandomAlert?.()}
            className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-sm flex items-center gap-1.5 active:scale-95 cursor-pointer"
            title="Randomly generates a realistic industrial telemetry alert from an active robot in the fleet"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Generate Random Alert</span>
          </button>

          {/* Auto-Generation Background Timer Toggle */}
          <button
            type="button"
            onClick={() => fleetCtx?.setAutoAlertsEnabled?.(!fleetCtx?.autoAlertsEnabled)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 cursor-pointer ${
              fleetCtx?.autoAlertsEnabled
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                : "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500"
            }`}
            title="Toggles background timer that automatically generates random robot alerts every ~25 seconds"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                fleetCtx?.autoAlertsEnabled ? "bg-emerald-500 animate-pulse" : "bg-slate-400"
              }`}
            />
            <span>Auto-Gen: {fleetCtx?.autoAlertsEnabled ? "Active" : "Paused"}</span>
          </button>

          {/* Clear All */}
          {alerts.length > 0 && (
            <button
              type="button"
              onClick={() => fleetCtx?.clearAllAlerts?.()}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-semibold text-xs border border-slate-200 dark:border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          )}

          {/* Filter Pills */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-semibold overflow-x-auto">
            {["ALL", "danger", "warning", "info"].map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`px-2.5 py-1 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                  filter === f
                    ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {f === "ALL" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
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
                  {alert.category && (
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                      {alert.category}
                    </span>
                  )}
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
