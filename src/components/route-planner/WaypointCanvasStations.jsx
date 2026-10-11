import React from "react";

export default function WaypointCanvasStations({
  floorStations = [],
  onSnapToStation,
}) {
  if (!floorStations || floorStations.length === 0) return null;

  return (
    <g id="facilityStationsOverlay">
      {floorStations.map((stn) => {
        const isCharger = stn.type === "charger";
        const isElevator = stn.type === "elevator";

        // Map 1000x650 coordinates to Route Planner canvas aspect (540x400)
        const mappedX = Math.round(
          stn.x > 540 ? (stn.x * 500) / 1000 + 20 : stn.x
        );
        const mappedY = Math.round(
          stn.y > 400 ? (stn.y * 360) / 650 + 20 : stn.y
        );

        const pillWidth = Math.max(
          68,
          Math.min(110, (stn.name || "").length * 5.5 + 24)
        );
        const halfPill = pillWidth / 2;

        return (
          <g
            key={`route-stn-${stn.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onSnapToStation(stn);
            }}
            className="cursor-pointer group select-none"
            transform={`translate(${mappedX}, ${mappedY})`}
          >
            {/* High-Tech Industrial Dock Graphics */}
            {isCharger ? (
              <g id={`wp-charger-${stn.id}`}>
                {/* Heavy-Duty Industrial Base Plate */}
                <rect
                  x="-20"
                  y="-16"
                  width="40"
                  height="32"
                  rx="5"
                  className="fill-slate-900/95 stroke-emerald-500/90 group-hover:stroke-emerald-400"
                  strokeWidth="1.8"
                  style={{
                    filter: "drop-shadow(0 2px 6px rgba(16, 185, 129, 0.35))",
                  }}
                />
                <rect
                  x="-16"
                  y="-12"
                  width="32"
                  height="24"
                  rx="3"
                  className="fill-slate-800 stroke-slate-700/60"
                  strokeWidth="0.8"
                />
                {/* Dual Copper Contacts */}
                <rect
                  x="-18"
                  y="-6"
                  width="2.5"
                  height="12"
                  rx="0.8"
                  className="fill-amber-400"
                />
                <rect
                  x="15.5"
                  y="-6"
                  width="2.5"
                  height="12"
                  rx="0.8"
                  className="fill-amber-400"
                />
                {/* Induction Coil */}
                <circle
                  r="9"
                  fill="none"
                  className="stroke-emerald-400/50"
                  strokeWidth="1"
                  strokeDasharray="2.5 1.5"
                />
                <circle
                  r="6"
                  className="fill-emerald-500/20 stroke-emerald-400"
                  strokeWidth="1"
                />
                {/* Lightning Bolt */}
                <path
                  d="M 1 -4 L -2.2 0 L 0.5 0 L -1 4 L 3 -0.5 L 0.5 -0.5 Z"
                  className="fill-emerald-400 stroke-emerald-100"
                  strokeWidth="0.4"
                />
              </g>
            ) : isElevator ? (
              <g id={`wp-elevator-${stn.id}`}>
                <rect
                  x="-18"
                  y="-15"
                  width="36"
                  height="30"
                  rx="5"
                  className="fill-slate-900/95 stroke-purple-500 group-hover:stroke-purple-400"
                  strokeWidth="1.8"
                />
                <rect
                  x="-14"
                  y="-11"
                  width="13"
                  height="22"
                  rx="1.5"
                  className="fill-slate-800 stroke-purple-400/40"
                  strokeWidth="0.8"
                />
                <rect
                  x="1"
                  y="-11"
                  width="13"
                  height="22"
                  rx="1.5"
                  className="fill-slate-800 stroke-purple-400/40"
                  strokeWidth="0.8"
                />
                <line
                  x1="0"
                  y1="-11"
                  x2="0"
                  y2="11"
                  className="stroke-purple-400"
                  strokeWidth="1.2"
                />
              </g>
            ) : (
              <g id={`wp-dock-${stn.id}`}>
                <rect
                  x="-17"
                  y="-14"
                  width="34"
                  height="28"
                  rx="4"
                  className="fill-slate-900/90 stroke-blue-500 group-hover:stroke-blue-400"
                  strokeWidth="1.8"
                />
                <circle
                  r="5.5"
                  className="fill-blue-500/20 stroke-blue-400"
                  strokeWidth="1"
                />
                <circle r="2" className="fill-blue-400" />
              </g>
            )}

            {/* Interactive Snap-Target Ring on Hover */}
            <circle
              r="22"
              fill="none"
              className="stroke-amber-400/0 group-hover:stroke-amber-400/50 transition-colors"
              strokeWidth="1.5"
              strokeDasharray="3 3"
            />

            {/* Floating Glassmorphism Badge Pill */}
            <g
              transform="translate(0, -25)"
              className="pointer-events-none select-none"
            >
              <rect
                x={-halfPill}
                y="-9"
                width={pillWidth}
                height="18"
                rx="9"
                className="fill-slate-900/95 stroke-slate-700/80 shadow-md group-hover:stroke-amber-400/70"
                strokeWidth="1.2"
              />
              <circle
                cx={-halfPill + 8}
                cy="0"
                r="2.2"
                className={
                  isCharger
                    ? "fill-emerald-400 animate-pulse"
                    : isElevator
                    ? "fill-purple-400"
                    : "fill-blue-400"
                }
              />
              <text
                x="3"
                y="3"
                textAnchor="middle"
                className="fill-white font-bold text-[8.5px] tracking-tight"
              >
                {stn.name}
              </text>
            </g>
          </g>
        );
      })}
    </g>
  );
}
