import React from "react";
import { Bell, CheckCircle2, Zap, ChevronRight } from "lucide-react";
import { VIEWS } from "../../constants";

export default function ActiveAlertsCard({
  alerts = [],
  onNavigate,
  onSelectRobot,
  onGenerateRandomAlert,
}) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs p-5 flex flex-col justify-between">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <span className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
          <Bell className="w-4 h-4 text-red-500" />
          <span>Active Alerts &amp; Watchdog</span>
          {alerts.length > 0 && (
            <span className="text-xs font-mono font-bold px-1.5 py-0.2 rounded-full bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400">
              {alerts.length}
            </span>
          )}
        </span>
        <button
          onClick={() => onNavigate?.(VIEWS.ALERTS)}
          className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5 cursor-pointer"
        >
          Alerts View <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="divide-y divide-slate-100 dark:divide-slate-800 flex-1 overflow-y-auto min-h-[260px] max-h-[260px] my-2 pr-1.5">
        {alerts.slice(0, 4).map((a) => (
          <div
            key={a.id}
            onClick={() => {
              if (a.agv) {
                onSelectRobot?.(a.agv);
              } else {
                onNavigate?.(VIEWS.ALERTS);
              }
            }}
            className="py-2.5 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors flex items-start justify-between gap-3 cursor-pointer group"
            title="Click to locate robot or view details"
          >
            <div className="flex items-start gap-2.5">
              <span
                className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                  a.level === "danger"
                    ? "bg-red-500 animate-pulse"
                    : a.level === "warning"
                    ? "bg-amber-500"
                    : "bg-blue-500"
                }`}
              />
              <div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {a.agv ? `${a.agv}: ` : ""}
                  {a.message}
                </div>
                {a.category && (
                  <span className="text-[10px] font-semibold text-slate-400 uppercase mt-0.5 inline-block">
                    {a.category}
                  </span>
                )}
              </div>
            </div>
            <span className="text-[10px] text-slate-400 shrink-0 font-mono whitespace-nowrap">
              {a.time}
            </span>
          </div>
        ))}

        {alerts.length === 0 && (
          <div className="py-8 text-center space-y-2">
            <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto" />
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Zero active alerts. System envelope nominal.
            </p>
            <button
              type="button"
              onClick={onGenerateRandomAlert}
              className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer inline-flex items-center gap-1 shadow-xs"
            >
              <Zap className="w-3 h-3" />
              <span>Generate Test Alert</span>
            </button>
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
        <span>Automated alert watchdog active</span>
        <button
          onClick={() => onNavigate?.(VIEWS.ALERTS)}
          className="font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
        >
          <span>View All Alerts</span>
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
