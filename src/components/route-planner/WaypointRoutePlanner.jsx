import React, { useRef, useState, useEffect } from "react";
import { Move } from "lucide-react";
import FloorPlanZones from "./FloorPlanZones";
import RouteTimeline from "./RouteTimeline";
import WaypointPlannerHeader from "./WaypointPlannerHeader";
import WaypointCanvasStations from "./WaypointCanvasStations";
import WaypointCanvasMarkers from "./WaypointCanvasMarkers";
import { getSvgCoordinates } from "../../utils/svg";
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

    const coords = getSvgCoordinates(svgRef.current, e.clientX, e.clientY, {
      minX: 25,
      maxX: 515,
      minY: 25,
      maxY: 375,
    });
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
      const coords = getSvgCoordinates(svgRef.current, e.clientX, e.clientY, {
        minX: 25,
        maxX: 515,
        minY: 25,
        maxY: 375,
      });
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
      {/* Header, Presets & Station Snapping Bar */}
      <WaypointPlannerHeader
        waypoints={waypoints}
        onUndo={handleUndo}
        onResetWaypoints={onResetWaypoints}
        activePreset={activePreset}
        onApplyPreset={onApplyPreset}
        floorStations={floorStations}
        onSnapToStation={handleSnapToStation}
      />

      {/* Interactive CAD Route Planner SVG Canvas */}
      <div className="relative w-full rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <svg
          ref={svgRef}
          viewBox="0 0 540 400"
          className="w-full h-auto cursor-crosshair select-none"
          onClick={handleSvgClick}
          onMouseMove={handleSvgMouseMove}
          onMouseLeave={handleSvgMouseLeave}
        >
          {/* Subtle Grid Pattern */}
          <defs>
            <pattern
              id="plannerGrid"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 20 0 L 0 0 0 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                className="text-slate-200 dark:text-slate-800"
              />
            </pattern>
            <filter id="pin-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.25" />
            </filter>
          </defs>

          {/* Grid Background */}
          <rect width="540" height="400" fill="url(#plannerGrid)" />

          {/* Structural Layout Walls */}
          <rect
            x="25"
            y="25"
            width="490"
            height="350"
            fill="none"
            className="stroke-slate-300 dark:stroke-slate-700"
            strokeWidth="1.5"
            rx="6"
          />

          {/* Standard Facility Zones */}
          <FloorPlanZones />

          {/* Placed Facility Stations with High-Tech Dock Icons */}
          <WaypointCanvasStations
            floorStations={floorStations}
            onSnapToStation={handleSnapToStation}
          />

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
          <WaypointCanvasMarkers
            waypoints={waypoints}
            draggingId={draggingId}
            onWaypointMouseDown={handleWaypointMouseDown}
          />
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
