// RFMS Enterprise Constants

export const VIEWS = Object.freeze({
  DASHBOARD: "dashboard",
  ROBOTS: "robots",
  ROBOT_DETAIL: "robot-detail",
  MAP: "map",
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
  RETURNING_TO_CHARGER: "Returning to Charger",
  FAULT: "Fault",
  IDLE: "Idle",
  STOPPED: "Stopped",
  BLOCKED: "Obstacle Blocked",
  LOW_BATTERY: "Low Battery",
});

// Designated Autonomous Guide Loops per Floor (1000 x 650 CAD Grid)
export const DEFAULT_FLOOR_PATHS = {
  "floor-g": [
    { id: "wp-fg-1", label: "Docking Bay 01", x: 170, y: 135 },
    { id: "wp-fg-2", label: "North Corridor Junction", x: 500, y: 135 },
    { id: "wp-fg-3", label: "Charger Pad Alpha", x: 880, y: 135 },
    { id: "wp-fg-4", label: "High-Bay Storage East", x: 880, y: 205 },
    { id: "wp-fg-5", label: "Central Distribution Hub", x: 500, y: 205 },
    { id: "wp-fg-6", label: "Inbound Receiving West", x: 170, y: 205 },
  ],
  "floor-1": [
    { id: "wp-f1-1", label: "Sorter Induction Bay 01", x: 220, y: 180 },
    { id: "wp-f1-2", label: "Mezzanine Cross-Aisle", x: 500, y: 180 },
    { id: "wp-f1-3", label: "Mezzanine Fast Charger", x: 780, y: 180 },
    { id: "wp-f1-4", label: "Quality Inspection Deck", x: 780, y: 260 },
    { id: "wp-f1-5", label: "Sorter Express Return", x: 500, y: 260 },
    { id: "wp-f1-6", label: "Induction Queue West", x: 220, y: 260 },
  ],
  "floor-b2-g": [
    { id: "wp-b2g-1", label: "ASRS Induction Bay", x: 200, y: 200 },
    { id: "wp-b2g-2", label: "High-Bay Aisle Transit", x: 500, y: 200 },
    { id: "wp-b2g-3", label: "Heavy Depot Charger", x: 800, y: 200 },
    { id: "wp-b2g-4", label: "ASRS Buffer East", x: 800, y: 260 },
    { id: "wp-b2g-5", label: "High-Bay Cross-Aisle", x: 500, y: 260 },
    { id: "wp-b2g-6", label: "Pallet Induction Return", x: 200, y: 260 },
  ],
  "floor-b2-1": [
    { id: "wp-b21-1", label: "Order Consolidation Hub", x: 240, y: 180 },
    { id: "wp-b21-2", label: "Picking Deck Main Loop", x: 500, y: 180 },
    { id: "wp-b21-3", label: "Mezzanine Depot Charger", x: 760, y: 180 },
    { id: "wp-b21-4", label: "Quality Check Deck East", x: 760, y: 260 },
    { id: "wp-b21-5", label: "Consolidation Express Line", x: 500, y: 260 },
    { id: "wp-b21-6", label: "Consolidation Buffer West", x: 240, y: 260 },
  ],
};

// Distinct, non-overlapping autonomous looping routes for the 10-robot fleet (1000 x 650 CAD Grid)
// Divided across maps and facilities:
// - Building A Ground Floor (floor-g): FL-01, FL-02, FB-01
// - Building A Level 1 Mezzanine (floor-1): FL-03, FB-02
// - Building B Ground Floor (floor-b2-g): FL-04, FB-03, FB-04
// - Building B Level 1 Order Deck (floor-b2-1): FL-05, FB-05
export const ROBOT_PATHS = {
  // FL-01: Building A Ground Floor - North Inbound Logistics Loop (Cyan #06b6d4)
  "FL-01": [
    { id: "wp-fl1-1", label: "Docking Bay 01", x: 170, y: 135 },
    { id: "wp-fl1-2", label: "North Transit Junction", x: 500, y: 135 },
    { id: "wp-fl1-3", label: "Charger Pad Alpha", x: 880, y: 135 },
    { id: "wp-fl1-4", label: "Charger Pad Beta", x: 880, y: 205 },
    { id: "wp-fl1-5", label: "North Inspection Spine", x: 500, y: 205 },
    { id: "wp-fl1-6", label: "Receiving Sort Bay", x: 170, y: 205 },
  ],
  // FL-02: Building A Ground Floor - South Assembly & Storage Loop (Emerald #10b981)
  "FL-02": [
    { id: "wp-fl2-1", label: "Kitting Infeed Bay", x: 170, y: 490 },
    { id: "wp-fl2-2", label: "Assembly Transfer Mid", x: 500, y: 490 },
    { id: "wp-fl2-3", label: "Finished Goods Staging", x: 860, y: 490 },
    { id: "wp-fl2-4", label: "South Outbound Gate", x: 860, y: 560 },
    { id: "wp-fl2-5", label: "Sub-Assembly Return", x: 500, y: 560 },
    { id: "wp-fl2-6", label: "Kitting Return West", x: 170, y: 560 },
  ],
  // FB-01: Building A Ground Floor - Central Freight Arterial Loop (Blue #3b82f6)
  "FB-01": [
    { id: "wp-fb1-1", label: "West Freight Siding", x: 120, y: 340 },
    { id: "wp-fb1-2", label: "Freight Staging Crossway", x: 360, y: 310 },
    { id: "wp-fb1-3", label: "Assembly Crossway", x: 640, y: 310 },
    { id: "wp-fb1-4", label: "Outbound Dispatch Bay", x: 860, y: 340 },
    { id: "wp-fb1-5", label: "Main Dispatch Siding", x: 640, y: 420 },
    { id: "wp-fb1-6", label: "Heavy Kitting Buffer", x: 360, y: 420 },
  ],
  // FL-03: Building A Level 1 - North Sorter Induction Loop (Amber #f59e0b)
  "FL-03": [
    { id: "wp-fl3-1", label: "Sorter Induction Bay 01", x: 220, y: 180 },
    { id: "wp-fl3-2", label: "Mezzanine Cross-Aisle", x: 500, y: 180 },
    { id: "wp-fl3-3", label: "Mezzanine Fast Charger", x: 780, y: 180 },
    { id: "wp-fl3-4", label: "Quality Inspection Deck", x: 780, y: 260 },
    { id: "wp-fl3-5", label: "Sorter Express Return", x: 500, y: 260 },
    { id: "wp-fl3-6", label: "Induction Queue West", x: 220, y: 260 },
  ],
  // FB-02: Building A Level 1 - South Packaging & Chute Loop (Orange #f97316)
  "FB-02": [
    { id: "wp-fb2-1", label: "Packaging Bay 02", x: 220, y: 480 },
    { id: "wp-fb2-2", label: "Conveyor Link Mid", x: 500, y: 480 },
    { id: "wp-fb2-3", label: "Parcel Chute Dispatch", x: 780, y: 480 },
    { id: "wp-fb2-4", label: "Cross-Dock Buffer", x: 780, y: 400 },
    { id: "wp-fb2-5", label: "Automated Tote Return", x: 500, y: 400 },
    { id: "wp-fb2-6", label: "Packaging Buffer West", x: 220, y: 400 },
  ],
  // FL-04: Building B Ground Floor - North ASRS Induction Loop (Rose #f43f5e)
  "FL-04": [
    { id: "wp-fl4-1", label: "ASRS Induction Bay", x: 200, y: 200 },
    { id: "wp-fl4-2", label: "High-Bay Aisle Transit", x: 500, y: 200 },
    { id: "wp-fl4-3", label: "Heavy Depot Charger", x: 800, y: 200 },
    { id: "wp-fl4-4", label: "ASRS Buffer East", x: 800, y: 260 },
    { id: "wp-fl4-5", label: "High-Bay Cross-Aisle", x: 500, y: 260 },
    { id: "wp-fl4-6", label: "Pallet Induction Return", x: 200, y: 260 },
  ],
  // FB-03: Building B Ground Floor - Central Heavy Transit Spur (Teal #14b8a6)
  "FB-03": [
    { id: "wp-fb3-1", label: "Heavy Pallet West Infeed", x: 180, y: 340 },
    { id: "wp-fb3-2", label: "Central ASRS Spine", x: 480, y: 340 },
    { id: "wp-fb3-3", label: "Cross-Dock Staging East", x: 820, y: 340 },
    { id: "wp-fb3-4", label: "East Staging Turnout", x: 820, y: 410 },
    { id: "wp-fb3-5", label: "Heavy Transit Corridor", x: 480, y: 410 },
    { id: "wp-fb3-6", label: "Infeed Turnout West", x: 180, y: 410 },
  ],
  // FB-04: Building B Ground Floor - South Outbound Freight Loop (Fuchsia #d946ef)
  "FB-04": [
    { id: "wp-fb4-1", label: "High-Bay Transfer Bay", x: 200, y: 480 },
    { id: "wp-fb4-2", label: "South Transit Main", x: 500, y: 480 },
    { id: "wp-fb4-3", label: "Outbound Dispatch Siding", x: 800, y: 480 },
    { id: "wp-fb4-4", label: "Outbound Rail Gate", x: 800, y: 550 },
    { id: "wp-fb4-5", label: "Storage Cross-Return", x: 500, y: 550 },
    { id: "wp-fb4-6", label: "Pallet Return Dock", x: 200, y: 550 },
  ],
  // FL-05: Building B Level 1 - North Consolidation & Picking Loop (Violet #8b5cf6)
  "FL-05": [
    { id: "wp-fl5-1", label: "Order Consolidation Hub", x: 240, y: 180 },
    { id: "wp-fl5-2", label: "Picking Deck Main Loop", x: 500, y: 180 },
    { id: "wp-fl5-3", label: "Mezzanine Depot Charger", x: 760, y: 180 },
    { id: "wp-fl5-4", label: "Quality Check Deck East", x: 760, y: 260 },
    { id: "wp-fl5-5", label: "Consolidation Express Line", x: 500, y: 260 },
    { id: "wp-fl5-6", label: "Consolidation Buffer West", x: 240, y: 260 },
  ],
  // FB-05: Building B Level 1 - South Tote Carousel & Dispatch Loop (Indigo #6366f1)
  "FB-05": [
    { id: "wp-fb5-1", label: "Pack Station Return", x: 240, y: 460 },
    { id: "wp-fb5-2", label: "Tote Transit Crossway", x: 500, y: 460 },
    { id: "wp-fb5-3", label: "Tote Dispatch Carousel", x: 760, y: 460 },
    { id: "wp-fb5-4", label: "Dispatch Chute North", x: 760, y: 380 },
    { id: "wp-fb5-5", label: "Fast Dispatch Transit", x: 500, y: 380 },
    { id: "wp-fb5-6", label: "Packing Feed Spur", x: 240, y: 380 },
  ],
};

// Supported Industrial AGV Vehicle Models (Strictly 2 Types)
export const ROBOT_TYPES = Object.freeze({
  FORKLIFT: "Forklift AGV",
  FLATBED_CARRIER: "Flatbed Payload Carrier AGV",
});

// Unique color theme association per AGV across the 10-robot fleet
export const ROBOT_COLOR_THEMES = {
  // 1. FL-01: Cyan
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
  // 2. FL-02: Emerald
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
  // 3. FB-01: Blue
  "FB-01": {
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
  // 4. FL-03: Amber
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
  // 5. FB-02: Orange
  "FB-02": {
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
  // 6. FL-04: Rose
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
  // 7. FB-03: Teal
  "FB-03": {
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
  // 8. FB-04: Fuchsia
  "FB-04": {
    name: "Fuchsia",
    hex: "#d946ef",
    strokeClass: "stroke-fuchsia-500 dark:stroke-fuchsia-400",
    fillClass: "fill-fuchsia-500",
    bgClass: "bg-fuchsia-500",
    textClass: "text-fuchsia-600 dark:text-fuchsia-400",
    glow: "rgba(217, 70, 239, 0.28)",
    radarHalo: "fill-fuchsia-500/20 stroke-fuchsia-400",
    badgeBorder: "border-fuchsia-500",
  },
  // 9. FL-05: Violet
  "FL-05": {
    name: "Violet",
    hex: "#8b5cf6",
    strokeClass: "stroke-purple-500 dark:stroke-purple-400",
    fillClass: "fill-purple-500",
    bgClass: "bg-purple-500",
    textClass: "text-purple-600 dark:text-purple-400",
    glow: "rgba(139, 92, 246, 0.28)",
    radarHalo: "fill-purple-500/20 stroke-purple-400",
    badgeBorder: "border-purple-500",
  },
  // 10. FB-05: Indigo
  "FB-05": {
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

