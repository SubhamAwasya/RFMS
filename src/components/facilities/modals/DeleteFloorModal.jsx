import React from "react";
import { Trash2 } from "lucide-react";

export default function DeleteFloorModal({
  isOpen,
  onClose,
  currentFloor,
  onDeleteFloor,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-950/50 flex items-center justify-center text-red-600 dark:text-red-400 shrink-0">
            <Trash2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              Delete Floor Level?
            </h4>
            <p className="text-xs text-slate-400">
              {currentFloor?.name}
            </p>
          </div>
        </div>
        <div className="py-4 text-xs text-slate-600 dark:text-slate-300 space-y-2">
          <p>
            Are you sure you want to delete <strong>{currentFloor?.name}</strong>?
          </p>
          <p className="text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 p-2.5 rounded-lg border border-red-200 dark:border-red-900/40">
            This will permanently delete this floor CAD blueprint, all {(currentFloor?.stations || []).length} stations, and {(currentFloor?.restrictedZones || []).length} safety zones.
          </p>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold text-xs"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onDeleteFloor}
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold text-xs transition-colors"
          >
            Delete Floor
          </button>
        </div>
      </div>
    </div>
  );
}
