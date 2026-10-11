// RFMS Enterprise Constants

export const VIEWS = Object.freeze({
  DASHBOARD: "dashboard",
  ROBOTS: "robots",
  ROBOT_DETAIL: "robot-detail",
  MAP: "map",
  ANALYTICS: "analytics",
  MAINTENANCE: "maintenance",
  ALERTS: "alerts",
  FACILITIES: "facilities",
  USERS: "users",
  SETTINGS: "settings",
});

export const NAVIGATION_MODE = Object.freeze({
  AUTONOMOUS: "AUTONOMOUS", // Auto-Pilot Looping Path
  MANUAL: "MANUAL",         // Manual Teleoperation (WASD / Joystick)
});

export const AGV_STATUS = Object.freeze({
  AUTO_LOOP: "Auto-Pilot (Looping)",
  MANUAL_TELEOP: "Manual Teleop",
  CHARGING: "Charging",
  IDLE: "Idle",
  STOPPED: "Stopped",
  BLOCKED: "Obstacle Blocked",
});

// Designated Autonomous Guide Loops per Floor (1000 x 650 CAD Grid)
export const DEFAULT_FLOOR_PATHS = {
  "floor-g": [
    { id: "wp-1", label: "Docking Bay 01", x: 170, y: 140 },
    { id: "wp-2", label: "North Corridor Junction", x: 440, y: 140 },
    { id: "wp-3", label: "Charger Pad Alpha", x: 880, y: 140 },
    { id: "wp-4", label: "High-Bay Storage East", x: 880, y: 535 },
    { id: "wp-5", label: "Central Distribution Hub", x: 440, y: 535 },
    { id: "wp-6", label: "Inbound Receiving West", x: 170, y: 535 },
  ],
  "floor-1": [
    { id: "wp-f1-1", label: "Assembly Station 1", x: 220, y: 180 },
    { id: "wp-f1-2", label: "Quality Inspection Bay", x: 780, y: 180 },
    { id: "wp-f1-3", label: "Component Staging East", x: 780, y: 480 },
    { id: "wp-f1-4", label: "Packaging Loop West", x: 220, y: 480 },
  ],
};

// Distinct, non-overlapping autonomous looping routes for the multi-robot fleet (1000 x 650 CAD Grid)
export const ROBOT_PATHS = {
  // FL-01: North Inbound Logistics & Receiving Corridor (Cyan #06b6d4)
  "FL-01": [
    { id: "wp-fl1-1", label: "Docking Bay 01", x: 170, y: 140 },
    { id: "wp-fl1-2", label: "Assembly Feed Junction", x: 480, y: 140 },
    { id: "wp-fl1-3", label: "Charger Pad Alpha", x: 880, y: 140 },
    { id: "wp-fl1-4", label: "North Transit East", x: 880, y: 240 },
    { id: "wp-fl1-5", label: "North Corridor Central", x: 480, y: 240 },
    { id: "wp-fl1-6", label: "Receiving Sort Bay", x: 170, y: 240 },
  ],
  // FL-02: Central Assembly & Logistics Spine (Emerald #10b981)
  "FL-02": [
    { id: "wp-fl2-1", label: "Central Aisle Intake", x: 200, y: 300 },
    { id: "wp-fl2-2", label: "Main Floor Crossway", x: 500, y: 300 },
    { id: "wp-fl2-3", label: "Outbound Feed West", x: 820, y: 300 },
    { id: "wp-fl2-4", label: "Packaging Buffer East", x: 820, y: 390 },
    { id: "wp-fl2-5", label: "Central Logistics Spine", x: 500, y: 390 },
    { id: "wp-fl2-6", label: "Kitting Transfer Bay", x: 200, y: 390 },
  ],
  // FL-03: South High-Bay Racks & Outbound Dispatch (Amber #f59e0b)
  "FL-03": [
    { id: "wp-fl3-1", label: "High-Bay Aisle 1", x: 170, y: 480 },
    { id: "wp-fl3-2", label: "Storage Cross-Aisle", x: 480, y: 480 },
    { id: "wp-fl3-3", label: "Dispatch Transfer Alpha", x: 880, y: 480 },
    { id: "wp-fl3-4", label: "Outbound Bay Gate", x: 880, y: 560 },
    { id: "wp-fl3-5", label: "High-Bay Return South", x: 480, y: 560 },
    { id: "wp-fl3-6", label: "Rack Infeed Station", x: 170, y: 560 },
  ],
  // FB-01: Flatbed Payload Carrier AGV - Heavy Freight Arterial Loop (Purple #8b5cf6)
  "FB-01": [
    { id: "wp-fb1-1", label: "West Freight Siding", x: 120, y: 340 },
    { id: "wp-fb1-2", label: "North Cross-Aisle Junction", x: 340, y: 260 },
    { id: "wp-fb1-3", label: "East Transfer Spur", x: 640, y: 260 },
    { id: "wp-fb1-4", label: "Outbound Buffer Platform", x: 860, y: 340 },
    { id: "wp-fb1-5", label: "South Cross-Aisle Transit", x: 640, y: 440 },
    { id: "wp-fb1-6", label: "Heavy Kitting Staging", x: 340, y: 440 },
  ],
  // FL-04: North-West Cross Loop (Rose #f43f5e)
  "FL-04": [
    { id: "wp-fl4-1", label: "NW Pallet Intake", x: 260, y: 180 },
    { id: "wp-fl4-2", label: "NW Quality Check", x: 410, y: 180 },
    { id: "wp-fl4-3", label: "NW Staging Line", x: 410, y: 250 },
    { id: "wp-fl4-4", label: "NW Return Crossway", x: 260, y: 250 },
  ],
  // FB-02: East Staging Heavy Transport Loop (Blue #3b82f6)
  "FB-02": [
    { id: "wp-fb2-1", label: "East Bulk Cargo Infeed", x: 700, y: 200 },
    { id: "wp-fb2-2", label: "East Buffer Platform", x: 860, y: 200 },
    { id: "wp-fb2-3", label: "Outbound Ramp East", x: 860, y: 330 },
    { id: "wp-fb2-4", label: "Transfer Siding Return", x: 700, y: 330 },
  ],
  // TUG-01: Automated Tugger Train Arterial Loop (Orange #f97316)
  "TUG-01": [
    { id: "wp-tug1-1", label: "Tugger Depot Station", x: 280, y: 240 },
    { id: "wp-tug1-2", label: "Midway Distribution Stop", x: 620, y: 240 },
    { id: "wp-tug1-3", label: "Assembly Train Dropoff", x: 620, y: 320 },
    { id: "wp-tug1-4", label: "Return Loop West", x: 280, y: 320 },
  ],
  // AMR-01: Autonomous Mobile Robot - Fast Sort Transit (Teal #14b8a6)
  "AMR-01": [
    { id: "wp-amr1-1", label: "Sort Express Intake", x: 550, y: 150 },
    { id: "wp-amr1-2", label: "Sort Cross-Link", x: 730, y: 150 },
    { id: "wp-amr1-3", label: "Sort Chute Feeder", x: 730, y: 220 },
    { id: "wp-amr1-4", label: "Express Return Line", x: 550, y: 220 },
  ],
  // AMR-02: South-West Feeder Loop (Lime #84cc16)
  "AMR-02": [
    { id: "wp-amr2-1", label: "Kitting Infeed Alpha", x: 220, y: 410 },
    { id: "wp-amr2-2", label: "Cell Assembly Transit", x: 420, y: 410 },
    { id: "wp-amr2-3", label: "Parts Buffer West", x: 420, y: 470 },
    { id: "wp-amr2-4", label: "Kitting Return Track", x: 220, y: 470 },
  ],
  // FL-05: South-East High Rack Circuit (Indigo #6366f1)
  "FL-05": [
    { id: "wp-fl5-1", label: "High-Bay Rack 05 Infeed", x: 600, y: 410 },
    { id: "wp-fl5-2", label: "Rack 07 Dispatch Point", x: 840, y: 410 },
    { id: "wp-fl5-3", label: "Narrow-Aisle Turnout", x: 840, y: 480 },
    { id: "wp-fl5-4", label: "Storage Return Crossway", x: 600, y: 480 },
  ],
};

// Supported Industrial AGV Vehicle Models
export const ROBOT_TYPES = Object.freeze({
  FORKLIFT: "Forklift AGV",
  FLATBED_CARRIER: "Flatbed Payload Carrier AGV",
  TUGGER: "Automated Tow Tractor AGV",
  AMR: "Autonomous Mobile Robot AMR",
});

// Unique color theme association per AGV
export const ROBOT_COLOR_THEMES = {
  "FL-01": {
    name: "Cyan",
    hex: "#06b6d4",
    strokeClass: "stroke-cyan-500 dark:stroke-cyan-400",
    fillClass: "fill-cyan-500",
    bgClass: "bg-cyan-500",
    textClass: "text-cyan-600 dark:text-cyan-400",
    glow: "rgba(6, 182, 212, 0.28)",
    radarHalo: "fill-cyan-500/20 stroke-cyan-400",
    badgeBorder: "border-cyan-500",
  },
  "FL-02": {
    name: "Emerald",
    hex: "#10b981",
    strokeClass: "stroke-emerald-500 dark:stroke-emerald-400",
    fillClass: "fill-emerald-500",
    bgClass: "bg-emerald-500",
    textClass: "text-emerald-600 dark:text-emerald-400",
    glow: "rgba(16, 185, 129, 0.28)",
    radarHalo: "fill-emerald-500/20 stroke-emerald-400",
    badgeBorder: "border-emerald-500",
  },
  "FL-03": {
    name: "Amber",
    hex: "#f59e0b",
    strokeClass: "stroke-amber-500 dark:stroke-amber-400",
    fillClass: "fill-amber-500",
    bgClass: "bg-amber-500",
    textClass: "text-amber-600 dark:text-amber-400",
    glow: "rgba(245, 158, 11, 0.28)",
    radarHalo: "fill-amber-500/20 stroke-amber-400",
    badgeBorder: "border-amber-500",
  },
  "FB-01": {
    name: "Purple",
    hex: "#8b5cf6",
    strokeClass: "stroke-purple-500 dark:stroke-purple-400",
    fillClass: "fill-purple-500",
    bgClass: "bg-purple-500",
    textClass: "text-purple-600 dark:text-purple-400",
    glow: "rgba(139, 92, 246, 0.28)",
    radarHalo: "fill-purple-500/20 stroke-purple-400",
    badgeBorder: "border-purple-500",
  },
  "FL-04": {
    name: "Rose",
    hex: "#f43f5e",
    strokeClass: "stroke-rose-500 dark:stroke-rose-400",
    fillClass: "fill-rose-500",
    bgClass: "bg-rose-500",
    textClass: "text-rose-600 dark:text-rose-400",
    glow: "rgba(244, 63, 94, 0.28)",
    radarHalo: "fill-rose-500/20 stroke-rose-400",
    badgeBorder: "border-rose-500",
  },
  "FB-02": {
    name: "Blue",
    hex: "#3b82f6",
    strokeClass: "stroke-blue-500 dark:stroke-blue-400",
    fillClass: "fill-blue-500",
    bgClass: "bg-blue-500",
    textClass: "text-blue-600 dark:text-blue-400",
    glow: "rgba(59, 130, 246, 0.28)",
    radarHalo: "fill-blue-500/20 stroke-blue-400",
    badgeBorder: "border-blue-500",
  },
  "TUG-01": {
    name: "Orange",
    hex: "#f97316",
    strokeClass: "stroke-orange-500 dark:stroke-orange-400",
    fillClass: "fill-orange-500",
    bgClass: "bg-orange-500",
    textClass: "text-orange-600 dark:text-orange-400",
    glow: "rgba(249, 115, 22, 0.28)",
    radarHalo: "fill-orange-500/20 stroke-orange-400",
    badgeBorder: "border-orange-500",
  },
  "AMR-01": {
    name: "Teal",
    hex: "#14b8a6",
    strokeClass: "stroke-teal-500 dark:stroke-teal-400",
    fillClass: "fill-teal-500",
    bgClass: "bg-teal-500",
    textClass: "text-teal-600 dark:text-teal-400",
    glow: "rgba(20, 184, 166, 0.28)",
    radarHalo: "fill-teal-500/20 stroke-teal-400",
    badgeBorder: "border-teal-500",
  },
  "AMR-02": {
    name: "Lime",
    hex: "#84cc16",
    strokeClass: "stroke-lime-500 dark:stroke-lime-400",
    fillClass: "fill-lime-500",
    bgClass: "bg-lime-500",
    textClass: "text-lime-600 dark:text-lime-400",
    glow: "rgba(132, 204, 22, 0.28)",
    radarHalo: "fill-lime-500/20 stroke-lime-400",
    badgeBorder: "border-lime-500",
  },
  "FL-05": {
    name: "Indigo",
    hex: "#6366f1",
    strokeClass: "stroke-indigo-500 dark:stroke-indigo-400",
    fillClass: "fill-indigo-500",
    bgClass: "bg-indigo-500",
    textClass: "text-indigo-600 dark:text-indigo-400",
    glow: "rgba(99, 102, 241, 0.28)",
    radarHalo: "fill-indigo-500/20 stroke-indigo-400",
    badgeBorder: "border-indigo-500",
  },
};

/**
 * Returns the color theme for a given robot ID with a deterministic fallback.
 */
export const getRobotColorTheme = (robotId) => {
  if (ROBOT_COLOR_THEMES[robotId]) return ROBOT_COLOR_THEMES[robotId];
  const keys = Object.keys(ROBOT_COLOR_THEMES);
  const hash = Math.abs(
    (robotId || "").split("").reduce((acc, c) => acc + c.charCodeAt(0), 0)
  );
  return ROBOT_COLOR_THEMES[keys[hash % keys.length]];
};

/**
 * Returns the designated loop path for a robot, falling back to floor path.
 */
export const getRobotPath = (robotId, floorId = "floor-g") => {
  if (ROBOT_PATHS[robotId]) return ROBOT_PATHS[robotId];
  return DEFAULT_FLOOR_PATHS[floorId] || DEFAULT_FLOOR_PATHS["floor-g"] || [];
};

