import React from "react";

export default function RobotModelIllustration() {
  return (
    <div className="w-full max-w-sm relative">
      <svg viewBox="0 0 300 220" className="w-full h-auto drop-shadow-2xl">
        {/* Shadow */}
        <ellipse cx="150" cy="195" rx="120" ry="20" fill="rgba(0,0,0,0.12)" />

        {/* Lower Wheels & Chassis */}
        <rect
          x="50"
          y="155"
          width="200"
          height="35"
          rx="10"
          className="fill-slate-800 dark:fill-slate-950 stroke-slate-700 dark:stroke-slate-800"
          strokeWidth="2"
        />
        <rect x="70" y="180" width="35" height="15" rx="5" fill="#1e293b" />
        <rect x="195" y="180" width="35" height="15" rx="5" fill="#1e293b" />

        {/* Mid Body (Matte Industrial Gray) */}
        <rect
          x="60"
          y="100"
          width="180"
          height="60"
          rx="12"
          className="fill-slate-200 dark:fill-slate-800 stroke-slate-300 dark:stroke-slate-700"
          strokeWidth="2"
        />

        {/* High-tech Accent Stripe (Blue LED glow) */}
        <rect
          x="75"
          y="125"
          width="150"
          height="8"
          rx="4"
          fill="#3b82f6"
          className="animate-pulse"
        />

        {/* Payload Deck Top Plate */}
        <rect
          x="45"
          y="85"
          width="210"
          height="18"
          rx="5"
          className="fill-slate-300 dark:fill-slate-700 stroke-slate-400 dark:stroke-slate-600"
          strokeWidth="1.5"
        />

        {/* Top Dome & LiDAR Sensor Tower */}
        <rect
          x="130"
          y="55"
          width="40"
          height="30"
          rx="6"
          className="fill-slate-800 dark:fill-slate-900 stroke-slate-700"
          strokeWidth="2"
        />
        <circle cx="150" cy="50" r="14" fill="#0f172a" />
        <circle cx="150" cy="50" r="7" fill="#38bdf8" />

        {/* Status Warning Ring indicator */}
        <circle
          cx="150"
          cy="50"
          r="18"
          fill="none"
          stroke="#38bdf8"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />
      </svg>
    </div>
  );
}
