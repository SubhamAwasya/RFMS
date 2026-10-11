import React, { useState } from "react";
import { getRobotPath, getRobotColorTheme } from "../../../constants";

export default function MapCanvasPaths({
  selectedAgv,
  showAllPaths = false,
  activeFloorId,
  agvs = [],
}) {
  const [hoveredWp, setHoveredWp] = useState(null);
  const isVisible = showAllPaths || Boolean(selectedAgv);
  if (!isVisible) return null;

  let pathsToRender = [];
  if (selectedAgv?.id) {
    // In tracking mode: Focus ONLY on the selected robot's route
    const path = getRobotPath(selectedAgv.id, activeFloorId);
    const theme = getRobotColorTheme(selectedAgv.id);
    pathsToRender = [{ robot: selectedAgv, path, theme, isFocused: true }];
  } else if (showAllPaths) {
    // Fleet overview mode: Render all active robots' routes with sleek, non-intrusive rails
    pathsToRender = (agvs || [])
      .filter((r) => !r.floorId || r.floorId === activeFloorId)
      .map((r) => ({
        robot: r,
        path: getRobotPath(r.id, activeFloorId),
        theme: getRobotColorTheme(r.id),
        isFocused: false,
      }));
  }

  if (pathsToRender.length === 0) return null;

  return (
    <g id="activeLoopPaths">
      {pathsToRender.map(({ robot, path, theme, isFocused }) => {
        if (!path || path.length < 2) return null;
        const pointsStr = path.map((wp) => `${wp.x},${wp.y}`).join(" ");
        const targetIndex = robot.targetWaypointIndex ?? 1;

        return (
          <g key={`path-group-${robot.id}`} id={`path-${robot.id}`}>
            {/* 1. Sleek Navigation Rail Track */}
            <polygon
              points={pointsStr}
              fill="none"
              stroke={theme.hex}
              strokeOpacity={isFocused ? "0.2" : "0.12"}
              strokeWidth={isFocused ? "8" : "5"}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <polygon
              points={pointsStr}
              fill="none"
              stroke={theme.hex}
              strokeOpacity={isFocused ? "0.95" : "0.55"}
              strokeWidth={isFocused ? "2.5" : "1.8"}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={isFocused ? "8 6" : "6 6"}
            />

            {/* 2. Direction Chevrons along Route Segments (Shows flow without text clutter) */}
            {path.map((wp, idx) => {
              const nextWp = path[(idx + 1) % path.length];
              const midX = (wp.x + nextWp.x) / 2;
              const midY = (wp.y + nextWp.y) / 2;
              const angle = (Math.atan2(nextWp.y - wp.y, nextWp.x - wp.x) * 180) / Math.PI;

              return (
                <g
                  key={`chevron-${robot.id}-${idx}`}
                  transform={`translate(${midX}, ${midY}) rotate(${angle})`}
                  className="pointer-events-none select-none"
                  opacity={isFocused ? "0.85" : "0.4"}
                >
                  <polygon
                    points="-4,-3 3,0 -4,3"
                    fill={theme.hex}
                  />
                </g>
              );
            })}

            {/* 3. Clean, Minimalist Waypoint Nodes (Numbers only, ZERO text collisions) */}
            {path.map((wp, idx) => {
              const isTargetWp = isFocused && idx === targetIndex;
              const isHovered = hoveredWp?.robotId === robot.id && hoveredWp?.idx === idx;

              return (
                <g
                  key={wp.id || `${robot.id}-wp-${idx}`}
                  className="cursor-pointer group"
                  onMouseEnter={() => setHoveredWp({ robotId: robot.id, idx, wp })}
                  onMouseLeave={() => setHoveredWp(null)}
                >

                  {/* Waypoint Node Dot */}
                  <circle
                    cx={wp.x}
                    cy={wp.y}
                    r={isTargetWp ? "7" : isFocused ? "5.5" : "4.5"}
                    fill={theme.hex}
                    className="stroke-white dark:stroke-slate-950 transition-transform group-hover:scale-125"
                    strokeWidth={isTargetWp ? "2" : "1.5"}
                  />

                  {/* Clean Sequential Step Number inside node */}
                  {(isFocused || isTargetWp) && (
                    <text
                      x={wp.x}
                      y={wp.y + 2.5}
                      textAnchor="middle"
                      className="fill-white font-black text-[7px] pointer-events-none select-none"
                    >
                      {idx + 1}
                    </text>
                  )}

                  {/* On-Demand Tooltip (ONLY visible on explicit mouse hover) */}
                  {isHovered && (
                    <g transform={`translate(${wp.x}, ${wp.y - 16})`} className="pointer-events-none select-none z-50">
                      <rect
                        x="-48"
                        y="-14"
                        width="96"
                        height="18"
                        rx="4"
                        className="fill-slate-900/95 stroke-slate-700/80 shadow-lg"
                        strokeWidth="1"
                      />
                      <text
                        x="0"
                        y="-2"
                        textAnchor="middle"
                        className="fill-white font-bold text-[8.5px]"
                      >
                        {wp.label || `WP ${idx + 1}`}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </g>
        );
      })}
    </g>
  );
}
