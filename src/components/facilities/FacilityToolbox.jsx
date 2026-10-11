import React from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  Move,
  MapPin,
  Square,
  Trash2,
  Target,
  Package,
  Zap,
  Building2,
  Layers,
  ShieldAlert,
  AlertTriangle,
  ChevronRight,
} from "lucide-react";

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
        {/* Tooltip on Hover */}
        <span className="absolute left-full ml-3 px-2 py-1 bg-slate-900 dark:bg-slate-800 text-white text-[11px] font-semibold rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
          Inspect & Pan
        </span>
      </button>

      {/* 2. Add Station Point (Dropdown Flyout to the Right) */}
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
            Add Station (Click to Choose Type)
          </span>
        </div>

        <DropdownMenu.Portal>
          <DropdownMenu.Content
            side="right"
            sideOffset={12}
            align="start"
            className="min-w-[210px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-1.5 shadow-2xl text-xs z-50 animate-in fade-in zoom-in-95 duration-100"
          >
            <DropdownMenu.Label className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Station Type to Place
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
              <span>📦 Docking Bay (Receiving)</span>
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
              <span>⚡ Fast-Charger Pad</span>
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
              <span>🏗️ Storage Rack</span>
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
              <span>🛗 Freight Elevator</span>
            </DropdownMenu.Item>

            <DropdownMenu.Separator className="h-px bg-slate-100 dark:bg-slate-800 my-1" />

            <DropdownMenu.Item
              onClick={() => {
                if (onOpenManualCoords) onOpenManualCoords();
              }}
              className="px-2.5 py-1.5 rounded-lg flex items-center gap-2 font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 cursor-pointer outline-none"
            >
              <Target className="w-3.5 h-3.5 shrink-0" />
              <span>Enter Coordinates Manually...</span>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>

      {/* 3. Draw Facility Area or Safety Zone (Dropdown Flyout to the Right) */}
      <DropdownMenu.Root>
        <div className="relative group">
          <DropdownMenu.Trigger asChild>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveTool("draw-zone");
                if (setSelectedItem) setSelectedItem(null);
              }}
              onMouseDown={(e) => e.stopPropagation()}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all relative focus:outline-none ${
                activeTool === "draw-zone"
                  ? "bg-amber-600 text-white shadow-md shadow-amber-500/20"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
              }`}
              title="Draw Facility Area or Safety Zone"
            >
              <Square
                className={`w-4 h-4 ${
                  activeTool === "draw-zone" ? "text-white" : "text-amber-500"
                }`}
              />
              <span
                className={`absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full ${
                  zoneTypeToAdd === "no-go"
                    ? "bg-red-400"
                    : zoneTypeToAdd === "slow"
                    ? "bg-amber-400"
                    : zoneTypeToAdd === "receiving"
                    ? "bg-blue-400"
                    : zoneTypeToAdd === "assembly"
                    ? "bg-purple-400"
                    : zoneTypeToAdd === "storage"
                    ? "bg-slate-400"
                    : zoneTypeToAdd === "dispatch"
                    ? "bg-emerald-400"
                    : "bg-cyan-400"
                }`}
              />
            </button>
          </DropdownMenu.Trigger>

          {/* Tooltip on Hover */}
          <span className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2 py-1 bg-slate-900 dark:bg-slate-800 text-white text-[11px] font-semibold rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
            Draw Area / Zone (Click to Select Type)
          </span>
        </div>

        <DropdownMenu.Portal>
          <DropdownMenu.Content
            side="right"
            sideOffset={12}
            align="start"
            className="min-w-[240px] max-h-[85vh] overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-1.5 shadow-2xl text-xs z-50 animate-in fade-in zoom-in-95 duration-100"
          >
            <DropdownMenu.Label className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Operational Areas
            </DropdownMenu.Label>

            <DropdownMenu.Item
              onClick={() => {
                setActiveTool("draw-zone");
                setZoneTypeToAdd("receiving");
              }}
              className={`px-2.5 py-1.5 rounded-lg flex items-center gap-2 cursor-pointer outline-none transition-colors ${
                zoneTypeToAdd === "receiving" && activeTool === "draw-zone"
                  ? "bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-bold"
                  : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <span>📥</span>
              <span>Inbound Receiving Bay</span>
            </DropdownMenu.Item>

            <DropdownMenu.Item
              onClick={() => {
                setActiveTool("draw-zone");
                setZoneTypeToAdd("assembly");
              }}
              className={`px-2.5 py-1.5 rounded-lg flex items-center gap-2 cursor-pointer outline-none transition-colors ${
                zoneTypeToAdd === "assembly" && activeTool === "draw-zone"
                  ? "bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 font-bold"
                  : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <span>⚙️</span>
              <span>Main Assembly Line</span>
            </DropdownMenu.Item>

            <DropdownMenu.Item
              onClick={() => {
                setActiveTool("draw-zone");
                setZoneTypeToAdd("charging-bay");
              }}
              className={`px-2.5 py-1.5 rounded-lg flex items-center gap-2 cursor-pointer outline-none transition-colors ${
                zoneTypeToAdd === "charging-bay" && activeTool === "draw-zone"
                  ? "bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 font-bold"
                  : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <span>⚡</span>
              <span>Charging Bay Hub</span>
            </DropdownMenu.Item>

            <DropdownMenu.Item
              onClick={() => {
                setActiveTool("draw-zone");
                setZoneTypeToAdd("storage");
              }}
              className={`px-2.5 py-1.5 rounded-lg flex items-center gap-2 cursor-pointer outline-none transition-colors ${
                zoneTypeToAdd === "storage" && activeTool === "draw-zone"
                  ? "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white font-bold"
                  : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <span>🏗️</span>
              <span>High-Bay Storage Racks</span>
            </DropdownMenu.Item>

            <DropdownMenu.Item
              onClick={() => {
                setActiveTool("draw-zone");
                setZoneTypeToAdd("dispatch");
              }}
              className={`px-2.5 py-1.5 rounded-lg flex items-center gap-2 cursor-pointer outline-none transition-colors ${
                zoneTypeToAdd === "dispatch" && activeTool === "draw-zone"
                  ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 font-bold"
                  : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <span>🚚</span>
              <span>Outbound Dispatch Docks</span>
            </DropdownMenu.Item>

            <DropdownMenu.Item
              onClick={() => {
                setActiveTool("draw-zone");
                setZoneTypeToAdd("staging");
              }}
              className={`px-2.5 py-1.5 rounded-lg flex items-center gap-2 cursor-pointer outline-none transition-colors ${
                zoneTypeToAdd === "staging" && activeTool === "draw-zone"
                  ? "bg-cyan-50 dark:bg-cyan-950/50 text-cyan-600 dark:text-cyan-400 font-bold"
                  : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <span>📦</span>
              <span>Staging Buffer Area</span>
            </DropdownMenu.Item>

            <DropdownMenu.Item
              onClick={() => {
                setActiveTool("draw-zone");
                setZoneTypeToAdd("custom-area");
              }}
              className={`px-2.5 py-1.5 rounded-lg flex items-center gap-2 cursor-pointer outline-none transition-colors ${
                zoneTypeToAdd === "custom-area" && activeTool === "draw-zone"
                  ? "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-bold"
                  : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <span>🏢</span>
              <span>Department / Work Zone</span>
            </DropdownMenu.Item>

            <DropdownMenu.Separator className="h-px bg-slate-100 dark:border-slate-800 my-1" />

            <DropdownMenu.Label className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Safety Restricted Zones
            </DropdownMenu.Label>

            <DropdownMenu.Item
              onClick={() => {
                setActiveTool("draw-zone");
                setZoneTypeToAdd("no-go");
              }}
              className={`px-2.5 py-1.5 rounded-lg flex items-center gap-2 cursor-pointer outline-none transition-colors ${
                zoneTypeToAdd === "no-go" && activeTool === "draw-zone"
                  ? "bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 font-bold"
                  : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-red-500 shrink-0" />
              <span>🛑 No-Go (Keep-Out)</span>
            </DropdownMenu.Item>

            <DropdownMenu.Item
              onClick={() => {
                setActiveTool("draw-zone");
                setZoneTypeToAdd("slow");
              }}
              className={`px-2.5 py-1.5 rounded-lg flex items-center gap-2 cursor-pointer outline-none transition-colors ${
                zoneTypeToAdd === "slow" && activeTool === "draw-zone"
                  ? "bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 font-bold"
                  : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>⚠️ Slow Zone (0.4 m/s limit)</span>
            </DropdownMenu.Item>

            <DropdownMenu.Separator className="h-px bg-slate-100 dark:border-slate-800 my-1" />

            <DropdownMenu.Item
              onClick={() => {
                if (onOpenNewAreaModal) onOpenNewAreaModal();
              }}
              className="px-2.5 py-1.5 rounded-lg flex items-center gap-2 font-semibold text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 cursor-pointer outline-none"
            >
              <Target className="w-3.5 h-3.5 shrink-0" />
              <span>Enter Area Dimensions Manually...</span>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>

      {/* 4. Delete Tool */}
      <div className="relative group">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setActiveTool(activeTool === "delete" ? "pan" : "delete");
            if (setIsDrawingZone) setIsDrawingZone(false);
          }}
          onMouseDown={(e) => e.stopPropagation()}
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all focus:outline-none ${
            activeTool === "delete"
              ? "bg-red-600 text-white shadow-md shadow-red-500/20"
              : "text-slate-600 dark:text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
          }`}
          title="Delete Tool"
        >
          <Trash2 className="w-4 h-4" />
        </button>

        {/* Tooltip on Hover */}
        <span className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2 py-1 bg-slate-900 dark:bg-slate-800 text-white text-[11px] font-semibold rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
          Delete Tool (Click item to remove)
        </span>
      </div>

      {/* Subtle Divider */}
      <div className="w-5 h-px bg-slate-200 dark:bg-slate-800 my-0.5" />

      {/* 5. Direct Manual Coordinates Shortcut */}
      <div className="relative group">
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onOpenManualCoords) onOpenManualCoords();
          }}
          onMouseDown={(e) => e.stopPropagation()}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:text-blue-600 dark:hover:text-blue-400 transition-colors focus:outline-none"
          title="Place by Coordinates"
        >
          <Target className="w-4 h-4" />
        </button>

        {/* Tooltip on Hover */}
        <span className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-2 py-1 bg-slate-900 dark:bg-slate-800 text-white text-[11px] font-semibold rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
          Enter Coordinates Manually
        </span>
      </div>
    </div>
  );
}
