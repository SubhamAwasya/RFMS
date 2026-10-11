import React from "react";

export default function KpiCard({
  title,
  value,
  subtext,
  icon: Icon,
  badgeText,
  badgeType = "success",
  onClick,
}) {
  return (
    <div
      onClick={onClick}
      className={`p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm transition-all duration-150 flex flex-col justify-between ${
        onClick ? "cursor-pointer hover:border-slate-300 dark:hover:border-slate-700" : ""
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
          {title}
        </span>
        {Icon && (
          <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="mt-2 flex items-baseline justify-between">
        <div className="text-2xl font-bold text-slate-900 dark:text-white">
          {value}
        </div>
        {badgeText && (
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              badgeType === "success"
                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400"
                : badgeType === "danger"
                ? "bg-red-50 text-red-700 dark:bg-red-500/15 dark:text-red-400"
                : badgeType === "warning"
                ? "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400"
                : "bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400"
            }`}
          >
            {badgeText}
          </span>
        )}
      </div>

      {subtext && (
        <div className="text-xs text-slate-400 dark:text-slate-500 mt-1">
          {subtext}
        </div>
      )}
    </div>
  );
}
