import React from "react";
import { ChevronRight, Route } from "lucide-react";
import FleetKpiCards from "../components/dashboard/FleetKpiCards";
import FleetStatusDonut from "../components/dashboard/FleetStatusDonut";
import StatusBadge from "../components/common/StatusBadge";
import { useFleet } from "../context/FleetContext";
import { useNavigation } from "../context/NavigationContext";
import { VIEWS, getRobotColorTheme } from "../constants";

export default function DashboardView({
  agvs: propAgvs,
  missions: propMissions,
  alerts: propAlerts,
  maintenance: propMaintenance,
  onNavigate: propOnNavigate,
}) {
  let fleetCtx = null;
  let navCtx = null;

  try {
    fleetCtx = useFleet();
  } catch (e) {}

  try {
    navCtx = useNavigation();
  } catch (e) {}

  const agvs = propAgvs ?? fleetCtx?.agvs ?? [];
  const missions = propMissions ?? fleetCtx?.missions ?? [];
  const alerts = propAlerts ?? fleetCtx?.alerts ?? [];
  const maintenance = propMaintenance ?? fleetCtx?.maintenance ?? [];
  const onNavigate = propOnNavigate ?? navCtx?.navigateTo;

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
      {/* 1. 6 KPI Metric Cards */}
      <FleetKpiCards agvs={agvs} />

      {/* 2. Visual Charts Row (AGV Status Donut, Mission Activity, Energy) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* AGV Status Donut Chart */}
        <FleetStatusDonut agvs={agvs} />

        {/* Fleet Route Cycles (Today) Multi-line Chart */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-slate-900 dark:text-white">
              Fleet Route Cycles (Today)
            </span>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                <span className="w-2 h-2 rounded-full bg-cyan-500" /> Loop Cycles
              </span>
              <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                <span className="w-2 h-2 rounded-full bg-amber-500" /> Teleop Drive
              </span>
              <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                <span className="w-2 h-2 rounded-full bg-red-500" /> Faults
              </span>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-end pt-4">
            <svg viewBox="0 0 300 120" className="w-full h-32 overflow-visible">
              <line
                x1="0"
                y1="30"
                x2="300"
                y2="30"
                stroke="#e2e8f0"
                className="dark:stroke-slate-800"
                strokeDasharray="3 3"
              />
              <line
                x1="0"
                y1="60"
                x2="300"
                y2="60"
                stroke="#e2e8f0"
                className="dark:stroke-slate-800"
                strokeDasharray="3 3"
              />
              <line
                x1="0"
                y1="90"
                x2="300"
                y2="90"
                stroke="#e2e8f0"
                className="dark:stroke-slate-800"
                strokeDasharray="3 3"
              />
              <line
                x1="0"
                y1="120"
                x2="300"
                y2="120"
                stroke="#cbd5e1"
                className="dark:stroke-slate-700"
              />

              {/* Completed (Green line) */}
              <polyline
                fill="none"
                stroke="#10b981"
                strokeWidth="2.5"
                points="0,110 50,95 100,60 150,45 200,30 250,55 300,20"
              />
              {/* In Progress (Blue line) */}
              <polyline
                fill="none"
                stroke="#2563eb"
                strokeWidth="2.5"
                points="0,115 50,105 100,80 150,70 200,65 250,40 300,45"
              />
              {/* Failed (Red line) */}
              <polyline
                fill="none"
                stroke="#ef4444"
                strokeWidth="2"
                points="0,120 50,118 100,120 150,116 200,120 250,120 300,120"
              />
            </svg>
            <div className="flex justify-between text-[11px] text-slate-400 mt-2 pt-1 border-t border-slate-100 dark:border-slate-800">
              <span>00</span>
              <span>04</span>
              <span>08</span>
              <span>12</span>
              <span>16</span>
              <span>20</span>
              <span>24</span>
            </div>
          </div>
        </div>

        {/* Energy Consumption Bar Chart */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-slate-900 dark:text-white">
              Energy Consumption
            </span>
            <span className="text-xs text-slate-400 font-medium">kWh</span>
          </div>

          <div className="flex-1 flex flex-col justify-end pt-4">
            <div className="h-32 flex items-end justify-between gap-2 px-2 border-b border-slate-100 dark:border-slate-800">
              {[
                { day: "Oct 4", val: 65 },
                { day: "Oct 5", val: 82 },
                { day: "Oct 6", val: 45 },
                { day: "Oct 7", val: 94 },
                { day: "Oct 8", val: 78 },
                { day: "Oct 9", val: 88 },
                { day: "Oct 10", val: 72 },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex-1 flex flex-col items-center gap-1 group"
                >
                  <div
                    className="w-full bg-blue-500 hover:bg-blue-600 rounded-t-sm transition-all"
                    style={{ height: `${item.val}%` }}
                  />
                  <span className="text-[10px] text-slate-400 mt-1 whitespace-nowrap">
                    {item.day.slice(4)}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mt-2">
              <span>Avg: 75.1 kWh</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                Optimal
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Operational Lists Row (Recent Missions, Active Alerts, Maintenance Due) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Active Looping Paths */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm flex flex-col">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Route className="w-4 h-4 text-cyan-500" />
              <span>Active Looping Paths</span>
            </span>
            <button
              onClick={() => onNavigate?.(VIEWS.MAP)}
              className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-0.5"
            >
              Live Map <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 flex-1">
            {agvs.slice(0, 3).map((agv) => (
              <div
                key={agv.id}
                onClick={() => onNavigate?.(VIEWS.MAP)}
                className="p-3.5 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 cursor-pointer transition-colors flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span
                      className="w-2 h-2 rounded-full ring-1 ring-white dark:ring-slate-900 shrink-0"
                      style={{ backgroundColor: getRobotColorTheme(agv.id).hex }}
                    />
                    <span>{agv.id}</span>
                    <span className="text-[10px] text-slate-400 font-normal">({agv.name})</span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {agv.currentMission || "Continuous Looping Path"}
                  </div>
                </div>
                <StatusBadge status={agv.status} />
              </div>
            ))}
            {agvs.length === 0 && (
              <div className="p-4 text-xs text-slate-400 text-center">
                No active AGVs connected. Add an AGV to start looping.
              </div>
            )}
          </div>
        </div>

        {/* Active Alerts */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm flex flex-col">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-sm font-bold text-slate-900 dark:text-white">
              Active Alerts
            </span>
            <button
              onClick={() => onNavigate?.(VIEWS.ALERTS)}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5"
            >
              View All <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 flex-1">
            {alerts.slice(0, 3).map((a) => (
              <div
                key={a.id}
                className="p-3.5 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors flex items-start justify-between gap-3"
              >
                <div className="flex items-start gap-2.5">
                  <span
                    className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                      a.level === "danger"
                        ? "bg-red-500"
                        : a.level === "warning"
                        ? "bg-amber-500"
                        : "bg-blue-500"
                    }`}
                  />
                  <div>
                    <div className="text-xs font-semibold text-slate-900 dark:text-white">
                      <span className="font-bold">{a.agv}</span> {a.message}
                    </div>
                  </div>
                </div>
                <span className="text-[11px] text-slate-400 shrink-0 whitespace-nowrap">
                  {a.time}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Maintenance Due */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm flex flex-col">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-sm font-bold text-slate-900 dark:text-white">
              Maintenance Due
            </span>
            <button
              onClick={() => onNavigate?.(VIEWS.MAINTENANCE)}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5"
            >
              View All <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 flex-1">
            {maintenance.slice(0, 3).map((m, idx) => (
              <div
                key={m.id}
                onClick={() => onNavigate?.(VIEWS.MAINTENANCE)}
                className="p-3.5 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 cursor-pointer transition-colors flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                  <div>
                    <div className="text-xs font-semibold text-slate-900 dark:text-white">
                      <span className="font-bold">{m.agv}</span> {m.service}
                    </div>
                  </div>
                </div>
                <span
                  className={`text-[11px] font-medium shrink-0 ${
                    idx < 2
                      ? "text-amber-600 dark:text-amber-400"
                      : "text-slate-400"
                  }`}
                >
                  {idx === 0
                    ? "3 days left"
                    : idx === 1
                    ? "5 days left"
                    : "8 days left"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
