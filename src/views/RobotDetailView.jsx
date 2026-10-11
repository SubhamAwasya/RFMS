import React, { useState, useEffect, useMemo, useRef } from "react";
import { Bot } from "lucide-react";
import EditRobotModal from "../components/robots/EditRobotModal";
import RobotDetailHeader from "../components/robot-detail/RobotDetailHeader";
import RobotHeroSpecsCard from "../components/robot-detail/RobotHeroSpecsCard";
import RobotLogsPanel from "../components/robot-detail/RobotLogsPanel";
import RobotCameraView from "../components/robot-detail/RobotCameraView";
import RobotPositionMiniMap from "../components/robot-detail/RobotPositionMiniMap";
import { useFleet } from "../context/FleetContext";
import { useNavigation } from "../context/NavigationContext";
import { VIEWS, getRobotColorTheme, getRobotPath } from "../constants";

export default function RobotDetailView({
  agvId: propAgvId,
  agvs: propAgvs,
  onBack: propOnBack,
  onNavigateMap: propOnNavigateMap,
}) {
  let fleetCtx = null;
  let navCtx = null;

  try {
    fleetCtx = useFleet();
  } catch (e) {}

  try {
    navCtx = useNavigation();
  } catch (e) {}

  const agvs = propAgvs ?? fleetCtx?.agvs ?? [];
  const agvId = propAgvId ?? navCtx?.selectedAgvId ?? "FL-01";
  const onBack = propOnBack ?? (() => navCtx?.navigateTo(VIEWS.ROBOTS));

  const rawAgv = agvs.find((a) => a.id === agvId) || agvs[0] || null;

  // Dynamic live store instance for whichever AGV is currently active
  const agv =
    rawAgv &&
    fleetCtx?.forklift &&
    (rawAgv.id === "FL-01" || rawAgv.id === fleetCtx.forklift.id)
      ? fleetCtx.forklift
      : rawAgv;

  const [activeTab, setActiveTab] = useState("logs");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // 1. Color theme & designated path
  const theme = useMemo(() => getRobotColorTheme(agv?.id), [agv?.id]);
  const designatedPath = useMemo(
    () => getRobotPath(agv?.id, agv?.floorId),
    [agv?.id, agv?.floorId]
  );

  // 2. LIVE RANDOM LOGS GENERATOR (Triggered on page navigation & random intervals)
  const agvRef = useRef(agv);
  useEffect(() => {
    agvRef.current = agv;
  }, [agv]);

  const [logs, setLogs] = useState(() => [
    {
      id: 1,
      time: "11:32:01",
      level: "INFO",
      node: "ros2_bridge",
      msg: `Odometry topic /odom publishing at 50Hz (linear: ${(agv?.speed || 1.2).toFixed(2)} m/s)`,
    },
    {
      id: 2,
      time: "11:31:45",
      level: "INFO",
      node: "nav2_planner",
      msg: `Route recalculated via ${agv?.currentMission || "Main Guide Loop"}`,
    },
    {
      id: 3,
      time: "11:30:12",
      level: "WARN",
      node: "lidar_driver",
      msg: "Minor safety envelope deflection compensated (360° scan nominal)",
    },
    {
      id: 4,
      time: "11:28:50",
      level: "INFO",
      node: "mission_exec",
      msg: `Payload state: ${agv?.cargo ? `${agv.cargo.palletId} (${agv.cargo.weightKg}kg)` : (agv?.payload || "Zero tare weight")}`,
    },
    {
      id: 5,
      time: "11:25:00",
      level: "INFO",
      node: "dispatch",
      msg: `Autonomous routine initialized for unit ${agv?.id}`,
    },
  ]);

  const generateSingleLog = () => {
    const current = agvRef.current || agv;
    if (!current) return;
    const curX = current?.position?.x ?? current?.coordinates?.x ?? current?.x ?? 0;
    const curY = current?.position?.y ?? current?.coordinates?.y ?? current?.y ?? 0;
    const curRot = current?.position?.headingDeg ?? current?.heading ?? current?.rotation ?? 0;

    const logTemplates = [
      {
        level: "INFO",
        node: "nav2_controller",
        fn: (a) => `Following path waypoint; velocity ${(a.speed || 1.2).toFixed(2)} m/s`,
      },
      {
        level: "INFO",
        node: "localization",
        fn: () => `Adaptive Monte-Carlo particle filter pose: [x=${curX.toFixed(1)}, y=${curY.toFixed(1)}, yaw=${Math.round(curRot)}°]`,
      },
      {
        level: "INFO",
        node: "battery_bms",
        fn: (a) => `Cell health nominal (SOC: ${typeof a.battery === "number" ? a.battery.toFixed(1) : 100}%, pack temp: 28.4°C)`,
      },
      {
        level: "DEBUG",
        node: "canopen_drive",
        fn: (a) => `Dual wheel inverter heartbeat OK • status: ${a.status}`,
      },
      {
        level: "INFO",
        node: "safety_lidar",
        fn: () => `Front safety curtain clear (${Math.round(curX)}, ${Math.round(curY)})`,
      },
      {
        level: "INFO",
        node: "mission_tracker",
        fn: (a) => `Progress on ${a.currentMission || "Active Guide Loop"}: continuous operation`,
      },
      {
        level: "WARN",
        node: "tsn_network",
        fn: () => `Bridge latency jitter: 3.2ms • Wi-Fi 6 RSSI: -48 dBm nominal`,
      },
      {
        level: "INFO",
        node: "cargo_monitor",
        fn: (a) =>
          a.cargo
            ? `Pallet ${a.cargo.palletId} latch secure (${a.cargo.weightKg}kg ${a.cargo.cargoType})`
            : `Deck tare verified: zero payload`,
      },
    ];

    const pick = logTemplates[Math.floor(Math.random() * logTemplates.length)];
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes()
    ).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;

    const newEntry = {
      id: Date.now() + Math.random(),
      time: timeStr,
      level: pick.level,
      node: pick.node,
      msg: pick.fn(current),
    };

    setLogs((prev) => [newEntry, ...prev.slice(0, 49)]);
  };

  useEffect(() => {
    let timeoutId = null;
    let isMounted = true;

    const scheduleNextLog = () => {
      const nextDelayMs = 2500 + Math.random() * 4500;
      timeoutId = setTimeout(() => {
        if (!isMounted) return;
        generateSingleLog();
        scheduleNextLog();
      }, nextDelayMs);
    };

    const initialTimer = setTimeout(() => {
      if (!isMounted) return;
      generateSingleLog();
      scheduleNextLog();
    }, 700);

    return () => {
      isMounted = false;
      clearTimeout(initialTimer);
      clearTimeout(timeoutId);
    };
  }, [agvId]);

  // 3. LIVE POSITION CALCULATION
  const robotX =
    agv?.position?.x ?? agv?.coordinates?.x ?? agv?.x ?? (designatedPath[0]?.x || 480);
  const robotY =
    agv?.position?.y ?? agv?.coordinates?.y ?? agv?.y ?? (designatedPath[0]?.y || 140);
  const robotRot =
    agv?.position?.headingDeg ?? agv?.heading ?? agv?.rotation ?? 0;

  // Closest waypoint detection
  const closestWaypoint = useMemo(() => {
    if (!designatedPath || designatedPath.length === 0) return null;
    let closest = designatedPath[0];
    let minDst = Infinity;
    designatedPath.forEach((wp) => {
      const d = Math.hypot(robotX - wp.x, robotY - wp.y);
      if (d < minDst) {
        minDst = d;
        closest = wp;
      }
    });
    return closest;
  }, [designatedPath, robotX, robotY]);

  const assignedFloor = (fleetCtx?.floors || []).find((f) => f.id === agv?.floorId);

  const handleTrackOnMap = (enableManualDrive = false) => {
    const targetFloor = (fleetCtx?.floors || []).find((f) => f?.id === agv?.floorId);
    const targetBuildingId = agv?.buildingId || targetFloor?.buildingId;
    if (targetBuildingId && fleetCtx?.setActiveBuildingId) {
      fleetCtx.setActiveBuildingId(targetBuildingId);
    }
    if (agv?.floorId && fleetCtx?.setActiveFloorId) {
      fleetCtx.setActiveFloorId(agv.floorId);
    }
    if (enableManualDrive && agv?.id) {
      fleetCtx?.takeManualControl?.(agv.id);
    }
    if (navCtx?.selectAgvOnMap) {
      navCtx.selectAgvOnMap(agv?.id);
    } else if (navCtx?.navigateTo) {
      navCtx.navigateTo(VIEWS.MAP, { agvId: agv?.id });
    } else if (propOnNavigateMap) {
      propOnNavigateMap(agv?.id);
    }
  };

  const onNavigateMap = () => handleTrackOnMap(false);

  if (!agv) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <Bot className="w-12 h-12 text-slate-400 mb-3" />
        <h2 className="text-base font-bold text-slate-800 dark:text-slate-200">
          Robot Not Found
        </h2>
        <p className="text-xs text-slate-500 max-w-sm mt-1 mb-4">
          This AGV has been de-registered or is no longer present in the fleet roster.
        </p>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm"
        >
          Return to Fleet Roster
        </button>
      </div>
    );
  }

  const agvState = agv.status;

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto p-4 sm:p-6 space-y-5">
      {/* 1. Header with Actions */}
      <RobotDetailHeader
        agv={agv}
        theme={theme}
        agvState={agvState}
        onBack={onBack}
        onEdit={() => setIsEditModalOpen(true)}
        onNavigateMap={onNavigateMap}
        onSendToCharger={() => fleetCtx?.sendToCharger?.(agv.id)}
        onSimulateLowBattery={() => fleetCtx?.simulateLowBattery?.(agv.id)}
        onSimulateFault={() => fleetCtx?.simulateRobotFault?.(agv.id)}
        onDelete={() => {
          fleetCtx?.deleteAgv(agv.id);
          onBack?.();
        }}
      />

      {/* 2. Main Top Card: Robot Render & Telemetry Specs */}
      <RobotHeroSpecsCard
        agv={agv}
        theme={theme}
        assignedFloor={assignedFloor}
        closestWaypoint={closestWaypoint}
        onTrackOnMap={handleTrackOnMap}
        onResumeRobot={() => fleetCtx?.resumeSpecificAgv?.(agv.id)}
        onStopRobot={() => fleetCtx?.stopSpecificAgv?.(agv.id)}
      />

      {/* 3. Bottom Split Layout: Live Logs & Camera on Left + Current Position Mini-Map on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Tabs with Live Dynamic Logs / Camera */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-5 space-y-4">
          {/* Tab Navigation */}
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 text-xs font-semibold pb-3">
            <div className="flex items-center gap-6">
              <button
                onClick={() => setActiveTab("logs")}
                className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                  activeTab === "logs"
                    ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 pb-3 -mb-3 font-bold"
                    : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
                }`}
              >
                <span>Logs ({logs.length})</span>
                <span
                  className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"
                  title="Live stream active"
                />
              </button>
              <button
                onClick={() => setActiveTab("camera")}
                className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                  activeTab === "camera"
                    ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 pb-3 -mb-3 font-bold"
                    : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
                }`}
              >
                <span>Live Camera</span>
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              </button>
            </div>
          </div>

          {/* Active Tab Content */}
          {activeTab === "logs" ? (
            <RobotLogsPanel
              logs={logs}
              onGenerateLog={generateSingleLog}
              onClearLogs={() => setLogs([])}
            />
          ) : (
            <RobotCameraView theme={theme} />
          )}
        </div>

        {/* Right: CURRENT POSITION MINI-MAP (REAL-TIME LIVE TRACKING) */}
        <div className="lg:col-span-4">
          <RobotPositionMiniMap
            agv={agv}
            theme={theme}
            designatedPath={designatedPath}
            robotX={robotX}
            robotY={robotY}
            robotRot={robotRot}
            closestWaypoint={closestWaypoint}
            assignedFloor={assignedFloor}
            onNavigateMap={onNavigateMap}
          />
        </div>
      </div>

      {/* Edit Robot Modal */}
      <EditRobotModal
        robot={agv}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={(id, updates) => fleetCtx?.updateAgv(id, updates)}
        onDelete={(id) => {
          fleetCtx?.deleteAgv(id);
          onBack?.();
        }}
      />
    </div>
  );
}
