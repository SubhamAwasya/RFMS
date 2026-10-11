import React from "react";
import { Target, X, Info } from "lucide-react";

export default function FacilityModals({
  // Manual Coordinates Station Modal
  showManualCoordModal,
  setShowManualCoordModal,
  manualStnName,
  setManualStnName,
  manualStnType,
  setManualStnType,
  manualXMeter,
  setManualXMeter,
  manualYMeter,
  setManualYMeter,
  onManualDropStation,

  // Floor Specs Modal
  showFloorSpecsModal,
  setShowFloorSpecsModal,
  currentFloor,
  selectedBuilding,

  // New Building Modal
  showNewBuildingModal,
  setShowNewBuildingModal,
  newBldgName,
  setNewBldgName,
  newBldgCode,
  setNewBldgCode,
  newBldgAddress,
  setNewBldgAddress,
  onCreateBuilding,

  // New Floor Modal
  showNewFloorModal,
  setShowNewFloorModal,
  newFloorName,
  setNewFloorName,
  newFloorWidth,
  setNewFloorWidth,
  newFloorLength,
  setNewFloorLength,
  onCreateFloor,
}) {
  return (
    <>
      {/* MODAL 1: Place Station by Exact Coordinates */}
      {showManualCoordModal && (
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
                onClick={() => setShowManualCoordModal(false)}
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
                  <option value="dock">📦 Docking Bay (Receiving)</option>
                  <option value="charger">⚡ Fast-Charger Pad</option>
                  <option value="rack">🏗️ Storage Rack</option>
                  <option value="elevator">🛗 Freight Elevator</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 dark:text-slate-400 font-bold mb-1">
                    X (Meters, 0-{currentFloor.widthMeters})
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max={currentFloor.widthMeters}
                    value={manualXMeter}
                    onChange={(e) => setManualXMeter(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 font-mono text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 dark:text-slate-400 font-bold mb-1">
                    Y (Meters, 0-{currentFloor.lengthMeters})
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max={currentFloor.lengthMeters}
                    value={manualYMeter}
                    onChange={(e) => setManualYMeter(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 font-mono text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowManualCoordModal(false)}
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
      )}

      {/* MODAL 2: Floor Dimensions & Architectural Specs */}
      {showFloorSpecsModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Info className="w-5 h-5 text-emerald-500" />
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  Floor Specifications
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setShowFloorSpecsModal(false)}
                className="text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 mt-4 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Floor Name</span>
                  <span className="font-bold text-slate-800 dark:text-slate-100">{currentFloor.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Building</span>
                  <span className="font-bold text-slate-800 dark:text-slate-100">{selectedBuilding?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Physical Dimensions</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-100">
                    {currentFloor.widthMeters}m × {currentFloor.lengthMeters}m
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Total Usable Area</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {(currentFloor.widthMeters * currentFloor.lengthMeters).toLocaleString()} m²
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Grid Scale Ratio</span>
                  <span className="font-mono text-slate-800 dark:text-slate-100">
                    10px = 1.0 meter (1m / cell)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Placed Stations</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">
                    {(currentFloor.stations || []).length} stations
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Restricted Zones</span>
                  <span className="font-bold text-amber-600 dark:text-amber-400">
                    {(currentFloor.restrictedZones || []).length} zones
                  </span>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowFloorSpecsModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: New Building */}
      {showNewBuildingModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                Register New Building
              </h4>
              <button
                type="button"
                onClick={() => setShowNewBuildingModal(false)}
                className="text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={onCreateBuilding} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block text-slate-500 dark:text-slate-400 font-bold mb-1">
                  Building Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Building B - Production Facility"
                  value={newBldgName}
                  onChange={(e) => setNewBldgName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-slate-500 dark:text-slate-400 font-bold mb-1">
                  Facility Code
                </label>
                <input
                  type="text"
                  placeholder="e.g. FAC-PROD-02"
                  value={newBldgCode}
                  onChange={(e) => setNewBldgCode(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-slate-500 dark:text-slate-400 font-bold mb-1">
                  Campus Address
                </label>
                <input
                  type="text"
                  placeholder="e.g. East Industrial Campus Gate 2"
                  value={newBldgAddress}
                  onChange={(e) => setNewBldgAddress(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-white"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewBuildingModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold"
                >
                  Create Building
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: New Floor Level */}
      {showNewFloorModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                Add Floor to {selectedBuilding?.name}
              </h4>
              <button
                type="button"
                onClick={() => setShowNewFloorModal(false)}
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
                  onClick={() => setShowNewFloorModal(false)}
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
      )}
    </>
  );
}
