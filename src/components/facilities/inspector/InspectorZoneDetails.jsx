import React from "react";
import { Square, Trash2, X } from "lucide-react";

export default function InspectorZoneDetails({
  selectedObjectData,
  pxToMeters,
  metersToPx,
  handleUpdateSelectedZone,
  handleDeleteSelectedItem,
  onClose,
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-500/15 text-amber-500">
            <Square className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
              Zone Inspector
            </h4>
            <span className="text-[10px] text-slate-400 font-mono">
              ID: {selectedObjectData.id}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded text-slate-400 hover:text-slate-900 dark:hover:text-white"
          title="Close Inspector"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Zone Name */}
      <div className="text-xs space-y-1">
        <label className="text-slate-500 dark:text-slate-400 font-bold">
          Zone Name
        </label>
        <input
          type="text"
          value={selectedObjectData.name}
          onChange={(e) => handleUpdateSelectedZone("name", e.target.value)}
          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-white font-medium"
        />
      </div>

      {/* Zone Classification */}
      <div className="text-xs space-y-1">
        <label className="text-slate-500 dark:text-slate-400 font-bold">
          Zone Type
        </label>
        <select
          value={selectedObjectData.type}
          onChange={(e) => handleUpdateSelectedZone("type", e.target.value)}
          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-white font-medium"
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

      {/* Exact Bounding Dimensions (Meters) */}
      <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
        <span className="font-bold text-slate-700 dark:text-slate-300">
          Exact Bounding Box (Meters)
        </span>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] text-slate-400 font-bold block mb-1">
              Origin X (m)
            </label>
            <input
              type="number"
              step="0.5"
              value={pxToMeters(selectedObjectData.x)}
              onChange={(e) =>
                handleUpdateSelectedZone("x", metersToPx(Number(e.target.value)))
              }
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-1.5 font-mono text-slate-900 dark:text-white"
            />
          </div>
          <div>
            <label className="text-[10px] text-slate-400 font-bold block mb-1">
              Origin Y (m)
            </label>
            <input
              type="number"
              step="0.5"
              value={pxToMeters(selectedObjectData.y)}
              onChange={(e) =>
                handleUpdateSelectedZone("y", metersToPx(Number(e.target.value)))
              }
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-1.5 font-mono text-slate-900 dark:text-white"
            />
          </div>
          <div>
            <label className="text-[10px] text-slate-400 font-bold block mb-1">
              Width (m)
            </label>
            <input
              type="number"
              step="0.5"
              value={pxToMeters(selectedObjectData.w)}
              onChange={(e) =>
                handleUpdateSelectedZone("w", metersToPx(Number(e.target.value)))
              }
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-1.5 font-mono text-slate-900 dark:text-white"
            />
          </div>
          <div>
            <label className="text-[10px] text-slate-400 font-bold block mb-1">
              Height (m)
            </label>
            <input
              type="number"
              step="0.5"
              value={pxToMeters(selectedObjectData.h)}
              onChange={(e) =>
                handleUpdateSelectedZone("h", metersToPx(Number(e.target.value)))
              }
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-1.5 font-mono text-slate-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Delete Button */}
      <button
        type="button"
        onClick={handleDeleteSelectedItem}
        className="w-full py-2 bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/50 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
      >
        <Trash2 className="w-3.5 h-3.5" />
        <span>Delete Safety Zone</span>
      </button>
    </div>
  );
}
