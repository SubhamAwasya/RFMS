import React from "react";
import { X } from "lucide-react";

export default function NewAreaModal({
  isOpen,
  onClose,
  newAreaName,
  setNewAreaName,
  newAreaType,
  setNewAreaType,
  newAreaWidthMeter,
  setNewAreaWidthMeter,
  newAreaLengthMeter,
  setNewAreaLengthMeter,
  newAreaXMeter,
  setNewAreaXMeter,
  newAreaYMeter,
  setNewAreaYMeter,
  onCreateArea,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <h4 className="text-base font-bold text-slate-900 dark:text-white">
            Create Facility Area / Zone
          </h4>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-900 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={onCreateArea} className="space-y-4 mt-4 text-xs">
          <div>
            <label className="block text-slate-500 dark:text-slate-400 font-bold mb-1">
              Area / Zone Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Inbound Receiving Bay"
              value={newAreaName}
              onChange={(e) => setNewAreaName(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-white font-medium"
            />
          </div>

          <div>
            <label className="block text-slate-500 dark:text-slate-400 font-bold mb-1">
              Area Classification / Purpose
            </label>
            <select
              value={newAreaType}
              onChange={(e) => setNewAreaType(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-white font-medium cursor-pointer"
            >
              <option value="receiving">Inbound Receiving Bay</option>
              <option value="assembly">Main Assembly Line</option>
              <option value="charging-bay">Charging Bay Hub</option>
              <option value="storage">High-Bay Storage Racks</option>
              <option value="dispatch">Outbound Dispatch Docks</option>
              <option value="staging">Staging Buffer Area</option>
              <option value="custom-area">Work / Operational Zone</option>
              <option value="no-go">No-Go (Keep-Out Zone)</option>
              <option value="slow">Slow Zone (0.4 m/s limit)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-500 dark:text-slate-400 font-bold mb-1">
                Width (Meters)
              </label>
              <input
                type="number"
                min="3"
                max="100"
                step="1"
                required
                value={newAreaWidthMeter}
                onChange={(e) => setNewAreaWidthMeter(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-500 dark:text-slate-400 font-bold mb-1">
                Length / Height (Meters)
              </label>
              <input
                type="number"
                min="3"
                max="100"
                step="1"
                required
                value={newAreaLengthMeter}
                onChange={(e) => setNewAreaLengthMeter(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-white font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-500 dark:text-slate-400 font-bold mb-1">
                Origin X (Meters from left)
              </label>
              <input
                type="number"
                min="0"
                max="90"
                step="1"
                required
                value={newAreaXMeter}
                onChange={(e) => setNewAreaXMeter(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-500 dark:text-slate-400 font-bold mb-1">
                Origin Y (Meters from top)
              </label>
              <input
                type="number"
                min="0"
                max="60"
                step="1"
                required
                value={newAreaYMeter}
                onChange={(e) => setNewAreaYMeter(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-white font-mono"
              />
            </div>
          </div>

          <div className="text-[11px] text-slate-400 bg-slate-50 dark:bg-slate-800/60 p-2 rounded-lg flex justify-between font-mono">
            <span>Calculated Footprint:</span>
            <span className="font-bold text-slate-700 dark:text-slate-200">
              {(Number(newAreaWidthMeter) * Number(newAreaLengthMeter)).toLocaleString()} m²
            </span>
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
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors"
            >
              Create Area
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
