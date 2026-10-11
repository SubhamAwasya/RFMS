import React from "react";
import { useFleet } from "../context/FleetContext";
import { useNavigation } from "../context/NavigationContext";
import { VIEWS } from "../constants";

import FacilityHeader from "../components/facilities/FacilityHeader";
import FacilityCanvas from "../components/facilities/FacilityCanvas";
import FacilityInspectorDrawer from "../components/facilities/FacilityInspectorDrawer";
import FacilityModals from "../components/facilities/FacilityModals";
import { useFacilityCanvas } from "../hooks/useFacilityCanvas";
import { useFacilityModals } from "../hooks/useFacilityModals";

export default function FacilitiesView() {
  const {
    buildings,
    floors,
    activeBuildingId,
    setActiveBuildingId,
    selectBuilding,
    activeFloorId,
    setActiveFloorId,
    activeFloor,
    addBuilding,
    updateBuilding,
    deleteBuilding,
    addFloor,
    updateFloor,
    deleteFloor,
    uploadFloorMap,
    clearFloorMap,
    addStationToFloor,
    removeStationFromFloor,
    addRestrictedZoneToFloor,
    removeRestrictedZoneFromFloor,
  } = useFleet();

  const navCtx = useNavigation();

  const selectedBuilding =
    buildings.find((b) => b.id === activeBuildingId) || buildings[0];

  const currentFloor = activeFloor || {
    id: "floor-g",
    name: "Ground Floor",
    widthMeters: 100,
    lengthMeters: 65,
    areaSqM: 6500,
    stations: [],
    restrictedZones: [],
    customMapImage: null,
  };

  // Canvas Interactions Hook
  const canvas = useFacilityCanvas({
    currentFloor,
    addStationToFloor,
    removeStationFromFloor,
    updateFloor,
    addRestrictedZoneToFloor,
    removeRestrictedZoneFromFloor,
    uploadFloorMap,
    clearFloorMap,
  });

  // Modals Management Hook
  const modals = useFacilityModals({
    selectedBuilding,
    currentFloor,
    floors,
    addBuilding,
    updateBuilding,
    deleteBuilding,
    setActiveBuildingId,
    addFloor,
    updateFloor,
    deleteFloor,
    setActiveFloorId,
    addStationToFloor,
    addRestrictedZoneToFloor,
    setSelectedItem: canvas.setSelectedItem,
    zoneTypeToAdd: canvas.zoneTypeToAdd,
    metersToPx: canvas.metersToPx,
  });

  const isDrawerOpen = Boolean(canvas.selectedItem || canvas.showElementsDrawer);

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 select-none overflow-hidden relative transition-colors duration-150">
      {/* Hidden File Input for Blueprint Uploading */}
      <input
        ref={canvas.blueprintInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/svg+xml,image/webp"
        className="hidden"
        onChange={canvas.handleImageUpload}
      />

      {/* 1. Header Bar */}
      <FacilityHeader
        selectedBuilding={selectedBuilding}
        buildings={buildings}
        activeBuildingId={activeBuildingId}
        setActiveBuildingId={setActiveBuildingId}
        onSelectBuilding={(id) => (selectBuilding ? selectBuilding(id) : setActiveBuildingId(id))}
        setShowNewBuildingModal={modals.setShowNewBuildingModal}
        setShowEditBuildingModal={modals.handleOpenEditBuilding}
        setShowDeleteBuildingModal={() => modals.setShowDeleteBuildingModal(true)}
        currentFloor={currentFloor}
        floors={floors}
        activeFloorId={activeFloorId}
        setActiveFloorId={setActiveFloorId}
        setSelectedItem={canvas.setSelectedItem}
        setShowNewFloorModal={modals.setShowNewFloorModal}
        setShowEditFloorModal={modals.handleOpenEditFloor}
        setShowDeleteFloorModal={() => modals.setShowDeleteFloorModal(true)}
        handleImageUpload={canvas.handleImageUpload}
        onTriggerUploadBlueprint={() => canvas.blueprintInputRef.current?.click()}
        blueprintOpacity={canvas.blueprintOpacity}
        setBlueprintOpacity={canvas.setBlueprintOpacity}
        handleClearBlueprintImage={canvas.handleClearBlueprintImage}
        showElementsDrawer={canvas.showElementsDrawer}
        setShowElementsDrawer={canvas.setShowElementsDrawer}
        selectedItem={canvas.selectedItem}
        onNavigateLiveMap={() => navCtx?.navigateTo?.(VIEWS.MAP)}
      />

      {/* 2. Main CAD Workspace with Canvas & Contextual Drawer */}
      <div className="flex-1 flex overflow-hidden relative">
        <FacilityCanvas
          viewportRef={canvas.viewportRef}
          svgRef={canvas.svgRef}
          pan={canvas.pan}
          zoom={canvas.zoom}
          isPanning={canvas.isPanning}
          activeTool={canvas.activeTool}
          setActiveTool={canvas.setActiveTool}
          stationTypeToAdd={canvas.stationTypeToAdd}
          setStationTypeToAdd={canvas.setStationTypeToAdd}
          zoneTypeToAdd={canvas.zoneTypeToAdd}
          setZoneTypeToAdd={canvas.setZoneTypeToAdd}
          setIsDrawingZone={canvas.setIsDrawingZone}
          setSelectedItem={canvas.setSelectedItem}
          setShowManualCoordModal={modals.setShowManualCoordModal}
          cursorCoords={canvas.cursorCoords}
          currentFloor={currentFloor}
          blueprintOpacity={canvas.blueprintOpacity}
          selectedItem={canvas.selectedItem}
          isDrawingZone={canvas.isDrawingZone}
          currentDrawZone={canvas.currentDrawZone}
          pxToMeters={canvas.pxToMeters}
          handleCanvasMouseDown={canvas.handleCanvasMouseDown}
          handleCanvasMouseMove={canvas.handleCanvasMouseMove}
          handleCanvasMouseUp={() => {}}
          handleZoneClick={canvas.handleZoneClick}
          handleZoneMouseDown={canvas.handleZoneMouseDown}
          handleZoneResizeMouseDown={canvas.handleZoneResizeMouseDown}
          handleStationMouseDown={canvas.handleStationMouseDown}
          onOpenNewAreaModal={modals.handleOpenNewAreaModal}
        />

        <FacilityInspectorDrawer
          isDrawerOpen={isDrawerOpen}
          selectedObjectData={canvas.selectedObjectData}
          setSelectedItem={canvas.setSelectedItem}
          currentFloor={currentFloor}
          pxToMeters={canvas.pxToMeters}
          metersToPx={canvas.metersToPx}
          handleUpdateSelectedStation={canvas.handleUpdateSelectedStation}
          handleUpdateSelectedZone={canvas.handleUpdateSelectedZone}
          handleDeleteSelectedItem={canvas.handleDeleteSelectedItem}
          showElementsDrawer={canvas.showElementsDrawer}
          setShowElementsDrawer={canvas.setShowElementsDrawer}
          setShowManualCoordModal={modals.setShowManualCoordModal}
          removeStationFromFloor={removeStationFromFloor}
          removeRestrictedZoneFromFloor={removeRestrictedZoneFromFloor}
        />
      </div>

      {/* 3. Facility Modals */}
      <FacilityModals
        showManualCoordModal={modals.showManualCoordModal}
        setShowManualCoordModal={modals.setShowManualCoordModal}
        manualStnName={modals.manualStnName}
        setManualStnName={modals.setManualStnName}
        manualStnType={modals.manualStnType}
        setManualStnType={modals.setManualStnType}
        manualXMeter={modals.manualXMeter}
        setManualXMeter={modals.setManualXMeter}
        manualYMeter={modals.manualYMeter}
        setManualYMeter={modals.setManualYMeter}
        onManualDropStation={modals.handleManualDropStation}
        currentFloor={currentFloor}
        selectedBuilding={selectedBuilding}
        showNewBuildingModal={modals.showNewBuildingModal}
        setShowNewBuildingModal={modals.setShowNewBuildingModal}
        newBldgName={modals.newBldgName}
        setNewBldgName={modals.setNewBldgName}
        newBldgCode={modals.newBldgCode}
        setNewBldgCode={modals.setNewBldgCode}
        newBldgAddress={modals.newBldgAddress}
        setNewBldgAddress={modals.setNewBldgAddress}
        onCreateBuilding={modals.handleCreateBuildingSubmit}
        showEditBuildingModal={modals.showEditBuildingModal}
        setShowEditBuildingModal={modals.setShowEditBuildingModal}
        editBldgName={modals.editBldgName}
        setEditBldgName={modals.setEditBldgName}
        editBldgCode={modals.editBldgCode}
        setEditBldgCode={modals.setEditBldgCode}
        editBldgAddress={modals.editBldgAddress}
        setEditBldgAddress={modals.setEditBldgAddress}
        editBldgLevels={modals.editBldgLevels}
        setEditBldgLevels={modals.setEditBldgLevels}
        onUpdateBuilding={modals.handleUpdateBuildingSubmit}
        showDeleteBuildingModal={modals.showDeleteBuildingModal}
        setShowDeleteBuildingModal={modals.setShowDeleteBuildingModal}
        onDeleteBuilding={modals.handleDeleteBuildingSubmit}
        showNewFloorModal={modals.showNewFloorModal}
        setShowNewFloorModal={modals.setShowNewFloorModal}
        newFloorName={modals.newFloorName}
        setNewFloorName={modals.setNewFloorName}
        newFloorWidth={modals.newFloorWidth}
        setNewFloorWidth={modals.setNewFloorWidth}
        newFloorLength={modals.newFloorLength}
        setNewFloorLength={modals.setNewFloorLength}
        onCreateFloor={modals.handleCreateFloorSubmit}
        showEditFloorModal={modals.showEditFloorModal}
        setShowEditFloorModal={modals.setShowEditFloorModal}
        editFloorName={modals.editFloorName}
        setEditFloorName={modals.setEditFloorName}
        editFloorWidth={modals.editFloorWidth}
        setEditFloorWidth={modals.setEditFloorWidth}
        editFloorLength={modals.editFloorLength}
        setEditFloorLength={modals.setEditFloorLength}
        editFloorLevel={modals.editFloorLevel}
        setEditFloorLevel={modals.setEditFloorLevel}
        editFloorCapacity={modals.editFloorCapacity}
        setEditFloorCapacity={modals.setEditFloorCapacity}
        onUpdateFloor={modals.handleUpdateFloorSubmit}
        showDeleteFloorModal={modals.showDeleteFloorModal}
        setShowDeleteFloorModal={modals.setShowDeleteFloorModal}
        onDeleteFloor={modals.handleDeleteFloorSubmit}
        showNewAreaModal={modals.showNewAreaModal}
        setShowNewAreaModal={modals.setShowNewAreaModal}
        newAreaName={modals.newAreaName}
        setNewAreaName={modals.setNewAreaName}
        newAreaType={modals.newAreaType}
        setNewAreaType={modals.setNewAreaType}
        newAreaWidthMeter={modals.newAreaWidthMeter}
        setNewAreaWidthMeter={modals.setNewAreaWidthMeter}
        newAreaLengthMeter={modals.newAreaLengthMeter}
        setNewAreaLengthMeter={modals.setNewAreaLengthMeter}
        newAreaXMeter={modals.newAreaXMeter}
        setNewAreaXMeter={modals.setNewAreaXMeter}
        newAreaYMeter={modals.newAreaYMeter}
        setNewAreaYMeter={modals.setNewAreaYMeter}
        onCreateArea={modals.handleCreateAreaSubmit}
      />
    </div>
  );
}
