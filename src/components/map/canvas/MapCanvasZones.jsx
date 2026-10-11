import React from "react";
import { getZoneConfig } from "../../../utils/zoneConfig";

export default function MapCanvasZones({ zones = [] }) {
  return (
    <g id="restrictedZones">
      {zones.map((zone) => {
        const config = getZoneConfig(zone.type);
        const isSafety = config.isSafety;
        const isNoGo = zone.type === "no-go";
        const isSlow = zone.type === "slow";

        return (
          <g key={zone.id} className="pointer-events-none select-none">
            {/* Zone Perimeter Box */}
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
              fillOpacity={isSafety ? "0.85" : "0.5"}
              stroke={config.stroke}
              strokeOpacity={isSafety ? "0.8" : "0.45"}
              strokeWidth={isSafety ? "1.5" : "1.2"}
              strokeDasharray={isSafety ? "4 4" : "none"}
              rx="6"
            />

            {/* Subtle Blueprint Zone Watermark / Label */}
            {isSafety ? (
              <g transform={`translate(${zone.x + 6}, ${zone.y + 6})`}>
                <rect
                  x="0"
                  y="0"
                  width={Math.max(56, (zone.name || "Safety").length * 5.5 + 16)}
                  height="16"
                  rx="3"
                  className="fill-slate-950/85 stroke-red-500/40"
                  strokeWidth="0.8"
                />
                <text
                  x="8"
                  y="11"
                  fill={config.stroke}
                  fontSize="7.5"
                  fontWeight="bold"
                  letterSpacing="0.5"
                >
                  {config.icon} {(zone.name || "SAFETY").toUpperCase()}
                </text>
              </g>
            ) : (
              <text
                x={zone.x + 10}
                y={zone.y + 16}
                fill={config.stroke}
                fillOpacity="0.75"
                fontSize="8"
                fontWeight="bold"
                letterSpacing="0.8"
              >
                {(zone.name || "AREA").toUpperCase()}
              </text>
            )}
          </g>
        );
      })}
    </g>
  );
}
