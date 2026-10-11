import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  useMemo,
} from "react";
import {
  INITIAL_AGVS,
  INITIAL_FORKLIFT_AGV,
  INITIAL_OTHER_AGVS,
  INITIAL_FLATBED_AGV,
  INITIAL_MISSIONS,
  INITIAL_SCHEDULES,
  INITIAL_MAINTENANCE,
  INITIAL_ALERTS,
  INITIAL_BUILDINGS,
  INITIAL_FLOORS,
  INITIAL_BLACKBOX_LOGS,
  DEMO_RICH_BUILDINGS,
  DEMO_RICH_FLOORS,
  DEMO_10_AGVS,
  DEMO_RICH_ALERTS,
  DEMO_RICH_BLACKBOX_LOGS,
} from "../data/mockData";
import {
  DEFAULT_FLOOR_PATHS,
  ROBOT_PATHS,
  getRobotPath,
  getRobotColorTheme,
  NAVIGATION_MODE,
  AGV_STATUS,
} from "../constants";

export const FleetContext = createContext(null);

const loadStorage = (key, fallback) => {
  try {
    const val = localStorage.getItem(key);
    if (val === null || val === undefined) return fallback;
    return JSON.parse(val);
  } catch (e) {
    return fallback;
  }
};

const saveStorage = (key, val) => {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {}
};

export function FleetProvider({ children }) {
  // Facility Hierarchy (persisted)
  const [buildings, setBuildings] = useState(() =>
    loadStorage("rfms_buildings", INITIAL_BUILDINGS)
  );
  const [floors, setFloors] = useState(() =>
    loadStorage("rfms_floors", INITIAL_FLOORS)
  );
  const [activeBuildingId, setActiveBuildingId] = useState(() =>
    loadStorage("rfms_active_building_id", "bldg-1")
  );
  const [activeFloorId, setActiveFloorId] = useState(() =>
    loadStorage("rfms_active_floor_id", "floor-g")
  );

  // Single Flagship Robot: Forklift AGV (FL-01) (persisted)
  const [forklift, setForklift] = useState(() =>
    loadStorage("rfms_forklift", INITIAL_FORKLIFT_AGV)
  );

  // Fleet array (persisted: defaults to FL-02, FL-03, and FB-01)
  const [otherAgvs, setOtherAgvs] = useState(() => {
    const loaded = loadStorage("rfms_other_agvs", null);
    if (Array.isArray(loaded)) {
      return loaded;
    }
    return INITIAL_OTHER_AGVS;
  });

  // Navigation Mode (AUTONOMOUS Looping vs MANUAL Drive)
  const [navigationMode, setNavigationMode] = useState(() =>
    loadStorage("rfms_nav_mode", NAVIGATION_MODE.AUTONOMOUS)
  );

  const [maintenance, setMaintenance] = useState(() =>
    loadStorage("rfms_maintenance", INITIAL_MAINTENANCE)
  );
  const [alerts, setAlerts] = useState(() =>
    loadStorage("rfms_alerts", INITIAL_ALERTS)
  );

  // Active Looping Route & Waypoint Tracking
  const [activeRoute, setActiveRoute] = useState(() => {
    return DEFAULT_FLOOR_PATHS["floor-g"] || [];
  });
  const [currentWaypointIdx, setCurrentWaypointIdx] = useState(0);

  // Obstacle Injection
  const [simulatedObstacle, setSimulatedObstacle] = useState(null);

  // Safety & E-Stop
  const [isEStopped, setIsEStopped] = useState(false);
  const [eStopOpen, setEStopOpen] = useState(false);

  // Teleoperation Cockpit
  const [teleopOpen, setTeleopOpen] = useState(false);
  const [drivingAgvId, setDrivingAgvId] = useState("FL-01");
  const [manualSpeedProfile, setManualSpeedProfile] = useState("STANDARD");

  // Blackbox Audit Trail (persisted)
  const [blackboxLogs, setBlackboxLogs] = useState(() =>
    loadStorage("rfms_blackbox_logs", INITIAL_BLACKBOX_LOGS)
  );
  const [blackboxOpen, setBlackboxOpen] = useState(false);

  // Reset Confirmation Modal State
  const [resetDialogOpen, setResetDialogOpen] = useState(false);

  // Sync state changes automatically to localStorage
  useEffect(() => { saveStorage("rfms_buildings", buildings); }, [buildings]);
  useEffect(() => { saveStorage("rfms_floors", floors); }, [floors]);
  useEffect(() => { saveStorage("rfms_active_building_id", activeBuildingId); }, [activeBuildingId]);
  useEffect(() => { saveStorage("rfms_active_floor_id", activeFloorId); }, [activeFloorId]);
  useEffect(() => { saveStorage("rfms_forklift", forklift); }, [forklift]);
  useEffect(() => { saveStorage("rfms_other_agvs", otherAgvs); }, [otherAgvs]);
  useEffect(() => { saveStorage("rfms_nav_mode", navigationMode); }, [navigationMode]);
  useEffect(() => { saveStorage("rfms_maintenance", maintenance); }, [maintenance]);
  useEffect(() => { saveStorage("rfms_alerts", alerts); }, [alerts]);
  useEffect(() => { saveStorage("rfms_blackbox_logs", blackboxLogs); }, [blackboxLogs]);

  // Select building and auto-switch to its designated first floor
  const selectBuilding = useCallback((bldgId) => {
    setActiveBuildingId(bldgId);
    const bldgFloors = floors.filter((f) => f.buildingId === bldgId);
    if (bldgFloors.length > 0) {
      const hasActive = bldgFloors.some((f) => f.id === activeFloorId);
      if (!hasActive) {
        setActiveFloorId(bldgFloors[0].id);
      }
    } else {
      setActiveFloorId("");
    }
  }, [floors, activeFloorId]);

  // Synchronize activeFloorId whenever activeBuildingId or floors change
  useEffect(() => {
    if (!activeBuildingId) {
      if (buildings.length > 0) {
        setActiveBuildingId(buildings[0].id);
      }
      return;
    }
    const bldgFloors = floors.filter((f) => f.buildingId === activeBuildingId);
    if (bldgFloors.length > 0) {
      const isFloorInBldg = bldgFloors.some((f) => f.id === activeFloorId);
      if (!isFloorInBldg) {
        setActiveFloorId(bldgFloors[0].id);
      }
    }
  }, [activeBuildingId, floors, activeFloorId, buildings]);

  // Sync active floor's designated path when active floor changes
  useEffect(() => {
    const floorPath = DEFAULT_FLOOR_PATHS[activeFloorId] || DEFAULT_FLOOR_PATHS["floor-g"] || [];
    setActiveRoute(floorPath);
    setCurrentWaypointIdx(0);
  }, [activeFloorId]);

  // Active Floor object: always synchronized to activeBuildingId
  const activeFloor = useMemo(() => {
    const bldgFloors = floors.filter((f) => f.buildingId === activeBuildingId);
    if (bldgFloors.length > 0) {
      const found = bldgFloors.find((f) => f.id === activeFloorId);
      if (found) return found;
      return bldgFloors[0];
    }
    return (
      floors.find((f) => f.id === activeFloorId) ||
      floors[0] || {
        id: "floor-g",
        name: "Ground Floor",
        widthMeters: 100,
        lengthMeters: 65,
        stations: [],
        restrictedZones: [],
      }
    );
  }, [floors, activeFloorId, activeBuildingId]);

  // Combined AGVs array (dynamic: includes forklift if active, plus all fleet AGVs)
  const agvs = useMemo(() => {
    return forklift ? [forklift, ...otherAgvs] : otherAgvs;
  }, [forklift, otherAgvs]);

  // Blackbox Logger Helper
  const addBlackboxLog = useCallback((type, message, details = "") => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes()
    ).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
    setBlackboxLogs((prev) => [
      {
        id: `bb-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        timestamp: timeStr,
        type: type || "INFO",
        message,
        details,
      },
      ...prev.slice(0, 99), // keep last 100 logs
    ]);
  }, []);

  // Update Forklift Helper
  const updateForklift = useCallback((updates) => {
    setForklift((prev) => {
      const next = typeof updates === "function" ? updates(prev) : { ...prev, ...updates };
      // Also update coordinates and heading aliases for compatibility
      if (next.position) {
        next.coordinates = { x: next.position.x, y: next.position.y };
        next.heading = next.position.headingDeg;
      }
      return next;
    });
  }, []);

  // updateAgv handler
  const updateAgv = useCallback(
    (id, updates) => {
      if (forklift && (id === "FL-01" || id === forklift.id)) {
        updateForklift(updates);
      } else {
        setOtherAgvs((prev) =>
          prev.map((a) => (a.id === id ? { ...a, ...updates } : a))
        );
      }
      addBlackboxLog("ACTION", `Updated specifications for AGV: ${id}`);
    },
    [forklift, updateForklift, addBlackboxLog]
  );

  const deleteAgv = useCallback(
    (id) => {
      if (id === "FL-01" || (forklift && id === forklift.id)) {
        setForklift(null);
        setActiveRoute([]);
        setCurrentWaypointIdx(0);
        addBlackboxLog("WARN", `De-registered AGV from fleet: ${id}`);
        return true;
      }
      setOtherAgvs((prev) => prev.filter((a) => a.id !== id));
      addBlackboxLog("WARN", `De-registered AGV from fleet: ${id}`);
      return true;
    },
    [forklift, addBlackboxLog]
  );

  const addAgv = useCallback(
    (newRobot) => {
      const path = DEFAULT_FLOOR_PATHS[newRobot.floorId || activeFloorId] || DEFAULT_FLOOR_PATHS["floor-g"] || [];
      const startWaypoint = path[0] || { x: 220, y: 220 };
      const coords = newRobot.coordinates || { x: startWaypoint.x, y: startWaypoint.y };
      const pos = newRobot.position || {
        x: coords.x,
        y: coords.y,
        headingDeg: newRobot.heading ?? 0,
      };
      const robotSpeed = typeof newRobot.speed === "number" ? newRobot.speed : 1.2;
      const robotStatus = newRobot.status || AGV_STATUS.AUTO_LOOP;
      const robotBattery = typeof newRobot.battery === "number" ? newRobot.battery : 100;
      const robotPayload = newRobot.payload || (newRobot.type === "Flatbed Payload Carrier AGV" ? "1,200 kg Max Deck" : "0 kg");

      const robotWithDefaults = {
        ...newRobot,
        type: newRobot.type || "Forklift AGV",
        coordinates: coords,
        position: pos,
        heading: pos.headingDeg,
        status: robotStatus,
        speed: robotStatus === AGV_STATUS.MANUAL_TELEOP ? 0.0 : robotSpeed,
        cruiseSpeed: robotSpeed,
        battery: robotBattery,
        payload: robotPayload,
        currentMission: robotStatus === AGV_STATUS.AUTO_LOOP ? "Continuous Looping Path" : robotStatus,
        targetWaypointIndex: 1,
        floorId: newRobot.floorId || activeFloorId,
        proximityRadar: newRobot.proximityRadar || {
          frontDistMeters: 4.8,
          leftDistMeters: 2.2,
          rightDistMeters: 2.5,
          rearDistMeters: 3.6,
        },
        fork:
          newRobot.type === "Forklift AGV" || !newRobot.type
            ? newRobot.fork || {
                heightMeters: 0.0,
                targetHeightMeters: 0.0,
                tiltDegrees: 0,
                isClamped: false,
              }
            : undefined,
      };
      if (!forklift) {
        setForklift(robotWithDefaults);
        setActiveRoute(path);
        setCurrentWaypointIdx(0);
      } else {
        setOtherAgvs((prev) => [robotWithDefaults, ...prev]);
      }
      addBlackboxLog("ACTION", `Registered AGV: ${robotWithDefaults.id} — Connected directly to floor loop path`);
    },
    [activeFloorId, forklift, addBlackboxLog]
  );

  // Facility Management Actions
  const addBuilding = useCallback((bldg) => {
    setBuildings((prev) => [...prev, bldg]);
    addBlackboxLog("ACTION", `Created facility: ${bldg.name}`);
  }, [addBlackboxLog]);

  const updateBuilding = useCallback((id, updates) => {
    setBuildings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updates } : b))
    );
    addBlackboxLog("ACTION", `Updated facility details for #${id}`);
  }, [addBlackboxLog]);

  const deleteBuilding = useCallback((id) => {
    setBuildings((prev) => {
      const remaining = prev.filter((b) => b.id !== id);
      if (activeBuildingId === id) {
        setActiveBuildingId(remaining[0]?.id || "");
      }
      return remaining;
    });
    // Cascade delete floors belonging to this building
    setFloors((prev) => prev.filter((f) => f.buildingId !== id));
    addBlackboxLog("WARN", `Deleted building #${id} and associated floor levels`);
  }, [activeBuildingId, addBlackboxLog]);

  const addFloor = useCallback((floorData) => {
    setFloors((prev) => [...prev, floorData]);
    addBlackboxLog("ACTION", `Added level: ${floorData.name}`);
  }, [addBlackboxLog]);

  const updateFloor = useCallback((floorId, updates) => {
    setFloors((prev) =>
      prev.map((f) => (f.id === floorId ? { ...f, ...updates } : f))
    );
    addBlackboxLog("ACTION", `Updated floor specs for #${floorId}`);
  }, [addBlackboxLog]);

  const deleteFloor = useCallback((floorId) => {
    setFloors((prev) => {
      const remaining = prev.filter((f) => f.id !== floorId);
      if (activeFloorId === floorId) {
        const currentF = prev.find((f) => f.id === floorId);
        const bldgFloors = remaining.filter((f) => f.buildingId === currentF?.buildingId);
        setActiveFloorId(bldgFloors[0]?.id || remaining[0]?.id || "");
      }
      return remaining;
    });
    addBlackboxLog("WARN", `Deleted floor level #${floorId}`);
  }, [activeFloorId, addBlackboxLog]);

  const uploadFloorMap = useCallback((floorId, imageBase64) => {
    setFloors((prev) =>
      prev.map((f) =>
        f.id === floorId ? { ...f, customMapImage: imageBase64 } : f
      )
    );
    addBlackboxLog("ACTION", `Custom floor blueprint uploaded for floor ${floorId}`);
  }, [addBlackboxLog]);

  const clearFloorMap = useCallback((floorId) => {
    setFloors((prev) =>
      prev.map((f) =>
        f.id === floorId ? { ...f, customMapImage: null } : f
      )
    );
    addBlackboxLog("ACTION", `Cleared custom blueprint image for floor ${floorId}`);
  }, [addBlackboxLog]);

  const addStationToFloor = useCallback((floorId, station) => {
    setFloors((prev) =>
      prev.map((f) => {
        if (f.id !== floorId) return f;
        return {
          ...f,
          stations: [...(f.stations || []), station],
        };
      })
    );
    addBlackboxLog("ACTION", `Placed station '${station.name}' (${station.type})`);
  }, [addBlackboxLog]);

  const removeStationFromFloor = useCallback((floorId, stationId) => {
    setFloors((prev) =>
      prev.map((f) => {
        if (f.id !== floorId) return f;
        return {
          ...f,
          stations: (f.stations || []).filter((s) => s.id !== stationId),
        };
      })
    );
  }, []);

  const addRestrictedZoneToFloor = useCallback((floorId, zone) => {
    setFloors((prev) =>
      prev.map((f) => {
        if (f.id !== floorId) return f;
        return {
          ...f,
          restrictedZones: [...(f.restrictedZones || []), zone],
        };
      })
    );
    addBlackboxLog("ACTION", `Designated zone '${zone.name}' (${zone.type})`);
  }, [addBlackboxLog]);

  const removeRestrictedZoneFromFloor = useCallback((floorId, zoneId) => {
    setFloors((prev) =>
      prev.map((f) => {
        if (f.id !== floorId) return f;
        return {
          ...f,
          restrictedZones: (f.restrictedZones || []).filter((z) => z.id !== zoneId),
        };
      })
    );
  }, []);

  // Obstacle Controls
  const spawnObstacle = useCallback((x = 440, y = 300) => {
    setSimulatedObstacle({
      x,
      y,
      radius: 26,
      label: "Unregistered Pallet Box",
    });
    addBlackboxLog(
      "WARN",
      `Obstacle simulated on floor grid (${Math.round(x)}, ${Math.round(y)})`,
      "LiDAR point cloud detection test active"
    );
  }, [addBlackboxLog]);

  const removeObstacle = useCallback(() => {
    setSimulatedObstacle(null);
    addBlackboxLog("INFO", "Simulated obstacle cleared from corridor");
    setAlerts((prev) => prev.filter((a) => !a.message.includes("Obstacle detected")));
    // If FL-01 was blocked, allow resumption
    setForklift((prev) => {
      if (prev.status === "Obstacle Blocked") {
        return {
          ...prev,
          status: activeRoute.length > 0 ? "In Mission" : "Idle",
          proximityRadar: {
            ...prev.proximityRadar,
            frontDistMeters: 4.8,
          },
        };
      }
      return prev;
    });
  }, [addBlackboxLog, activeRoute.length]);

  // Dispatch Mission to Forklift
  const dispatchMissionToForklift = useCallback((missionData, waypointsList) => {
    const newMission = {
      id: missionData.id || `M-FL-${Math.floor(Math.random() * 900) + 100}`,
      name: missionData.name || "Pallet Relocation Route",
      type: missionData.type || "Transport",
      priority: missionData.priority || "High",
      assignedAgv: "FL-01",
      status: "In Progress",
      startTime: "Just now",
      pickup: missionData.pickup || "Docking Bay 01",
      dropoff: missionData.dropoff || "High-Bay Rack 03",
      estTime: missionData.estTime || "5 min",
      waypointCount: waypointsList.length,
    };

    setMissions((prev) => [newMission, ...prev]);
    setActiveRoute(waypointsList);
    setCurrentWaypointIdx(0);

    setForklift((prev) => ({
      ...prev,
      status: "In Mission",
      speed: 1.2,
      activeMissionId: newMission.id,
      currentMission: newMission.name,
      targetWaypointIndex: 0,
    }));

    addBlackboxLog(
      "ACTION",
      `Mission dispatched: ${newMission.name}`,
      `${waypointsList.length} waypoints plotted from ${newMission.pickup} to ${newMission.dropoff}`
    );
  }, [addBlackboxLog]);

  // Send AGV to Charger Pad
  const sendToCharger = useCallback(() => {
    const target = forklift || otherAgvs[0];
    if (!target) return;
    const targetPos = target.position || target.coordinates || { x: 300, y: 250 };
    const charger = activeFloor.stations?.find((s) => s.type === "charger") || {
      x: 880,
      y: 140,
      name: "Charger Pad Alpha",
    };

    const returnRoute = [
      { id: "wp-ret-cur", label: "Current Point", x: targetPos.x, y: targetPos.y },
      { id: "wp-ret-mid", label: "Transit Waypoint", x: 600, y: 140 },
      { id: "wp-ret-chg", label: charger.name, x: charger.x, y: charger.y, action: "DOCK_CHARGER" },
    ];

    setActiveRoute(returnRoute);
    setCurrentWaypointIdx(0);

    if (forklift) {
      setForklift((prev) =>
        prev
          ? {
              ...prev,
              status: "In Mission",
              speed: 1.2,
              currentMission: `Return to ${charger.name}`,
              targetWaypointIndex: 0,
            }
          : null
      );
    } else if (otherAgvs.length > 0) {
      setOtherAgvs((prev) =>
        prev.map((a, idx) =>
          idx === 0
            ? {
                ...a,
                status: "In Mission",
                speed: 1.2,
                currentMission: `Return to ${charger.name}`,
              }
            : a
        )
      );
    }

    addBlackboxLog("ACTION", `Auto-Return commanded to ${charger.name}`);
  }, [activeFloor, forklift, otherAgvs, addBlackboxLog]);

  // Teleoperation & Autonomous Looping Controls
  const takeManualControl = useCallback(
    (targetId) => {
      const idToDrive = targetId || forklift?.id || (otherAgvs.length > 0 ? otherAgvs[0].id : "FL-01");
      setDrivingAgvId(idToDrive);
      setNavigationMode(NAVIGATION_MODE.MANUAL);
      setTeleopOpen(true);

      // Only the selected robot is put in Manual Teleop; all other robots stay in Auto-Pilot
      if (forklift && (forklift.id === idToDrive || !targetId)) {
        setForklift((prev) =>
          prev ? { ...prev, status: AGV_STATUS.MANUAL_TELEOP, speed: 0.0 } : null
        );
      }

      setOtherAgvs((prev) =>
        prev.map((a) =>
          a.id === idToDrive
            ? { ...a, status: AGV_STATUS.MANUAL_TELEOP, speed: 0.0 }
            : a
        )
      );

      addBlackboxLog(
        "WARN",
        `Manual Teleoperation engaged for ${idToDrive}`,
        "All other fleet robots continue autonomous looping uninterrupted"
      );
    },
    [forklift, otherAgvs, addBlackboxLog]
  );

  // Stop vehicle immediately and transition to Manual Teleop
  const stopAndManual = useCallback(
    (targetId) => {
      const idToStop = targetId || drivingAgvId || forklift?.id || (otherAgvs[0]?.id) || "FL-01";
      setDrivingAgvId(idToStop);
      setNavigationMode(NAVIGATION_MODE.MANUAL);

      const applyStop = (prev) => {
        if (!prev) return prev;
        const currentCruise = prev.cruiseSpeed || (prev.speed > 0 ? prev.speed : 1.2);
        return {
          ...prev,
          status: AGV_STATUS.MANUAL_TELEOP,
          speed: 0.0,
          cruiseSpeed: currentCruise,
        };
      };

      if (forklift && forklift.id === idToStop) {
        setForklift(applyStop);
      }
      setOtherAgvs((prev) =>
        prev.map((a) => (a.id === idToStop ? applyStop(a) : a))
      );

      addBlackboxLog(
        "WARN",
        `Brake / Stop engaged for ${idToStop}`,
        "Vehicle halted (0.0 m/s). Switched to Manual Teleop mode."
      );
    },
    [drivingAgvId, forklift, otherAgvs, addBlackboxLog]
  );

  // Resume Auto-Pilot looping for a specific robot (or entire fleet if targetId omitted)
  const handBackToAutopilot = useCallback(
    (targetId) => {
      const applyAuto = (prev) => {
        if (!prev) return prev;
        const resumeSpeed = prev.cruiseSpeed || 1.2;
        return {
          ...prev,
          status: AGV_STATUS.AUTO_LOOP,
          speed: resumeSpeed,
          currentMission: "Continuous Looping Path",
        };
      };

      if (targetId) {
        if (forklift && forklift.id === targetId) {
          setForklift(applyAuto);
        }
        setOtherAgvs((prev) =>
          prev.map((a) => (a.id === targetId ? applyAuto(a) : a))
        );
        addBlackboxLog("INFO", `Auto-Pilot looping resumed for ${targetId}`);
      } else {
        setForklift((prev) =>
          prev && prev.status === AGV_STATUS.MANUAL_TELEOP ? applyAuto(prev) : prev
        );
        setOtherAgvs((prev) =>
          prev.map((a) =>
            a.status === AGV_STATUS.MANUAL_TELEOP ? applyAuto(a) : a
          )
        );
        setNavigationMode(NAVIGATION_MODE.AUTONOMOUS);
        setTeleopOpen(false);
        addBlackboxLog("INFO", "All manual fleet robots restored to Auto-Pilot looping");
      }
    },
    [forklift, addBlackboxLog]
  );

  // Set speed directly for a specific AGV (for autonomous looping & teleop drive)
  const setAgvSpeed = useCallback(
    (targetId, speed) => {
      const numSpeed = Math.max(0.1, Math.min(3.5, Number(Number(speed).toFixed(2))));
      const applySpeed = (prev) => {
        if (!prev) return prev;
        const isHalted = prev.status === AGV_STATUS.MANUAL_TELEOP && prev.speed === 0.0;
        return {
          ...prev,
          speed: isHalted ? 0.0 : numSpeed,
          cruiseSpeed: numSpeed,
        };
      };

      if (forklift && forklift.id === targetId) {
        setForklift(applySpeed);
      }
      setOtherAgvs((prev) =>
        prev.map((a) => (a.id === targetId ? applySpeed(a) : a))
      );
      addBlackboxLog("ACTION", `Speed profile for ${targetId} updated to ${numSpeed} m/s`);
    },
    [forklift, addBlackboxLog]
  );

  const toggleNavigationMode = useCallback(() => {
    if (navigationMode === NAVIGATION_MODE.AUTONOMOUS) {
      takeManualControl();
    } else {
      handBackToAutopilot();
    }
  }, [navigationMode, takeManualControl, handBackToAutopilot]);

  const manualDrive = useCallback(
    (direction, targetId) => {
      const idToDrive = targetId || drivingAgvId;
      const speedValues = { CREEP: 0.4, STANDARD: 1.2, SPRINT: 2.2 };

      const applyMove = (prev) => {
        if (!prev || !prev.position) return prev;
        const currentSpeed = prev.cruiseSpeed || (prev.speed > 0 ? prev.speed : speedValues[manualSpeedProfile] || 1.2);
        const moveStep = currentSpeed * 7.5; // step size in map pixels

        let { x, y, headingDeg } = prev.position;
        let newHeading = headingDeg;
        let newX = x;
        let newY = y;
        let newSpeed = currentSpeed;

        switch (direction) {
          case "FORWARD": {
            const rad = (newHeading * Math.PI) / 180;
            newX += Math.cos(rad) * moveStep;
            newY += Math.sin(rad) * moveStep;
            break;
          }
          case "REVERSE": {
            const rad = (newHeading * Math.PI) / 180;
            newX -= Math.cos(rad) * moveStep;
            newY -= Math.sin(rad) * moveStep;
            break;
          }
          case "LEFT": {
            newHeading = (newHeading - 15 + 360) % 360;
            break;
          }
          case "RIGHT": {
            newHeading = (newHeading + 15) % 360;
            break;
          }
          case "BRAKE": {
            newSpeed = 0.0;
            break;
          }
          default:
            break;
        }

        // Constrain inside floor bounds (50 to 950 px x, 50 to 600 px y)
        newX = Math.max(50, Math.min(950, newX));
        newY = Math.max(50, Math.min(600, newY));

        // Sensor distance mock calculation
        const frontDist = simulatedObstacle
          ? Math.max(0.4, Number((Math.hypot(simulatedObstacle.x - newX, simulatedObstacle.y - newY) / 60).toFixed(1)))
          : 4.8;

        return {
          ...prev,
          position: { x: Number(newX.toFixed(1)), y: Number(newY.toFixed(1)), headingDeg: newHeading },
          coordinates: { x: Number(newX.toFixed(1)), y: Number(newY.toFixed(1)) },
          heading: newHeading,
          status: AGV_STATUS.MANUAL_TELEOP,
          speed: direction === "BRAKE" ? 0.0 : newSpeed,
          cruiseSpeed: currentSpeed,
          battery: Math.max(0, Number((prev.battery - 0.02).toFixed(2))),
          proximityRadar: {
            frontDistMeters: frontDist,
            leftDistMeters: Number((2.0 + Math.random() * 0.5).toFixed(1)),
            rightDistMeters: Number((2.0 + Math.random() * 0.5).toFixed(1)),
            rearDistMeters: Number((3.5 + Math.random() * 0.3).toFixed(1)),
          },
        };
      };

      if (forklift && (forklift.id === idToDrive || !idToDrive)) {
        setForklift(applyMove);
      } else {
        setOtherAgvs((prev) => prev.map((a) => (a.id === idToDrive ? applyMove(a) : a)));
      }
    },
    [drivingAgvId, forklift, manualSpeedProfile, simulatedObstacle]
  );

  // Forklift Fork Mechanism Controls
  const setForkHeight = useCallback((targetMeters) => {
    const clamped = Math.max(0.0, Math.min(2.8, Number(targetMeters.toFixed(2))));
    const applyFork = (prev) => {
      if (!prev || !prev.fork) return prev;
      return {
        ...prev,
        fork: {
          ...prev.fork,
          targetHeightMeters: clamped,
        },
      };
    };
    if (forklift && (forklift.id === drivingAgvId || !drivingAgvId)) {
      setForklift(applyFork);
    } else {
      setOtherAgvs((prev) => prev.map((a) => (a.id === drivingAgvId ? applyFork(a) : a)));
    }
    addBlackboxLog("ACTION", `Fork target height adjusted to ${clamped}m`);
  }, [drivingAgvId, forklift, addBlackboxLog]);

  const togglePalletClamp = useCallback(() => {
    const applyClamp = (prev) => {
      if (!prev || !prev.fork) return prev;
      const isClamping = !prev.fork.isClamped;
      if (isClamping && !prev.cargo) {
        // Pick up nearby pallet if any
        return {
          ...prev,
          fork: { ...prev.fork, isClamped: true, heightMeters: Math.max(prev.fork.heightMeters, 0.4) },
          cargo: {
            hasPallet: true,
            palletId: "PLT-409",
            weightKg: 450,
            cargoType: "Automotive Parts",
          },
          payload: "450 kg",
        };
      } else if (!isClamping && prev.cargo) {
        // Drop pallet
        return {
          ...prev,
          fork: { ...prev.fork, isClamped: false, heightMeters: 0.0, targetHeightMeters: 0.0 },
          cargo: null,
          payload: "0 kg",
        };
      }
      return {
        ...prev,
        fork: { ...prev.fork, isClamped: isClamping },
      };
    };

    if (forklift && (forklift.id === drivingAgvId || !drivingAgvId)) {
      setForklift(applyClamp);
    } else {
      setOtherAgvs((prev) => prev.map((a) => (a.id === drivingAgvId ? applyClamp(a) : a)));
    }
  }, [drivingAgvId, forklift]);

  // Floor Elevator Transit
  const useElevatorToFloor = useCallback((targetFloorId) => {
    const elevatorStn = activeFloor.stations?.find((s) => s.type === "elevator");
    if (!elevatorStn) return;

    setForklift((prev) =>
      prev
        ? {
            ...prev,
            status: "In Mission",
            currentMission: "Entering Freight Elevator",
          }
        : null
    );

    addBlackboxLog("INFO", `AGV entered Freight Elevator to transit to ${targetFloorId}`);

    setTimeout(() => {
      setActiveFloorId(targetFloorId);
      setForklift((prev) =>
        prev
          ? {
              ...prev,
              floorId: targetFloorId,
              status: "Idle",
              currentMission: "Exited Freight Elevator",
              position: { x: elevatorStn.x + 30, y: elevatorStn.y, headingDeg: 0 },
            }
          : null
      );
      addBlackboxLog("INFO", `AGV arrived at level ${targetFloorId}`);
    }, 1500);
  }, [activeFloor, addBlackboxLog]);

  // E-Stop Handlers (Global & Single-Robot)
  const triggerEStop = useCallback(() => {
    setIsEStopped(true);
    setEStopOpen(false);
    setForklift((prev) =>
      prev
        ? {
            ...prev,
            status: "Stopped",
            speed: 0.0,
          }
        : null
    );
    setOtherAgvs((prev) =>
      prev.map((a) => ({ ...a, status: "Stopped", speed: 0.0 }))
    );
    addBlackboxLog("CRITICAL", "GLOBAL EMERGENCY STOP ENGAGED", "All actuators hardware-braked");
    setAlerts((prev) => [
      {
        id: `ALT-ESTOP-${Date.now()}`,
        agv: "ALL",
        message: "Global Emergency Stop Engaged. Fleet frozen.",
        time: "Just now",
        level: "danger",
      },
      ...prev,
    ]);
  }, [addBlackboxLog]);

  const resetEStop = useCallback(() => {
    setIsEStopped(false);
    setForklift((prev) =>
      prev
        ? {
            ...prev,
            status: AGV_STATUS.AUTO_LOOP,
            speed: prev.cruiseSpeed || 1.2,
            currentMission: "Continuous Looping Path",
          }
        : null
    );
    setOtherAgvs((prev) =>
      prev.map((a) => ({
        ...a,
        status: AGV_STATUS.AUTO_LOOP,
        speed: a.cruiseSpeed || 1.2,
        currentMission: "Continuous Looping Path",
      }))
    );
    addBlackboxLog("INFO", "Global Emergency Stop Reset. Fleet brakes released and looping resumed");
    setAlerts((prev) => prev.filter((a) => !a.message.includes("Emergency Stop")));
  }, [addBlackboxLog]);

  // Stop ONLY a specific robot without affecting any other fleet robots
  const stopSpecificAgv = useCallback((targetId) => {
    if (!targetId) return;
    const applyStop = (prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        status: "Stopped",
        speed: 0.0,
        cruiseSpeed: prev.cruiseSpeed || (prev.speed > 0 ? prev.speed : 1.2),
      };
    };

    if (forklift && forklift.id === targetId) {
      setForklift(applyStop);
    }
    setOtherAgvs((prev) =>
      prev.map((a) => (a.id === targetId ? applyStop(a) : a))
    );

    addBlackboxLog(
      "WARN",
      `Emergency Stop engaged for ${targetId}`,
      "Vehicle halted (0.0 m/s). All other fleet robots continue normal operation."
    );
  }, [forklift, addBlackboxLog]);

  // Resume ONLY a specific stopped robot back to auto looping
  const resumeSpecificAgv = useCallback((targetId) => {
    if (!targetId) return;
    const applyResume = (prev) => {
      if (!prev) return prev;
      const resumeSpeed = prev.cruiseSpeed || 1.2;
      return {
        ...prev,
        status: AGV_STATUS.AUTO_LOOP,
        speed: resumeSpeed,
        currentMission: "Continuous Looping Path",
      };
    };

    if (forklift && forklift.id === targetId) {
      setForklift(applyResume);
    }
    setOtherAgvs((prev) =>
      prev.map((a) => (a.id === targetId ? applyResume(a) : a))
    );

    addBlackboxLog(
      "INFO",
      `Emergency Stop released for ${targetId}`,
      "Vehicle returned to autonomous looping path."
    );
  }, [forklift, addBlackboxLog]);

  // Alert Helpers
  const acknowledgeAlert = useCallback((id) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const clearAllAlerts = useCallback(() => {
    setAlerts([]);
  }, []);

  const createMission = useCallback((newMission) => {
    setMissions((prev) => [newMission, ...prev]);
  }, []);

  const updateMission = useCallback((missionId, updatedFields) => {
    setMissions((prev) =>
      prev.map((m) => {
        if (m.id !== missionId) return m;
        return { ...m, ...updatedFields };
      })
    );

    setForklift((prev) => {
      if (!prev) return null;
      if (prev.activeMissionId === missionId) {
        return {
          ...prev,
          currentMission: updatedFields.name || prev.currentMission,
          status:
            updatedFields.status === "Completed" || updatedFields.status === "Failed"
              ? "Idle"
              : updatedFields.status === "In Progress"
              ? "In Mission"
              : prev.status,
        };
      }
      return prev;
    });

    addBlackboxLog("ACTION", `Mission ${missionId} updated`);
  }, [addBlackboxLog]);

  const cancelMission = useCallback((id) => {
    setMissions((prev) => prev.filter((m) => m.id !== id));
    if (forklift && forklift.activeMissionId === id) {
      setActiveRoute([]);
      setForklift((prev) =>
        prev
          ? {
              ...prev,
              status: "Idle",
              speed: 0.0,
              activeMissionId: null,
              currentMission: "Awaiting Dispatch",
            }
          : null
      );
      addBlackboxLog("WARN", `Mission ${id} canceled by operator`);
    }
  }, [forklift?.activeMissionId, addBlackboxLog]);

  const toggleSchedule = useCallback((id) => {
    setSchedules((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: !s.status } : s))
    );
  }, []);

  const addSchedule = useCallback((newSch) => {
    setSchedules((prev) => [newSch, ...prev]);
  }, []);

  // Factory Reset All Data to Single-Entity Baseline
  const resetAllData = useCallback(() => {
    try {
      localStorage.removeItem("rfms_buildings");
      localStorage.removeItem("rfms_floors");
      localStorage.removeItem("rfms_active_building_id");
      localStorage.removeItem("rfms_active_floor_id");
      localStorage.removeItem("rfms_forklift");
      localStorage.removeItem("rfms_other_agvs");
      localStorage.removeItem("rfms_nav_mode");
      localStorage.removeItem("rfms_maintenance");
      localStorage.removeItem("rfms_alerts");
      localStorage.removeItem("rfms_blackbox_logs");
    } catch (e) {}

    setBuildings(INITIAL_BUILDINGS);
    setFloors(INITIAL_FLOORS);
    setActiveBuildingId("bldg-1");
    setActiveFloorId("floor-g");
    setForklift(INITIAL_FORKLIFT_AGV);
    setOtherAgvs(INITIAL_OTHER_AGVS);
    setNavigationMode(NAVIGATION_MODE.AUTONOMOUS);
    setMaintenance(INITIAL_MAINTENANCE);
    setAlerts(INITIAL_ALERTS);
    setBlackboxLogs(INITIAL_BLACKBOX_LOGS);
    setActiveRoute(DEFAULT_FLOOR_PATHS["floor-g"] || []);
    setCurrentWaypointIdx(0);
    setSimulatedObstacle(null);
    setIsEStopped(false);
    setResetDialogOpen(false);
  }, []);

  // Clear All Data (Empty State: No robots, no buildings, no floors)
  const clearAllData = useCallback(() => {
    try {
      localStorage.setItem("rfms_buildings", JSON.stringify([]));
      localStorage.setItem("rfms_floors", JSON.stringify([]));
      localStorage.setItem("rfms_active_building_id", JSON.stringify(""));
      localStorage.setItem("rfms_active_floor_id", JSON.stringify(""));
      localStorage.setItem("rfms_forklift", JSON.stringify(null));
      localStorage.setItem("rfms_other_agvs", JSON.stringify([]));
      localStorage.setItem("rfms_nav_mode", JSON.stringify(NAVIGATION_MODE.AUTONOMOUS));
      localStorage.setItem("rfms_maintenance", JSON.stringify([]));
      localStorage.setItem("rfms_alerts", JSON.stringify([]));
      localStorage.setItem("rfms_blackbox_logs", JSON.stringify([
        {
          id: `bb-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString(),
          type: "WARN",
          message: "All fleet and facility data cleared. System in empty state.",
          details: "0 AGVs, 0 Buildings, 0 Floors loaded.",
        },
      ]));
    } catch (e) {}

    setBuildings([]);
    setFloors([]);
    setActiveBuildingId("");
    setActiveFloorId("");
    setForklift(null);
    setOtherAgvs([]);
    setNavigationMode(NAVIGATION_MODE.AUTONOMOUS);
    setMaintenance([]);
    setAlerts([]);
    setBlackboxLogs([
      {
        id: `bb-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        type: "WARN",
        message: "All fleet and facility data cleared. System in empty state.",
        details: "0 AGVs, 0 Buildings, 0 Floors loaded.",
      },
    ]);
    setActiveRoute([]);
    setCurrentWaypointIdx(0);
    setSimulatedObstacle(null);
    setIsEStopped(false);
    setResetDialogOpen(false);
  }, []);

  // Load Rich Demo Data (10 Robots, Multiple Buildings, Multiple Floors)
  const loadRichDemoData = useCallback(() => {
    try {
      localStorage.setItem("rfms_buildings", JSON.stringify(DEMO_RICH_BUILDINGS));
      localStorage.setItem("rfms_floors", JSON.stringify(DEMO_RICH_FLOORS));
      localStorage.setItem("rfms_active_building_id", JSON.stringify("bldg-1"));
      localStorage.setItem("rfms_active_floor_id", JSON.stringify("floor-g"));
      localStorage.setItem("rfms_forklift", JSON.stringify(DEMO_10_AGVS[0]));
      localStorage.setItem("rfms_other_agvs", JSON.stringify(DEMO_10_AGVS.slice(1)));
      localStorage.setItem("rfms_nav_mode", JSON.stringify(NAVIGATION_MODE.AUTONOMOUS));
      localStorage.setItem("rfms_maintenance", JSON.stringify(INITIAL_MAINTENANCE));
      localStorage.setItem("rfms_alerts", JSON.stringify(DEMO_RICH_ALERTS));
      localStorage.setItem("rfms_blackbox_logs", JSON.stringify(DEMO_RICH_BLACKBOX_LOGS));
    } catch (e) {}

    setBuildings(DEMO_RICH_BUILDINGS);
    setFloors(DEMO_RICH_FLOORS);
    setActiveBuildingId("bldg-1");
    setActiveFloorId("floor-g");
    setForklift(DEMO_10_AGVS[0]);
    setOtherAgvs(DEMO_10_AGVS.slice(1));
    setNavigationMode(NAVIGATION_MODE.AUTONOMOUS);
    setMaintenance(INITIAL_MAINTENANCE);
    setAlerts(DEMO_RICH_ALERTS);
    setBlackboxLogs(DEMO_RICH_BLACKBOX_LOGS);
    setActiveRoute(DEFAULT_FLOOR_PATHS["floor-g"] || []);
    setCurrentWaypointIdx(0);
    setSimulatedObstacle(null);
    setIsEStopped(false);
    setResetDialogOpen(false);
  }, []);

  // --------------------------------------------------------------------------
  // CONTINUOUS REAL-TIME CLIENT SIMULATION LOOP
  // Runs every 250ms to animate FL-01 motion, battery, fork height, obstacles
  // --------------------------------------------------------------------------
  useEffect(() => {
    const interval = setInterval(() => {
      // 1. If E-Stopped or Manual Teleop, do not perform autonomous route updates
      if (isEStopped) return;

      // 2. Battery Charging Simulation
      setForklift((prev) => {
        if (!prev) return null;
        if (prev.status === "Charging") {
          if (prev.battery < 100) {
            const nextBat = Math.min(100, Number((prev.battery + 0.6).toFixed(1)));
            return { ...prev, battery: nextBat };
          }
        }
        return prev;
      });

      // 3. Fork Mechanism Height Animation
      setForklift((prev) => {
        if (!prev || !prev.fork) return prev;
        const { heightMeters, targetHeightMeters } = prev.fork;
        if (Math.abs(heightMeters - targetHeightMeters) > 0.04) {
          const step = heightMeters < targetHeightMeters ? 0.08 : -0.08;
          const nextH = Math.max(
            0.0,
            Math.min(2.8, Number((heightMeters + step).toFixed(2)))
          );
          return {
            ...prev,
            fork: { ...prev.fork, heightMeters: nextH },
          };
        }
        return prev;
      });

      // 4. Autonomous Looping Waypoint Navigation for Forklift (FL-01)
      setForklift((prev) => {
        if (!prev || !prev.position) return null;
        if (
          prev.status === AGV_STATUS.MANUAL_TELEOP ||
          prev.status === "Stopped" ||
          prev.status === "Charging" ||
          prev.status === AGV_STATUS.BLOCKED
        ) {
          return prev;
        }
        const route = getRobotPath(prev.id || "FL-01", prev.floorId || activeFloorId);
        if (!route || route.length === 0) return prev;

        const safeIdx = (prev.targetWaypointIndex ?? 1) % route.length;
        const target = route[safeIdx];
        if (!target) return prev;

        const cx = prev.position.x;
        const cy = prev.position.y;
        const tx = target.x;
        const ty = target.y;

        // Check simulated obstacle collision (< 45px)
        if (simulatedObstacle) {
          const distToObs = Math.hypot(simulatedObstacle.x - cx, simulatedObstacle.y - cy);
          if (distToObs < 45) {
            addBlackboxLog(
              "CRITICAL",
              "LiDAR Proximity Stop: Obstacle detected within 0.8m safety envelope",
              "Auto-braking engaged. Manual intervention or corridor clearance required."
            );
            setAlerts((aPrev) => [
              {
                id: `ALT-OBS-${Date.now()}`,
                agv: prev.id || "FL-01",
                message: "Obstacle detected 0.8m ahead on Corridor. Vehicle halted.",
                time: "Just now",
                level: "danger",
              },
              ...aPrev,
            ]);
            return {
              ...prev,
              status: AGV_STATUS.BLOCKED,
              speed: 0.0,
              proximityRadar: {
                ...prev.proximityRadar,
                frontDistMeters: 0.8,
              },
            };
          }
        }

        // Check if inside any Slow Zone on the active floor
        const inSlowZone = (activeFloor.restrictedZones || []).some(
          (z) =>
            z.type === "slow" &&
            cx >= z.x &&
            cx <= z.x + z.w &&
            cy >= z.y &&
            cy <= z.y + z.h
        );

        const activeSpeed = inSlowZone ? 0.4 : (prev.speed || 1.2);
        const stepDist = activeSpeed * 6.5; // pixel step

        const dx = tx - cx;
        const dy = ty - cy;
        const distToTarget = Math.hypot(dx, dy);

        // Compute smooth heading angle
        let targetHeading = (Math.atan2(dy, dx) * 180) / Math.PI;
        if (targetHeading < 0) targetHeading += 360;

        // Check if arrived at this waypoint
        if (distToTarget <= stepDist + 4) {
          // Endless continuous loop: wrap around to 0 when reaching end!
          const nextIdx = (safeIdx + 1) % route.length;
          setCurrentWaypointIdx(nextIdx);

          // Handle waypoint pallet action if applicable
          let nextCargo = prev.cargo;
          let nextPayload = prev.payload;

          if (target.label?.toLowerCase().includes("dock") || target.label?.toLowerCase().includes("inbound")) {
            if (!prev.cargo) {
              nextCargo = {
                hasPallet: true,
                palletId: "PLT-409",
                weightKg: 450,
                cargoType: "Automotive Parts",
              };
              nextPayload = "450 kg";
              addBlackboxLog(
                "ACTION",
                `Lifting action executed at ${target.label}. Pallet #PLT-409 clamped (450kg)`
              );
            }
          } else if (target.label?.toLowerCase().includes("storage") || target.label?.toLowerCase().includes("hub")) {
            if (prev.cargo) {
              nextCargo = null;
              nextPayload = "0 kg";
              addBlackboxLog(
                "ACTION",
                `Pallet delivered and dropped at ${target.label}. Forks lowered.`
              );
            }
          }

          return {
            ...prev,
            position: { x: tx, y: ty, headingDeg: Math.round(targetHeading) },
            coordinates: { x: tx, y: ty },
            heading: Math.round(targetHeading),
            speed: activeSpeed,
            status: AGV_STATUS.AUTO_LOOP,
            currentMission: `Continuous Looping Path: → ${route[nextIdx]?.label || "Next WP"}`,
            cargo: nextCargo,
            payload: nextPayload,
            targetWaypointIndex: nextIdx,
          };
        }

        // Interpolate position forward
        const angleRad = (targetHeading * Math.PI) / 180;
        const nextX = Number((cx + Math.cos(angleRad) * stepDist).toFixed(1));
        const nextY = Number((cy + Math.sin(angleRad) * stepDist).toFixed(1));

        // Battery drain proportional to speed and cargo
        const drain = prev.cargo ? 0.04 : 0.02;
        const nextBat = Math.max(0, Number((prev.battery - drain).toFixed(2)));

        return {
          ...prev,
          position: { x: nextX, y: nextY, headingDeg: Math.round(targetHeading) },
          coordinates: { x: nextX, y: nextY },
          heading: Math.round(targetHeading),
          speed: activeSpeed,
          status: AGV_STATUS.AUTO_LOOP,
          battery: nextBat,
        };
      });

      // 5. Autonomous Looping Waypoint Navigation for ALL other robots in fleet (FL-02, FL-03)
      // Keeps moving continuously along designated loop path concurrently!
      setOtherAgvs((prev) => {
        if (!prev || prev.length === 0) return prev;
        return prev.map((agv) => {
          if (
            agv.status === AGV_STATUS.MANUAL_TELEOP ||
            agv.status === "Stopped" ||
            agv.status === "Charging" ||
            agv.status === AGV_STATUS.BLOCKED
          ) {
            return agv;
          }
          const route = getRobotPath(agv.id, agv.floorId || activeFloorId);
          if (!route || route.length === 0) return agv;

          const safeIdx = (agv.targetWaypointIndex ?? 1) % route.length;
          const target = route[safeIdx];
          if (!target) return agv;

          const acx = agv.position?.x ?? agv.coordinates?.x ?? 200;
          const acy = agv.position?.y ?? agv.coordinates?.y ?? 300;
          const adx = target.x - acx;
          const ady = target.y - acy;
          const adist = Math.hypot(adx, ady);
          let aHeading = (Math.atan2(ady, adx) * 180) / Math.PI;
          if (aHeading < 0) aHeading += 360;
          const aSpeed = agv.speed || 1.2;
          const aStep = aSpeed * 6.5;

          if (adist <= aStep + 4) {
            const nextIdx = (safeIdx + 1) % route.length;
            return {
              ...agv,
              position: { x: target.x, y: target.y, headingDeg: Math.round(aHeading) },
              coordinates: { x: target.x, y: target.y },
              heading: Math.round(aHeading),
              speed: aSpeed,
              status: AGV_STATUS.AUTO_LOOP,
              currentMission: `Continuous Looping Path: → ${route[nextIdx]?.label || "Next WP"}`,
              targetWaypointIndex: nextIdx,
            };
          }

          const aAngleRad = (aHeading * Math.PI) / 180;
          const anx = Number((acx + Math.cos(aAngleRad) * aStep).toFixed(1));
          const any = Number((acy + Math.sin(aAngleRad) * aStep).toFixed(1));
          const nextBat = Math.max(0, Number(((agv.battery ?? 80) - 0.02).toFixed(2)));

          return {
            ...agv,
            position: { x: anx, y: any, headingDeg: Math.round(aHeading) },
            coordinates: { x: anx, y: any },
            heading: Math.round(aHeading),
            speed: aSpeed,
            status: AGV_STATUS.AUTO_LOOP,
            battery: nextBat,
          };
        });
      });
    }, 250);

    return () => clearInterval(interval);
  }, [
    isEStopped,
    navigationMode,
    activeRoute,
    currentWaypointIdx,
    simulatedObstacle,
    activeFloor,
    addBlackboxLog,
  ]);

  const value = {
    // Facility Hierarchy
    buildings,
    floors,
    activeBuildingId,
    setActiveBuildingId,
    selectBuilding,
    activeFloorId,
    setActiveFloorId,
    activeFloor,
    addBuilding,
    updateBuilding,
    deleteBuilding,
    addFloor,
    updateFloor,
    deleteFloor,
    uploadFloorMap,
    clearFloorMap,
    addStationToFloor,
    removeStationFromFloor,
    addRestrictedZoneToFloor,
    removeRestrictedZoneFromFloor,

    // Forklift AGV (FL-01)
    forklift,
    setForklift,
    updateForklift,

    // Fleet Compatibility
    agvs,
    setAgvs: setOtherAgvs,
    addAgv,
    updateAgv,
    deleteAgv,

    // Autonomous Navigation & Path Looping
    navigationMode,
    setNavigationMode,
    toggleNavigationMode,
    activeRoute,
    setActiveRoute,
    currentWaypointIdx,
    setCurrentWaypointIdx,
    sendToCharger,
    useElevatorToFloor,

    // Obstacle Simulation
    simulatedObstacle,
    spawnObstacle,
    removeObstacle,

    // Teleoperation Cockpit
    teleopOpen,
    setTeleopOpen,
    drivingAgvId,
    setDrivingAgvId,
    manualSpeedProfile,
    setManualSpeedProfile,
    takeManualControl,
    stopAndManual,
    handBackToAutopilot,
    setAgvSpeed,
    manualDrive,
    setForkHeight,
    togglePalletClamp,

    // Safety & E-Stop
    isEStopped,
    eStopOpen,
    setEStopOpen,
    triggerEStop,
    resetEStop,
    stopSpecificAgv,
    resumeSpecificAgv,

    // Blackbox Event Logs
    blackboxLogs,
    blackboxOpen,
    setBlackboxOpen,
    addBlackboxLog,

    // Maintenance & Alerts
    maintenance,
    setMaintenance,
    alerts,
    setAlerts,
    acknowledgeAlert,
    clearAllAlerts,

    // Compatibility stubs
    missions: [],
    schedules: [],
    createMission: () => {},
    updateMission: () => {},
    cancelMission: () => {},
    dispatchMissionToForklift: () => {},

    // Factory Reset & Demo Presets
    resetDialogOpen,
    setResetDialogOpen,
    resetAllData,
    clearAllData,
    loadRichDemoData,
  };

  return <FleetContext.Provider value={value}>{children}</FleetContext.Provider>;
}

export function useFleet() {
  const context = useContext(FleetContext);
  if (!context) {
    throw new Error("useFleet must be used within a FleetProvider");
  }
  return context;
}

// Named alias per specification
export const useRFMSStore = useFleet;
