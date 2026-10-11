import React from "react";
import { getRobotColorTheme } from "../../constants";

/**
 * Universal AGV Vehicle Map Marker
 * Renders high-precision industrial vehicle markers according to robot type
 * (Forklift, Flatbed Carrier, Tugger Tractor, AMR Puck) with dynamic color themes.
 */
function AgvVehicleMarker({
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
  const isFault = status === "Fault";
  const isReturning = status === "Returning to Charger";

  const theme = getRobotColorTheme(robot.id);

  // Status indicator dot color
  const statusDotColor = isFault || isBlocked
    ? "#ef4444"
    : isCharging
    ? "#10b981"
    : isReturning
    ? "#f59e0b"
    : isTeleop
    ? "#38bdf8"
    : "#22c55e";

  // Clean, concise status label (removes redundant "(Looping)" and long text)
  const getCleanStatus = (st) => {
    if (!st) return "Idle";
    if (st.includes("Auto-Pilot") || st.includes("Looping") || st.includes("Mission")) return "Auto-Pilot";
    if (st.includes("Manual")) return "Manual";
    if (st.includes("Returning")) return "Docking";
    if (st.includes("Charging")) return "Charging";
    if (st.includes("Obstacle") || st.includes("Blocked")) return "Blocked";
    if (st.includes("Fault")) return "Fault";
    if (st.includes("Low Battery")) return "Low Batt";
    if (st.includes("Stopped")) return "Stopped";
    return st;
  };

  const shortStatus = getCleanStatus(status);
  const batteryPct = Math.round(robot.battery ?? 100);

  // Identify model classification
  const rType = (robot.type || "").toLowerCase();
  const rId = (robot.id || "").toLowerCase();

  const isAmr = rType.includes("amr") || rType.includes("mobile robot") || rId.startsWith("amr");
  const isTugger = rType.includes("tugger") || rType.includes("tractor") || rId.startsWith("tug");
  const isFlatbed = rType.includes("flatbed") || rType.includes("carrier") || rId.startsWith("fb");
  // Default is Forklift (FL-)
  const isForklift = !isAmr && !isTugger && !isFlatbed;

  return (
    <g
      id={`agv-marker-${robot.id}`}
      transform={`translate(${posX}, ${posY})`}
      style={{
        transition: "transform 60ms linear",
        willChange: "transform",
      }}
      className="cursor-pointer group select-none"
      onClick={(e) => {
        e.stopPropagation();
        onSelect?.(robot.id);
      }}
    >
      {/* 1. SELECTION ACTIVE TRACKING RETICLE */}
      {isSelected && (
        <g id="activeTrackingReticle" className="pointer-events-none">
          {/* Static Focus Reticle Ring */}
          <circle
            r="28"
            fill={theme.hex}
            fillOpacity="0.12"
            stroke={theme.hex}
            strokeWidth="2"
            strokeDasharray="4 3"
          />
          {/* Crosshair Corner Focus Ticks */}
          <line x1="-32" y1="0" x2="-26" y2="0" stroke={theme.hex} strokeWidth="2.2" strokeLinecap="round" />
          <line x1="26" y1="0" x2="32" y2="0" stroke={theme.hex} strokeWidth="2.2" strokeLinecap="round" />
          <line x1="0" y1="-32" x2="0" y2="-26" stroke={theme.hex} strokeWidth="2.2" strokeLinecap="round" />
          <line x1="0" y1="26" x2="0" y2="32" stroke={theme.hex} strokeWidth="2.2" strokeLinecap="round" />
        </g>
      )}

      {/* Subtle safety envelope on fault or obstacle */}
      {(isBlocked || isFault) && (
        <circle
          r="26"
          fill="#ef4444"
          fillOpacity="0.2"
          stroke="#ef4444"
          strokeWidth="1.5"
        />
      )}

      {/* 2. ROTATED VEHICLE GRAPHIC (ALIGNED TO HEADING) */}
      <g transform={`rotate(${heading})`}>
        {/* --- MODEL A: AUTONOMOUS MOBILE ROBOT (AMR PUCK / NO FORKS) --- */}
        {isAmr && (
          <g id={`amr-${robot.id}`}>
            {/* Sleek Rounded AMR Chassis */}
            <rect
              x="-18"
              y="-14"
              width="36"
              height="28"
              rx="9"
              className="fill-slate-900"
              stroke={theme.hex}
              strokeWidth="2.5"
            />

            {/* Recessed Polyurethane Wheels */}
            <rect x="-11" y="-17" width="9" height="3" rx="1.5" className="fill-slate-700" />
            <rect x="-11" y="14" width="9" height="3" rx="1.5" className="fill-slate-700" />
            <rect x="5" y="-17" width="9" height="3" rx="1.5" className="fill-slate-700" />
            <rect x="5" y="14" width="9" height="3" rx="1.5" className="fill-slate-700" />

            {/* Top Rotating Lift Turntable Disc */}
            <circle cx="0" cy="0" r="10" className="fill-slate-800 stroke-slate-600" strokeWidth="1.2" />
            <circle cx="0" cy="0" r="5" fill="#0f172a" />

            {/* Forward Direction Vector Arrow */}
            <path d="M 12 0 L 6 -3.5 L 6 3.5 Z" fill={theme.hex} opacity="0.9" />

            {/* 360 LiDAR Optical Window */}
            <circle cx="9" cy="0" r="2.5" fill={theme.hex} />
            <circle cx="9" cy="0" r="1" fill="#ffffff" />
          </g>
        )}

        {/* --- MODEL B: FLATBED PAYLOAD CARRIER AGV --- */}
        {isFlatbed && (
          <g id={`flatbed-${robot.id}`}>
            {/* Low-Profile Heavy-Duty Flatbed Chassis */}
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

            {/* 4 Heavy Drive Wheels */}
            <rect x="-14" y="-18.5" width="10" height="3.5" rx="1.5" className="fill-slate-700" />
            <rect x="-14" y="15" width="10" height="3.5" rx="1.5" className="fill-slate-700" />
            <rect x="4" y="-18.5" width="10" height="3.5" rx="1.5" className="fill-slate-700" />
            <rect x="4" y="15" width="10" height="3.5" rx="1.5" className="fill-slate-700" />

            {/* Steel Roller Platform Bed */}
            <rect
              x="-16"
              y="-11"
              width="32"
              height="22"
              rx="2"
              className="fill-slate-800 stroke-slate-600"
              strokeWidth="1.2"
            />
            <line x1="-8" y1="-11" x2="-8" y2="11" stroke="#475569" strokeWidth="1" />
            <line x1="0" y1="-11" x2="0" y2="11" stroke="#475569" strokeWidth="1" />
            <line x1="8" y1="-11" x2="8" y2="11" stroke="#475569" strokeWidth="1" />

            {/* Corner Safety Bumpers */}
            <rect x="-21" y="-7" width="2" height="14" rx="0.5" className="fill-amber-400" />
            <rect x="19" y="-7" width="2" height="14" rx="0.5" className="fill-amber-400" />

            {/* Forward Heading Vector */}
            <path d="M 12 0 L 6 -3.5 L 6 3.5 Z" fill={theme.hex} opacity="0.9" />

            {/* Cargo Box (if carrying payload) */}
            {robot.cargo && (
              <rect
                x="-12"
                y="-8"
                width="24"
                height="16"
                rx="2"
                className="fill-amber-500 stroke-amber-200"
                strokeWidth="1.2"
              />
            )}
          </g>
        )}

        {/* --- MODEL C: AUTOMATED TOW TRACTOR AGV (TUGGER) --- */}
        {isTugger && (
          <g id={`tugger-${robot.id}`}>
            {/* Tractor Cab & Chassis */}
            <path
              d="M -18 13 L -18 -13 L 8 -13 L 16 -7 L 16 7 L 8 13 Z"
              className="fill-slate-900"
              stroke={theme.hex}
              strokeWidth="2.5"
            />

            {/* Large Drive Wheels */}
            <rect x="-12" y="-17.5" width="12" height="4.5" rx="1.5" className="fill-slate-700" />
            <rect x="-12" y="13" width="12" height="4.5" rx="1.5" className="fill-slate-700" />

            {/* Front Heavy Bumper */}
            <rect x="14" y="-8" width="3" height="16" rx="1" className="fill-amber-400" />

            {/* Rear Tow Hitch */}
            <rect x="-22" y="-3" width="5" height="6" rx="1" fill="#475569" />

            {/* Forward Heading Indicator */}
            <path d="M 12 0 L 6 -3 L 6 3 Z" fill={theme.hex} />
          </g>
        )}

        {/* --- MODEL D: FORKLIFT AGV (WITH LIFT MAST & FORKS) --- */}
        {isForklift && (
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

            {/* Drive Wheels */}
            <rect x="-13" y="-17.5" width="10" height="3.5" rx="1.5" className="fill-slate-700" />
            <rect x="-13" y="14" width="10" height="3.5" rx="1.5" className="fill-slate-700" />
            <rect x="7" y="-17.5" width="10" height="3.5" rx="1.5" className="fill-slate-700" />
            <rect x="7" y="14" width="10" height="3.5" rx="1.5" className="fill-slate-700" />

            {/* Overhead Safety Guard */}
            <rect
              x="-11"
              y="-10"
              width="18"
              height="20"
              rx="3"
              className="fill-slate-800/90 stroke-slate-600"
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
              className="stroke-slate-400"
              strokeWidth="2.5"
            />

            {/* Dual Steel Fork Tines Extending Forward */}
            <line
              x1="18"
              y1="-7"
              x2="32"
              y2="-7"
              className="stroke-amber-400"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <line
              x1="18"
              y1="7"
              x2="32"
              y2="7"
              className="stroke-amber-400"
              strokeWidth="3"
              strokeLinecap="round"
            />

            {/* Cargo Pallet on Forks */}
            {robot.cargo && (
              <rect
                x="21"
                y="-10"
                width="16"
                height="20"
                rx="2"
                className="fill-amber-500 stroke-amber-200"
                strokeWidth="1.2"
              />
            )}

            {/* Front Solid-State LiDAR */}
            <circle cx="16" cy="0" r="2.8" fill={theme.hex} />
            <circle cx="16" cy="0" r="1.2" fill="#ffffff" />
          </g>
        )}
      </g>

      {/* 3. CLEAN, COMPACT FLOATING TAG BADGE (ADAPTIVE SIZE) */}
      <g transform={`translate(0, ${isSelected ? 32 : 28})`}>
        {/* Pill Background Container */}
        <rect
          x={isSelected ? -56 : -32}
          y="-9"
          width={isSelected ? 112 : 64}
          height="18"
          rx="9"
          fill={isSelected ? theme.hex : "rgba(15, 23, 42, 0.9)"}
          stroke={isSelected ? "#ffffff" : "rgba(51, 65, 85, 0.8)"}
          strokeWidth={isSelected ? "2" : "1"}
          style={{
            filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.4))",
          }}
        />

        {/* Status LED Indicator Dot */}
        <circle
          cx={isSelected ? -45 : -23}
          cy="0"
          r="2.2"
          fill={statusDotColor}
        />

        {/* Clean, Perfectly Centered Text */}
        <text
          x={isSelected ? 4 : 5}
          y="0.5"
          textAnchor="middle"
          dominantBaseline="central"
          className={`${
            isSelected ? "fill-white font-black" : "fill-slate-100 font-bold"
          } text-[8.5px] tracking-tight`}
        >
          {isSelected ? `${robot.id} • ${shortStatus} • ${batteryPct}%` : `${robot.id} • ${batteryPct}%`}
        </text>
      </g>
    </g>
  );
}

export default React.memo(AgvVehicleMarker);
