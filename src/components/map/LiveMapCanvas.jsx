import React from "react";
import MapToolbar from "./MapToolbar";
import AgvVehicleMarker from "./AgvVehicleMarker";
import MapCanvasDefs from "./canvas/MapCanvasDefs";
import MapCanvasZones from "./canvas/MapCanvasZones";
import MapCanvasPaths from "./canvas/MapCanvasPaths";
import MapCanvasStations from "./canvas/MapCanvasStations";

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
  activeFloor,
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
          {/* Grid Patterns & Stripe Definitions */}
          <MapCanvasDefs />

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
            <MapCanvasZones zones={activeFloor.restrictedZones || []} />
          )}

          {/* Dynamic Robot Looping Paths & Guide Corridors */}
          <MapCanvasPaths
            selectedAgv={selectedAgv}
            showAllPaths={showAllPaths}
            activeFloorId={activeFloor.id}
            agvs={agvs}
          />

          {/* Stations on Floor */}
          {layers.showStations && (
            <MapCanvasStations
              stations={activeFloor.stations || []}
              agvs={agvs || []}
            />
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
