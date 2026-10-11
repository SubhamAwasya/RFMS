import React from "react";
import FacilityToolbox from "./FacilityToolbox";
import FacilityCanvasStatusHud from "./canvas/FacilityCanvasStatusHud";
import FacilityCanvasDefs from "./canvas/FacilityCanvasDefs";
import FacilityCanvasZones from "./canvas/FacilityCanvasZones";
import FacilityCanvasStations from "./canvas/FacilityCanvasStations";

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
  handleZoneMouseDown,
  handleZoneResizeMouseDown,
  handleStationMouseDown,
  onOpenNewAreaModal,
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
      <FacilityCanvasStatusHud
        activeTool={activeTool}
        cursorCoords={cursorCoords}
      />

      {/* Dedicated Vertical CAD Toolbox Floating Component */}
      <div
        className="absolute top-4 left-4 z-30"
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
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
          onOpenNewAreaModal={onOpenNewAreaModal}
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
          <FacilityCanvasDefs />

          {/* Grid Background */}
          <rect width="1000" height="650" fill="url(#facilityGridLight)" className="dark:hidden" />
          <rect width="1000" height="650" fill="url(#facilityGridDark)" className="hidden dark:block" />

          {/* Uploaded Custom Blueprint Image (if present) */}
          {currentFloor.customMapImage && (
            <image
              href={currentFloor.customMapImage}
              xlinkHref={currentFloor.customMapImage}
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
            </g>
          )}

          {/* USER-CREATED OPERATIONAL AREAS & SAFETY ZONES */}
          <FacilityCanvasZones
            zones={currentFloor.restrictedZones || []}
            selectedItem={selectedItem}
            activeTool={activeTool}
            pxToMeters={pxToMeters}
            handleZoneMouseDown={handleZoneMouseDown}
            handleZoneClick={handleZoneClick}
            handleZoneResizeMouseDown={handleZoneResizeMouseDown}
            isDrawingZone={isDrawingZone}
            currentDrawZone={currentDrawZone}
            zoneTypeToAdd={zoneTypeToAdd}
          />

          {/* PLACED STATION POINTS */}
          <FacilityCanvasStations
            stations={currentFloor.stations || []}
            selectedItem={selectedItem}
            handleStationMouseDown={handleStationMouseDown}
          />
        </svg>
      </div>
    </div>
  );
}
