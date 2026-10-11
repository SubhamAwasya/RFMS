import React from "react";

export default function FacilityCanvasStations({
  stations = [],
  selectedItem,
  handleStationMouseDown,
}) {
  return (
    <g id="stationsLayer">
      {stations.map((stn) => {
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

            {/* High-Tech Industrial Station Visuals */}
            {isCharger ? (
              <g id={`charger-pad-${stn.id}`}>
                {/* Heavy-Duty Industrial Base Chassis */}
                <rect
                  x="-24"
                  y="-20"
                  width="48"
                  height="40"
                  rx="7"
                  className="fill-slate-900/95 dark:fill-slate-950/95 stroke-emerald-500/90 dark:stroke-emerald-400"
                  strokeWidth="2.2"
                  style={{
                    filter: "drop-shadow(0 3px 8px rgba(16, 185, 129, 0.35))",
                  }}
                />
                <rect
                  x="-19"
                  y="-15"
                  width="38"
                  height="30"
                  rx="4"
                  className="fill-slate-800 dark:fill-slate-900 stroke-slate-700/80"
                  strokeWidth="1"
                />
                {/* Dual Copper Contacts */}
                <rect x="-22" y="-7" width="3" height="14" rx="1" className="fill-amber-400" />
                <rect x="19" y="-7" width="3" height="14" rx="1" className="fill-amber-400" />
                {/* Induction Coil */}
                <circle r="11" fill="none" className="stroke-emerald-400/40" strokeWidth="1.2" strokeDasharray="3 2" />
                <circle r="7.5" className="fill-emerald-500/25 stroke-emerald-400" strokeWidth="1.2" />
                {/* Lightning Bolt */}
                <path
                  d="M 1.2 -5 L -2.8 0 L 0.5 0 L -1.2 5 L 3.8 -0.5 L 0.5 -0.5 Z"
                  className="fill-emerald-400 stroke-emerald-100"
                  strokeWidth="0.5"
                />
              </g>
            ) : isElevator ? (
              <g id={`elevator-dock-${stn.id}`}>
                <rect
                  x="-22"
                  y="-18"
                  width="44"
                  height="36"
                  rx="6"
                  className="fill-slate-900/95 stroke-purple-500"
                  strokeWidth="2"
                />
                <rect x="-17" y="-13" width="16" height="26" rx="2" className="fill-slate-800 stroke-purple-400/40" strokeWidth="1" />
                <rect x="1" y="-13" width="16" height="26" rx="2" className="fill-slate-800 stroke-purple-400/40" strokeWidth="1" />
                <line x1="0" y1="-13" x2="0" y2="13" className="stroke-purple-400" strokeWidth="1.5" />
              </g>
            ) : (
              <g id={`standard-station-${stn.id}`}>
                <rect
                  x="-20"
                  y="-16"
                  width="40"
                  height="32"
                  rx="5"
                  className={
                    isRack
                      ? "fill-slate-900/90 stroke-teal-500"
                      : "fill-slate-900/90 stroke-blue-500"
                  }
                  strokeWidth="2"
                />
                <circle
                  r="6"
                  className={
                    isRack
                      ? "fill-teal-500/25 stroke-teal-400"
                      : "fill-blue-500/25 stroke-blue-400"
                  }
                  strokeWidth="1.2"
                />
                <circle r="2.5" className={isRack ? "fill-teal-400" : "fill-blue-400"} />
              </g>
            )}

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

            {/* Station Label Floating Badge Pill */}
            <g transform="translate(0, -30)" className="pointer-events-none select-none">
              <rect
                x={-Math.max(48, stn.name.length * 3.4 + 14)}
                y="-10"
                width={Math.max(96, stn.name.length * 6.8 + 28)}
                height="20"
                rx="10"
                className="fill-white/95 dark:fill-slate-900/95 stroke-slate-200 dark:stroke-slate-700/80 shadow-md"
                strokeWidth="1.2"
              />
              <circle
                cx={-Math.max(48, stn.name.length * 3.4 + 14) + 9}
                cy="0"
                r="2.5"
                className={
                  isCharger
                    ? "fill-emerald-500"
                    : isElevator
                    ? "fill-purple-500"
                    : isRack
                    ? "fill-teal-500"
                    : "fill-blue-500"
                }
              />
              <text
                x="3"
                y="3.2"
                textAnchor="middle"
                className="fill-slate-900 dark:fill-white font-extrabold text-[9px] tracking-tight"
              >
                {stn.name}
              </text>
            </g>
          </g>
        );
      })}
    </g>
  );
}
