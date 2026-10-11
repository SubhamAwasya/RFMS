import React from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  Building2,
  Layers,
  Upload,
  Plus,
  Check,
  ChevronDown,
  Info,
  ListFilter,
  Sliders,
  ImageOff,
  Radio,
  Pencil,
  Trash2,
} from "lucide-react";

export default function FacilityHeader({
  selectedBuilding,
  buildings,
  activeBuildingId,
  setActiveBuildingId,
  onSelectBuilding,
  setShowNewBuildingModal,
  setShowEditBuildingModal,
  setShowDeleteBuildingModal,
  currentFloor,
  floors,
  activeFloorId,
  setActiveFloorId,
  setSelectedItem,
  setShowNewFloorModal,
  setShowEditFloorModal,
  setShowDeleteFloorModal,
  setShowFloorSpecsModal,
  handleImageUpload,
  onTriggerUploadBlueprint,
  blueprintOpacity,
  setBlueprintOpacity,
  handleClearBlueprintImage,
  showElementsDrawer,
  setShowElementsDrawer,
  selectedItem,
  onNavigateLiveMap,
}) {
  const buildingFloors = (floors || []).filter((f) => f.buildingId === activeBuildingId);

  return (
    <div className="h-14 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-3 sm:px-5 z-20 shrink-0 gap-2 transition-colors">
      {/* LEFT: Hierarchy Breadcrumbs (Facility / Floor) */}
      <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
        {/* Building Menu */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="h-8 flex items-center gap-1.5 px-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 transition-colors focus:outline-none whitespace-nowrap">
              <Building2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              <span className="truncate max-w-[130px] sm:max-w-[180px]">
                {selectedBuilding?.name || "Building"}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              align="start"
              sideOffset={6}
              className="min-w-[210px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-1.5 shadow-xl text-xs z-50 animate-in fade-in zoom-in-95 duration-100"
            >
              <DropdownMenu.Label className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Select Building
              </DropdownMenu.Label>
              {(buildings || []).map((b) => (
                <DropdownMenu.Item
                  key={b.id}
                  onClick={() => onSelectBuilding ? onSelectBuilding(b.id) : setActiveBuildingId(b.id)}
                  className={`px-2.5 py-1.5 rounded-lg flex items-center justify-between cursor-pointer outline-none transition-colors ${
                    b.id === activeBuildingId
                      ? "bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-bold"
                      : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <span className="truncate">{b.name}</span>
                  {b.id === activeBuildingId && <Check className="w-3.5 h-3.5 text-blue-500 shrink-0" />}
                </DropdownMenu.Item>
              ))}
              <DropdownMenu.Separator className="h-px bg-slate-100 dark:border-slate-800 my-1" />
              <DropdownMenu.Item
                onClick={() => setShowNewBuildingModal?.(true)}
                className="px-2.5 py-1.5 rounded-lg flex items-center gap-2 font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 cursor-pointer outline-none"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Building...</span>
              </DropdownMenu.Item>
              {selectedBuilding && (
                <>
                  <DropdownMenu.Item
                    onClick={() => setShowEditBuildingModal?.(true)}
                    className="px-2.5 py-1.5 rounded-lg flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer outline-none"
                  >
                    <Pencil className="w-3.5 h-3.5 text-slate-400" />
                    <span>Edit Current Building...</span>
                  </DropdownMenu.Item>
                  <DropdownMenu.Item
                    onClick={() => setShowDeleteBuildingModal?.(true)}
                    className="px-2.5 py-1.5 rounded-lg flex items-center gap-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer outline-none font-medium"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Building</span>
                  </DropdownMenu.Item>
                </>
              )}
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>

        <span className="text-slate-300 dark:text-slate-700 font-light select-none">/</span>

        {/* Floor Menu */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="h-8 flex items-center gap-1.5 px-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 transition-colors focus:outline-none whitespace-nowrap">
              <Layers className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span className="truncate max-w-[110px] sm:max-w-[150px]">
                {currentFloor?.name || "Floor"}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              align="start"
              sideOffset={6}
              className="min-w-[220px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-1.5 shadow-xl text-xs z-50 animate-in fade-in zoom-in-95 duration-100"
            >
              <DropdownMenu.Label className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Floor Levels ({selectedBuilding?.name || "Building"})
              </DropdownMenu.Label>
              {buildingFloors.map((f) => (
                <DropdownMenu.Item
                  key={f.id}
                  onClick={() => {
                    setActiveFloorId(f.id);
                    setSelectedItem?.(null);
                  }}
                  className={`px-2.5 py-1.5 rounded-lg flex items-center justify-between cursor-pointer outline-none transition-colors ${
                    f.id === activeFloorId
                      ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 font-bold"
                      : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  <span className="truncate">{f.name}</span>
                  {f.id === activeFloorId && <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />}
                </DropdownMenu.Item>
              ))}
              {buildingFloors.length === 0 && (
                <div className="px-2.5 py-2 text-xs text-slate-400 italic">
                  No floor levels in this building
                </div>
              )}
              <DropdownMenu.Separator className="h-px bg-slate-100 dark:border-slate-800 my-1" />
              <DropdownMenu.Item
                onClick={() => setShowNewFloorModal?.(true)}
                className="px-2.5 py-1.5 rounded-lg flex items-center gap-2 font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 cursor-pointer outline-none"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Floor Level...</span>
              </DropdownMenu.Item>
              {currentFloor && currentFloor.buildingId === activeBuildingId && (
                <>
                  <DropdownMenu.Item
                    onClick={() => setShowEditFloorModal?.(true)}
                    className="px-2.5 py-1.5 rounded-lg flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer outline-none"
                  >
                    <Pencil className="w-3.5 h-3.5 text-slate-400" />
                    <span>Edit Floor Specs...</span>
                  </DropdownMenu.Item>
                  <DropdownMenu.Item
                    onClick={() => setShowDeleteFloorModal?.(true)}
                    className="px-2.5 py-1.5 rounded-lg flex items-center gap-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer outline-none font-medium"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Floor</span>
                  </DropdownMenu.Item>
                </>
              )}
              <DropdownMenu.Item
                onClick={() => setShowFloorSpecsModal?.(true)}
                className="px-2.5 py-1.5 rounded-lg flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer outline-none"
              >
                <Info className="w-3.5 h-3.5 text-slate-400" />
                <span>Floor Dimensions & Specs</span>
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>

      {/* CENTER: Subtle Floor Scale Badge */}
      <div className="hidden xl:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100/70 dark:bg-slate-800/70 border border-slate-200/60 dark:border-slate-700/60 text-[11px] text-slate-500 font-mono">
        <span className="font-semibold text-slate-700 dark:text-slate-300">
          {currentFloor.widthMeters}m × {currentFloor.lengthMeters}m
        </span>
        <span>•</span>
        <span>{(currentFloor.widthMeters * currentFloor.lengthMeters).toLocaleString()} m²</span>
      </div>

      {/* RIGHT: Blueprint Menu, Elements Drawer & Live Map */}
      <div className="flex items-center gap-1.5 sm:gap-2 text-xs shrink-0">
        {/* Blueprint Dropdown Menu */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button
              className={`h-8 flex items-center gap-1.5 px-2.5 rounded-lg border text-xs font-medium transition-colors focus:outline-none whitespace-nowrap ${
                currentFloor.customMapImage
                  ? "bg-blue-50/80 dark:bg-blue-950/40 border-blue-500/30 text-blue-600 dark:text-blue-400"
                  : "bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
              title="Blueprint Management"
            >
              <Upload className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              <span>Blueprint</span>
              <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content
              align="end"
              sideOffset={6}
              className="min-w-[220px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2 shadow-xl text-xs z-50 animate-in fade-in zoom-in-95 duration-100"
            >
              <DropdownMenu.Label className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Floor Blueprint
              </DropdownMenu.Label>

              {/* File Upload Option */}
              <DropdownMenu.Item
                onClick={() => onTriggerUploadBlueprint?.()}
                className="px-2.5 py-2 rounded-lg flex items-center gap-2 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 transition-colors outline-none font-medium"
              >
                <Upload className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                <span>
                  {currentFloor.customMapImage ? "Replace Blueprint Image..." : "Upload Map Image..."}
                </span>
              </DropdownMenu.Item>

              {currentFloor.customMapImage && (
                <>
                  <div className="px-2.5 py-2 space-y-1.5 bg-slate-50 dark:bg-slate-800/50 rounded-lg mt-1 border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <Sliders className="w-3 h-3 text-slate-400" />
                        <span>Opacity</span>
                      </span>
                      <span className="font-mono text-slate-700 dark:text-slate-300 font-bold">
                        {blueprintOpacity}%
                      </span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="100"
                      value={blueprintOpacity}
                      onChange={(e) => setBlueprintOpacity(Number(e.target.value))}
                      className="w-full accent-blue-600 cursor-pointer h-1.5"
                    />
                  </div>

                  <DropdownMenu.Separator className="h-px bg-slate-100 dark:bg-slate-800 my-1" />

                  <DropdownMenu.Item
                    onClick={handleClearBlueprintImage}
                    className="px-2.5 py-2 rounded-lg flex items-center gap-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 cursor-pointer outline-none font-medium transition-colors"
                  >
                    <ImageOff className="w-3.5 h-3.5 shrink-0" />
                    <span>Clear Blueprint Image</span>
                  </DropdownMenu.Item>
                </>
              )}
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>

        {/* Elements Drawer Toggle */}
        <button
          onClick={() => {
            setShowElementsDrawer((prev) => !prev);
            if (selectedItem) setSelectedItem(null);
          }}
          className={`h-8 px-2.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors whitespace-nowrap ${
            showElementsDrawer
              ? "bg-blue-50 dark:bg-blue-900/40 border-blue-500/40 text-blue-600 dark:text-blue-400"
              : "bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
          }`}
          title="Toggle Infrastructure Elements List"
        >
          <ListFilter className="w-3.5 h-3.5 text-blue-500" />
          <span className="hidden sm:inline">Elements</span>
          <span className="px-1.5 py-0.2 rounded-full bg-slate-200 dark:bg-slate-700 text-[10px] font-mono font-bold">
            {(currentFloor.stations || []).length + (currentFloor.restrictedZones || []).length}
          </span>
        </button>

        {/* Navigate to Live CAD Map Button */}
        <button
          onClick={onNavigateLiveMap}
          className="h-8 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-colors flex items-center gap-1.5 whitespace-nowrap"
        >
          <Radio className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Live Map</span>
        </button>
      </div>
    </div>
  );
}
