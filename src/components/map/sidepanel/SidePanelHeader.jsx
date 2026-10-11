import React from "react";
import { X } from "lucide-react";

export default function SidePanelHeader({ agv, theme, onClose }) {
  if (!agv) return null;

  return (
    <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-2.5 min-w-0">
        <span
          className="w-3 h-3 rounded-full animate-pulse shrink-0 ring-4"
          style={{
            backgroundColor: theme?.hex || "#06b6d4",
            boxShadow: `0 0 10px ${theme?.hex || "#06b6d4"}`,
          }}
        />
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span
              className="font-bold font-mono text-sm"
              style={{ color: theme?.hex || "#06b6d4" }}
            >
              {agv.id}
            </span>
            <span className="text-xs text-slate-700 dark:text-slate-300 font-semibold truncate">
              {agv.name}
            </span>
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
            {agv.type || "Industrial AGV"}
          </p>
        </div>
      </div>

      <button
        onClick={onClose}
        className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
        title="Deselect robot (preserves current operating state)"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
