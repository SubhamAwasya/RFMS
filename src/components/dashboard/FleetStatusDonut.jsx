import React from "react";

export default function FleetStatusDonut({ agvs = [] }) {
  const autoLoop = agvs.filter(
    (a) => a.status === "Auto-Pilot (Looping)" || a.status === "In Mission" || a.status === "Manual Teleop"
  ).length;
  const charging = agvs.filter(
    (a) => a.status === "Charging" || a.status === "Returning to Charger"
  ).length;
  const idle = agvs.filter((a) => a.status === "Idle").length;
  const fault = agvs.filter(
    (a) =>
      a.status === "Stopped" ||
      a.status === "Obstacle Blocked" ||
      a.status === "Fault" ||
      a.status === "Low Battery"
  ).length;
  const total = agvs.length;

  const C = 2 * Math.PI * 38; // ~238.761

  // Dynamic segments
  const segments = [
    { label: "Auto Looping", count: autoLoop, color: "#06b6d4" },
    { label: "Charging", count: charging, color: "#f59e0b" },
    { label: "Idle Standby", count: idle, color: "#10b981" },
    { label: "Fault / Attention", count: fault, color: "#ef4444" },
  ];

  let cumulativeOffset = 0;
  const renderedSlices = segments.map((seg) => {
    const fraction = total > 0 ? seg.count / total : 0;
    const dash = fraction * C;
    const offset = cumulativeOffset;
    cumulativeOffset += dash;
    return { ...seg, dash, offset };
  });

  return (
    <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-bold text-slate-900 dark:text-white">
          AGV Fleet Status
        </span>
        <span className="text-[11px] font-mono font-semibold text-slate-400">
          Live Telemetry
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-around gap-4 flex-1">
        {/* Dynamic SVG Donut */}
        <div className="relative w-36 h-36 shrink-0">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            <circle
              cx="50"
              cy="50"
              r="38"
              fill="none"
              className="stroke-slate-100 dark:stroke-slate-800"
              strokeWidth="12"
            />
            {total > 0 &&
              renderedSlices.map((slice, i) =>
                slice.count > 0 ? (
                  <circle
                    key={i}
                    cx="50"
                    cy="50"
                    r="38"
                    fill="none"
                    stroke={slice.color}
                    strokeWidth="12"
                    strokeDasharray={`${slice.dash} ${C - slice.dash}`}
                    strokeDashoffset={-slice.offset}
                    style={{
                      transition: "stroke-dasharray 0.6s ease, stroke-dashoffset 0.6s ease",
                    }}
                  />
                ) : null
              )}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-black text-slate-900 dark:text-white leading-none font-mono">
              {total}
            </span>
            <span className="text-[10px] text-slate-400 uppercase font-semibold mt-0.5">
              AGVs
            </span>
          </div>
        </div>

        {/* Donut Legend */}
        <div className="grid grid-cols-2 gap-x-5 gap-y-2.5 text-xs w-full sm:w-auto">
          {segments.map((seg, i) => (
            <div key={i} className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: seg.color }}
              />
              <span className="text-slate-600 dark:text-slate-400 truncate max-w-[90px]">
                {seg.label}
              </span>
              <span className="font-bold text-slate-900 dark:text-white font-mono ml-auto">
                {seg.count}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
