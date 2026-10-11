import React from "react";

export default function MapCanvasStations({ stations = [], agvs = [] }) {
  const getShortName = (name) => {
    if (!name) return "Station";
    return name
      .replace(/\s*\(Receiving\)/i, "")
      .replace("Docking Bay", "Dock")
      .replace("Pad ", "")
      .replace("Freight ", "");
  };

  return (
    <g id="stations">
      {stations.map((stn) => {
        const isCharger = stn.type === "charger";
        const isElevator = stn.type === "elevator";

        // Check if any AGV is currently docked/charging at this station
        const isDocked = agvs.some(
          (robot) =>
            (robot.status === "Charging" || robot.status === "Docked") &&
            Math.hypot(
              (robot.position?.x ?? robot.coordinates?.x ?? 0) - stn.x,
              (robot.position?.y ?? robot.coordinates?.y ?? 0) - stn.y
            ) < 36
        );

        const shortName = getShortName(stn.name);
        const pillWidth = Math.max(68, Math.min(120, shortName.length * 5.6 + 22));
        const halfW = pillWidth / 2;

        return (
          <g
            key={stn.id}
            transform={`translate(${stn.x}, ${stn.y})`}
            className="cursor-pointer group select-none"
          >
            {isCharger ? (
              /* High-Tech Fast Charger Induction Dock Pad */
              <g id={`charger-pad-${stn.id}`}>
                {/* Outer Glow Halo Ring (pulses when charging) */}
                <circle
                  r="24"
                  fill="none"
                  stroke={isDocked ? "#10b981" : "#f59e0b"}
                  strokeWidth="1.8"
                  strokeDasharray="3 3"
                  className={isDocked ? "animate-spin-slow opacity-90" : "opacity-30"}
                />

                {/* Industrial Base Chassis */}
                <rect
                  x="-20"
                  y="-16"
                  width="40"
                  height="32"
                  rx="6"
                  className="fill-slate-900/95 dark:fill-slate-950/95 stroke-emerald-500/90 dark:stroke-emerald-400"
                  strokeWidth="2"
                  style={{
                    filter: "drop-shadow(0 2px 8px rgba(16, 185, 129, 0.3))",
                  }}
                />

                {/* Inductive Charging Recessed Core Plate */}
                <rect
                  x="-16"
                  y="-12"
                  width="32"
                  height="24"
                  rx="4"
                  className="fill-slate-800 dark:fill-slate-900 stroke-slate-700/80 dark:stroke-slate-800"
                  strokeWidth="0.8"
                />

                {/* Dual Copper High-Current Docking Contacts */}
                <rect
                  x="-18"
                  y="-7"
                  width="2.5"
                  height="14"
                  rx="1"
                  className="fill-amber-400 stroke-amber-200"
                  strokeWidth="0.6"
                />
                <rect
                  x="15.5"
                  y="-7"
                  width="2.5"
                  height="14"
                  rx="1"
                  className="fill-amber-400 stroke-amber-200"
                  strokeWidth="0.6"
                />

                {/* Concentric Wireless Induction Coil */}
                <circle
                  r="9"
                  fill="none"
                  className="stroke-emerald-400/50"
                  strokeWidth="1"
                  strokeDasharray="3 2"
                />
                <circle
                  r="6.5"
                  className="fill-emerald-500/25 stroke-emerald-400"
                  strokeWidth="1.2"
                />

                {/* Central Luminous Lightning Zap Icon */}
                <path
                  d="M 1.2 -4.5 L -2.5 0 L 0.5 0 L -1.2 4.5 L 3.5 -0.5 L 0.5 -0.5 Z"
                  className="fill-emerald-400 stroke-emerald-100"
                  strokeWidth="0.4"
                />
              </g>
            ) : isElevator ? (
              /* Freight Elevator Shaft Dock */
              <g id={`elevator-dock-${stn.id}`}>
                <rect
                  x="-20"
                  y="-16"
                  width="40"
                  height="32"
                  rx="5"
                  className="fill-slate-900/95 stroke-purple-500"
                  strokeWidth="2"
                  style={{
                    filter: "drop-shadow(0 2px 8px rgba(168, 85, 247, 0.3))",
                  }}
                />
                <rect
                  x="-16"
                  y="-12"
                  width="15"
                  height="24"
                  rx="2"
                  className="fill-slate-800 stroke-purple-400/40"
                  strokeWidth="0.8"
                />
                <rect
                  x="1"
                  y="-12"
                  width="15"
                  height="24"
                  rx="2"
                  className="fill-slate-800 stroke-purple-400/40"
                  strokeWidth="0.8"
                />
                <line x1="0" y1="-12" x2="0" y2="12" className="stroke-purple-400" strokeWidth="1.2" />
                <path d="M -6 -3 L -9 1 L -3 1 Z" className="fill-purple-300" />
                <path d="M 6 3 L 3 -1 L 9 -1 Z" className="fill-purple-300" />
              </g>
            ) : (
              /* Standard Industrial Cargo & Docking Bay */
              <g id={`standard-station-${stn.id}`}>
                <rect
                  x="-18"
                  y="-14"
                  width="36"
                  height="28"
                  rx="5"
                  className="fill-slate-900/90 stroke-blue-500"
                  strokeWidth="1.8"
                  style={{
                    filter: "drop-shadow(0 2px 6px rgba(59, 130, 246, 0.25))",
                  }}
                />
                <rect
                  x="-14"
                  y="-10"
                  width="28"
                  height="20"
                  rx="2.5"
                  className="fill-slate-800 stroke-blue-400/30"
                  strokeWidth="0.8"
                />
                <circle r="5.5" className="fill-blue-500/20 stroke-blue-400" strokeWidth="1.2" />
                <circle r="2.2" className="fill-blue-400" />
              </g>
            )}

            {/* Cargo Pallet Icon if dock has waiting pallet */}
            {stn.hasPallet && (
              <g transform="translate(-9, 10)">
                <rect
                  width="18"
                  height="11"
                  rx="1.5"
                  className="fill-amber-500 stroke-amber-200 shadow-sm"
                  strokeWidth="1"
                />
                <line x1="0" y1="5.5" x2="18" y2="5.5" className="stroke-amber-700" strokeWidth="0.6" />
                <text
                  x="9"
                  y="8.5"
                  textAnchor="middle"
                  className="fill-slate-950 font-black text-[6.5px]"
                >
                  PALLET
                </text>
              </g>
            )}

            {/* Sleek, Non-Intrusive Station Label Badge (Placed below base, never colliding with corridors) */}
            <g
              transform={`translate(0, ${stn.hasPallet ? 26 : 20})`}
              className="pointer-events-none select-none"
            >
              <rect
                x={-halfW}
                y="-8"
                width={pillWidth}
                height="16"
                rx="8"
                className="fill-slate-900/90 dark:fill-slate-950/90 stroke-slate-700/80 shadow-md"
                strokeWidth="1"
              />

              {/* Status Indicator LED Dot */}
              <circle
                cx={-halfW + 8}
                cy="0"
                r="2"
                className={
                  isCharger
                    ? isDocked
                      ? "fill-emerald-400 animate-pulse"
                      : "fill-emerald-400"
                    : isElevator
                    ? "fill-purple-400"
                    : "fill-blue-400"
                }
              />

              {/* Station Clean Short Name */}
              <text
                x={-halfW + 14}
                y="2.8"
                textAnchor="start"
                className="fill-slate-100 font-extrabold text-[8px] tracking-tight"
              >
                {shortName}
              </text>
            </g>
          </g>
        );
      })}
    </g>
  );
}
