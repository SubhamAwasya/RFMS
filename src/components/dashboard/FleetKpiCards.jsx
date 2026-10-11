import React from "react";
import { Bot, Gauge, Package, Battery } from "lucide-react";
import { VIEWS } from "../../constants";

export default function FleetKpiCards({ agvs = [], onNavigate }) {
  const total = agvs.length;

  const moving = agvs.filter(
    (a) =>
      a.status === "Auto-Pilot (Looping)" ||
      a.status === "In Mission" ||
      a.status === "Manual Teleop" ||
      a.status === "Returning to Charger"
  ).length;

  const charging = agvs.filter((a) => a.status === "Charging").length;
  const idle = agvs.filter((a) => a.status === "Idle").length;
  const fault = agvs.filter(
    (a) =>
      a.status === "Stopped" ||
      a.status === "Obstacle Blocked" ||
      a.status === "Fault" ||
      a.status === "Low Battery"
  ).length;

  // Real Average Battery
  const avgBattery =
    total > 0
      ? (agvs.reduce((acc, a) => acc + (a.battery ?? 100), 0) / total).toFixed(1)
      : "100.0";
  const lowBatteryCount = agvs.filter((a) => (a.battery ?? 100) < 20).length;

  // Real Average Speed
  const avgSpeed =
    total > 0
      ? (agvs.reduce((acc, a) => acc + (typeof a.speed === "number" ? a.speed : 0), 0) / total).toFixed(2)
      : "0.00";
  const speedKmH = (Number(avgSpeed) * 3.6).toFixed(1);

  // Real Total Payload
  const totalPayloadKg = agvs.reduce((acc, a) => {
    if (a.cargo?.weightKg) return acc + Number(a.cargo.weightKg);
    if (typeof a.payload === "string") {
      const num = parseInt(a.payload.replace(/[^0-9]/g, ""), 10);
      if (!isNaN(num)) return acc + num;
    }
    return acc;
  }, 0);
  const loadedPalletsCount = agvs.filter((a) => a.cargo?.hasPallet).length;

  const cards = [
    {
      title: "Total Fleet",
      value: `${total} Units`,
      sub: `${moving} moving • ${charging} charging • ${idle} idle`,
      subColor: "text-slate-500 dark:text-slate-400",
      icon: Bot,
      view: VIEWS.ROBOTS,
      accent: "text-blue-500 bg-blue-500/10",
    },
    {
      title: "Cruising Velocity",
      value: `${avgSpeed} m/s`,
      sub: `${speedKmH} km/h • ${moving} units in motion`,
      subColor: "text-emerald-600 dark:text-emerald-400 font-medium",
      icon: Gauge,
      view: VIEWS.MAP,
      accent: "text-emerald-500 bg-emerald-500/10",
    },
    {
      title: "Active Payload",
      value: `${totalPayloadKg.toLocaleString()} kg`,
      sub: `${loadedPalletsCount} loaded pallet(s) in transit`,
      subColor: "text-amber-600 dark:text-amber-400 font-medium",
      icon: Package,
      view: VIEWS.MAP,
      accent: "text-amber-500 bg-amber-500/10",
    },
    {
      title: "Fleet Battery",
      value: `${avgBattery}%`,
      sub: lowBatteryCount > 0 ? `${lowBatteryCount} low battery (<20%)` : `${charging} on charging pads`,
      subColor: lowBatteryCount > 0 ? "text-amber-500 font-medium" : "text-cyan-600 dark:text-cyan-400",
      icon: Battery,
      view: VIEWS.MAP,
      accent: "text-cyan-500 bg-cyan-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            onClick={() => onNavigate?.(card.view)}
            className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs hover:border-blue-500/50 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                {card.title}
              </span>
              <div className={`p-1.5 rounded-lg ${card.accent}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white my-1.5 font-mono">
              {card.value}
            </div>
            <div className={`text-[11px] truncate ${card.subColor}`}>
              {card.sub}
            </div>
          </div>
        );
      })}
    </div>
  );
}
