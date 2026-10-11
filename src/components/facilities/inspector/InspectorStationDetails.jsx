import React from "react";
import { MapPin, Trash2, X } from "lucide-react";

export default function InspectorStationDetails({
  selectedObjectData,
  currentFloor,
  pxToMeters,
  metersToPx,
  handleUpdateSelectedStation,
  handleDeleteSelectedItem,
  onClose,
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-500/15 text-blue-500">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
              Station Inspector
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

      {/* Station Name */}
      <div className="text-xs space-y-1">
        <label className="text-slate-500 dark:text-slate-400 font-bold">
          Station Name
        </label>
        <input
          type="text"
          value={selectedObjectData.name}
          onChange={(e) => handleUpdateSelectedStation("name", e.target.value)}
          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-white font-medium"
        />
      </div>

      {/* Station Type */}
      <div className="text-xs space-y-1">
        <label className="text-slate-500 dark:text-slate-400 font-bold">
          Station Type
        </label>
        <select
          value={selectedObjectData.type}
          onChange={(e) => handleUpdateSelectedStation("type", e.target.value)}
          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-900 dark:text-white font-medium"
        >
          <option value="dock">Docking Bay</option>
          <option value="charger">Fast-Charger Pad</option>
          <option value="rack">Storage Rack</option>
          <option value="elevator">Freight Elevator</option>
        </select>
      </div>

      {/* Position Coordinates (Meters) */}
      <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
        <span className="font-bold text-slate-700 dark:text-slate-300">
          Exact Position (Meters)
        </span>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] text-slate-400 font-bold block mb-1">
              X (m, 0-{currentFloor.widthMeters})
            </label>
            <input
              type="number"
              step="0.5"
              value={pxToMeters(selectedObjectData.x)}
              onChange={(e) =>
                handleUpdateSelectedStation("x", metersToPx(Number(e.target.value)))
              }
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-1.5 font-mono text-slate-900 dark:text-white"
            />
          </div>
          <div>
            <label className="text-[10px] text-slate-400 font-bold block mb-1">
              Y (m, 0-{currentFloor.lengthMeters})
            </label>
            <input
              type="number"
              step="0.5"
              value={pxToMeters(selectedObjectData.y)}
              onChange={(e) =>
                handleUpdateSelectedStation("y", metersToPx(Number(e.target.value)))
              }
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-1.5 font-mono text-slate-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Charger Specific: Power Rating */}
      {selectedObjectData.type === "charger" && (
        <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-900/50 space-y-1.5 text-xs">
          <label className="text-emerald-700 dark:text-emerald-400 font-bold block">
            Charge Power Rating (kW)
          </label>
          <input
            type="number"
            value={selectedObjectData.powerKw || 30}
            onChange={(e) =>
              handleUpdateSelectedStation("powerKw", Number(e.target.value))
            }
            className="w-full bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800 rounded-lg p-1.5 text-slate-900 dark:text-white font-mono"
          />
        </div>
      )}

      {/* Dock Specific: Waiting Cargo */}
      {selectedObjectData.type === "dock" && (
        <div className="p-3 bg-blue-50/60 dark:bg-blue-950/30 rounded-xl border border-blue-200 dark:border-blue-900/50 space-y-2.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-blue-700 dark:text-blue-300">
              Cargo Pallet Status
            </span>
            <button
              type="button"
              onClick={() =>
                handleUpdateSelectedStation("hasPallet", !selectedObjectData.hasPallet)
              }
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                selectedObjectData.hasPallet
                  ? "bg-amber-500 text-white"
                  : "bg-slate-200 dark:bg-slate-700 text-slate-500"
              }`}
            >
              {selectedObjectData.hasPallet ? "Pallet Waiting" : "Bay Empty"}
            </button>
          </div>

          {selectedObjectData.hasPallet && (
            <div className="space-y-1.5 pt-1 border-t border-blue-200/50 dark:border-blue-900/40">
              <div>
                <label className="text-[10px] text-slate-500 dark:text-slate-400 font-bold block">
                  Pallet ID
                </label>
                <input
                  type="text"
                  value={selectedObjectData.palletId || "PLT-101"}
                  onChange={(e) =>
                    handleUpdateSelectedStation("palletId", e.target.value)
                  }
                  className="w-full bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-800 rounded-lg p-1 text-slate-900 dark:text-white font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 dark:text-slate-400 font-bold block">
                  Cargo Weight (kg)
                </label>
                <input
                  type="number"
                  value={selectedObjectData.palletWeightKg || 450}
                  onChange={(e) =>
                    handleUpdateSelectedStation(
                      "palletWeightKg",
                      Number(e.target.value)
                    )
                  }
                  className="w-full bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-800 rounded-lg p-1 text-slate-900 dark:text-white font-mono"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Delete Button */}
      <button
        type="button"
        onClick={handleDeleteSelectedItem}
        className="w-full py-2 bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/50 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
      >
        <Trash2 className="w-3.5 h-3.5" />
        <span>Delete Station</span>
      </button>
    </div>
  );
}
