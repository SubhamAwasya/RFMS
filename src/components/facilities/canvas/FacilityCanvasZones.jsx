import React from "react";
import { getZoneConfig } from "../../../utils/zoneConfig";

export default function FacilityCanvasZones({
  zones = [],
  selectedItem,
  activeTool,
  pxToMeters,
  handleZoneMouseDown,
  handleZoneClick,
  handleZoneResizeMouseDown,
  isDrawingZone,
  currentDrawZone,
  zoneTypeToAdd,
}) {
  return (
    <>
      {/* USER-CREATED OPERATIONAL AREAS & SAFETY ZONES */}
      <g id="zonesLayer">
        {zones.map((zone) => {
          const isSelected = selectedItem?.type === "zone" && selectedItem.id === zone.id;
          const config = getZoneConfig(zone.type);
          const isSafety = config.isSafety;

          return (
            <g
              key={zone.id}
              onMouseDown={(e) =>
                handleZoneMouseDown ? handleZoneMouseDown(e, zone.id) : handleZoneClick(e, zone.id)
              }
              onClick={(e) => handleZoneClick(e, zone.id)}
              className={`transition-all ${
                activeTool === "delete"
                  ? "cursor-pointer hover:opacity-60"
                  : activeTool === "draw-zone"
                  ? "cursor-crosshair"
                  : "cursor-move"
              }`}
            >
              <rect
                x={zone.x}
                y={zone.y}
                width={zone.w}
                height={zone.h}
                fill={config.fill}
                stroke={isSelected ? "#3b82f6" : config.stroke}
                strokeWidth={isSelected ? "3" : isSafety ? "2" : "1.5"}
                strokeDasharray={isSafety ? "4 4" : "none"}
                rx="8"
              />

              {/* Header / Title Area Badge */}
              <rect
                x={zone.x + 8}
                y={zone.y + 6}
                width={Math.max(70, (zone.name || "Area").length * 6.5 + 24)}
                height="20"
                rx="4"
                fill="rgba(15, 23, 42, 0.88)"
              />
              <text
                x={zone.x + 14}
                y={zone.y + 20}
                fill={isSelected ? "#60a5fa" : config.stroke}
                fontSize="10"
                fontWeight="bold"
                letterSpacing="0.5"
              >
                {(zone.name || "AREA").toUpperCase()}
              </text>

              {/* Physical Dimensions Readout in bottom-right if area is wide enough */}
              {zone.w >= 75 && zone.h >= 45 && (
                <text
                  x={zone.x + zone.w - 8}
                  y={zone.y + zone.h - 8}
                  textAnchor="end"
                  fill="rgba(148, 163, 184, 0.75)"
                  fontSize="9"
                  fontFamily="monospace"
                >
                  {pxToMeters(zone.w)}m × {pxToMeters(zone.h)}m
                </text>
              )}

              {/* Resize Handle at Bottom-Right Corner (when selected) */}
              {isSelected && activeTool !== "delete" && activeTool !== "draw-zone" && (
                <g
                  className="cursor-nwse-resize"
                  onMouseDown={(e) => handleZoneResizeMouseDown?.(e, zone.id)}
                >
                  <rect
                    x={zone.x + zone.w - 12}
                    y={zone.y + zone.h - 12}
                    width="12"
                    height="12"
                    rx="3"
                    fill="#3b82f6"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                  />
                </g>
              )}
            </g>
          );
        })}
      </g>

      {/* CURRENT DRAWING BOUNDING BOX PREVIEW */}
      {isDrawingZone && currentDrawZone && (
        <g id="activeDrawingZonePreview" className="pointer-events-none select-none">
          {(() => {
            const config = getZoneConfig(zoneTypeToAdd);
            return (
              <>
                <rect
                  x={currentDrawZone.x}
                  y={currentDrawZone.y}
                  width={currentDrawZone.w}
                  height={currentDrawZone.h}
                  fill={config.fill}
                  stroke={config.stroke}
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  rx="6"
                />
                <rect
                  x={currentDrawZone.x + 8}
                  y={currentDrawZone.y + 8}
                  width="140"
                  height="22"
                  rx="4"
                  className="fill-slate-900/90"
                />
                <text
                  x={currentDrawZone.x + 14}
                  y={currentDrawZone.y + 23}
                  fill={config.stroke}
                  fontSize="10"
                  fontWeight="bold"
                >
                  {pxToMeters(currentDrawZone.w)}m × {pxToMeters(currentDrawZone.h)}m
                </text>
              </>
            );
          })()}
        </g>
      )}
    </>
  );
}
