import React from "react";
import { Target, X } from "lucide-react";

export default function ManualCoordinatesModal({
  isOpen,
  onClose,
  manualStnName,
  setManualStnName,
  manualStnType,
  setManualStnType,
  manualXMeter,
  setManualXMeter,
  manualYMeter,
  setManualYMeter,
  currentFloor,
  onManualDropStation,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-500" />
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              Place Station by Coordinates
            </h4>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-900 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={onManualDropStation} className="space-y-4 mt-4 text-xs">
          <div>
            <label className="block text-slate-500 dark:text-slate-400 font-bold mb-1">
              Station Name
            </label>
            <input
              type="text"
              placeholder="e.g. Charging Dock 02"
              value={manualStnName}
              onChange={(e) => setManualStnName(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-slate-500 dark:text-slate-400 font-bold mb-1">
              Station Type
            </label>
            <select
              value={manualStnType}
              onChange={(e) => setManualStnType(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-white"
            >
              <option value="dock">Docking Bay</option>
              <option value="charger">Fast-Charger Pad</option>
              <option value="rack">Storage Rack</option>
              <option value="elevator">Freight Elevator</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-500 dark:text-slate-400 font-bold mb-1">
                X (Meters, 0-{currentFloor?.widthMeters || 100})
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                max={currentFloor?.widthMeters || 100}
                value={manualXMeter}
                onChange={(e) => setManualXMeter(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 font-mono text-slate-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-slate-500 dark:text-slate-400 font-bold mb-1">
                Y (Meters, 0-{currentFloor?.lengthMeters || 65})
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                max={currentFloor?.lengthMeters || 65}
                value={manualYMeter}
                onChange={(e) => setManualYMeter(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 font-mono text-slate-900 dark:text-white"
              />
            </div>
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
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors"
            >
              Place Station
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
