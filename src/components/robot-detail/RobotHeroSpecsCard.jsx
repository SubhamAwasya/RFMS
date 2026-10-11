import React from "react";
import RobotModelIllustration from "../robots/RobotModelIllustration";

export default function RobotHeroSpecsCard({
  agv,
  theme,
  assignedFloor,
  closestWaypoint,
  onTrackOnMap,
  onResumeRobot,
  onStopRobot,
}) {
  if (!agv) return null;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
      {/* Left: Dynamic 3D/Vector Robot Illustration based on Type */}
      <div className="lg:col-span-6 flex items-center justify-center p-4">
        <RobotModelIllustration
          type={agv.type}
          color={theme?.hex || "#06b6d4"}
          status={agv.status}
          name={agv.name}
          cargo={agv.cargo}
        />
      </div>

      {/* Right: Technical Specs & Realtime Telemetry Grid */}
      <div className="lg:col-span-6 space-y-4">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            {agv.name}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            ROS2 Connected • Operational Telemetry
          </p>
        </div>

        <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-xs">
          {/* Battery Level */}
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400 font-medium">
              Battery Level
            </span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">
              {typeof agv.battery === "number" ? agv.battery.toFixed(1) : 100}%
            </span>
          </div>

          {/* Live Discharge / Charge Rate */}
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400 font-medium">
              Power Draw / Discharge
            </span>
            <span className="font-semibold text-xs font-mono text-amber-500 dark:text-amber-400">
              {agv.status === "Charging"
                ? "⚡ Charging (+11.0%/s)"
                : `-${((agv.batteryDrainRate || 0.014) * 20).toFixed(2)}%/s (Dynamic)`}
            </span>
          </div>

          {/* Current Speed */}
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400 font-medium">
              Current Speed
            </span>
            <span className="font-bold text-slate-900 dark:text-white">
              {typeof agv.speed === "number" ? agv.speed.toFixed(1) : "1.2"} m/s
            </span>
          </div>

          {/* Payload */}
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400 font-medium">
              Payload
            </span>
            <span className="font-bold text-slate-900 dark:text-white">
              {agv.cargo
                ? `${agv.cargo.palletId} (${agv.cargo.weightKg}kg)`
                : agv.payload || "0 kg"}
            </span>
          </div>

          {/* Facility Level */}
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400 font-medium">
              Assigned Floor
            </span>
            <span className="font-bold text-slate-900 dark:text-white truncate max-w-[140px] text-right">
              {assignedFloor?.name || "Ground Floor"}
            </span>
          </div>

          {/* Location */}
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400 font-medium">
              Location
            </span>
            <span className="font-bold text-slate-900 dark:text-white truncate max-w-[140px] text-right">
              {closestWaypoint
                ? `Near ${closestWaypoint.label}`
                : agv.location || "North Corridor"}
            </span>
          </div>

          {/* Active Loop Path */}
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400 font-medium">
              Active Loop Path
            </span>
            <span className="font-bold text-cyan-600 dark:text-cyan-400 truncate max-w-[140px] text-right">
              {agv.currentMission || "Continuous Looping Path"}
            </span>
          </div>

          {/* Uptime */}
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400 font-medium">
              Uptime
            </span>
            <span className="font-bold text-slate-900 dark:text-white">
              {agv.uptime || "2h 45m"}
            </span>
          </div>

          {/* Last Service */}
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400 font-medium">
              Last Service
            </span>
            <span className="font-bold text-slate-900 dark:text-white">
              {agv.lastService || "10 Oct 2026"}
            </span>
          </div>
        </div>

        {/* Action Control Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
          <button
            onClick={() => onTrackOnMap(false)}
            className="py-2.5 px-3 rounded-lg border border-blue-500/30 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-500/20 font-semibold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Track on Live Map</span>
          </button>
          <button
            onClick={() => onTrackOnMap(true)}
            className="py-2.5 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Drive [WASD]</span>
          </button>
          {agv.status === "Stopped" ? (
            <button
              onClick={onResumeRobot}
              className="py-2.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              title={`Resume operation for ${agv.id}`}
            >
              <span>Resume Robot</span>
            </button>
          ) : (
            <button
              onClick={onStopRobot}
              className="py-2.5 px-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              title={`Stop ${agv.id}`}
            >
              <span>E-Stop</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
