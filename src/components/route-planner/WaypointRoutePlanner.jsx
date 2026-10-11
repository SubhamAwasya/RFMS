import React, { useRef, useState, useEffect } from "react";
import {
  RotateCcw,
  Trash2,
  Navigation,
  Sparkles,
  Move,
} from "lucide-react";
import FloorPlanZones from "./FloorPlanZones";
import RouteTimeline from "./RouteTimeline";
import { getSvgCoordinates } from "../../utils/svg";
import { ROUTE_PRESETS } from "../../constants";
import { useFleet } from "../../context/FleetContext";

export default function WaypointRoutePlanner({
  waypoints,
  setWaypoints,
  totalMeters,
  estMinutes,
  activePreset,
  onApplyPreset,
  onResetWaypoints,
}) {
  let fleetCtx = null;
  try {
    fleetCtx = useFleet();
  } catch (e) {}

  const activeFloor = fleetCtx?.activeFloor;
  const floorStations = activeFloor?.stations || [];

  const svgRef = useRef(null);
  const [draggingId, setDraggingId] = useState(null);
  const [hoverPos, setHoverPos] = useState(null);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const hasDraggedRef = useRef(false);

  const handleSnapToStation = (stn) => {
    const targetX = Math.round(stn.x > 540 ? (stn.x * 500) / 1000 + 20 : stn.x);
    const targetY = Math.round(stn.y > 400 ? (stn.y * 360) / 650 + 20 : stn.y);

    setWaypoints((prev) => {
      const endIdx = prev.findIndex((w) => w.type === "end");
      if (prev.length <= 2) {
        if (!prev[0].label.includes(stn.name)) {
          return [
            { ...prev[0], x: targetX, y: targetY, label: `Start - ${stn.name}` },
            ...prev.slice(1),
          ];
        } else if (endIdx !== -1) {
          const next = [...prev];
          next[endIdx] = { ...next[endIdx], x: targetX, y: targetY, label: `End - ${stn.name}` };
          return next;
        }
      } else {
        const next = [...prev];
        next[endIdx] = { ...next[endIdx], x: targetX, y: targetY, label: `End - ${stn.name}` };
        return next;
      }
      return prev;
    });
  };

  // Canvas Click to Place Waypoint
  const handleSvgClick = (e) => {
    if (hasDraggedRef.current) {
      hasDraggedRef.current = false;
      return;
    }
    if (waypoints.length >= 10) return;

    const coords = getSvgCoordinates(svgRef.current, e.clientX, e.clientY, { minX: 25, maxX: 515, minY: 25, maxY: 375 });
    if (!coords) return;

    const endIdx = waypoints.findIndex((w) => w.type === "end");
    const midCount = waypoints.filter((w) => w.type === "mid").length + 1;
    const newWaypoint = {
      id: `wp-${Date.now()}`,
      label: `Waypoint ${midCount}`,
      x: coords.x,
      y: coords.y,
      type: "mid",
    };

    if (endIdx !== -1) {
      setWaypoints((prev) => [
        ...prev.slice(0, endIdx),
        newWaypoint,
        ...prev.slice(endIdx),
      ]);
    } else {
      setWaypoints((prev) => [...prev, newWaypoint]);
    }
  };

  // Drag Handlers
  const handleWaypointMouseDown = (e, id) => {
    e.stopPropagation();
    setDraggingId(id);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    hasDraggedRef.current = false;
  };

  useEffect(() => {
    const handleMouseMoveGlobal = (e) => {
      if (!draggingId) return;
      if (
        Math.abs(e.clientX - dragStartRef.current.x) > 3 ||
        Math.abs(e.clientY - dragStartRef.current.y) > 3
      ) {
        hasDraggedRef.current = true;
      }
      const coords = getSvgCoordinates(svgRef.current, e.clientX, e.clientY, { minX: 25, maxX: 515, minY: 25, maxY: 375 });
      if (!coords) return;
      setWaypoints((prev) =>
        prev.map((w) => (w.id === draggingId ? { ...w, x: coords.x, y: coords.y } : w))
      );
    };

    const handleMouseUpGlobal = () => {
      if (draggingId) {
        setDraggingId(null);
        setTimeout(() => {
          hasDraggedRef.current = false;
        }, 50);
      }
    };

    if (draggingId) {
      window.addEventListener("mousemove", handleMouseMoveGlobal);
      window.addEventListener("mouseup", handleMouseUpGlobal);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMoveGlobal);
      window.removeEventListener("mouseup", handleMouseUpGlobal);
    };
  }, [draggingId, setWaypoints]);

  // Hover Handlers
  const handleSvgMouseMove = (e) => {
    if (draggingId) return;
    const coords = getSvgCoordinates(svgRef.current, e.clientX, e.clientY);
    setHoverPos(coords);
  };

  const handleSvgMouseLeave = () => {
    if (!draggingId) {
      setHoverPos(null);
    }
  };

  // Delete Individual Waypoint
  const handleDeleteWaypoint = (id, e) => {
    if (e) e.stopPropagation();
    if (waypoints.length <= 2) return;
    setWaypoints((prev) => {
      const filtered = prev.filter((w) => w.id !== id);
      let midCount = 1;
      return filtered.map((w) => {
        if (w.type === "mid") {
          return { ...w, label: `Waypoint ${midCount++}` };
        }
        return w;
      });
    });
  };

  // Undo Last Added Mid Point
  const handleUndo = () => {
    const midPoints = waypoints.filter((w) => w.type === "mid");
    if (midPoints.length > 0) {
      const lastMid = midPoints[midPoints.length - 1];
      handleDeleteWaypoint(lastMid.id);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6 flex flex-col justify-between space-y-4">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Navigation className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-bold text-slate-900 dark:text-white">
              Waypoint Route Planner
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold border border-blue-200 dark:border-blue-500/20">
              {waypoints.length} / 10 Points
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            Click map to add waypoint • Drag pins to reposition
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleUndo}
            disabled={waypoints.filter((w) => w.type === "mid").length === 0}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1 transition-colors"
            title="Undo last added waypoint"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Undo</span>
          </button>
          <button
            type="button"
            onClick={onResetWaypoints}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-500/15 flex items-center gap-1 transition-colors"
            title="Reset waypoints to Start and End only"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Quick Preset Corridors */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-400 shrink-0 flex items-center gap-1 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Presets:
        </span>
        {ROUTE_PRESETS.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => onApplyPreset(preset)}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium border shrink-0 transition-colors ${
              activePreset === preset.id
                ? "bg-blue-50 text-blue-700 border-blue-300 dark:bg-blue-500/15 dark:text-blue-300 dark:border-blue-500/30 font-semibold"
                : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
            }`}
          >
            {preset.name}
          </button>
        ))}
      </div>

      {/* Placed Floor Stations Bar */}
      {floorStations.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-400 shrink-0 font-medium">
            Facility Stations:
          </span>
          {floorStations.map((stn) => (
            <button
              key={stn.id}
              type="button"
              onClick={() => handleSnapToStation(stn)}
              className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 dark:bg-slate-800 dark:hover:bg-blue-500/10 text-slate-700 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-300 border border-slate-200 dark:border-slate-700 text-xs font-semibold shrink-0 transition-colors flex items-center gap-1"
            >
              <span>📍</span>
              <span>{stn.name}</span>
            </button>
          ))}
        </div>
      )}

      {/* SVG Map Canvas */}
      <div
        className={`flex-1 min-h-[350px] bg-slate-50 dark:bg-[#0b0d13] rounded-xl relative overflow-hidden border border-slate-200 dark:border-slate-800 transition-colors flex flex-col justify-center items-center ${
          draggingId ? "cursor-grabbing" : "cursor-crosshair"
        }`}
      >
        <svg
          ref={svgRef}
          viewBox="0 0 540 400"
          onClick={handleSvgClick}
          onMouseMove={handleSvgMouseMove}
          onMouseLeave={handleSvgMouseLeave}
          className="w-full h-full select-none block"
          style={{ touchAction: "none" }}
        >
          {/* Floor Plan Areas & Grid */}
          <FloorPlanZones />

          {/* Placed Floor Stations Visual Pins */}
          <g id="placed-floor-stations">
            {floorStations.map((stn) => {
              const mappedX = Math.round(
                stn.x > 540 ? (stn.x * 500) / 1000 + 20 : stn.x
              );
              const mappedY = Math.round(
                stn.y > 400 ? (stn.y * 360) / 650 + 20 : stn.y
              );
              const isCharger = stn.type === "charger";
              const isElevator = stn.type === "elevator";

              return (
                <g
                  key={stn.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSnapToStation(stn);
                  }}
                  className="cursor-pointer group"
                >
                  <circle
                    cx={mappedX}
                    cy={mappedY}
                    r="13"
                    className={
                      isCharger
                        ? "fill-amber-500/15 stroke-amber-500 group-hover:fill-amber-500/30"
                        : isElevator
                        ? "fill-purple-500/15 stroke-purple-500 group-hover:fill-purple-500/30"
                        : "fill-blue-500/15 stroke-blue-500 group-hover:fill-blue-500/30"
                    }
                    strokeWidth="1.5"
                  />
                  <circle
                    cx={mappedX}
                    cy={mappedY}
                    r="4"
                    className={
                      isCharger
                        ? "fill-amber-500"
                        : isElevator
                        ? "fill-purple-500"
                        : "fill-blue-500"
                    }
                  />
                  <text
                    x={mappedX}
                    y={mappedY - 15}
                    textAnchor="middle"
                    className="fill-slate-600 dark:fill-slate-300 font-bold text-[8.5px] pointer-events-none select-none"
                  >
                    {stn.name}
                  </text>
                </g>
              );
            })}
          </g>

          {/* Waypoint Polyline (Glow + Dashed Stroke) */}
          <polyline
            fill="none"
            stroke="#3b82f6"
            strokeWidth="8"
            opacity="0.18"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={waypoints.map((w) => `${w.x},${w.y}`).join(" ")}
          />
          <polyline
            fill="none"
            stroke="#2563eb"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="8 6"
            points={waypoints.map((w) => `${w.x},${w.y}`).join(" ")}
          />

          {/* Direction Indicator Chevrons along Route Segments */}
          {waypoints.slice(0, -1).map((w, idx) => {
            const next = waypoints[idx + 1];
            const midX = (w.x + next.x) / 2;
            const midY = (w.y + next.y) / 2;
            const angle = (Math.atan2(next.y - w.y, next.x - w.x) * 180) / Math.PI;
            return (
              <g
                key={`chevron-${w.id}-${next.id}`}
                transform={`translate(${midX}, ${midY}) rotate(${angle})`}
                className="pointer-events-none"
              >
                <polygon points="-6,-4 4,0 -6,4" fill="#3b82f6" opacity="0.8" />
              </g>
            );
          })}

          {/* Hover Ghost Indicator (Previews Exact Click Coordinate) */}
          {hoverPos && !draggingId && waypoints.length < 10 && (
            <g className="pointer-events-none transition-opacity">
              {waypoints.length > 0 && (
                <line
                  x1={waypoints[Math.max(0, waypoints.length - 2)].x}
                  y1={waypoints[Math.max(0, waypoints.length - 2)].y}
                  x2={hoverPos.x}
                  y2={hoverPos.y}
                  stroke="#3b82f6"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                  opacity="0.4"
                />
              )}
              <circle
                cx={hoverPos.x}
                cy={hoverPos.y}
                r={8}
                fill="none"
                stroke="#3b82f6"
                strokeWidth="1.75"
                strokeDasharray="3 3"
              />
              <circle cx={hoverPos.x} cy={hoverPos.y} r={2.5} fill="#3b82f6" />
              <g
                transform={`translate(${Math.min(hoverPos.x + 12, 450)}, ${Math.max(
                  hoverPos.y - 12,
                  24
                )})`}
              >
                <rect
                  x="0"
                  y="-14"
                  width="72"
                  height="18"
                  rx="4"
                  className="fill-slate-900/90 dark:fill-slate-800/95 stroke-slate-700/60"
                  strokeWidth="0.75"
                />
                <text
                  x="36"
                  y="-2"
                  textAnchor="middle"
                  className="fill-slate-100 text-[9px] font-mono font-medium"
                >
                  {hoverPos.x}, {hoverPos.y}
                </text>
              </g>
            </g>
          )}

          {/* Waypoint Pins & Draggable Handles */}
          {waypoints.map((w, index) => {
            const isStart = w.type === "start";
            const isEnd = w.type === "end";
            const isDraggingThis = draggingId === w.id;
            const pinColor = isStart ? "#10b981" : isEnd ? "#ef4444" : "#3b82f6";
            const symbol = isStart ? "A" : isEnd ? "B" : `${index}`;

            return (
              <g
                key={w.id}
                onMouseDown={(e) => handleWaypointMouseDown(e, w.id)}
                className="cursor-grab active:cursor-grabbing group select-none"
              >
                {/* Active Drag Halo */}
                {isDraggingThis && (
                  <circle
                    cx={w.x}
                    cy={w.y}
                    r={20}
                    fill={pinColor}
                    opacity="0.25"
                    className="animate-pulse"
                  />
                )}

                {/* Outer Pin Circle */}
                <circle
                  cx={w.x}
                  cy={w.y}
                  r={isStart || isEnd ? 11 : 9.5}
                  fill={pinColor}
                  stroke="#ffffff"
                  strokeWidth="2.5"
                  filter="url(#pin-shadow)"
                  className="transition-transform group-hover:scale-110"
                />

                {/* Step Identifier Inside Pin */}
                <text
                  x={w.x}
                  y={w.y + (isStart || isEnd ? 3.5 : 3.5)}
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize={isStart || isEnd ? "9.5" : "9"}
                  fontWeight="bold"
                  className="pointer-events-none select-none font-sans"
                >
                  {symbol}
                </text>

                {/* Floating Label Badge */}
                <g
                  transform={`translate(${
                    w.x > 380 ? w.x - 14 - (w.label.length * 6 + 18) : w.x + 14
                  }, ${w.y - 12})`}
                  className="pointer-events-none"
                >
                  <rect
                    x="0"
                    y="0"
                    width={w.label.length * 6 + 18}
                    height="22"
                    rx="11"
                    className="fill-white/95 dark:fill-slate-900/95 stroke-slate-200 dark:stroke-slate-700 shadow-sm"
                    strokeWidth="1"
                  />
                  <text
                    x={9}
                    y="14"
                    className="fill-slate-800 dark:fill-slate-100 font-bold"
                    fontSize="9.5"
                  >
                    {w.label}
                  </text>
                </g>
              </g>
            );
          })}
        </svg>

        {/* Live Drag Coordinate HUD */}
        {draggingId && (
          <div className="absolute top-3 left-3 bg-slate-900/90 text-white text-[11px] font-mono px-2.5 py-1 rounded-md shadow-md flex items-center gap-1.5 pointer-events-none">
            <Move className="w-3 h-3 text-blue-400" />
            <span>
              Adjusting {waypoints.find((w) => w.id === draggingId)?.label}: (
              {waypoints.find((w) => w.id === draggingId)?.x},{" "}
              {waypoints.find((w) => w.id === draggingId)?.y})
            </span>
          </div>
        )}
      </div>

      {/* Interactive Waypoint Route Sequence & Metrics */}
      <RouteTimeline
        waypoints={waypoints}
        totalMeters={totalMeters}
        estMinutes={estMinutes}
        onDeleteWaypoint={handleDeleteWaypoint}
      />
    </div>
  );
}
