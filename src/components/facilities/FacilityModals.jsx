import React from "react";
import { Target, X, Info, Trash2, Pencil } from "lucide-react";

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
  onOpenEditFloor,

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

  // Edit Building Modal
  showEditBuildingModal,
  setShowEditBuildingModal,
  editBldgName,
  setEditBldgName,
  editBldgCode,
  setEditBldgCode,
  editBldgAddress,
  setEditBldgAddress,
  editBldgLevels,
  setEditBldgLevels,
  onUpdateBuilding,

  // Delete Building Modal
  showDeleteBuildingModal,
  setShowDeleteBuildingModal,
  onDeleteBuilding,

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

  // Edit Floor Modal
  showEditFloorModal,
  setShowEditFloorModal,
  editFloorName,
  setEditFloorName,
  editFloorWidth,
  setEditFloorWidth,
  editFloorLength,
  setEditFloorLength,
  editFloorLevel,
  setEditFloorLevel,
  editFloorCapacity,
  setEditFloorCapacity,
  onUpdateFloor,

  // Delete Floor Modal
  showDeleteFloorModal,
  setShowDeleteFloorModal,
  onDeleteFloor,

  // New Area Modal
  showNewAreaModal,
  setShowNewAreaModal,
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

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowFloorSpecsModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold"
                >
                  Close
                </button>
                {onOpenEditFloor && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowFloorSpecsModal(false);
                      onOpenEditFloor();
                    }}
                    className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    <span>Edit Specs...</span>
                  </button>
                )}
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
      {/* MODAL 5: Edit Building */}
      {showEditBuildingModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                Edit Building — {selectedBuilding?.name}
              </h4>
              <button
                type="button"
                onClick={() => setShowEditBuildingModal(false)}
                className="text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={onUpdateBuilding} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block text-slate-500 dark:text-slate-400 font-bold mb-1">
                  Building Name
                </label>
                <input
                  type="text"
                  required
                  value={editBldgName}
                  onChange={(e) => setEditBldgName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-slate-500 dark:text-slate-400 font-bold mb-1">
                  Facility Code
                </label>
                <input
                  type="text"
                  value={editBldgCode}
                  onChange={(e) => setEditBldgCode(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-slate-500 dark:text-slate-400 font-bold mb-1">
                  Campus Address
                </label>
                <input
                  type="text"
                  value={editBldgAddress}
                  onChange={(e) => setEditBldgAddress(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-slate-500 dark:text-slate-400 font-bold mb-1">
                  Total Levels
                </label>
                <input
                  type="number"
                  min="1"
                  value={editBldgLevels}
                  onChange={(e) => setEditBldgLevels(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-white"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEditBuildingModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 6: Delete Building Confirmation */}
      {showDeleteBuildingModal && (
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
                ⚠️ All floor levels, custom blueprints, stations, and safety zones belonging to this building will also be deleted.
              </p>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteBuildingModal(false)}
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
      )}

      {/* MODAL 7: Edit Floor Dimensions & Specs */}
      {showEditFloorModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                Edit Floor Specifications
              </h4>
              <button
                type="button"
                onClick={() => setShowEditFloorModal(false)}
                className="text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={onUpdateFloor} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block text-slate-500 dark:text-slate-400 font-bold mb-1">
                  Floor Name
                </label>
                <input
                  type="text"
                  required
                  value={editFloorName}
                  onChange={(e) => setEditFloorName(e.target.value)}
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
                    min="10"
                    max="500"
                    value={editFloorWidth}
                    onChange={(e) => setEditFloorWidth(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 dark:text-slate-400 font-bold mb-1">
                    Length (Meters)
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="500"
                    value={editFloorLength}
                    onChange={(e) => setEditFloorLength(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 dark:text-slate-400 font-bold mb-1">
                    Level Number
                  </label>
                  <input
                    type="number"
                    value={editFloorLevel}
                    onChange={(e) => setEditFloorLevel(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 dark:text-slate-400 font-bold mb-1">
                    Max AGV Capacity
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={editFloorCapacity}
                    onChange={(e) => setEditFloorCapacity(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
              <div className="text-[11px] text-slate-400">
                Usable Area: {(Number(editFloorWidth) * Number(editFloorLength)).toLocaleString()} m²
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEditFloorModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-semibold"
                >
                  Save Floor Specs
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 8: Delete Floor Confirmation */}
      {showDeleteFloorModal && (
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
                onClick={() => setShowDeleteFloorModal(false)}
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
      )}

      {/* MODAL 9: Create Operational Area or Safety Zone by Dimensions */}
      {showNewAreaModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                Create Facility Area / Zone
              </h4>
              <button
                type="button"
                onClick={() => setShowNewAreaModal(false)}
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
                  <option value="receiving">📥 Inbound Receiving Bay</option>
                  <option value="assembly">⚙️ Main Assembly Line</option>
                  <option value="charging-bay">⚡ Charging Bay Hub</option>
                  <option value="storage">🏗️ High-Bay Storage Racks</option>
                  <option value="dispatch">🚚 Outbound Dispatch Docks</option>
                  <option value="staging">📦 Staging Buffer Area</option>
                  <option value="custom-area">🏢 Department / Work Zone</option>
                  <option value="no-go">🛑 No-Go (Keep-Out Zone)</option>
                  <option value="slow">⚠️ Slow Zone (Speed limit 0.4 m/s)</option>
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
                  onClick={() => setShowNewAreaModal(false)}
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
      )}
    </>
  );
}
