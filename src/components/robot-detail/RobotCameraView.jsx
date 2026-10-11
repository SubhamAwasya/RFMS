import React from "react";

export default function RobotCameraView({ theme }) {
  return (
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
          <div
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: theme?.hex || "#06b6d4" }}
          />
        </div>
        <div className="text-[11px] font-semibold text-white/80 mt-2">
          ROS2 Camera 1 • 1080p 60FPS • Optical Tracking Active
        </div>
      </div>

      {/* Live overlay tag */}
      <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-600/90 text-white text-[10px] font-bold tracking-wider">
        <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
        LIVE STREAM
      </div>
    </div>
  );
}
