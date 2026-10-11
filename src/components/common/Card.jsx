import React from "react";

export default function Card({ children, className = "", title, action }) {
  return (
    <div
      className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-5 transition-colors ${className}`}
    >
      {(title || action) && (
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
          {title && (
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {title}
            </h3>
          )}
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
}
