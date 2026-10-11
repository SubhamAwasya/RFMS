import React from "react";
import {
  MapPin,
  Square,
  ListFilter,
  Plus,
  Trash2,
  X,
} from "lucide-react";

export default function FacilityInspectorDrawer({
  isDrawerOpen,
  selectedObjectData,
  setSelectedItem,
  currentFloor,
  pxToMeters,
  metersToPx,
  handleUpdateSelectedStation,
  handleUpdateSelectedZone,
  handleDeleteSelectedItem,
  showElementsDrawer,
  setShowElementsDrawer,
  setShowManualCoordModal,
  removeStationFromFloor,
  removeRestrictedZoneFromFloor,
}) {
  if (!isDrawerOpen) return null;

  return (
    <div className="w-80 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex flex-col p-4 overflow-y-auto shrink-0 z-20 space-y-4 shadow-xl animate-in slide-in-from-right duration-150">
      {/* CASE A: Station Inspector */}
      {selectedObjectData && selectedObjectData.kind === "station" && (
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
              onClick={() => setSelectedItem(null)}
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
              <option value="dock">📦 Docking Bay (Receiving)</option>
              <option value="charger">⚡ Fast-Charger Pad</option>
              <option value="rack">🏗️ Storage Rack</option>
              <option value="elevator">🛗 Freight Elevator</option>
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
                  min="0"
                  max={currentFloor.widthMeters}
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
                  min="0"
                  max={currentFloor.lengthMeters}
                  value={pxToMeters(selectedObjectData.y)}
                  onChange={(e) =>
                    handleUpdateSelectedStation("y", metersToPx(Number(e.target.value)))
                  }
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-1.5 font-mono text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

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
                      onChange={(e) => handleUpdateSelectedStation("palletId", e.target.value)}
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
                        handleUpdateSelectedStation("palletWeightKg", Number(e.target.value))
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
      )}

      {/* CASE B: Zone Inspector */}
      {selectedObjectData && selectedObjectData.kind === "zone" && (
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
              onClick={() => setSelectedItem(null)}
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
              <option value="receiving">📥 Inbound Receiving Bay</option>
              <option value="assembly">⚙️ Main Assembly Line</option>
              <option value="charging-bay">⚡ Charging Bay Hub</option>
              <option value="storage">🏗️ High-Bay Storage Racks</option>
              <option value="dispatch">🚚 Outbound Dispatch Docks</option>
              <option value="staging">📦 Staging Buffer Area</option>
              <option value="custom-area">🏢 Department / Work Zone</option>
              <option value="no-go">🛑 No-Go (Keep-Out Zone)</option>
              <option value="slow">⚠️ Slow Zone (Speed capped 0.4 m/s)</option>
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
      )}

      {/* CASE C: Floor Elements List (When no item is specifically selected) */}
      {!selectedObjectData && showElementsDrawer && (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <ListFilter className="w-4 h-4 text-blue-500" />
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                Floor Infrastructure
              </h4>
            </div>
            <button
              type="button"
              onClick={() => setShowElementsDrawer(false)}
              className="p-1 rounded text-slate-400 hover:text-slate-900 dark:hover:text-white"
              title="Close Drawer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Placed Stations List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
              <span>Stations ({(currentFloor.stations || []).length})</span>
              <button
                type="button"
                onClick={() => setShowManualCoordModal(true)}
                className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>

            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {(currentFloor.stations || []).length === 0 ? (
                <div className="p-3 text-center text-[11px] text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
                  No stations placed yet
                </div>
              ) : (
                (currentFloor.stations || []).map((s) => (
                  <div
                    key={s.id}
                    onClick={() => setSelectedItem({ type: "station", id: s.id })}
                    className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div className="truncate">
                      <span className="font-bold text-xs text-slate-800 dark:text-slate-200 block truncate">
                        {s.name}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {pxToMeters(s.x)}m, {pxToMeters(s.y)}m • {s.type}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeStationFromFloor(currentFloor.id, s.id);
                      }}
                      className="p-1 text-slate-400 hover:text-red-500 rounded"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Safety Zones List */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
              <span>Operational Areas & Zones ({(currentFloor.restrictedZones || []).length})</span>
            </div>

            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {(currentFloor.restrictedZones || []).length === 0 ? (
                <div className="p-3 text-center text-[11px] text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
                  No areas or zones created yet. Use "Draw Area / Zone" to create one.
                </div>
              ) : (
                (currentFloor.restrictedZones || []).map((z) => (
                  <div
                    key={z.id}
                    onClick={() => setSelectedItem({ type: "zone", id: z.id })}
                    className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 hover:bg-amber-50 dark:hover:bg-amber-950/40 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div className="truncate">
                      <span className="font-bold text-xs text-slate-800 dark:text-slate-200 block truncate">
                        {z.name}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {pxToMeters(z.w)}m × {pxToMeters(z.h)}m • {z.type}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeRestrictedZoneFromFloor(currentFloor.id, z.id);
                      }}
                      className="p-1 text-slate-400 hover:text-red-500 rounded"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
