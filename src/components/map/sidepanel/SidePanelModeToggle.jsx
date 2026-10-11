import React from "react";
import { Repeat, Radio } from "lucide-react";

export default function SidePanelModeToggle({
  isAutoMode,
  isManualMode,
  onToggleMode,
}) {
  return (
    <div className="bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-1">
      <button
        type="button"
        onClick={() => onToggleMode("AUTO")}
        className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
          isAutoMode
            ? "bg-cyan-500 text-white shadow-xs"
            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
        }`}
      >
        <Repeat className="w-3.5 h-3.5" />
        <span>Auto-Pilot (Loop)</span>
      </button>
      <button
        type="button"
        onClick={() => onToggleMode("MANUAL")}
        className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
          isManualMode
            ? "bg-amber-500 text-white shadow-xs"
            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
        }`}
      >
        <Radio className="w-3.5 h-3.5" />
        <span>Manual Drive</span>
      </button>
    </div>
  );
}
