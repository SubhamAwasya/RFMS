import React from "react";
import { getRobotColorTheme } from "../../constants";

/**
 * Universal AGV Vehicle Map Marker
 * Renders all robots in the fleet as detailed, realistic industrial Forklift AGVs
 * with dynamic color coding corresponding to each robot's theme.
 */
export default function AgvVehicleMarker({
  robot,
  isSelected,
  onSelect,
}) {
  if (!robot) return null;

  const posX = robot.position?.x ?? robot.coordinates?.x ?? 300;
  const posY = robot.position?.y ?? robot.coordinates?.y ?? 250;
  const heading = robot.position?.headingDeg ?? robot.heading ?? 0;

  const status = robot.status || "Idle";
  const isBlocked = status === "Obstacle Blocked" || status === "Stopped";
  const isTeleop = status === "Manual Teleop";
  const isCharging = status === "Charging";

  const theme = getRobotColorTheme(robot.id);

  // Dynamic radar halo colors based on operational status and robot theme
  const radarColor = isBlocked
    ? "#ef4444"
    : isTeleop
    ? "#f59e0b"
    : isCharging
    ? "#10b981"
    : theme.hex;

  return (
    <g
      id={`agv-marker-${robot.id}`}
      transform={`translate(${posX}, ${posY})`}
      className="cursor-pointer group select-none transition-transform duration-150"
      onClick={(e) => {
        e.stopPropagation();
        onSelect?.(robot.id);
      }}
    >
      {/* Outer Selection Highlight Glow (when selected by operator) */}
      {isSelected && (
        <circle
          r="36"
          fill="none"
          stroke={theme.hex}
          strokeWidth="2.5"
          strokeDasharray="4 4"
          className="animate-pulse"
        />
      )}

      {/* LiDAR Proximity Safety Envelope Ring */}
      <circle
        r="28"
        fill={radarColor}
        fillOpacity={isBlocked ? 0.25 : 0.15}
        stroke={radarColor}
        strokeWidth="1.5"
        strokeDasharray="3 3"
        className={isBlocked || isTeleop ? "animate-pulse" : ""}
      />

      {/* Rotated Industrial Vehicle Graphic aligned to heading */}
      <g transform={`rotate(${heading})`}>
        {robot.type === "Flatbed Payload Carrier AGV" || robot.id?.startsWith("FB") ? (
          <g id={`flatbed-${robot.id}`}>
            {/* Heavy-Duty Industrial Low-Profile Flatbed Chassis */}
            <rect
              x="-22"
              y="-15"
              width="44"
              height="30"
              rx="4"
              className="fill-slate-900"
              stroke={theme.hex}
              strokeWidth="2.5"
            />

            {/* Industrial Drive Wheels (4 Heavy Polyurethane Wheels) */}
            <rect x="-14" y="-18.5" width="10" height="3.5" rx="1.5" className="fill-slate-700 dark:fill-slate-600" />
            <rect x="-14" y="15" width="10" height="3.5" rx="1.5" className="fill-slate-700 dark:fill-slate-600" />
            <rect x="4" y="-18.5" width="10" height="3.5" rx="1.5" className="fill-slate-700 dark:fill-slate-600" />
            <rect x="4" y="15" width="10" height="3.5" rx="1.5" className="fill-slate-700 dark:fill-slate-600" />

            {/* High-Traction Diamond Steel Deck / Flatbed Platform Bed */}
            <rect
              x="-16"
              y="-11"
              width="32"
              height="22"
              rx="2"
              className="fill-slate-800 stroke-slate-600 dark:stroke-slate-700"
              strokeWidth="1.2"
            />

            {/* Platform Roller / Skid Guide Lines */}
            <line x1="-8" y1="-11" x2="-8" y2="11" stroke="#475569" strokeWidth="1" strokeDasharray="2 2" />
            <line x1="0" y1="-11" x2="0" y2="11" stroke="#475569" strokeWidth="1" strokeDasharray="2 2" />
            <line x1="8" y1="-11" x2="8" y2="11" stroke="#475569" strokeWidth="1" strokeDasharray="2 2" />

            {/* Front & Rear Amber Warning Chevrons / Impact Bumpers */}
            <rect x="-21" y="-7" width="2" height="14" rx="0.5" className="fill-amber-400" />
            <rect x="19" y="-7" width="2" height="14" rx="0.5" className="fill-amber-400" />

            {/* Dual Diagonal 360 LiDAR Safety Sensors (Front-Right & Rear-Left) */}
            <circle cx="18" cy="-11" r="3" fill={theme.hex} />
            <circle cx="18" cy="-11" r="1.2" fill="#ffffff" />
            <circle cx="-18" cy="11" r="3" fill={theme.hex} />
            <circle cx="-18" cy="11" r="1.2" fill="#ffffff" />

            {/* Forward Heading Vector Chevron Indicator */}
            <path d="M 12 0 L 6 -3.5 L 6 3.5 Z" fill={theme.hex} opacity="0.9" />

            {/* Flatbed Payload Cargo Container (if carrying cargo/pallet) */}
            {robot.cargo ? (
              <g>
                <rect
                  x="-12"
                  y="-8"
                  width="24"
                  height="16"
                  rx="2"
                  className="fill-amber-500 stroke-amber-200"
                  strokeWidth="1.2"
                />
                <line x1="-12" y1="0" x2="12" y2="0" className="stroke-amber-700" strokeWidth="1" />
                <line x1="0" y1="-8" x2="0" y2="8" className="stroke-amber-700" strokeWidth="1" />
                <text
                  x="0"
                  y="2.5"
                  textAnchor="middle"
                  className="fill-slate-950 font-extrabold text-[6.5px] pointer-events-none select-none"
                >
                  CARGO
                </text>
              </g>
            ) : null}
          </g>
        ) : (
          <g id={`forklift-${robot.id}`}>
            {/* Main Counterbalanced Chassis */}
            <rect
              x="-19"
              y="-14"
              width="38"
              height="28"
              rx="5"
              className="fill-slate-900"
              stroke={theme.hex}
              strokeWidth="2.5"
            />

            {/* Industrial Rubber Drive Wheels */}
            <rect x="-13" y="-17.5" width="10" height="3.5" rx="1.5" className="fill-slate-700 dark:fill-slate-600" />
            <rect x="-13" y="14" width="10" height="3.5" rx="1.5" className="fill-slate-700 dark:fill-slate-600" />
            <rect x="7" y="-17.5" width="10" height="3.5" rx="1.5" className="fill-slate-700 dark:fill-slate-600" />
            <rect x="7" y="14" width="10" height="3.5" rx="1.5" className="fill-slate-700 dark:fill-slate-600" />

            {/* Protective Overhead Cabin */}
            <rect
              x="-11"
              y="-10"
              width="18"
              height="20"
              rx="3"
              className="fill-slate-800/90 stroke-slate-600 dark:stroke-slate-700"
              strokeWidth="1.2"
            />

            {/* Rear Counterweight Warning Band */}
            <rect x="-18" y="-9" width="3" height="18" rx="1" className="fill-amber-400" />

            {/* Mast Uprights Crossbar */}
            <line
              x1="18"
              y1="-11"
              x2="18"
              y2="11"
              className="stroke-slate-400 dark:stroke-slate-300"
              strokeWidth="2.5"
            />

            {/* Dual Steel Fork Tines Extending Forward (+X) */}
            <line
              x1="18"
              y1="-8"
              x2="34"
              y2="-8"
              className="stroke-amber-400"
              strokeWidth="3.2"
              strokeLinecap="round"
            />
            <line
              x1="18"
              y1="8"
              x2="34"
              y2="8"
              className="stroke-amber-400"
              strokeWidth="3.2"
              strokeLinecap="round"
            />

            {/* Cargo Pallet on Forks (if carrying payload) */}
            {robot.cargo ? (
              <g>
                <rect
                  x="22"
                  y="-11"
                  width="18"
                  height="22"
                  rx="3"
                  className="fill-amber-500 stroke-amber-200"
                  strokeWidth="1.5"
                />
                <line x1="22" y1="0" x2="40" y2="0" className="stroke-amber-700" strokeWidth="1" />
              </g>
            ) : null}

            {/* Front Solid-State LiDAR Sensor */}
            <circle cx="16" cy="0" r="3" fill={theme.hex} />
            <circle cx="16" cy="0" r="1.2" className="fill-white" />
          </g>
        )}
      </g>

      {/* Floating Tag Label Badge (fixed orientation below robot) */}
      <g transform="translate(0, 36)">
        <rect
          x="-65"
          y="-12"
          width="130"
          height="24"
          rx="12"
          className={
            isSelected
              ? "shadow-lg"
              : "fill-white/95 dark:fill-slate-900/95 stroke-slate-200 dark:stroke-slate-700 shadow-md"
          }
          fill={isSelected ? theme.hex : undefined}
          stroke={isSelected ? "#ffffff" : undefined}
          strokeWidth={isSelected ? "2" : "1.5"}
        />
        <text
          x="0"
          y="3.5"
          textAnchor="middle"
          className={`${
            isSelected
              ? "fill-white font-extrabold"
              : "fill-slate-900 dark:fill-white font-bold"
          } text-[10px] tracking-tight`}
        >
          {robot.id} • {robot.status} (⚡{Math.round(robot.battery ?? 100)}%)
        </text>
      </g>
    </g>
  );
}
