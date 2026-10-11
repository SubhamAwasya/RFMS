import React from "react";

export default function WaypointCanvasMarkers({
  waypoints = [],
  draggingId,
  onWaypointMouseDown,
}) {
  return (
    <>
      {waypoints.map((w, index) => {
        const isStart = w.type === "start";
        const isEnd = w.type === "end";
        const isDraggingThis = draggingId === w.id;
        const pinColor = isStart ? "#10b981" : isEnd ? "#ef4444" : "#3b82f6";
        const symbol = isStart ? "A" : isEnd ? "B" : `${index}`;

        return (
          <g
            key={w.id}
            onMouseDown={(e) => onWaypointMouseDown(e, w.id)}
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
              y={w.y + 3.5}
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
                y={14}
                className="fill-slate-800 dark:fill-slate-100 font-bold"
                fontSize="9.5"
              >
                {w.label}
              </text>
            </g>
          </g>
        );
      })}
    </>
  );
}
