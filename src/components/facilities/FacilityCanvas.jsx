import React from "react";
import FacilityToolbox from "./FacilityToolbox";

export default function FacilityCanvas({
  viewportRef,
  svgRef,
  pan,
  zoom,
  isPanning,
  activeTool,
  setActiveTool,
  stationTypeToAdd,
  setStationTypeToAdd,
  zoneTypeToAdd,
  setZoneTypeToAdd,
  setIsDrawingZone,
  setSelectedItem,
  setShowManualCoordModal,
  cursorCoords,
  currentFloor,
  blueprintOpacity,
  selectedItem,
  isDrawingZone,
  currentDrawZone,
  pxToMeters,
  handleCanvasMouseDown,
  handleCanvasMouseMove,
  handleCanvasMouseUp,
  handleZoneClick,
  handleStationMouseDown,
}) {
  return (
    <div
      ref={viewportRef}
      onMouseDown={handleCanvasMouseDown}
      onMouseMove={handleCanvasMouseMove}
      onMouseUp={handleCanvasMouseUp}
      className={`flex-1 relative overflow-hidden bg-slate-100/70 dark:bg-slate-950 flex items-center justify-center p-3 select-none ${
        activeTool === "pan"
          ? isPanning
            ? "cursor-grabbing"
            : "cursor-grab"
          : activeTool === "station"
          ? "cursor-crosshair"
          : activeTool === "draw-zone"
          ? "cursor-crosshair"
          : "cursor-pointer"
      }`}
    >
      {/* Subtle Bottom Floating Status HUD */}
      <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-300 shadow-md pointer-events-none font-mono">
        <span
          className={`w-2 h-2 rounded-full animate-pulse ${
            activeTool === "pan"
              ? "bg-blue-500"
              : activeTool === "station"
              ? "bg-emerald-500"
              : activeTool === "draw-zone"
              ? "bg-amber-500"
              : "bg-red-500"
          }`}
        />
        <span className="font-semibold text-slate-800 dark:text-slate-200">
          {activeTool === "pan"
            ? "Inspect Mode"
            : activeTool === "station"
            ? "Click Map to Place"
            : activeTool === "draw-zone"
            ? "Drag to Draw Zone"
            : "Delete Tool Active"}
        </span>
        <span className="text-slate-300 dark:text-slate-700">|</span>
        <span>
          X: {cursorCoords.meterX}m, Y: {cursorCoords.meterY}m
        </span>
        <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">|</span>
        <span className="text-slate-400 hidden sm:inline">1m / cell</span>
      </div>

      {/* Dedicated Vertical CAD Toolbox Floating Component */}
      <div className="absolute top-4 left-4 z-30">
        <FacilityToolbox
          activeTool={activeTool}
          setActiveTool={setActiveTool}
          stationTypeToAdd={stationTypeToAdd}
          setStationTypeToAdd={setStationTypeToAdd}
          zoneTypeToAdd={zoneTypeToAdd}
          setZoneTypeToAdd={setZoneTypeToAdd}
          setIsDrawingZone={setIsDrawingZone}
          setSelectedItem={setSelectedItem}
          onOpenManualCoords={() => setShowManualCoordModal(true)}
        />
      </div>

      {/* Zoomable & Pannable CAD Canvas Container */}
      <div
        className="w-full h-full max-w-5xl max-h-[700px] flex items-center justify-center origin-center will-change-transform"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transition: isPanning ? "none" : "transform 120ms ease-out",
        }}
      >
        <svg
          ref={svgRef}
          viewBox="0 0 1000 650"
          className="w-full h-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c0d10] shadow-xl transition-colors"
        >
          {/* Pattern Definitions */}
          <defs>
            <pattern id="facilityGridLight" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e2e4e9" strokeWidth="1" strokeOpacity="0.85" />
            </pattern>
            <pattern id="facilityGridDark" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#22242a" strokeWidth="1" strokeOpacity="0.75" />
            </pattern>

            {/* Red Hazard Stripes for No-Go Zones */}
            <pattern id="hazardRed" width="16" height="16" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0" y2="16" stroke="#ef4444" strokeWidth="5" strokeOpacity="0.45" />
            </pattern>

            {/* Amber Caution Stripes for Slow Zones */}
            <pattern id="hazardAmber" width="16" height="16" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0" y2="16" stroke="#f59e0b" strokeWidth="5" strokeOpacity="0.4" />
            </pattern>
          </defs>

          {/* Grid Background */}
          <rect width="1000" height="650" fill="url(#facilityGridLight)" className="dark:hidden" />
          <rect width="1000" height="650" fill="url(#facilityGridDark)" className="hidden dark:block" />

          {/* Uploaded Custom Blueprint Image (if present) */}
          {currentFloor.customMapImage && (
            <image
              href={currentFloor.customMapImage}
              width="1000"
              height="650"
              preserveAspectRatio="none"
              opacity={blueprintOpacity / 100}
            />
          )}

          {/* Architectural CAD Framework (if no custom blueprint) */}
          {!currentFloor.customMapImage && (
            <g id="structuralCAD" opacity="0.85">
              <rect
                x="40"
                y="40"
                width="920"
                height="570"
                fill="none"
                className="stroke-slate-300 dark:stroke-slate-800"
                strokeWidth="2.5"
                rx="10"
              />
              {/* Department Areas */}
              <g opacity="0.6">
                <rect x="70" y="70" width="240" height="150" rx="8" className="fill-slate-100/50 dark:fill-slate-900/40 stroke-slate-300 dark:stroke-slate-800" strokeWidth="1.5" />
                <text x="85" y="95" className="fill-slate-600 dark:fill-slate-400 font-bold" fontSize="10">INBOUND RECEIVING BAY</text>

                <rect x="350" y="70" width="260" height="150" rx="8" className="fill-slate-100/50 dark:fill-slate-900/40 stroke-slate-300 dark:stroke-slate-800" strokeWidth="1.5" />
                <text x="365" y="95" className="fill-slate-600 dark:fill-slate-400 font-bold" fontSize="10">MAIN ASSEMBLY LINE</text>

                <rect x="650" y="70" width="280" height="150" rx="8" className="fill-amber-500/5 dark:fill-amber-500/10 stroke-amber-500/20" strokeWidth="1.5" />
                <text x="665" y="95" className="fill-amber-600 dark:fill-amber-400 font-bold" fontSize="10">CHARGING BAY ALPHA</text>

                <rect x="70" y="420" width="540" height="150" rx="8" className="fill-slate-100/50 dark:fill-slate-900/40 stroke-slate-300 dark:stroke-slate-800" strokeWidth="1.5" />
                <text x="85" y="445" className="fill-slate-600 dark:fill-slate-400 font-bold" fontSize="10">HIGH-BAY STORAGE RACKS</text>

                <rect x="650" y="420" width="280" height="150" rx="8" className="fill-slate-100/50 dark:fill-slate-900/40 stroke-slate-300 dark:stroke-slate-800" strokeWidth="1.5" />
                <text x="665" y="445" className="fill-slate-600 dark:fill-slate-400 font-bold" fontSize="10">OUTBOUND DISPATCH DOCKS</text>
              </g>
            </g>
          )}

          {/* SAFETY RESTRICTED ZONES */}
          <g id="zonesLayer">
            {(currentFloor.restrictedZones || []).map((zone) => {
              const isSelected = selectedItem?.type === "zone" && selectedItem.id === zone.id;
              const isNoGo = zone.type === "no-go";
              const isSlow = zone.type === "slow";

              return (
                <g
                  key={zone.id}
                  onClick={(e) => handleZoneClick(e, zone.id)}
                  className={`cursor-pointer transition-all ${
                    activeTool === "delete" ? "hover:opacity-60" : ""
                  }`}
                >
                  <rect
                    x={zone.x}
                    y={zone.y}
                    width={zone.w}
                    height={zone.h}
                    fill={
                      isNoGo
                        ? "url(#hazardRed)"
                        : isSlow
                        ? "url(#hazardAmber)"
                        : "rgba(56, 189, 248, 0.15)"
                    }
                    stroke={
                      isSelected
                        ? "#3b82f6"
                        : isNoGo
                        ? "#ef4444"
                        : isSlow
                        ? "#f59e0b"
                        : "#38bdf8"
                    }
                    strokeWidth={isSelected ? "3" : "1.5"}
                    strokeDasharray={isNoGo || isSlow ? "4 4" : "none"}
                    rx="6"
                  />

                  {/* Zone Label Badge */}
                  <rect
                    x={zone.x + 8}
                    y={zone.y + 6}
                    width={zone.name.length * 6 + 18}
                    height="18"
                    rx="4"
                    className="fill-slate-900/90"
                  />
                  <text
                    x={zone.x + 14}
                    y={zone.y + 19}
                    className={`font-bold text-[9px] ${
                      isNoGo ? "fill-red-400" : isSlow ? "fill-amber-400" : "fill-cyan-400"
                    }`}
                  >
                    {zone.name}
                  </text>
                </g>
              );
            })}
          </g>

          {/* CURRENT DRAWING BOUNDING BOX */}
          {isDrawingZone && currentDrawZone && (
            <g id="activeDrawingZonePreview">
              <rect
                x={currentDrawZone.x}
                y={currentDrawZone.y}
                width={currentDrawZone.w}
                height={currentDrawZone.h}
                fill={
                  zoneTypeToAdd === "no-go"
                    ? "url(#hazardRed)"
                    : zoneTypeToAdd === "slow"
                    ? "url(#hazardAmber)"
                    : "rgba(56, 189, 248, 0.2)"
                }
                stroke={zoneTypeToAdd === "no-go" ? "#ef4444" : "#f59e0b"}
                strokeWidth="2"
                strokeDasharray="4 4"
                rx="6"
              />
              <rect
                x={currentDrawZone.x + 8}
                y={currentDrawZone.y + 8}
                width="110"
                height="20"
                rx="4"
                className="fill-slate-900/90"
              />
              <text
                x={currentDrawZone.x + 14}
                y={currentDrawZone.y + 22}
                className="fill-white font-bold text-[9.5px]"
              >
                {pxToMeters(currentDrawZone.w)}m × {pxToMeters(currentDrawZone.h)}m
              </text>
            </g>
          )}

          {/* PLACED STATION POINTS */}
          <g id="stationsLayer">
            {(currentFloor.stations || []).map((stn) => {
              const isSelected = selectedItem?.type === "station" && selectedItem.id === stn.id;
              const isCharger = stn.type === "charger";
              const isElevator = stn.type === "elevator";
              const isRack = stn.type === "rack";

              return (
                <g
                  key={stn.id}
                  transform={`translate(${stn.x}, ${stn.y})`}
                  onMouseDown={(e) => handleStationMouseDown(e, stn.id)}
                  className="cursor-pointer"
                >
                  {/* Selection Ring */}
                  {isSelected && (
                    <circle
                      r="22"
                      className="fill-blue-500/20 stroke-blue-500 animate-pulse"
                      strokeWidth="2"
                    />
                  )}

                  {/* Station Pin Outer Circle */}
                  <circle
                    r="14"
                    className={
                      isCharger
                        ? "fill-amber-500/25 stroke-amber-500"
                        : isElevator
                        ? "fill-purple-500/25 stroke-purple-500"
                        : isRack
                        ? "fill-teal-500/25 stroke-teal-500"
                        : "fill-blue-500/25 stroke-blue-500"
                    }
                    strokeWidth="2.5"
                  />

                  {/* Inner Dot */}
                  <circle
                    r="5"
                    className={
                      isCharger
                        ? "fill-amber-500"
                        : isElevator
                        ? "fill-purple-500"
                        : isRack
                        ? "fill-teal-500"
                        : "fill-blue-500"
                    }
                  />

                  {/* Cargo Indicator (if dock has waiting pallet) */}
                  {stn.hasPallet && (
                    <g transform="translate(-10, 12)">
                      <rect
                        width="20"
                        height="13"
                        rx="2"
                        className="fill-amber-500 stroke-amber-200"
                        strokeWidth="1"
                      />
                      <text
                        x="10"
                        y="9.5"
                        textAnchor="middle"
                        className="fill-slate-950 font-bold text-[7.5px]"
                      >
                        PLT
                      </text>
                    </g>
                  )}

                  {/* Station Label */}
                  <g transform="translate(0, -18)">
                    <rect
                      x={-(stn.name.length * 3.2 + 8)}
                      y="-9"
                      width={stn.name.length * 6.4 + 16}
                      height="18"
                      rx="9"
                      className="fill-white/95 dark:fill-slate-900/95 stroke-slate-200 dark:stroke-slate-700 shadow-sm"
                      strokeWidth="1"
                    />
                    <text
                      x="0"
                      y="3"
                      textAnchor="middle"
                      className="fill-slate-900 dark:fill-white font-bold text-[9px]"
                    >
                      {stn.name}
                    </text>
                  </g>
                </g>
              );
            })}
          </g>
        </svg>
      </div>
    </div>
  );
}
