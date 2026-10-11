import React from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  MapPin,
  Target,
  Package,
  Zap,
  Building2,
  Layers,
} from "lucide-react";

export default function ToolboxStationDropdown({
  activeTool,
  setActiveTool,
  stationTypeToAdd,
  setStationTypeToAdd,
  setIsDrawingZone,
  onOpenManualCoords,
}) {
  return (
    <DropdownMenu.Root>
      <div className="relative group">
        <DropdownMenu.Trigger asChild>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveTool("station");
              if (setIsDrawingZone) setIsDrawingZone(false);
            }}
            onMouseDown={(e) => e.stopPropagation()}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all relative focus:outline-none ${
              activeTool === "station"
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
            }`}
            title="Add Station Point"
          >
            <MapPin
              className={`w-4 h-4 ${
                activeTool === "station" ? "text-white" : "text-emerald-500"
              }`}
            />
            {/* Type indicator pill */}
            <span className="absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full bg-emerald-400" />
          </button>
        </DropdownMenu.Trigger>

        {/* Tooltip on Hover */}
        <span className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2 py-1 bg-slate-900 dark:bg-slate-800 text-white text-[11px] font-semibold rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
          Add Station
        </span>
      </div>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          side="right"
          sideOffset={12}
          align="start"
          className="min-w-[200px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-1.5 shadow-2xl text-xs z-50 animate-in fade-in zoom-in-95 duration-100"
        >
          <DropdownMenu.Label className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Station Type
          </DropdownMenu.Label>

          <DropdownMenu.Item
            onClick={() => {
              setActiveTool("station");
              setStationTypeToAdd("dock");
            }}
            className={`px-2.5 py-1.5 rounded-lg flex items-center gap-2 cursor-pointer outline-none transition-colors ${
              stationTypeToAdd === "dock" && activeTool === "station"
                ? "bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-bold"
                : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <Package className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            <span>Docking Bay</span>
          </DropdownMenu.Item>

          <DropdownMenu.Item
            onClick={() => {
              setActiveTool("station");
              setStationTypeToAdd("charger");
            }}
            className={`px-2.5 py-1.5 rounded-lg flex items-center gap-2 cursor-pointer outline-none transition-colors ${
              stationTypeToAdd === "charger" && activeTool === "station"
                ? "bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 font-bold"
                : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>Fast-Charger</span>
          </DropdownMenu.Item>

          <DropdownMenu.Item
            onClick={() => {
              setActiveTool("station");
              setStationTypeToAdd("rack");
            }}
            className={`px-2.5 py-1.5 rounded-lg flex items-center gap-2 cursor-pointer outline-none transition-colors ${
              stationTypeToAdd === "rack" && activeTool === "station"
                ? "bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400 font-bold"
                : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-teal-500 shrink-0" />
            <span>Storage Rack</span>
          </DropdownMenu.Item>

          <DropdownMenu.Item
            onClick={() => {
              setActiveTool("station");
              setStationTypeToAdd("elevator");
            }}
            className={`px-2.5 py-1.5 rounded-lg flex items-center gap-2 cursor-pointer outline-none transition-colors ${
              stationTypeToAdd === "elevator" && activeTool === "station"
                ? "bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 font-bold"
                : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-purple-500 shrink-0" />
            <span>Freight Elevator</span>
          </DropdownMenu.Item>

          <DropdownMenu.Separator className="h-px bg-slate-100 dark:bg-slate-800 my-1" />

          <DropdownMenu.Item
            onClick={() => {
              if (onOpenManualCoords) onOpenManualCoords();
            }}
            className="px-2.5 py-1.5 rounded-lg flex items-center gap-2 font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 cursor-pointer outline-none"
          >
            <Target className="w-3.5 h-3.5 shrink-0" />
            <span>Manual Coordinates...</span>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
