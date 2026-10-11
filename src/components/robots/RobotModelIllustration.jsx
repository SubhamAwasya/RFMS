import React from "react";

export default function RobotModelIllustration({
  type = "Forklift AGV",
  color = "#06b6d4",
  status = "Auto-Pilot",
  name = "Robot",
  cargo = null,
}) {
  const normType = (type || "").toLowerCase();

  // Determine model classification
  let category = "FORKLIFT";
  if (normType.includes("tugger") || normType.includes("tractor") || normType.includes("tow")) {
    category = "TUGGER";
  } else if (
    normType.includes("flatbed") ||
    normType.includes("carrier") ||
    normType.includes("deck") ||
    normType.includes("hauler")
  ) {
    category = "FLATBED";
  } else if (
    normType.includes("amr") ||
    normType.includes("mobile robot") ||
    normType.includes("sorter") ||
    normType.includes("puck")
  ) {
    category = "AMR";
  }

  return (
    <div className="w-full max-w-sm relative flex flex-col items-center justify-center select-none">
      <svg viewBox="0 0 320 220" className="w-full h-auto drop-shadow-2xl">
        {/* Drop Shadow on the floor */}
        <ellipse cx="160" cy="195" rx="125" ry="18" fill="rgba(0,0,0,0.18)" />

        {/* 1. FORKLIFT AGV */}
        {category === "FORKLIFT" && (
          <g>
            {/* Rear Counterweight & Main Chassis */}
            <rect
              x="60"
              y="110"
              width="130"
              height="65"
              rx="12"
              className="fill-slate-800 dark:fill-slate-900 stroke-slate-700"
              strokeWidth="2.5"
            />
            {/* Counterweight rear chamfer */}
            <path
              d="M 60 140 L 75 112 L 110 112 L 110 175 L 70 175 Z"
              fill="#1e293b"
              opacity="0.8"
            />

            {/* Accent colored LED strip on chassis */}
            <rect
              x="75"
              y="135"
              width="105"
              height="8"
              rx="4"
              fill={color}
              className="animate-pulse"
            />

            {/* Overhead Safety Guard / Cage Structure */}
            <path
              d="M 85 110 L 85 50 L 165 50 L 165 110"
              fill="none"
              stroke="#475569"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <line x1="85" y1="70" x2="165" y2="70" stroke="#334155" strokeWidth="3" />
            <line x1="85" y1="90" x2="165" y2="90" stroke="#334155" strokeWidth="3" />

            {/* Vertical Lift Mast Columns */}
            <rect x="185" y="30" width="10" height="145" rx="3" fill="#334155" stroke="#1e293b" strokeWidth="1.5" />
            <rect x="202" y="30" width="10" height="145" rx="3" fill="#334155" stroke="#1e293b" strokeWidth="1.5" />
            <rect x="185" y="45" width="27" height="6" fill="#64748b" />
            <rect x="185" y="85" width="27" height="6" fill="#64748b" />
            <rect x="185" y="125" width="27" height="6" fill="#64748b" />

            {/* Hydraulic Center Piston */}
            <rect x="194" y="55" width="9" height="110" rx="2" fill="#94a3b8" />

            {/* Fork Carriage & Tines */}
            <rect x="180" y="140" width="37" height="20" rx="3" fill="#0f172a" />
            {/* Horizontal Fork Tines extending forward */}
            <path
              d="M 217 155 L 285 155 L 290 160 L 217 160 Z"
              fill="#cbd5e1"
              stroke="#94a3b8"
              strokeWidth="1"
            />

            {/* Loaded Pallet on Forks */}
            <rect x="225" y="115" width="55" height="38" rx="4" fill="#d97706" opacity="0.9" />
            <line x1="225" y1="130" x2="280" y2="130" stroke="#78350f" strokeWidth="2" />
            <line x1="225" y1="145" x2="280" y2="145" stroke="#78350f" strokeWidth="2" />
            {/* Pallet wood skids */}
            <rect x="223" y="150" width="59" height="6" fill="#92400e" rx="1" />

            {/* Wheels */}
            <rect x="75" y="165" width="30" height="20" rx="6" fill="#020617" />
            <circle cx="90" cy="175" r="7" fill="#475569" />
            <rect x="165" y="165" width="30" height="20" rx="6" fill="#020617" />
            <circle cx="180" cy="175" r="7" fill="#475569" />

            {/* Top Rotating Beacon / LiDAR Tower */}
            <rect x="115" y="32" width="20" height="18" rx="4" fill="#0f172a" />
            <circle cx="125" cy="28" r="9" fill={color} opacity="0.9" />
            <circle cx="125" cy="28" r="14" fill="none" stroke={color} strokeWidth="1.5" strokeDasharray="3 3" />
          </g>
        )}

        {/* 2. FLATBED PAYLOAD CARRIER AGV */}
        {category === "FLATBED" && (
          <g>
            {/* Low-profile Heavy-Duty Chassis */}
            <rect
              x="45"
              y="125"
              width="230"
              height="48"
              rx="10"
              className="fill-slate-800 dark:fill-slate-900 stroke-slate-700"
              strokeWidth="2.5"
            />

            {/* Corner Safety Bumpers & SICK Laser Scanners */}
            <rect x="42" y="135" width="12" height="30" rx="4" fill="#eab308" />
            <rect x="266" y="135" width="12" height="30" rx="4" fill="#eab308" />

            {/* Accent LED Perimeter glow */}
            <rect
              x="60"
              y="145"
              width="200"
              height="8"
              rx="4"
              fill={color}
              className="animate-pulse"
            />

            {/* Roller Deck Top Surface */}
            <rect
              x="50"
              y="110"
              width="220"
              height="18"
              rx="4"
              fill="#334155"
              stroke="#475569"
              strokeWidth="1.5"
            />
            {/* Deck Rollers */}
            {[65, 85, 105, 125, 145, 165, 185, 205, 225, 245].map((rx, idx) => (
              <circle key={idx} cx={rx} cy="119" r="4" fill="#94a3b8" />
            ))}

            {/* Cargo Box / Heavy Container on Deck */}
            <rect
              x="75"
              y="45"
              width="170"
              height="65"
              rx="6"
              fill="#1e293b"
              stroke="#475569"
              strokeWidth="2"
            />
            <rect x="85" y="55" width="150" height="45" rx="4" fill="#0f172a" />
            {/* Cargo branding / pallet label */}
            <line x1="85" y1="78" x2="235" y2="78" stroke="#334155" strokeWidth="2" />
            <rect x="130" y="66" width="60" height="22" rx="3" fill="#3b82f6" opacity="0.3" />
            <text x="160" y="81" textAnchor="middle" fill="#93c5fd" fontSize="9" fontWeight="bold">
              HEAVY DECK
            </text>

            {/* Omni-directional Wheels */}
            {[65, 115, 175, 225].map((wx, idx) => (
              <g key={idx}>
                <rect x={wx} y="165" width="28" height="18" rx="5" fill="#020617" />
                <circle cx={wx + 14} cy="174" r="6" fill="#475569" />
              </g>
            ))}

            {/* Top Center Warning Beacon */}
            <rect x="150" y="28" width="20" height="16" rx="4" fill="#0f172a" />
            <circle cx="160" cy="24" r="9" fill={color} />
            <circle cx="160" cy="24" r="14" fill="none" stroke={color} strokeWidth="1.5" strokeDasharray="3 3" />
          </g>
        )}

        {/* 3. AUTOMATED TOW TRACTOR AGV (TUGGER) */}
        {category === "TUGGER" && (
          <g>
            {/* Tractor Main Body */}
            <path
              d="M 50 170 L 50 115 L 110 85 L 160 85 L 165 170 Z"
              className="fill-slate-800 dark:fill-slate-900 stroke-slate-700"
              strokeWidth="2.5"
            />

            {/* Front Protective Heavy Push Bumper */}
            <rect x="42" y="130" width="14" height="42" rx="4" fill="#eab308" />

            {/* Windshield / Scanner Cockpit Glass */}
            <path d="M 105 92 L 150 92 L 152 120 L 98 120 Z" fill="#0284c7" opacity="0.4" />

            {/* Accent colored side stripe */}
            <rect x="65" y="135" width="85" height="8" rx="4" fill={color} className="animate-pulse" />

            {/* Heavy Rear Hitch Coupling */}
            <rect x="165" y="145" width="35" height="10" rx="3" fill="#475569" />
            <circle cx="185" cy="150" r="5" fill="#e2e8f0" />
            <rect x="195" y="142" width="8" height="16" rx="2" fill="#94a3b8" />

            {/* Trailing Towed Cart */}
            <rect
              x="210"
              y="110"
              width="75"
              height="55"
              rx="6"
              className="fill-slate-800 dark:fill-slate-900 stroke-slate-600"
              strokeWidth="2"
            />
            {/* Cart Cargo Barrels / Boxes */}
            <rect x="220" y="85" width="25" height="25" rx="3" fill="#d97706" />
            <rect x="250" y="85" width="25" height="25" rx="3" fill="#d97706" />

            {/* High-traction Drive Wheels */}
            <g>
              <circle cx="75" cy="172" r="18" fill="#020617" />
              <circle cx="75" cy="172" r="8" fill="#475569" />
              <circle cx="140" cy="172" r="18" fill="#020617" />
              <circle cx="140" cy="172" r="8" fill="#475569" />
              {/* Cart Wheels */}
              <circle cx="230" cy="172" r="12" fill="#020617" />
              <circle cx="230" cy="172" r="5" fill="#475569" />
              <circle cx="265" cy="172" r="12" fill="#020617" />
              <circle cx="265" cy="172" r="5" fill="#475569" />
            </g>

            {/* Warning Tower Antenna */}
            <line x1="130" y1="85" x2="130" y2="40" stroke="#64748b" strokeWidth="3" />
            <circle cx="130" cy="35" r="8" fill={color} />
            <circle cx="130" cy="35" r="13" fill="none" stroke={color} strokeWidth="1.5" strokeDasharray="3 3" />
          </g>
        )}

        {/* 4. AUTONOMOUS MOBILE ROBOT (AMR) */}
        {category === "AMR" && (
          <g>
            {/* Compact Puck Robotic Chassis */}
            <ellipse
              cx="160"
              cy="150"
              rx="95"
              ry="32"
              className="fill-slate-800 dark:fill-slate-900 stroke-slate-700"
              strokeWidth="2.5"
            />

            {/* Mid Lower Body */}
            <rect
              x="65"
              y="120"
              width="190"
              height="35"
              rx="12"
              className="fill-slate-800 dark:fill-slate-900 stroke-slate-700"
              strokeWidth="2"
            />

            {/* 360-degree LiDAR Scanner Window Band */}
            <rect x="75" y="112" width="170" height="14" rx="4" fill="#020617" />
            <circle cx="160" cy="119" r="4" fill="#ef4444" className="animate-ping" />

            {/* 360-degree Glowing LED Light Ring */}
            <ellipse
              cx="160"
              cy="125"
              rx="88"
              ry="12"
              fill="none"
              stroke={color}
              strokeWidth="3.5"
              className="animate-pulse"
            />

            {/* Top Rotating Lift Turntable Disc */}
            <ellipse
              cx="160"
              cy="95"
              rx="75"
              ry="22"
              fill="#334155"
              stroke="#64748b"
              strokeWidth="2"
            />
            <ellipse cx="160" cy="93" rx="55" ry="15" fill="#1e293b" />
            <circle cx="160" cy="93" r="8" fill={color} />

            {/* Wheels underneath */}
            <rect x="95" y="170" width="24" height="15" rx="5" fill="#020617" />
            <circle cx="107" cy="177" r="5" fill="#475569" />
            <rect x="200" y="170" width="24" height="15" rx="5" fill="#020617" />
            <circle cx="212" cy="177" r="5" fill="#475569" />

            {/* High-Tech Antenna / Status Dome */}
            <circle cx="160" cy="65" r="9" fill={color} />
            <circle cx="160" cy="65" r="14" fill="none" stroke={color} strokeWidth="1.5" strokeDasharray="3 3" />
          </g>
        )}
      </svg>

      {/* Model Badge */}
      <div className="mt-2 text-center">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          {category === "FORKLIFT"
            ? "Counterbalanced Forklift AGV"
            : category === "TUGGER"
            ? "Automated Tow Tractor AGV"
            : category === "FLATBED"
            ? "Heavy-Duty Flatbed Carrier AGV"
            : "Autonomous Mobile Robot AMR"}
        </span>
      </div>
    </div>
  );
}
