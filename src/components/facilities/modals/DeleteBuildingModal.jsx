import React from "react";
import { Trash2 } from "lucide-react";

export default function DeleteBuildingModal({
  isOpen,
  onClose,
  selectedBuilding,
  onDeleteBuilding,
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
              Delete Building?
            </h4>
            <p className="text-xs text-slate-400">
              {selectedBuilding?.name}
            </p>
          </div>
        </div>
        <div className="py-4 text-xs text-slate-600 dark:text-slate-300 space-y-2">
          <p>
            Are you sure you want to delete <strong>{selectedBuilding?.name}</strong>?
          </p>
          <p className="text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 p-2.5 rounded-lg border border-amber-200 dark:border-amber-900/40">
            All floor levels, blueprints, stations, and safety zones belonging to this building will also be deleted.
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
            onClick={onDeleteBuilding}
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold text-xs transition-colors"
          >
            Delete Building
          </button>
        </div>
      </div>
    </div>
  );
}
