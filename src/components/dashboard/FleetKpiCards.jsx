import React from "react";

export default function FleetKpiCards({ agvs = [] }) {
  const autoLoop = agvs.filter((a) => a.status === "Auto-Pilot (Looping)" || a.status === "In Mission").length;
  const charging = agvs.filter((a) => a.status === "Charging").length;
  const idle = agvs.filter((a) => a.status === "Idle").length;
  const fault = agvs.filter((a) => a.status === "Stopped" || a.status === "Obstacle Blocked").length;
  const total = agvs.length;
  const active = autoLoop + charging;

  const metricCards = [
    {
      title: "Total AGVs",
      value: total,
      sub: "Active Fleet",
      subColor: "text-emerald-600 dark:text-emerald-400 font-semibold",
    },
    {
      title: "Active",
      value: active,
      sub: total > 0 ? `${Math.round((active / total) * 100)}%` : "0%",
      subColor: "text-emerald-600 dark:text-emerald-400 font-semibold",
    },
    {
      title: "Auto Looping",
      value: autoLoop,
      sub: total > 0 ? `${Math.round((autoLoop / total) * 100)}%` : "0%",
      subColor: "text-cyan-600 dark:text-cyan-400 font-semibold",
    },
    {
      title: "Charging",
      value: charging,
      sub: total > 0 ? `${Math.round((charging / total) * 100)}%` : "0%",
      subColor: "text-amber-600 dark:text-amber-400 font-semibold",
    },
    {
      title: "Idle",
      value: idle,
      sub: total > 0 ? `${Math.round((idle / total) * 100)}%` : "0%",
      subColor: "text-slate-500 dark:text-slate-400 font-semibold",
    },
    {
      title: "Fault / Offline",
      value: fault,
      sub: total > 0 ? `${Math.round((fault / total) * 100)}%` : "0%",
      subColor: fault > 0 ? "text-red-500 font-bold" : "text-slate-400",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
      {metricCards.map((card, idx) => (
        <div
          key={idx}
          className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm flex flex-col justify-between"
        >
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {card.title}
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white my-1.5">
            {card.value}
          </div>
          <div className={`text-xs ${card.subColor}`}>{card.sub}</div>
        </div>
      ))}
    </div>
  );
}
