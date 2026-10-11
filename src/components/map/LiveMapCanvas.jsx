import React from "react";
import MapToolbar from "./MapToolbar";
import AgvVehicleMarker from "./AgvVehicleMarker";
import { getRobotPath, getRobotColorTheme } from "../../constants";
import { getZoneConfig } from "../../utils/zoneConfig";

export default function LiveMapCanvas({
  viewportRef,
  pan,
  zoom,
  setZoom,
  isDragging,
  handleMouseDown,
  handleMouseMove,
  handleMouseUp,
  handleTouchStart,
  handleTouchMove,
  handleTouchEnd,
  handleResetView,
  layers,
  toggleLayer,
  selectedAgv,
  setSelectedAgvId,
  onSelectAgv,
  activeFloor,
  forklift,
  isForkliftOnActiveFloor,
  activeRoute,
  agvs,
  showAllPaths = false,
  onCanvasClick,
}) {
  return (
    <div
      ref={viewportRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={`flex-1 relative overflow-hidden bg-slate-100/60 dark:bg-slate-950 flex items-center justify-center p-2 sm:p-3 transition-colors select-none ${
        isDragging ? "cursor-grabbing" : "cursor-grab"
      }`}
    >
      {/* Floating Zoom & Layers Toolbar */}
      <MapToolbar
        zoom={zoom}
        onZoomIn={() =>
          setZoom((z) => Math.min(Number((z + 0.2).toFixed(2)), 3.5))
        }
        onZoomOut={() =>
          setZoom((z) => Math.max(Number((z - 0.2).toFixed(2)), 0.4))
        }
        onResetView={handleResetView}
        layers={layers}
        onToggleLayer={toggleLayer}
      />

      {/* Factory Blueprint CAD Map Canvas */}
      <div
        className="w-full h-full max-w-7xl max-h-[860px] flex items-center justify-center origin-center will-change-transform"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transition: isDragging ? "none" : "transform 120ms ease-out",
        }}
      >
        <svg
          viewBox="0 0 1000 650"
          className="w-full h-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c0d10] shadow-md dark:shadow-2xl transition-colors cursor-default"
          onClick={onCanvasClick}
        >
          {/* Grid Patterns for Light and Dark */}
          <defs>
            <pattern
              id="cadGridLight"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="#e2e4e9"
                strokeWidth="1"
                strokeOpacity="0.85"
              />
            </pattern>
            <pattern
              id="cadGridDark"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="#22242a"
                strokeWidth="1"
                strokeOpacity="0.75"
              />
            </pattern>

            {/* Hazard Stripes for Restricted No-Go Zones */}
            <pattern
              id="hazardStripesRed"
              width="16"
              height="16"
              patternTransform="rotate(45 0 0)"
              patternUnits="userSpaceOnUse"
            >
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="16"
                stroke="#ef4444"
                strokeWidth="6"
                strokeOpacity="0.4"
              />
            </pattern>

            {/* Caution Stripes for Slow Zones */}
            <pattern
              id="hazardStripesAmber"
              width="16"
              height="16"
              patternTransform="rotate(45 0 0)"
              patternUnits="userSpaceOnUse"
            >
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="16"
                stroke="#f59e0b"
                strokeWidth="6"
                strokeOpacity="0.35"
              />
            </pattern>
          </defs>

          {/* Grid Background */}
          <rect
            width="1000"
            height="650"
            fill="url(#cadGridLight)"
            className="dark:hidden"
          />
          <rect
            width="1000"
            height="650"
            fill="url(#cadGridDark)"
            className="hidden dark:block"
          />

          {/* Uploaded Blueprint Image (if present) */}
          {activeFloor.customMapImage && (
            <image
              href={activeFloor.customMapImage}
              xlinkHref={activeFloor.customMapImage}
              width="1000"
              height="650"
              preserveAspectRatio="none"
              opacity={0.85}
            />
          )}

          {/* Exterior Structural Walls (if no custom blueprint) */}
          {!activeFloor.customMapImage && (
            <g id="structuralLayout" opacity="0.9">
              <rect
                x="40"
                y="40"
                width="920"
                height="570"
                fill="none"
                className="stroke-slate-300 dark:stroke-slate-800"
                strokeWidth="3"
                rx="12"
              />
            </g>
          )}

          {/* Operational Areas & Safety Zones */}
          {layers.showZones && (
            <g id="restrictedZones">
              {(activeFloor.restrictedZones || []).map((zone) => {
                const config = getZoneConfig(zone.type);
                const isSafety = config.isSafety;
                const isNoGo = zone.type === "no-go";
                const isSlow = zone.type === "slow";

                return (
                  <g key={zone.id}>
                    <rect
                      x={zone.x}
                      y={zone.y}
                      width={zone.w}
                      height={zone.h}
                      fill={
                        isNoGo
                          ? "url(#hazardStripesRed)"
                          : isSlow
                          ? "url(#hazardStripesAmber)"
                          : config.fill
                      }
                      stroke={config.stroke}
                      strokeWidth={isSafety ? "2" : "1.5"}
                      strokeDasharray={isSafety ? "4 4" : "none"}
                      rx="8"
                    />
                    {/* Badge Label */}
                    <rect
                      x={zone.x + 8}
                      y={zone.y + 6}
                      width={Math.max(65, (zone.name || "Area").length * 6.5 + 24)}
                      height="20"
                      rx="4"
                      className="fill-slate-900/90"
                    />
                    <text
                      x={zone.x + 14}
                      y={zone.y + 20}
                      fill={config.stroke}
                      fontSize="9.5"
                      fontWeight="bold"
                    >
                      {config.icon} {(zone.name || "AREA").toUpperCase()}
                    </text>
                  </g>
                );
              })}
            </g>
          )}

          {/* Guide Corridors (shown when paths are visible) */}
          {(showAllPaths || selectedAgv) && (
            <g id="corridors" opacity="0.35">
              <path
                d="M 170 140 H 880 V 535 H 170 Z"
                fill="none"
                className="stroke-slate-300 dark:stroke-slate-800"
                strokeWidth="1.5"
                strokeDasharray="6 6"
              />
              <path
                d="M 170 300 H 880"
                fill="none"
                className="stroke-slate-300 dark:stroke-slate-800"
                strokeWidth="1.5"
                strokeDasharray="6 6"
              />
            </g>
          )}

          {/* Dynamic Robot Looping Paths:
              1. Hidden by default.
              2. If a robot is clicked/selected: isolate and show ONLY that robot's designated path in its accent color.
              3. Else if showAllPaths is toggled on: show all active robots' paths in Cyan, Emerald, and Amber simultaneously.
          */}
          {(() => {
            let pathsToRender = [];
            if (selectedAgv?.id) {
              // Isolate ONLY the selected robot's path
              const path = getRobotPath(selectedAgv.id, activeFloor.id);
              const theme = getRobotColorTheme(selectedAgv.id);
              pathsToRender = [{ robot: selectedAgv, path, theme }];
            } else if (showAllPaths) {
              // Show all robots' paths concurrently
              pathsToRender = (agvs || [])
                .filter((r) => !r.floorId || r.floorId === activeFloor.id)
                .map((r) => ({
                  robot: r,
                  path: getRobotPath(r.id, activeFloor.id),
                  theme: getRobotColorTheme(r.id),
                }));
            }

            if (pathsToRender.length === 0) return null;

            return (
              <g id="activeLoopPaths">
                {pathsToRender.map(({ robot, path, theme }) => {
                  if (!path || path.length < 2) return null;
                  const pointsStr = path.map((wp) => `${wp.x},${wp.y}`).join(" ");
                  return (
                    <g key={`path-group-${robot.id}`} id={`path-${robot.id}`}>
                      {/* Outer Ambient Glow with robot's accent color */}
                      <polygon
                        points={pointsStr}
                        fill="none"
                        stroke={theme.hex}
                        strokeOpacity="0.25"
                        strokeWidth="10"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      {/* Core Animated Track Polyline */}
                      <polygon
                        points={pointsStr}
                        fill="none"
                        stroke={theme.hex}
                        strokeWidth="3.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeDasharray="8 6"
                      />
                      {/* Waypoint Nodes along the loop */}
                      {path.map((wp, idx) => (
                        <g key={wp.id || `${robot.id}-wp-${idx}`}>
                          <circle
                            cx={wp.x}
                            cy={wp.y}
                            r="7.5"
                            fill={theme.hex}
                            className="stroke-white dark:stroke-slate-900"
                            strokeWidth="2"
                          />
                          <text
                            x={wp.x}
                            y={wp.y + 3.2}
                            textAnchor="middle"
                            className="fill-white font-bold text-[8.5px] pointer-events-none select-none"
                          >
                            {idx + 1}
                          </text>
                          <text
                            x={wp.x}
                            y={wp.y - 11}
                            textAnchor="middle"
                            fill={theme.hex}
                            className="font-bold text-[9.5px] select-none pointer-events-none"
                          >
                            {wp.label || `WP ${idx + 1}`}
                          </text>
                        </g>
                      ))}
                    </g>
                  );
                })}
              </g>
            );
          })()}

          {/* Stations on Floor */}
          {layers.showStations && (
            <g id="stations">
              {(activeFloor.stations || []).map((stn) => {
                const isCharger = stn.type === "charger";
                const isElevator = stn.type === "elevator";

                return (
                  <g key={stn.id} className="cursor-pointer">
                    {/* Station base marker */}
                    <circle
                      cx={stn.x}
                      cy={stn.y}
                      r="14"
                      className={
                        isCharger
                          ? "fill-amber-500/20 stroke-amber-500"
                          : isElevator
                          ? "fill-purple-500/20 stroke-purple-500"
                          : "fill-blue-500/20 stroke-blue-500"
                      }
                      strokeWidth="2"
                    />
                    <circle
                      cx={stn.x}
                      cy={stn.y}
                      r="5"
                      className={
                        isCharger
                          ? "fill-amber-500"
                          : isElevator
                          ? "fill-purple-500"
                          : "fill-blue-500"
                      }
                    />

                    {/* Cargo Pallet Icon if dock has waiting pallet */}
                    {stn.hasPallet && (
                      <g transform={`translate(${stn.x - 10}, ${stn.y + 12})`}>
                        <rect
                          width="20"
                          height="14"
                          rx="2"
                          className="fill-amber-500 stroke-amber-300"
                          strokeWidth="1"
                        />
                        <text
                          x="10"
                          y="10"
                          textAnchor="middle"
                          className="fill-slate-950 font-bold text-[8px]"
                        >
                          PLT
                        </text>
                      </g>
                    )}

                    {/* Station Label */}
                    <text
                      x={stn.x}
                      y={stn.y - 18}
                      textAnchor="middle"
                      className="fill-slate-700 dark:fill-slate-300 font-bold text-[10px]"
                    >
                      {stn.name}
                    </text>
                  </g>
                );
              })}
            </g>
          )}



          {/* Active AGVs on Active Floor — Detailed Industrial Vehicle Models */}
          {layers.showAgvs &&
            (agvs || [])
              .filter(
                (robot) =>
                  robot && (!robot.floorId || robot.floorId === activeFloor.id)
              )
              .map((robot) => (
                <AgvVehicleMarker
                  key={robot.id}
                  robot={robot}
                  isSelected={selectedAgv?.id === robot.id}
                  onSelect={(id) => setSelectedAgvId(id)}
                />
              ))}
        </svg>
      </div>
    </div>
  );
}
