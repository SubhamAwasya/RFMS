import React from "react";
import { PlusCircle } from "lucide-react";

export default function RobotLogsPanel({
  logs,
  onGenerateLog,
  onClearLogs,
}) {
  return (
    <div className="space-y-3">
      {/* Action buttons inside log tab */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Real-time ROS2 Humble log output
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onGenerateLog}
            className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-medium transition-colors flex items-center gap-1 cursor-pointer"
            title="Generate random telemetry log immediately"
          >
            <PlusCircle className="w-3 h-3 text-blue-500" />
            <span>Add Log</span>
          </button>
          <button
            type="button"
            onClick={onClearLogs}
            className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 text-[11px] font-medium transition-colors cursor-pointer"
            title="Clear log console"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Terminal Output Console */}
      <div className="h-64 overflow-y-auto bg-slate-950 text-slate-300 p-3.5 rounded-xl font-mono text-[11px] space-y-2 border border-slate-800/80">
        {logs.map((log) => (
          <div key={log.id} className="flex items-start gap-2 leading-relaxed">
            <span className="text-slate-500 shrink-0 font-mono">[{log.time}]</span>
            <span
              className={`px-1 rounded text-[9.5px] font-bold shrink-0 ${
                log.level === "ERROR"
                  ? "bg-red-500/20 text-red-400 border border-red-500/30"
                  : log.level === "WARN"
                  ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                  : log.level === "DEBUG"
                  ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                  : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
              }`}
            >
              {log.level}
            </span>
            <span className="text-slate-400 font-bold shrink-0">{log.node}:</span>
            <span className="text-slate-200 flex-1">{log.msg}</span>
          </div>
        ))}
        {logs.length === 0 && (
          <div className="text-slate-500 text-center py-12">
            Console cleared. Waiting for next automated ROS2 log event...
          </div>
        )}
      </div>
    </div>
  );
}
