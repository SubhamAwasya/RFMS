import React, { useEffect } from "react";
import { Zap, Play } from "lucide-react";
import SidePanelHeader from "./sidepanel/SidePanelHeader";
import SidePanelModeToggle from "./sidepanel/SidePanelModeToggle";
import SidePanelTelemetry from "./sidepanel/SidePanelTelemetry";
import SidePanelDPad from "./sidepanel/SidePanelDPad";
import SidePanelSimulation from "./sidepanel/SidePanelSimulation";
import { useFleet } from "../../context/FleetContext";
import { getRobotColorTheme, AGV_STATUS } from "../../constants";

export default function AgvControlSidePanel({ agv, onClose, onSelectAgv }) {
  const fleetCtx = useFleet();
  if (!agv) return null;

  const theme = getRobotColorTheme(agv.id);

  const isManualMode =
    agv.status === AGV_STATUS.MANUAL_TELEOP || agv.status === "Manual Teleop";
  const isAutoMode =
    agv.status === AGV_STATUS.AUTO_LOOP ||
    agv.status === "Auto-Pilot (Looping)" ||
    agv.status === "In Mission";

  // Active speed to display
  const activeSpeed = typeof agv.speed === "number" ? agv.speed : 1.2;
  const targetSpeed = agv.cruiseSpeed || (activeSpeed > 0 ? activeSpeed : 1.2);

  // Keyboard navigation listener while side panel is focused/open
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        e.target.tagName === "INPUT" ||
        e.target.tagName === "TEXTAREA" ||
        e.target.tagName === "SELECT"
      ) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case "w":
        case "arrowup":
          e.preventDefault();
          fleetCtx?.manualDrive?.("FORWARD", agv.id);
          break;
        case "s":
        case "arrowdown":
          e.preventDefault();
          fleetCtx?.manualDrive?.("REVERSE", agv.id);
          break;
        case "a":
        case "arrowleft":
          e.preventDefault();
          fleetCtx?.manualDrive?.("LEFT", agv.id);
          break;
        case "d":
        case "arrowright":
          e.preventDefault();
          fleetCtx?.manualDrive?.("RIGHT", agv.id);
          break;
        case " ":
          e.preventDefault();
          fleetCtx?.stopAndManual?.(agv.id);
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [fleetCtx, agv.id]);

  const frontDist = agv.proximityRadar?.frontDistMeters ?? 4.8;
  const isDangerRadar = frontDist < 1.0;
  const isWarnRadar = frontDist >= 1.0 && frontDist < 3.0;

  // Handle mode toggle directly for this robot
  const handleToggleMode = (mode) => {
    if (mode === "AUTO") {
      fleetCtx?.handBackToAutopilot?.(agv.id);
    } else {
      fleetCtx?.stopAndManual?.(agv.id);
    }
  };

  const handleSpeedChange = (newSpeed) => {
    fleetCtx?.setAgvSpeed?.(agv.id, newSpeed);
  };

  return (
    <aside
      className="w-84 sm:w-96 max-w-[88vw] h-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-l border-slate-200 dark:border-slate-800 flex flex-col z-30 shadow-2xl transition-all duration-200 shrink-0 select-none overflow-hidden"
      onMouseDown={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
    >
      {/* 1. Panel Header */}
      <SidePanelHeader agv={agv} theme={theme} onClose={onClose} />

      {/* 2. Scrollable Body Content */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5 text-xs">
        {/* Navigation Mode Toggle */}
        <SidePanelModeToggle
          isAutoMode={isAutoMode}
          isManualMode={isManualMode}
          onToggleMode={handleToggleMode}
        />

        {/* Live Telemetry & Proximity Radar */}
        <SidePanelTelemetry
          agv={agv}
          theme={theme}
          activeSpeed={activeSpeed}
          frontDist={frontDist}
          isDangerRadar={isDangerRadar}
          isWarnRadar={isWarnRadar}
        />

        {/* Remote D-Pad Steering & Cruise Speed */}
        <SidePanelDPad
          agv={agv}
          targetSpeed={targetSpeed}
          onManualDrive={(dir, id) => fleetCtx?.manualDrive?.(dir, id)}
          onStopAndManual={(id) => fleetCtx?.stopAndManual?.(id)}
          onSpeedChange={handleSpeedChange}
        />

        {/* State Machine Simulation */}
        <SidePanelSimulation agv={agv} fleetCtx={fleetCtx} />
      </div>

      {/* 3. Footer Quick Actions */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 space-y-2 shrink-0 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => fleetCtx?.sendToCharger?.(agv.id)}
            className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            title="Send robot to nearest charging pad"
          >
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>To Charger</span>
          </button>
          <button
            type="button"
            onClick={() => fleetCtx?.handBackToAutopilot?.(agv.id)}
            className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
            title="Resume autonomous looping path and route operations"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Resume Route</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
