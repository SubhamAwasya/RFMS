import React from "react";

export default function FloorPlanZones() {
  return (
    <>
      {/* Background Grid & Pattern */}
      <defs>
        <pattern
          id="planner-grid"
          width="20"
          height="20"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 20 0 L 0 0 0 20"
            fill="none"
            stroke="currentColor"
            className="text-slate-200/80 dark:text-slate-800/40"
            strokeWidth="0.75"
          />
        </pattern>
        <filter
          id="pin-shadow"
          x="-30%"
          y="-30%"
          width="160%"
          height="160%"
        >
          <feDropShadow
            dx="0"
            dy="2"
            stdDeviation="2.5"
            floodOpacity="0.25"
          />
        </filter>
      </defs>

      <rect width="100%" height="100%" fill="url(#planner-grid)" />

      {/* Navigation Corridors (Guidelines) */}
      <line
        x1={245}
        y1={20}
        x2={245}
        y2={380}
        stroke="currentColor"
        className="text-slate-300 dark:text-slate-800"
        strokeWidth="1"
        strokeDasharray="4 4"
      />
      <line
        x1={20}
        y1={180}
        x2={520}
        y2={180}
        stroke="currentColor"
        className="text-slate-300 dark:text-slate-800"
        strokeWidth="1"
        strokeDasharray="4 4"
      />
      <text
        x={245}
        y={15}
        textAnchor="middle"
        className="fill-slate-400 dark:fill-slate-600 text-[8px] font-semibold uppercase tracking-wider"
      >
        Main Aisle Corridor
      </text>
      <text
        x={515}
        y={176}
        textAnchor="end"
        className="fill-slate-400 dark:fill-slate-600 text-[8px] font-semibold uppercase tracking-wider"
      >
        Crossway 1
      </text>

      {/* Floor Plan Areas */}
      <g className="transition-opacity">
        {/* Assembly Line 1 */}
        <rect
          x="25"
          y="30"
          width="180"
          height="120"
          rx="8"
          className="fill-slate-200/60 dark:fill-slate-800/40 stroke-slate-300 dark:stroke-slate-700/80"
          strokeWidth="1.5"
        />
        <text
          x="40"
          y="60"
          className="fill-slate-800 dark:fill-slate-200 font-bold"
          fontSize="11"
        >
          Assembly Line 1
        </text>
        <text
          x="40"
          y="78"
          className="fill-slate-500 dark:fill-slate-400 text-[9px]"
        >
          Stations A-1 through A-6
        </text>

        {/* Machining Area */}
        <rect
          x="280"
          y="30"
          width="235"
          height="120"
          rx="8"
          className="fill-slate-200/60 dark:fill-slate-800/40 stroke-slate-300 dark:stroke-slate-700/80"
          strokeWidth="1.5"
        />
        <text
          x="295"
          y="60"
          className="fill-slate-800 dark:fill-slate-200 font-bold"
          fontSize="11"
        >
          Machining Area
        </text>
        <text
          x="295"
          y="78"
          className="fill-slate-500 dark:fill-slate-400 text-[9px]"
        >
          CNC Milling & Lathes
        </text>

        {/* Charging Bay */}
        <rect
          x="25"
          y="230"
          width="180"
          height="135"
          rx="8"
          className="fill-amber-500/10 dark:fill-amber-500/5 stroke-amber-300/80 dark:stroke-amber-500/20"
          strokeWidth="1.5"
        />
        <text
          x="40"
          y="260"
          className="fill-amber-800 dark:fill-amber-400 font-bold"
          fontSize="11"
        >
          Charging Bay & Docks
        </text>
        <text
          x="40"
          y="278"
          className="fill-amber-700/80 dark:fill-amber-400/70 text-[9px]"
        >
          Auto-Induction Stations
        </text>

        {/* Packing & Dispatch */}
        <rect
          x="280"
          y="230"
          width="235"
          height="135"
          rx="8"
          className="fill-slate-200/60 dark:fill-slate-800/40 stroke-slate-300 dark:stroke-slate-700/80"
          strokeWidth="1.5"
        />
        <text
          x="295"
          y="260"
          className="fill-slate-800 dark:fill-slate-200 font-bold"
          fontSize="11"
        >
          Packing & Dispatch
        </text>
        <text
          x="295"
          y="278"
          className="fill-slate-500 dark:fill-slate-400 text-[9px]"
        >
          Outbound Loading Bay 1-4
        </text>
      </g>
    </>
  );
}
