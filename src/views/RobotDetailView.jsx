import React, { useState } from "react";
import { ArrowLeft, MoreVertical, Pencil, Trash2, MapPin } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import EditRobotModal from "../components/robots/EditRobotModal";
import RobotModelIllustration from "../components/robots/RobotModelIllustration";
import StatusBadge from "../components/common/StatusBadge";
import { useFleet } from "../context/FleetContext";
import { useNavigation } from "../context/NavigationContext";
import { VIEWS } from "../constants";

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
  const onNavigateMap =
    propOnNavigateMap ?? (() => navCtx?.navigateTo(VIEWS.MAP));

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

  if (!agv) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <Bot className="w-12 h-12 text-slate-400 mb-3" />
        <h2 className="text-base font-bold text-slate-800 dark:text-slate-200">
          Robot Not Found
        </h2>
        <p className="text-xs text-slate-500 max-w-sm mt-1 mb-4">
          This AGV has been de-registered or is no longer present in the fleet
          roster.
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
      {/* Top Header with Back to AGVs & Actions */}
      <div className="flex items-center justify-between pb-2">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to AGVs</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="h-8 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm transition-all flex items-center gap-1.5"
          >
            <Pencil className="w-3.5 h-3.5" />
            <span>Edit Specifications</span>
          </button>

          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                <MoreVertical className="w-4 h-4" />
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                align="end"
                sideOffset={5}
                className="min-w-[175px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-1 shadow-xl text-xs font-medium z-50 text-slate-800 dark:text-slate-200 focus:outline-none animate-in fade-in zoom-in-95 duration-100"
              >
                <DropdownMenu.Item
                  onClick={() => setIsEditModalOpen(true)}
                  className="px-3 py-2 rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 outline-none transition-colors flex items-center gap-2 font-semibold text-blue-600 dark:text-blue-400"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  <span>Edit AGV Specs</span>
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  onClick={() => onNavigateMap?.()}
                  className="px-3 py-2 rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 outline-none transition-colors flex items-center gap-2"
                >
                  <MapPin className="w-3.5 h-3.5 text-blue-500" />
                  <span>Locate on Live Map</span>
                </DropdownMenu.Item>

                <DropdownMenu.Separator className="h-px bg-slate-100 dark:bg-slate-800 my-1" />
                <DropdownMenu.Item
                  onClick={() => {
                    fleetCtx?.deleteAgv(agv.id);
                    onBack?.();
                  }}
                  className="px-3 py-2 rounded-lg cursor-pointer text-red-600 hover:bg-red-50 dark:hover:bg-red-500/15 outline-none transition-colors font-semibold flex items-center gap-2"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete AGV</span>
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">
          {agv.id} - {agv.type}
        </h1>
        <StatusBadge status={agvState} />
      </div>

      {/* Main Top Card (Robot Render & Telemetry) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left: 3D Robot Illustration */}
        <div className="lg:col-span-6 flex items-center justify-center p-4">
          <RobotModelIllustration />
        </div>

        {/* Right: Technical Specs & Realtime Telemetry Grid */}
        <div className="lg:col-span-6 space-y-4">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {agv.name}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Robotics Subsystems: Healthy • ROS2 Humble Connected
            </p>
          </div>

          <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-xs">
            {/* Battery Level */}
            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400 font-medium">
                Battery Level
              </span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                {agv.battery}%
              </span>
            </div>

            {/* Current Speed */}
            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400 font-medium">
                Current Speed
              </span>
              <span className="font-bold text-slate-900 dark:text-white">
                {agv.speed?.toFixed(1)} m/s
              </span>
            </div>

            {/* Payload */}
            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400 font-medium">
                Payload
              </span>
              <span className="font-bold text-slate-900 dark:text-white">
                {agv.payload}
              </span>
            </div>

            {/* Facility Level */}
            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400 font-medium">
                Assigned Floor
              </span>
              <span className="font-bold text-slate-900 dark:text-white truncate max-w-[140px] text-right">
                {fleetCtx?.floors?.find((f) => f.id === agv.floorId)?.name ||
                  "Ground Floor"}
              </span>
            </div>

            {/* Location */}
            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400 font-medium">
                Location
              </span>
              <span className="font-bold text-slate-900 dark:text-white">
                {agv.location}
              </span>
            </div>

            {/* Active Loop Path */}
            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400 font-medium">
                Active Loop Path
              </span>
              <span className="font-bold text-cyan-600 dark:text-cyan-400 truncate max-w-[140px] text-right">
                {agv.currentMission || "Floor Looping Path"}
              </span>
            </div>

            {/* Uptime */}
            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400 font-medium">
                Uptime
              </span>
              <span className="font-bold text-slate-900 dark:text-white">
                {agv.uptime}
              </span>
            </div>

            {/* Last Service */}
            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400 font-medium">
                Last Service
              </span>
              <span className="font-bold text-slate-900 dark:text-white">
                {agv.lastService}
              </span>
            </div>
          </div>

          {/* Action Control Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
            <button
              onClick={() => {
                if (agv.floorId && fleetCtx?.setActiveFloorId) {
                  fleetCtx.setActiveFloorId(agv.floorId);
                }
                navCtx?.navigateTo(VIEWS.MAP);
              }}
              className="py-2.5 px-3 rounded-lg border border-blue-500/30 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-500/20 font-semibold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5"
            >
              <span>🗺️ Track on Live Map</span>
            </button>
            <button
              onClick={() => {
                if (agv.floorId && fleetCtx?.setActiveFloorId) {
                  fleetCtx.setActiveFloorId(agv.floorId);
                }
                fleetCtx?.takeManualControl(agv.id);
                navCtx?.selectAgv(agv.id);
                navCtx?.navigateTo(VIEWS.MAP);
              }}
              className="py-2.5 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5"
            >
              <span>🕹️ Drive [WASD]</span>
            </button>
            {agv.status === "Stopped" ? (
              <button
                onClick={() => fleetCtx?.resumeSpecificAgv?.(agv.id)}
                className="py-2.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5"
                title={`Resume autonomous operation for ${agv.id}`}
              >
                <span>▶ Resume Robot</span>
              </button>
            ) : (
              <button
                onClick={() => fleetCtx?.stopSpecificAgv?.(agv.id)}
                className="py-2.5 px-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5"
                title={`Emergency Stop ${agv.id} only (other fleet robots continue running)`}
              >
                <span>🛑 E-Stop</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Split Layout: Live Camera Tabs on Left + Current Position on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Tabs with Live Camera */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-5 space-y-4">
          {/* Tab Navigation */}
          <div className="flex items-center gap-6 border-b border-slate-100 dark:border-slate-800 text-xs font-semibold pb-3">
            <button
              onClick={() => setActiveTab("logs")}
              className={`transition-colors ${
                activeTab === "logs"
                  ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 pb-3 -mb-3"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
              }`}
            >
              Logs
            </button>
            <button
              onClick={() => setActiveTab("camera")}
              className={`flex items-center gap-1.5 transition-colors ${
                activeTab === "camera"
                  ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 pb-3 -mb-3"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
              }`}
            >
              <span>Live Camera</span>
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            </button>
            <button
              onClick={() => setActiveTab("telemetry")}
              className={`transition-colors ${
                activeTab === "telemetry"
                  ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 pb-3 -mb-3"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
              }`}
            >
              Telemetry
            </button>
          </div>

          {/* Camera Canvas */}
          {activeTab === "camera" && (
            <div className="relative w-full h-64 bg-slate-900 dark:bg-slate-950 rounded-xl overflow-hidden flex items-center justify-center border border-slate-200 dark:border-slate-800">
              <div
                className="absolute inset-0 opacity-40"
                style={{
                  backgroundImage: `radial-gradient(circle at center, #202227 0%, #0c0d10 100%)`,
                }}
              />
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `linear-gradient(to right, #38bdf8 1px, transparent 1px), linear-gradient(to bottom, #38bdf8 1px, transparent 1px)`,
                  backgroundSize: "32px 32px",
                }}
              />

              {/* Viewfinder crosshairs */}
              <div className="relative z-10 flex flex-col items-center justify-center">
                <div className="w-16 h-16 border border-white/30 border-dashed rounded-lg flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                </div>
                <div className="text-[11px] font-semibold text-white/80 mt-2">
                  ROS2 Camera 1 • 1080p 60FPS
                </div>
              </div>

              {/* Live overlay tag */}
              <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-600/90 text-white text-[10px] font-bold tracking-wider">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                LIVE
              </div>
            </div>
          )}

          {activeTab === "telemetry" && (
            <div className="space-y-2.5 text-xs py-2">
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg flex justify-between">
                <span className="text-slate-500">Drive Motor RPM</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  1,240 RPM (Normal)
                </span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg flex justify-between">
                <span className="text-slate-500">LiDAR Scan Frequency</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  20.0 Hz (Optimal)
                </span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg flex justify-between">
                <span className="text-slate-500">Battery Core Temperature</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  31.4 °C
                </span>
              </div>
            </div>
          )}

          {activeTab === "logs" && (
            <div className="h-64 overflow-y-auto bg-slate-950 text-slate-300 p-3.5 rounded-xl font-mono text-[11px] space-y-1.5">
              <div>
                [11:32:01] INFO ros2_bridge: Odometry topic /odom publishing at
                50Hz
              </div>
              <div>
                [11:31:45] INFO nav2_planner: Route recalculated via STN-03
                waypoint
              </div>
              <div>
                [11:30:12] WARN lidar_driver: Minor dust deflection on optical
                lens #2
              </div>
              <div>
                [11:28:50] INFO mission_exec: Payload latch engaged [250kg
                verified]
              </div>
              <div>
                [11:25:00] INFO dispatch: Mission M-001 started from Station A
              </div>
            </div>
          )}
        </div>

        {/* Right: Current Position Mini-Map Widget */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                Current Position
              </span>
              <button
                onClick={onNavigateMap}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              >
                View on Map
              </button>
            </div>

            {/* Mini Map Floor Canvas */}
            <div className="w-full h-44 bg-slate-100/90 dark:bg-slate-950 rounded-xl overflow-hidden relative border border-slate-200 dark:border-slate-800 flex items-center justify-center">
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `linear-gradient(to right, #686b76 1px, transparent 1px), linear-gradient(to bottom, #686b76 1px, transparent 1px)`,
                  backgroundSize: "20px 20px",
                }}
              />
              <div className="absolute top-3 left-3 w-16 h-12 border border-blue-500/40 bg-blue-500/10 rounded flex items-center justify-center text-[9px] text-blue-400 font-medium">
                Line 1
              </div>
              <div className="absolute top-3 right-3 w-16 h-12 border border-slate-700 bg-slate-800/40 rounded flex items-center justify-center text-[9px] text-slate-400 font-medium">
                Line 2
              </div>
              <div className="absolute bottom-3 right-3 w-16 h-12 border border-emerald-500/40 bg-emerald-500/10 rounded flex items-center justify-center text-[9px] text-emerald-400 font-medium">
                Packing
              </div>

              {/* Pulsing robot pin */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-4 h-4 rounded-full bg-blue-500 ring-4 ring-blue-500/30 animate-pulse" />
                <span className="text-[10px] font-bold text-white mt-1">
                  {agv.id}
                </span>
              </div>
            </div>

            <div className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-3">
              {agv.location} - Near Station A
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400">
            Hardware interlocks: Active • Watchdog OK
          </div>
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
