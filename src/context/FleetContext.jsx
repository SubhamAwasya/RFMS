import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import {
  INITIAL_FORKLIFT_AGV,
  INITIAL_OTHER_AGVS,
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
  getRobotPath,
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
  const [buildings, setBuildings] = useState(() => {
    const loaded = loadStorage("rfms_buildings", null);
    if (Array.isArray(loaded) && loaded.length >= INITIAL_BUILDINGS.length) {
      return loaded;
    }
    return INITIAL_BUILDINGS;
  });
  const [floors, setFloors] = useState(() => {
    const loaded = loadStorage("rfms_floors", null);
    if (Array.isArray(loaded) && loaded.length >= INITIAL_FLOORS.length) {
      const fg = loaded.find((f) => f.id === "floor-g");
      if (fg && (!fg.restrictedZones || fg.restrictedZones.length <= 2)) {
        return loaded.map((f) => {
          const initMatch = INITIAL_FLOORS.find((i) => i.id === f.id);
          if (initMatch && initMatch.restrictedZones?.length > 2) {
            return {
              ...f,
              restrictedZones: initMatch.restrictedZones,
              stations: initMatch.stations || f.stations,
            };
          }
          return f;
        });
      }
      return loaded;
    }
    return INITIAL_FLOORS;
  });
  const [activeBuildingId, setActiveBuildingId] = useState(() =>
    loadStorage("rfms_active_building_id", "bldg-1")
  );
  const [activeFloorId, setActiveFloorId] = useState(() =>
    loadStorage("rfms_active_floor_id", "floor-g")
  );

  // Single Flagship Robot: Forklift AGV (FL-01) (persisted)
  const [forklift, setForklift] = useState(() => {
    const loaded = loadStorage("rfms_forklift", INITIAL_FORKLIFT_AGV);
    if (loaded && (typeof loaded.battery !== "number" || loaded.battery < 0)) {
      return { ...loaded, battery: 95 };
    }
    return loaded;
  });

  // Fleet array: 9 remaining AGVs in the 10-robot fleet (persisted)
  const [otherAgvs, setOtherAgvs] = useState(() => {
    const loaded = loadStorage("rfms_other_agvs", null);
    if (Array.isArray(loaded) && loaded.length >= 8) {
      const valid = loaded.filter(
        (a) =>
          a &&
          a.id !== "FL-01" &&
          (a.type === "Forklift AGV" || a.type === "Flatbed Payload Carrier AGV")
      );
      if (valid.length >= 8) {
        return valid.map((a) => {
          if (typeof a.battery !== "number" || a.battery < 0) {
            const match = DEMO_10_AGVS.find((d) => d.id === a.id);
            return { ...a, battery: match?.battery || 90 };
          }
          return a;
        });
      }
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

  // Debounce high-frequency vehicle telemetry saves to prevent blocking the main UI thread
  useEffect(() => {
    const timer = setTimeout(() => {
      saveStorage("rfms_forklift", forklift);
    }, 1000);
    return () => clearTimeout(timer);
  }, [forklift]);

  useEffect(() => {
    const timer = setTimeout(() => {
      saveStorage("rfms_other_agvs", otherAgvs);
    }, 1000);
    return () => clearTimeout(timer);
  }, [otherAgvs]);

  // Flush vehicle states immediately when window unloads
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (forklift) saveStorage("rfms_forklift", forklift);
      if (otherAgvs) saveStorage("rfms_other_agvs", otherAgvs);
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [forklift, otherAgvs]);

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

  // Realistic Industrial Robot Fault Presets
  const FAULT_PRESETS = useMemo(
    () => [
      "Drive Actuator Motor Stall",
      "LiDAR Proximity Safety Field Violation",
      "Navigation IMU Gyro Drift Anomaly",
      "Wheel Traction Loss & Slip Error",
      "Actuator Hydraulic Pressure Drop",
    ],
    []
  );

  // Send AGV to Charger Pad (Specific target robot or primary AGV)
  const sendToCharger = useCallback(
    (targetId) => {
      const id = targetId || forklift?.id || otherAgvs[0]?.id;
      if (!id) return;

      const applyReturn = (prev) => {
        if (!prev) return prev;
        const robotFloor = floors.find((f) => f.id === (prev.floorId || activeFloorId)) || activeFloor;
        const charger = robotFloor?.stations?.find((s) => s.type === "charger") || {
          x: 880,
          y: 140,
          name: "Charger Pad Alpha",
        };
        return {
          ...prev,
          status: "Returning to Charger",
          speed: prev.cruiseSpeed || 1.1,
          currentMission: `Commanded Return to ${charger.name}`,
        };
      };

      if (forklift && forklift.id === id) {
        setForklift(applyReturn);
      }
      setOtherAgvs((prev) => prev.map((a) => (a.id === id ? applyReturn(a) : a)));

      addBlackboxLog("ACTION", `Auto-Return to charging pad commanded for ${id}`);
    },
    [forklift, otherAgvs, floors, activeFloorId, activeFloor, addBlackboxLog]
  );

  // Simulate Low Battery (< 10%) Condition
  // Robot immediately diverts from looping, alerts operators, navigates to charger, stops, charges, and resumes at 100%
  const simulateLowBattery = useCallback(
    (targetId) => {
      const id = targetId || forklift?.id || otherAgvs[0]?.id;
      if (!id) return;

      const applyLowBattery = (prev) => {
        if (!prev) return prev;
        const robotFloor = floors.find((f) => f.id === (prev.floorId || activeFloorId)) || activeFloor;
        const charger = robotFloor?.stations?.find((s) => s.type === "charger") || {
          x: 880,
          y: 140,
          name: "Charger Pad Alpha",
        };
        return {
          ...prev,
          battery: 8, // Set below 10% threshold
          status: "Returning to Charger",
          speed: prev.cruiseSpeed || 1.1,
          currentMission: `Low Battery (8%) — Returning to ${charger.name}`,
        };
      };

      if (forklift && forklift.id === id) {
        setForklift(applyLowBattery);
      }
      setOtherAgvs((prev) => prev.map((a) => (a.id === id ? applyLowBattery(a) : a)));

      const alertId = `ALT-LOWBAT-${id}-${Date.now()}`;
      setAlerts((prev) => [
        {
          id: alertId,
          agv: id,
          message: `Low Battery Warning: ${id} dropped to 8% (<10%). Autonomous reroute to charging station engaged.`,
          time: "Just now",
          level: "warning",
        },
        ...prev.filter((a) => !a.id.startsWith(`ALT-LOWBAT-${id}`)),
      ]);

      addBlackboxLog(
        "WARN",
        `Simulated low battery (8%) triggered for ${id}`,
        "Autonomous state machine activated: routing directly to floor charging station."
      );
    },
    [forklift, otherAgvs, floors, activeFloorId, activeFloor, addBlackboxLog]
  );

  // Simulate Hardware/Sensor Fault with Automated 8-Second Self-Healing Watchdog
  const simulateRobotFault = useCallback(
    (targetId, customReason) => {
      const id = targetId || forklift?.id || otherAgvs[0]?.id;
      if (!id) return;
      const reason = customReason || FAULT_PRESETS[Math.floor(Math.random() * FAULT_PRESETS.length)];
      const alertId = `ALT-FAULT-${id}-${Date.now()}`;
      const autoFixDuration = 8000; // 8-second auto-repair cooldown

      const applyFault = (prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          status: "Fault",
          speed: 0.0,
          currentMission: `Hardware Fault: ${reason} — Watchdog Active`,
          faultInfo: {
            reason,
            triggeredAt: Date.now(),
            autoFixAt: Date.now() + autoFixDuration,
            alertId,
          },
        };
      };

      if (forklift && forklift.id === id) {
        setForklift(applyFault);
      }
      setOtherAgvs((prev) => prev.map((a) => (a.id === id ? applyFault(a) : a)));

      setAlerts((prev) => [
        {
          id: alertId,
          agv: id,
          message: `CRITICAL FAULT [${id}]: ${reason}. Actuator brakes locked. Automated watchdog scheduled for self-repair (8s).`,
          time: "Just now",
          level: "danger",
        },
        ...prev,
      ]);

      addBlackboxLog(
        "CRITICAL",
        `Hardware fault simulated on ${id}: ${reason}`,
        "Safety brakes hardware-locked (0.0 m/s). Automated diagnostic watchdog scheduled for recovery in 8s."
      );
    },
    [forklift, otherAgvs, FAULT_PRESETS, addBlackboxLog]
  );

  // Immediate Manual Resolution for Robot Fault (Operator Override)
  const fixRobotFault = useCallback(
    (targetId) => {
      const id = targetId || forklift?.id || otherAgvs[0]?.id;
      if (!id) return;

      const applyFix = (prev) => {
        if (!prev || prev.status !== "Fault") return prev;
        const alertId = prev.faultInfo?.alertId;
        if (alertId) {
          setAlerts((aPrev) => aPrev.filter((a) => a.id !== alertId));
        }
        return {
          ...prev,
          status: AGV_STATUS.AUTO_LOOP,
          speed: prev.cruiseSpeed || 1.2,
          faultInfo: null,
          currentMission: "Continuous Looping Path",
        };
      };

      if (forklift && forklift.id === id) {
        setForklift(applyFix);
      }
      setOtherAgvs((prev) => prev.map((a) => (a.id === id ? applyFix(a) : a)));

      addBlackboxLog(
        "INFO",
        `Manual operator fix applied for ${id}`,
        "Diagnostics cleared. Safety brakes released and autonomous looping restored."
      );
    },
    [forklift, otherAgvs, addBlackboxLog]
  );

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
      if (prev.battery <= 0) {
        const robotFloor = floors.find((f) => f.id === (prev.floorId || activeFloorId)) || activeFloor;
        const charger = robotFloor?.stations?.find((s) => s.type === "charger") || {
          x: 880,
          y: 140,
          name: "Charger Pad Alpha",
        };
        return {
          ...prev,
          battery: 6,
          status: "Returning to Charger",
          speed: 0.9,
          currentMission: `Emergency Jump-start — Returning to ${charger.name}`,
        };
      }
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
  }, [forklift, floors, activeFloorId, activeFloor, addBlackboxLog]);

  // Alert Helpers
  const acknowledgeAlert = useCallback((id) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const clearAllAlerts = useCallback(() => {
    setAlerts([]);
  }, []);

  // Authentic Industrial AGV / AMR Telemetry Alert Presets
  const RANDOM_ROBOT_ALERT_PRESETS = useMemo(
    () => [
      // Category: LiDAR, Vision & Safety
      {
        level: "warning",
        category: "Sensors",
        message: "LiDAR optical lens transmission at 84% — cleaning scheduled for next dock",
      },
      {
        level: "warning",
        category: "Proximity",
        message: "Narrow passage clearance: side radar distance envelope < 0.42m",
      },
      {
        level: "info",
        category: "Navigation",
        message: "Dynamic aisle detour calculated: bypassed corridor pallet staging (+0.6s)",
      },
      {
        level: "danger",
        category: "Safety",
        message: "LiDAR Safety Envelope breach: transient obstacle detected within 0.5m envelope",
      },
      {
        level: "info",
        category: "Sensors",
        message: "3D Depth Camera spatial pointcloud recalibrated: zero blindspots reported",
      },

      // Category: Battery, Thermal & Energy
      {
        level: "warning",
        category: "Thermal",
        message: "Battery core temp elevated to 38.6°C — auxiliary cooling fan activated",
      },
      {
        level: "info",
        category: "Power",
        message: "Wireless inductive charging handshake confirmed at 120 kW rating",
      },
      {
        level: "info",
        category: "Power",
        message: "Regenerative braking energy recovered: +0.12 kWh returned to cells",
      },
      {
        level: "warning",
        category: "Battery",
        message: "Cell voltage balance variance: bank #3 variance ±0.03V within operating margins",
      },

      // Category: Traction, Localization & Drivetrain
      {
        level: "warning",
        category: "Traction",
        message: "Minor wheel slip detected on Sector B epoxy floor transition marker",
      },
      {
        level: "info",
        category: "Localization",
        message: "SLAM floor anchor relocalization confirmed against QR fiducial #24 (99.8% precision)",
      },
      {
        level: "warning",
        category: "Network",
        message: "Industrial WiFi 6 AP roaming handover latency spike (42ms) near Zone C",
      },
      {
        level: "info",
        category: "Drivetrain",
        message: "Drive motor torque nominal: 98.6% grip efficiency verified across corridor",
      },
      {
        level: "danger",
        category: "Drivetrain",
        message: "Steering servo angle tracking error > 3.6° — automated realignment sequence started",
      },

      // Category: Payload, Mast & Lifting Mechanics
      {
        level: "info",
        category: "Payload",
        message: "Pallet tare weight auto-calibrated: load verified at 450 kg nominal",
      },
      {
        level: "warning",
        category: "Payload",
        message: "Payload weight nearing upper envelope threshold (1,150 kg / 1,200 kg)",
      },
      {
        level: "info",
        category: "Hydraulics",
        message: "Hydraulic mast pressure verified: primary lift cylinders at 145 bar nominal",
      },
      {
        level: "danger",
        category: "Forks",
        message: "Pallet clamp pressure sensor variance: load re-alignment check advised",
      },
      {
        level: "info",
        category: "Inventory",
        message: "Integrated 2D barcode scanner successfully decoded pallet tag #PLT-904",
      },
    ],
    []
  );

  // Generate a realistic randomized telemetry alert for a specific robot or random fleet AGV
  const generateRandomAlert = useCallback(
    (targetId) => {
      const allRobots = agvs && agvs.length > 0 ? agvs : (forklift ? [forklift] : []);
      if (allRobots.length === 0) return null;

      const robot = targetId
        ? allRobots.find((a) => a.id === targetId) || allRobots[0]
        : allRobots[Math.floor(Math.random() * allRobots.length)];

      const robotId = robot?.id || "FL-01";
      const preset = RANDOM_ROBOT_ALERT_PRESETS[
        Math.floor(Math.random() * RANDOM_ROBOT_ALERT_PRESETS.length)
      ];

      const alertId = `ALT-RND-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const newAlert = {
        id: alertId,
        agv: robotId,
        message: `[${robotId}] ${preset.message}`,
        category: preset.category,
        time: "Just now",
        level: preset.level,
        timestamp: Date.now(),
      };

      setAlerts((prev) => [newAlert, ...prev.slice(0, 49)]); // keep last 50 alerts

      // Write corresponding audit trail entry in Blackbox Logs
      const bbType =
        preset.level === "danger"
          ? "CRITICAL"
          : preset.level === "warning"
          ? "WARN"
          : "INFO";

      addBlackboxLog(
        bbType,
        `Telemetry Alert: ${newAlert.message}`,
        `Subsystem: ${preset.category} | AGV: ${robotId} | Floor: ${robot?.floorId || activeFloorId}`
      );

      return newAlert;
    },
    [agvs, forklift, RANDOM_ROBOT_ALERT_PRESETS, activeFloorId, addBlackboxLog]
  );

  // Background Automatic Random Alert Generator (fires every 18-35 seconds)
  const [autoAlertsEnabled, setAutoAlertsEnabled] = useState(true);

  useEffect(() => {
    if (!autoAlertsEnabled) return;

    let timeoutId;
    const scheduleNext = () => {
      // Randomized delay: between 18,000ms and 36,000ms
      const delay = Math.floor(18000 + Math.random() * 18000);
      timeoutId = setTimeout(() => {
        generateRandomAlert();
        scheduleNext();
      }, delay);
    };

    scheduleNext();

    return () => clearTimeout(timeoutId);
  }, [autoAlertsEnabled, generateRandomAlert]);

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
  // DYNAMIC PER-ROBOT AUTOMATIC BATTERY DRAIN CALCULATOR
  // Computes realistic, individualized discharge curves with speed & cargo factors
  // --------------------------------------------------------------------------
  const computeBatteryDrain = (robot, isMoving = true) => {
    let baseRate = robot?.batteryDrainRate;
    if (typeof baseRate !== "number" || baseRate < 0.005 || baseRate > 0.05) {
      // Individual random base discharge rate: between 0.009% and 0.026% per 50ms tick
      // (~0.18% to 0.52% per second, so 1% drops every 2 to 5.5 seconds)
      baseRate = Number((0.009 + Math.random() * 0.017).toFixed(4));
    }

    // Micro-jitter simulating instantaneous motor torque, friction, and grade variation
    const jitter = (Math.random() - 0.48) * 0.003;

    if (!isMoving) {
      // Quiescent standby drain (sensors, onboard computer, cooling fan, comms radio)
      const idleDrain = Math.max(0.0006, Number((0.0012 + Math.random() * 0.0008).toFixed(4)));
      return { drain: idleDrain, drainRate: baseRate };
    }

    const currentSpeed = typeof robot.speed === "number" && robot.speed > 0 ? robot.speed : (robot.cruiseSpeed || 1.2);
    const speedMultiplier = Math.max(0.6, Math.min(2.0, currentSpeed / 1.2));
    const hasPayload = Boolean(robot.cargo || (robot.payload && robot.payload !== "0 kg"));
    const payloadMultiplier = hasPayload ? 1.45 : 1.0;

    const instantaneousDrain = Math.max(
      0.004,
      Number(((baseRate * speedMultiplier * payloadMultiplier) + jitter).toFixed(4))
    );

    return { drain: instantaneousDrain, drainRate: baseRate };
  };

  // --------------------------------------------------------------------------
  // CONTINUOUS REAL-TIME CLIENT SIMULATION LOOP
  // Runs at 50ms (20 FPS) with smooth angular interpolation and fine stepping
  // --------------------------------------------------------------------------
  useEffect(() => {
    const interval = setInterval(() => {
      // 1. If E-Stopped, do not perform autonomous route updates
      if (isEStopped) return;

      // 2. Continuous Autonomous Looping & Telemetry for Forklift (FL-01)
      setForklift((prev) => {
        if (!prev) return null;

        let curBat = typeof prev.battery === "number" ? prev.battery : 95;

        // If battery is fully depleted (0%) and vehicle is not currently charging, stay halted at 0%
        if (curBat <= 0 && prev.status !== "Charging") {
          return {
            ...prev,
            battery: 0,
            batteryDrainRate: 0,
            speed: 0.0,
            status: prev.status === "Stopped" ? "Stopped" : "Low Battery",
            currentMission: "Battery Depleted (0%) — Station Charging Required",
            fork: nextFork,
          };
        }

        // Fork Mechanism Height Animation
        let nextFork = prev.fork;
        if (prev.fork && Math.abs(prev.fork.heightMeters - prev.fork.targetHeightMeters) > 0.02) {
          const step = prev.fork.heightMeters < prev.fork.targetHeightMeters ? 0.02 : -0.02;
          const nextH = Math.max(0.0, Math.min(2.8, Number((prev.fork.heightMeters + step).toFixed(2))));
          nextFork = { ...prev.fork, heightMeters: nextH };
        }

        // Helper to get floor's designated charging pad
        const robotFloor = floors.find((f) => f.id === (prev.floorId || activeFloorId)) || activeFloor;
        const charger = robotFloor?.stations?.find((s) => s.type === "charger") || {
          x: 880,
          y: 140,
          name: "Charger Pad Alpha",
        };

        // --- STATE 1: HARDWARE/SENSOR FAULT & AUTO-FIX WATCHDOG ---
        if (prev.status === "Fault") {
          if (prev.faultInfo && Date.now() >= prev.faultInfo.autoFixAt) {
            const faultAlertId = prev.faultInfo.alertId;
            if (faultAlertId) {
              setAlerts((aPrev) => aPrev.filter((a) => a.id !== faultAlertId));
            }
            addBlackboxLog(
              "INFO",
              `Watchdog auto-resolved fault on ${prev.id || "FL-01"}: ${prev.faultInfo.reason}`,
              "Automated diagnostic routine PASSED. Brakes released and autonomous looping restored."
            );
            return {
              ...prev,
              status: AGV_STATUS.AUTO_LOOP,
              speed: prev.cruiseSpeed || 1.2,
              faultInfo: null,
              fork: nextFork,
              currentMission: "Continuous Looping Path",
            };
          }
          // Idle standby drain while halted in Fault
          const { drain: fDrain, drainRate: fRate } = computeBatteryDrain(prev, false);
          const nextBat = Math.max(0, Number((curBat - fDrain).toFixed(2)));
          return {
            ...prev,
            speed: 0.0,
            battery: nextBat,
            batteryDrainRate: fRate,
            fork: nextFork,
          };
        }

        // --- STATE 2: DOCKED AT CHARGING POINT (FAST CHARGING) ---
        if (prev.status === "Charging") {
          if (curBat < 100) {
            const chargeSpeed = 0.45 + Math.random() * 0.25;
            const nextBat = Math.min(100, Number((curBat + chargeSpeed).toFixed(2)));
            return {
              ...prev,
              battery: nextBat,
              speed: 0.0,
              fork: nextFork,
            };
          } else {
            // 100% full charge reached! Undock and resume following route!
            addBlackboxLog(
              "INFO",
              `${prev.id || "FL-01"} reached 100% full charge`,
              "Undocked from charging station and resumed continuous autonomous looping path."
            );
            setAlerts((aPrev) =>
              aPrev.filter((a) => !a.id.includes(`LOWBAT-${prev.id || "FL-01"}`))
            );
            // Re-roll fresh random discharge rate for the new cycle
            const newDrainRate = Number((0.009 + Math.random() * 0.017).toFixed(4));
            return {
              ...prev,
              battery: 100,
              batteryDrainRate: newDrainRate,
              status: AGV_STATUS.AUTO_LOOP,
              speed: prev.cruiseSpeed || 1.2,
              currentMission: "Continuous Looping Path",
              fork: nextFork,
            };
          }
        }

        // --- STATE 3: LOW BATTERY (<10%) AUTONOMOUS REROUTE ---
        if (
          curBat < 10 &&
          curBat > 0 &&
          prev.status !== "Returning to Charger" &&
          prev.status !== "Stopped" &&
          prev.status !== AGV_STATUS.MANUAL_TELEOP
        ) {
          addBlackboxLog(
            "WARN",
            `Low battery warning for ${prev.id || "FL-01"} (${Math.round(curBat)}%)`,
            `Autonomous diversion to ${charger.name} engaged.`
          );
          setAlerts((aPrev) => [
            {
              id: `ALT-LOWBAT-${prev.id || "FL-01"}-${Date.now()}`,
              agv: prev.id || "FL-01",
              message: `Low Battery (<10%): ${prev.id || "FL-01"} at ${Math.round(curBat)}%. Rerouting to ${charger.name}.`,
              time: "Just now",
              level: "warning",
            },
            ...aPrev.filter((a) => !a.id.startsWith(`ALT-LOWBAT-${prev.id || "FL-01"}`)),
          ]);
          return {
            ...prev,
            status: "Returning to Charger",
            speed: prev.cruiseSpeed || 1.1,
            currentMission: `Low Battery (${Math.round(curBat)}%) — Returning to ${charger.name}`,
            fork: nextFork,
          };
        }

        // --- STATE 4: RETURNING TO CHARGER NAVIGATION ---
        if (prev.status === "Returning to Charger") {
          const cx = prev.position?.x ?? 300;
          const cy = prev.position?.y ?? 250;
          const tx = charger.x;
          const ty = charger.y;
          const distToCharger = Math.hypot(tx - cx, ty - cy);

          // Arrived at charging pad (< 12px)? STOP AND DOCK!
          if (distToCharger <= 12) {
            addBlackboxLog(
              "ACTION",
              `${prev.id || "FL-01"} arrived and docked at ${charger.name}`,
              "Vehicle halted (0.0 m/s). Fast charging cycle initiated."
            );
            setAlerts((aPrev) =>
              aPrev.filter((a) => !a.id.includes(`LOWBAT-${prev.id || "FL-01"}`))
            );
            return {
              ...prev,
              position: { x: tx, y: ty, headingDeg: prev.position?.headingDeg ?? 0 },
              coordinates: { x: tx, y: ty },
              status: "Charging",
              speed: 0.0,
              currentMission: `Docked at ${charger.name} (Charging)`,
              fork: nextFork,
            };
          }

          // Steer smoothly towards charging pad
          let targetHeading = (Math.atan2(ty - cy, tx - cx) * 180) / Math.PI;
          if (targetHeading < 0) targetHeading += 360;

          const currentHeading = prev.position?.headingDeg ?? prev.heading ?? targetHeading;
          let angleDiff = ((targetHeading - currentHeading + 540) % 360) - 180;
          const maxTurnPerTick = 6;
          let smoothHeading = currentHeading;
          if (Math.abs(angleDiff) <= maxTurnPerTick) {
            smoothHeading = targetHeading;
          } else {
            smoothHeading = (currentHeading + Math.sign(angleDiff) * maxTurnPerTick + 360) % 360;
          }
          smoothHeading = Number((((smoothHeading % 360) + 360) % 360).toFixed(1));

          const retSpeed = prev.cruiseSpeed || 1.1;
          const stepDist = retSpeed * 1.3;
          const angleRad = (targetHeading * Math.PI) / 180;
          const nextX = Number((cx + Math.cos(angleRad) * stepDist).toFixed(2));
          const nextY = Number((cy + Math.sin(angleRad) * stepDist).toFixed(2));

          // Drains naturally down to 0% while in transit
          const { drain: rDrain, drainRate: rRate } = computeBatteryDrain(prev, true);
          const nextBat = Math.max(0, Number((curBat - rDrain).toFixed(2)));

          if (nextBat <= 0) {
            return {
              ...prev,
              battery: 0,
              batteryDrainRate: 0,
              speed: 0.0,
              status: "Low Battery",
              currentMission: "Battery Depleted (0%) — Station Charging Required",
              fork: nextFork,
            };
          }

          return {
            ...prev,
            position: { x: nextX, y: nextY, headingDeg: smoothHeading },
            coordinates: { x: nextX, y: nextY },
            heading: smoothHeading,
            speed: retSpeed,
            status: "Returning to Charger",
            currentMission: `Low Battery (${Math.round(nextBat)}%) — Returning to ${charger.name}`,
            battery: nextBat,
            batteryDrainRate: rRate,
            fork: nextFork,
          };
        }

        // If manual teleop, stopped, or obstacle blocked, position remains frozen but standby drain ticks
        if (
          !prev.position ||
          prev.status === AGV_STATUS.MANUAL_TELEOP ||
          prev.status === "Stopped" ||
          prev.status === AGV_STATUS.BLOCKED ||
          prev.status === "Low Battery"
        ) {
          const { drain: sDrain, drainRate: sRate } = computeBatteryDrain(prev, false);
          const nextBat = Math.max(0, Number((curBat - sDrain).toFixed(2)));
          return {
            ...prev,
            battery: nextBat,
            batteryDrainRate: nextBat <= 0 ? 0 : sRate,
            speed: 0.0,
            status: prev.status === "Stopped" ? "Stopped" : (nextBat <= 0 ? "Low Battery" : prev.status),
            currentMission: nextBat <= 0 ? "Battery Depleted (0%) — Station Charging Required" : prev.currentMission,
            fork: nextFork,
          };
        }

        // --- NORMAL AUTO-PILOT WAYPOINT NAVIGATION ---
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
              battery: curBat,
              fork: nextFork,
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
        const stepDist = activeSpeed * 1.3; // 50ms tick step (~1.56px at 1.2 m/s)

        const dx = tx - cx;
        const dy = ty - cy;
        const distToTarget = Math.hypot(dx, dy);

        // Compute smooth target heading towards waypoint
        let targetHeading = (Math.atan2(dy, dx) * 180) / Math.PI;
        if (targetHeading < 0) targetHeading += 360;

        // Smooth heading angular interpolation
        const currentHeading = prev.position?.headingDeg ?? prev.heading ?? targetHeading;
        let angleDiff = ((targetHeading - currentHeading + 540) % 360) - 180;
        const maxTurnPerTick = 6;
        let smoothHeading = currentHeading;
        if (Math.abs(angleDiff) <= maxTurnPerTick) {
          smoothHeading = targetHeading;
        } else {
          smoothHeading = (currentHeading + Math.sign(angleDiff) * maxTurnPerTick + 360) % 360;
        }
        smoothHeading = Number(smoothHeading.toFixed(1));

        // Compute dynamic per-robot random battery drain
        const { drain: mDrain, drainRate: mRate } = computeBatteryDrain(prev, true);
        const nextBat = Math.max(0, Number((curBat - mDrain).toFixed(2)));

        // Check if arrived at this waypoint
        if (distToTarget <= stepDist + 2) {
          const nextIdx = (safeIdx + 1) % route.length;
          setCurrentWaypointIdx(nextIdx);

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
            position: { x: target.x, y: target.y, headingDeg: smoothHeading },
            coordinates: { x: target.x, y: target.y },
            heading: smoothHeading,
            speed: activeSpeed,
            status: AGV_STATUS.AUTO_LOOP,
            currentMission: `Continuous Looping Path: → ${route[nextIdx]?.label || "Next WP"}`,
            cargo: nextCargo,
            payload: nextPayload,
            targetWaypointIndex: nextIdx,
            fork: nextFork,
            battery: nextBat,
            batteryDrainRate: mRate,
          };
        }

        // Interpolate position forward along corridor
        const angleRad = (targetHeading * Math.PI) / 180;
        const nextX = Number((cx + Math.cos(angleRad) * stepDist).toFixed(2));
        const nextY = Number((cy + Math.sin(angleRad) * stepDist).toFixed(2));

        return {
          ...prev,
          position: { x: nextX, y: nextY, headingDeg: smoothHeading },
          coordinates: { x: nextX, y: nextY },
          heading: smoothHeading,
          speed: activeSpeed,
          status: AGV_STATUS.AUTO_LOOP,
          battery: nextBat,
          batteryDrainRate: mRate,
          fork: nextFork,
        };
      });

      // 3. Autonomous Looping & State Machine Navigation for ALL other robots in fleet
      setOtherAgvs((prev) => {
        if (!prev || prev.length === 0) return prev;
        return prev.map((agv) => {
          let curBat = typeof agv.battery === "number" ? agv.battery : 85;

          // If battery is fully depleted (0%) and vehicle is not currently charging, stay halted at 0%
          if (curBat <= 0 && agv.status !== "Charging") {
            return {
              ...agv,
              battery: 0,
              batteryDrainRate: 0,
              speed: 0.0,
              status: agv.status === "Stopped" ? "Stopped" : "Low Battery",
              currentMission: "Battery Depleted (0%) — Station Charging Required",
            };
          }

          const robotFloor = floors.find((f) => f.id === (agv.floorId || activeFloorId)) || activeFloor;
          const charger = robotFloor?.stations?.find((s) => s.type === "charger") || {
            x: 880,
            y: 140,
            name: "Charger Pad Alpha",
          };

          // --- STATE 1: HARDWARE/SENSOR FAULT & AUTO-FIX WATCHDOG ---
          if (agv.status === "Fault") {
            if (agv.faultInfo && Date.now() >= agv.faultInfo.autoFixAt) {
              const faultAlertId = agv.faultInfo.alertId;
              if (faultAlertId) {
                setAlerts((aPrev) => aPrev.filter((a) => a.id !== faultAlertId));
              }
              addBlackboxLog(
                "INFO",
                `Watchdog auto-resolved fault on ${agv.id}: ${agv.faultInfo.reason}`,
                "Automated diagnostic routine PASSED. Brakes released and autonomous looping restored."
              );
              return {
                ...agv,
                status: AGV_STATUS.AUTO_LOOP,
                speed: agv.cruiseSpeed || 1.2,
                faultInfo: null,
                currentMission: "Continuous Looping Path",
              };
            }
            const { drain: fDrain, drainRate: fRate } = computeBatteryDrain(agv, false);
            const nextBat = Math.max(0, Number((curBat - fDrain).toFixed(2)));
            return { ...agv, speed: 0.0, battery: nextBat, batteryDrainRate: fRate };
          }

          // --- STATE 2: CHARGING AT CHARGER POINT ---
          if (agv.status === "Charging") {
            if (curBat < 100) {
              const chargeSpeed = 0.45 + Math.random() * 0.25;
              const nextBat = Math.min(100, Number((curBat + chargeSpeed).toFixed(2)));
              return {
                ...agv,
                battery: nextBat,
                speed: 0.0,
              };
            } else {
              addBlackboxLog(
                "INFO",
                `${agv.id} reached 100% full charge`,
                "Undocked from charging station and resumed continuous autonomous looping path."
              );
              setAlerts((aPrev) =>
                aPrev.filter((a) => !a.id.includes(`LOWBAT-${agv.id}`))
              );
              // Fresh randomized discharge rate for the new operational cycle
              const newDrainRate = Number((0.009 + Math.random() * 0.017).toFixed(4));
              return {
                ...agv,
                battery: 100,
                batteryDrainRate: newDrainRate,
                status: AGV_STATUS.AUTO_LOOP,
                speed: agv.cruiseSpeed || 1.2,
                currentMission: "Continuous Looping Path",
              };
            }
          }

          // --- STATE 3: LOW BATTERY (<10%) AUTONOMOUS REROUTE ---
          if (
            curBat < 10 &&
            curBat > 0 &&
            agv.status !== "Returning to Charger" &&
            agv.status !== "Stopped" &&
            agv.status !== AGV_STATUS.MANUAL_TELEOP
          ) {
            addBlackboxLog(
              "WARN",
              `Low battery warning for ${agv.id} (${Math.round(curBat)}%)`,
              `Autonomous diversion to ${charger.name} engaged.`
            );
            setAlerts((aPrev) => [
              {
                id: `ALT-LOWBAT-${agv.id}-${Date.now()}`,
                agv: agv.id,
                message: `Low Battery (<10%): ${agv.id} at ${Math.round(curBat)}%. Rerouting to ${charger.name}.`,
                time: "Just now",
                level: "warning",
              },
              ...aPrev.filter((a) => !a.id.startsWith(`ALT-LOWBAT-${agv.id}`)),
            ]);
            return {
              ...agv,
              status: "Returning to Charger",
              speed: agv.cruiseSpeed || 1.1,
              currentMission: `Low Battery (${Math.round(curBat)}%) — Returning to ${charger.name}`,
            };
          }

          // --- STATE 4: RETURNING TO CHARGER NAVIGATION ---
          if (agv.status === "Returning to Charger") {
            const acx = agv.position?.x ?? agv.coordinates?.x ?? 200;
            const acy = agv.position?.y ?? agv.coordinates?.y ?? 300;
            const atx = charger.x;
            const aty = charger.y;
            const adist = Math.hypot(atx - acx, aty - acy);

            // Arrived at charging pad (< 12px)? STOP AND DOCK!
            if (adist <= 12) {
              addBlackboxLog(
                "ACTION",
                `${agv.id} arrived and docked at ${charger.name}`,
                "Vehicle halted (0.0 m/s). Fast charging cycle initiated."
              );
              setAlerts((aPrev) =>
                aPrev.filter((a) => !a.id.includes(`LOWBAT-${agv.id}`))
              );
              return {
                ...agv,
                position: { x: atx, y: aty, headingDeg: agv.position?.headingDeg ?? 0 },
                coordinates: { x: atx, y: aty },
                status: "Charging",
                speed: 0.0,
                currentMission: `Docked at ${charger.name} (Charging)`,
              };
            }

            let aTargetHeading = (Math.atan2(aty - acy, atx - acx) * 180) / Math.PI;
            if (aTargetHeading < 0) aTargetHeading += 360;

            const currentAHeading = agv.position?.headingDeg ?? agv.heading ?? aTargetHeading;
            let aDiff = ((aTargetHeading - currentAHeading + 540) % 360) - 180;
            const aMaxTurn = 6;
            let smoothAHeading = currentAHeading;
            if (Math.abs(aDiff) <= aMaxTurn) {
              smoothAHeading = aTargetHeading;
            } else {
              smoothAHeading = (currentAHeading + Math.sign(aDiff) * aMaxTurn + 360) % 360;
            }
            smoothAHeading = Number((((smoothAHeading % 360) + 360) % 360).toFixed(1));

            const aRetSpeed = agv.cruiseSpeed || 1.1;
            const aStep = aRetSpeed * 1.3;
            const aAngleRad = (aTargetHeading * Math.PI) / 180;
            const anx = Number((acx + Math.cos(aAngleRad) * aStep).toFixed(2));
            const any = Number((acy + Math.sin(aAngleRad) * aStep).toFixed(2));

            // Drains naturally down to 0% while in transit
            const { drain: rDrain, drainRate: rRate } = computeBatteryDrain(agv, true);
            const nextBat = Math.max(0, Number((curBat - rDrain).toFixed(2)));

            if (nextBat <= 0) {
              return {
                ...agv,
                battery: 0,
                batteryDrainRate: 0,
                speed: 0.0,
                status: "Low Battery",
                currentMission: "Battery Depleted (0%) — Station Charging Required",
              };
            }

            return {
              ...agv,
              position: { x: anx, y: any, headingDeg: smoothAHeading },
              coordinates: { x: anx, y: any },
              heading: smoothAHeading,
              speed: aRetSpeed,
              status: "Returning to Charger",
              currentMission: `Low Battery (${Math.round(nextBat)}%) — Returning to ${charger.name}`,
              battery: nextBat,
              batteryDrainRate: rRate,
            };
          }

          // If manual teleop, stopped, or obstacle blocked, position remains frozen but standby drain ticks
          if (
            agv.status === AGV_STATUS.MANUAL_TELEOP ||
            agv.status === "Stopped" ||
            agv.status === AGV_STATUS.BLOCKED ||
            agv.status === "Low Battery"
          ) {
            const { drain: sDrain, drainRate: sRate } = computeBatteryDrain(agv, false);
            const nextBat = Math.max(0, Number((curBat - sDrain).toFixed(2)));
            return {
              ...agv,
              battery: nextBat,
              batteryDrainRate: nextBat <= 0 ? 0 : sRate,
              speed: 0.0,
              status: agv.status === "Stopped" ? "Stopped" : (nextBat <= 0 ? "Low Battery" : agv.status),
              currentMission: nextBat <= 0 ? "Battery Depleted (0%) — Station Charging Required" : agv.currentMission,
            };
          }

          // --- NORMAL AUTO-PILOT WAYPOINT NAVIGATION ---
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

          let aTargetHeading = (Math.atan2(ady, adx) * 180) / Math.PI;
          if (aTargetHeading < 0) aTargetHeading += 360;

          // Smooth heading angular interpolation
          const currentAHeading = agv.position?.headingDeg ?? agv.heading ?? aTargetHeading;
          let aDiff = ((aTargetHeading - currentAHeading + 540) % 360) - 180;
          const aMaxTurn = 6;
          let smoothAHeading = currentAHeading;
          if (Math.abs(aDiff) <= aMaxTurn) {
            smoothAHeading = aTargetHeading;
          } else {
            smoothAHeading = (currentAHeading + Math.sign(aDiff) * aMaxTurn + 360) % 360;
          }
          smoothAHeading = Number(smoothAHeading.toFixed(1));

          const aSpeed = agv.speed || 1.2;
          const aStep = aSpeed * 1.3; // 50ms tick step

          // Compute dynamic per-robot random battery drain
          const { drain: mDrain, drainRate: mRate } = computeBatteryDrain(agv, true);
          const nextBat = Math.max(0, Number((curBat - mDrain).toFixed(2)));

          if (adist <= aStep + 2) {
            const nextIdx = (safeIdx + 1) % route.length;
            return {
              ...agv,
              position: { x: target.x, y: target.y, headingDeg: smoothAHeading },
              coordinates: { x: target.x, y: target.y },
              heading: smoothAHeading,
              speed: aSpeed,
              status: AGV_STATUS.AUTO_LOOP,
              currentMission: `Continuous Looping Path: → ${route[nextIdx]?.label || "Next WP"}`,
              targetWaypointIndex: nextIdx,
              battery: nextBat,
              batteryDrainRate: mRate,
            };
          }

          const aAngleRad = (aTargetHeading * Math.PI) / 180;
          const anx = Number((acx + Math.cos(aAngleRad) * aStep).toFixed(2));
          const any = Number((acy + Math.sin(aAngleRad) * aStep).toFixed(2));

          return {
            ...agv,
            position: { x: anx, y: any, headingDeg: smoothAHeading },
            coordinates: { x: anx, y: any },
            heading: smoothAHeading,
            speed: aSpeed,
            status: AGV_STATUS.AUTO_LOOP,
            battery: nextBat,
            batteryDrainRate: mRate,
          };
        });
      });
    }, 50);

    return () => clearInterval(interval);
  }, [
    isEStopped,
    navigationMode,
    activeRoute,
    currentWaypointIdx,
    simulatedObstacle,
    activeFloor,
    floors,
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
    simulateLowBattery,
    simulateRobotFault,
    fixRobotFault,
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
    generateRandomAlert,
    autoAlertsEnabled,
    setAutoAlertsEnabled,

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
