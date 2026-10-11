import React from "react";
import { ListFilter, Plus, Trash2, X } from "lucide-react";

export default function InspectorElementsList({
  currentFloor,
  pxToMeters,
  setSelectedItem,
  setShowManualCoordModal,
  removeStationFromFloor,
  removeRestrictedZoneFromFloor,
  onClose,
}) {
  const stations = currentFloor?.stations || [];
  const zones = currentFloor?.restrictedZones || [];

  return (
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
          onClick={onClose}
          className="p-1 rounded text-slate-400 hover:text-slate-900 dark:hover:text-white"
          title="Close Drawer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Placed Stations List */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
          <span>Stations ({stations.length})</span>
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
          {stations.length === 0 ? (
            <div className="p-3 text-center text-[11px] text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
              No stations placed yet
            </div>
          ) : (
            stations.map((s) => (
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
          <span>Operational Areas & Zones ({zones.length})</span>
        </div>

        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
          {zones.length === 0 ? (
            <div className="p-3 text-center text-[11px] text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
              No areas or zones created yet. Use "Draw Area / Zone" to create one.
            </div>
          ) : (
            zones.map((z) => (
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
  );
}
