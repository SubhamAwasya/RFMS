import React from "react";
import { X } from "lucide-react";

export default function NewFloorModal({
  isOpen,
  onClose,
  selectedBuilding,
  newFloorName,
  setNewFloorName,
  newFloorWidth,
  setNewFloorWidth,
  newFloorLength,
  setNewFloorLength,
  onCreateFloor,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <h4 className="text-base font-bold text-slate-900 dark:text-white">
            Add Floor to {selectedBuilding?.name}
          </h4>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-900 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={onCreateFloor} className="space-y-4 mt-4 text-xs">
          <div>
            <label className="block text-slate-500 dark:text-slate-400 font-bold mb-1">
              Floor Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Floor 1 - High-Bay Staging"
              value={newFloorName}
              onChange={(e) => setNewFloorName(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-white"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-500 dark:text-slate-400 font-bold mb-1">
                Width (Meters)
              </label>
              <input
                type="number"
                value={newFloorWidth}
                onChange={(e) => setNewFloorWidth(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-slate-500 dark:text-slate-400 font-bold mb-1">
                Length (Meters)
              </label>
              <input
                type="number"
                value={newFloorLength}
                onChange={(e) => setNewFloorLength(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-white"
              />
            </div>
          </div>
          <div className="text-[11px] text-slate-400">
            Usable Area Calculated: {(newFloorWidth * newFloorLength).toLocaleString()} m²
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-semibold"
            >
              Add Floor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
