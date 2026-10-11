import React from "react";
import { X } from "lucide-react";

export default function EditBuildingModal({
  isOpen,
  onClose,
  selectedBuilding,
  editBldgName,
  setEditBldgName,
  editBldgCode,
  setEditBldgCode,
  editBldgAddress,
  setEditBldgAddress,
  editBldgLevels,
  setEditBldgLevels,
  onUpdateBuilding,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <h4 className="text-base font-bold text-slate-900 dark:text-white">
            Edit Building — {selectedBuilding?.name}
          </h4>
          <button
            type="button"
            onClick={onClose}
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
              onClick={onClose}
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
  );
}
