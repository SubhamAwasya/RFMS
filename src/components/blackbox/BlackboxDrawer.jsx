import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import {
  FileText,
  X,
  AlertTriangle,
  Info,
  CheckCircle2,
  AlertOctagon,
  Download,
  Trash2,
} from "lucide-react";
import { useFleet } from "../../context/FleetContext";

export default function BlackboxDrawer() {
  const { blackboxLogs, blackboxOpen, setBlackboxOpen } = useFleet();
  const [filter, setFilter] = useState("ALL");

  if (!blackboxOpen) return null;

  const filteredLogs = blackboxLogs.filter((log) => {
    if (filter === "ALL") return true;
    return log.type === filter;
  });

  const handleExportLogs = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(blackboxLogs, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `rfms-blackbox-log-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <Dialog.Root open={blackboxOpen} onOpenChange={setBlackboxOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 animate-in fade-in" />
        <Dialog.Content className="fixed right-0 top-0 bottom-0 w-full sm:w-[480px] bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl p-5 flex flex-col z-50 focus:outline-none text-slate-900 dark:text-slate-100 animate-in slide-in-from-right">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <Dialog.Title className="text-base font-bold text-slate-900 dark:text-white">
                  Blackbox Audit Trail
                </Dialog.Title>
                <Dialog.Description className="text-xs text-slate-500 dark:text-slate-400">
                  Real-time event logging & safety flight recorder for FL-01
                </Dialog.Description>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handleExportLogs}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Export JSON"
              >
                <Download className="w-4 h-4" />
              </button>
              <Dialog.Close asChild>
                <button
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </Dialog.Close>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex items-center gap-1 py-3 border-b border-slate-100 dark:border-slate-800 overflow-x-auto">
            {["ALL", "ACTION", "INFO", "WARN", "CRITICAL"].map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-2.5 py-1 text-xs rounded-lg font-semibold transition-colors ${
                  filter === type
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Log Stream */}
          <div className="flex-1 overflow-y-auto py-3 space-y-2.5 text-xs font-mono">
            {filteredLogs.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-xs">
                No logs recorded for this category
              </div>
            ) : (
              filteredLogs.map((log) => {
                const isCrit = log.type === "CRITICAL";
                const isWarn = log.type === "WARN";
                const isAction = log.type === "ACTION";

                return (
                  <div
                    key={log.id}
                    className={`p-3 rounded-xl border transition-all ${
                      isCrit
                        ? "bg-red-50/70 dark:bg-red-950/20 border-red-200 dark:border-red-900/40 text-red-900 dark:text-red-200"
                        : isWarn
                        ? "bg-amber-50/70 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/40 text-amber-900 dark:text-amber-200"
                        : isAction
                        ? "bg-blue-50/70 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/40 text-blue-900 dark:text-blue-200"
                        : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200"
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] font-bold mb-1">
                      <div className="flex items-center gap-1.5">
                        {isCrit && <AlertOctagon className="w-3.5 h-3.5 text-red-500" />}
                        {isWarn && <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />}
                        {isAction && <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />}
                        {!isCrit && !isWarn && !isAction && (
                          <Info className="w-3.5 h-3.5 text-slate-400" />
                        )}
                        <span className="uppercase">{log.type}</span>
                      </div>
                      <span className="text-slate-400 font-normal">{log.timestamp}</span>
                    </div>

                    <div className="font-semibold text-slate-900 dark:text-white">
                      {log.message}
                    </div>

                    {log.details && (
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-sans">
                        {log.details}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
