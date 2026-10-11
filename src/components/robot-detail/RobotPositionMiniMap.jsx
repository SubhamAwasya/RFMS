import React from "react";
import { Compass } from "lucide-react";

export default function RobotPositionMiniMap({
  agv,
  theme,
  designatedPath = [],
  robotX,
  robotY,
  robotRot,
  closestWaypoint,
  assignedFloor,
  onNavigateMap,
}) {
  if (!agv) return null;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-5 flex flex-col justify-between space-y-4 h-full">
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-blue-500" />
            <span>Current Position</span>
          </span>
          <button
            onClick={onNavigateMap}
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer flex items-center gap-0.5"
          >
            <span>View on Map</span>
          </button>
        </div>

        {/* Real-Time Floor Canvas Mini-Map */}
        <div className="w-full h-48 bg-slate-950 rounded-xl overflow-hidden relative border border-slate-200 dark:border-slate-800 shadow-inner">
          <svg viewBox="0 0 1000 650" className="w-full h-full">
            {/* Subtle Grid */}
            <defs>
              <pattern id="miniGrid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#334155" strokeWidth="1" opacity="0.25" />
              </pattern>
            </defs>
            <rect width="1000" height="650" fill="url(#miniGrid)" />

            {/* Designated Guide Path Polyline */}
            {designatedPath.length > 0 && (
              <g>
                <polyline
                  points={designatedPath.map((p) => `${p.x},${p.y}`).join(" ")}
                  fill="none"
                  stroke="#0284c7"
                  strokeWidth="4"
                  strokeDasharray="8 6"
                  opacity="0.6"
                />
                {/* Closed loop return segment */}
                <line
                  x1={designatedPath[designatedPath.length - 1].x}
                  y1={designatedPath[designatedPath.length - 1].y}
                  x2={designatedPath[0].x}
                  y2={designatedPath[0].y}
                  stroke="#0284c7"
                  strokeWidth="4"
                  strokeDasharray="8 6"
                  opacity="0.6"
                />

                {/* Path Waypoints */}
                {designatedPath.map((wp) => (
                  <circle
                    key={wp.id}
                    cx={wp.x}
                    cy={wp.y}
                    r="6"
                    fill="#0f172a"
                    stroke="#38bdf8"
                    strokeWidth="2.5"
                  />
                ))}
              </g>
            )}

            {/* Live Moving Robot Marker */}
            <g
              transform={`translate(${robotX}, ${robotY}) rotate(${robotRot})`}
              style={{ transition: "transform 0.08s linear" }}
            >
              {/* Vehicle Body Shadow */}
              <rect x="-22" y="-16" width="44" height="32" rx="6" fill="rgba(0,0,0,0.5)" />

              {/* Vehicle Body */}
              <rect
                x="-20"
                y="-14"
                width="40"
                height="28"
                rx="5"
                fill={theme?.hex || "#06b6d4"}
                stroke="#ffffff"
                strokeWidth="3"
              />

              {/* Heading Direction Arrow */}
              <polygon points="18,0 8,-7 8,7" fill="#ffffff" />

              {/* Center Dot */}
              <circle cx="0" cy="0" r="4" fill="#ffffff" />
            </g>

            {/* Robot ID Label Tag */}
            <text
              x={robotX}
              y={robotY + 32}
              fill="#ffffff"
              fontSize="20"
              fontWeight="bold"
              textAnchor="middle"
              style={{ textShadow: "0 2px 6px rgba(0,0,0,0.9)" }}
            >
              {agv.id}
            </text>
          </svg>
        </div>

        {/* Position & Location Details */}
        <div className="mt-3 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Location</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {closestWaypoint ? `Near ${closestWaypoint.label}` : "Guideway Corridor"}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Floor</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {assignedFloor?.name || "Ground Floor"}
            </span>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 font-mono text-[11px]">
            <span className="text-slate-500 dark:text-slate-400">Coordinates</span>
            <span className="text-blue-600 dark:text-blue-400 font-semibold">
              X: {Math.round(robotX)} • Y: {Math.round(robotY)} • θ: {Math.round(robotRot)}°
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
