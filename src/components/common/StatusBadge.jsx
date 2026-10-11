import React from "react";

export default function StatusBadge({ status, type = "agv", size = "sm" }) {
  const getBadgeStyle = () => {
    switch (status) {
      // AGV Statuses
      case "Auto-Pilot (Looping)":
      case "In Mission":
      case "In Progress":
        return "bg-cyan-50 text-cyan-700 border-cyan-300 dark:bg-cyan-500/15 dark:text-cyan-400 dark:border-cyan-500/30";
      case "Manual Teleop":
        return "bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-500/15 dark:text-amber-400 dark:border-amber-500/30";
      case "Charging":
        return "bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-500/15 dark:text-amber-400 dark:border-amber-500/30";
      case "Idle":
      case "Waiting":
        return "bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700";
      case "Stopped":
      case "Failed":
      case "Critical":
        return "bg-red-50 text-red-700 border-red-300 dark:bg-red-500/15 dark:text-red-400 dark:border-red-500/30";
      case "Completed":
        return "bg-blue-50 text-blue-700 border-blue-300 dark:bg-blue-500/15 dark:text-blue-400 dark:border-blue-500/30";
      case "Queued":
      case "Scheduled":
        return "bg-purple-50 text-purple-700 border-purple-300 dark:bg-purple-500/15 dark:text-purple-400 dark:border-purple-500/30";
      // Priority
      case "High":
        return "bg-red-50 text-red-700 border-red-300 dark:bg-red-500/15 dark:text-red-400 dark:border-red-500/30";
      case "Medium":
        return "bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-500/15 dark:text-amber-400 dark:border-amber-500/30";
      case "Low":
        return "bg-blue-50 text-blue-700 border-blue-300 dark:bg-blue-500/15 dark:text-blue-400 dark:border-blue-500/30";
      default:
        return "bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700";
    }
  };

  const sizeClasses =
    size === "xs"
      ? "text-[10px] px-2 py-0.5"
      : size === "md"
      ? "text-xs px-3 py-1"
      : "text-[11px] px-2.5 py-0.5";

  return (
    <span
      className={`inline-flex items-center gap-1 font-semibold rounded-full border ${sizeClasses} ${getBadgeStyle()}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-75" />
      <span>{status}</span>
    </span>
  );
}
