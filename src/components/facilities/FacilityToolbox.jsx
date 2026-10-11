import React from "react";
import { Move, Trash2 } from "lucide-react";
import ToolboxStationDropdown from "./toolbox/ToolboxStationDropdown";
import ToolboxZoneDropdown from "./toolbox/ToolboxZoneDropdown";

export default function FacilityToolbox({
  activeTool,
  setActiveTool,
  stationTypeToAdd,
  setStationTypeToAdd,
  zoneTypeToAdd,
  setZoneTypeToAdd,
  setIsDrawingZone,
  setSelectedItem,
  onOpenManualCoords,
  onOpenNewAreaModal,
}) {
  return (
    <div
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
      className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/90 dark:border-slate-800 rounded-2xl p-1.5 shadow-xl flex flex-col items-center gap-1.5 z-30 select-none transition-colors"
    >
      {/* 1. Inspect & Pan Mode */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setActiveTool("pan");
          if (setIsDrawingZone) setIsDrawingZone(false);
        }}
        onMouseDown={(e) => e.stopPropagation()}
        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all relative group focus:outline-none ${
          activeTool === "pan"
            ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
            : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
        }`}
        title="Inspect & Pan Map"
      >
        <Move className="w-4 h-4" />
        <span className="absolute left-full ml-3 px-2 py-1 bg-slate-900 dark:bg-slate-800 text-white text-[11px] font-semibold rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
          Inspect & Pan
        </span>
      </button>

      {/* 2. Add Station Point Flyout Dropdown */}
      <ToolboxStationDropdown
        activeTool={activeTool}
        setActiveTool={setActiveTool}
        stationTypeToAdd={stationTypeToAdd}
        setStationTypeToAdd={setStationTypeToAdd}
        setIsDrawingZone={setIsDrawingZone}
        onOpenManualCoords={onOpenManualCoords}
      />

      {/* 3. Draw Facility Area or Safety Zone Flyout Dropdown */}
      <ToolboxZoneDropdown
        activeTool={activeTool}
        setActiveTool={setActiveTool}
        zoneTypeToAdd={zoneTypeToAdd}
        setZoneTypeToAdd={setZoneTypeToAdd}
        setSelectedItem={setSelectedItem}
        onOpenNewAreaModal={onOpenNewAreaModal}
      />

      {/* 4. Delete Element Mode */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setActiveTool("delete");
          if (setIsDrawingZone) setIsDrawingZone(false);
        }}
        onMouseDown={(e) => e.stopPropagation()}
        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all relative group focus:outline-none ${
          activeTool === "delete"
            ? "bg-red-600 text-white shadow-md shadow-red-500/20"
            : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
        }`}
        title="Delete Element on Click"
      >
        <Trash2 className="w-4 h-4" />
        <span className="absolute left-full ml-3 px-2 py-1 bg-slate-900 dark:bg-slate-800 text-white text-[11px] font-semibold rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
          Delete on Click
        </span>
      </button>
    </div>
  );
}
