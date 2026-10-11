import React from "react";
import ManualCoordinatesModal from "./modals/ManualCoordinatesModal";
import NewBuildingModal from "./modals/NewBuildingModal";
import EditBuildingModal from "./modals/EditBuildingModal";
import DeleteBuildingModal from "./modals/DeleteBuildingModal";
import NewFloorModal from "./modals/NewFloorModal";
import EditFloorModal from "./modals/EditFloorModal";
import DeleteFloorModal from "./modals/DeleteFloorModal";
import NewAreaModal from "./modals/NewAreaModal";

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
      <ManualCoordinatesModal
        isOpen={showManualCoordModal}
        onClose={() => setShowManualCoordModal(false)}
        manualStnName={manualStnName}
        setManualStnName={setManualStnName}
        manualStnType={manualStnType}
        setManualStnType={setManualStnType}
        manualXMeter={manualXMeter}
        setManualXMeter={setManualXMeter}
        manualYMeter={manualYMeter}
        setManualYMeter={setManualYMeter}
        currentFloor={currentFloor}
        onManualDropStation={onManualDropStation}
      />

      <NewBuildingModal
        isOpen={showNewBuildingModal}
        onClose={() => setShowNewBuildingModal(false)}
        newBldgName={newBldgName}
        setNewBldgName={setNewBldgName}
        newBldgCode={newBldgCode}
        setNewBldgCode={setNewBldgCode}
        newBldgAddress={newBldgAddress}
        setNewBldgAddress={setNewBldgAddress}
        onCreateBuilding={onCreateBuilding}
      />

      <EditBuildingModal
        isOpen={showEditBuildingModal}
        onClose={() => setShowEditBuildingModal(false)}
        selectedBuilding={selectedBuilding}
        editBldgName={editBldgName}
        setEditBldgName={setEditBldgName}
        editBldgCode={editBldgCode}
        setEditBldgCode={setEditBldgCode}
        editBldgAddress={editBldgAddress}
        setEditBldgAddress={setEditBldgAddress}
        editBldgLevels={editBldgLevels}
        setEditBldgLevels={setEditBldgLevels}
        onUpdateBuilding={onUpdateBuilding}
      />

      <DeleteBuildingModal
        isOpen={showDeleteBuildingModal}
        onClose={() => setShowDeleteBuildingModal(false)}
        selectedBuilding={selectedBuilding}
        onDeleteBuilding={onDeleteBuilding}
      />

      <NewFloorModal
        isOpen={showNewFloorModal}
        onClose={() => setShowNewFloorModal(false)}
        selectedBuilding={selectedBuilding}
        newFloorName={newFloorName}
        setNewFloorName={setNewFloorName}
        newFloorWidth={newFloorWidth}
        setNewFloorWidth={setNewFloorWidth}
        newFloorLength={newFloorLength}
        setNewFloorLength={setNewFloorLength}
        onCreateFloor={onCreateFloor}
      />

      <EditFloorModal
        isOpen={showEditFloorModal}
        onClose={() => setShowEditFloorModal(false)}
        editFloorName={editFloorName}
        setEditFloorName={setEditFloorName}
        editFloorWidth={editFloorWidth}
        setEditFloorWidth={setEditFloorWidth}
        editFloorLength={editFloorLength}
        setEditFloorLength={setEditFloorLength}
        editFloorLevel={editFloorLevel}
        setEditFloorLevel={setEditFloorLevel}
        editFloorCapacity={editFloorCapacity}
        setEditFloorCapacity={setEditFloorCapacity}
        onUpdateFloor={onUpdateFloor}
      />

      <DeleteFloorModal
        isOpen={showDeleteFloorModal}
        onClose={() => setShowDeleteFloorModal(false)}
        currentFloor={currentFloor}
        onDeleteFloor={onDeleteFloor}
      />

      <NewAreaModal
        isOpen={showNewAreaModal}
        onClose={() => setShowNewAreaModal(false)}
        newAreaName={newAreaName}
        setNewAreaName={setNewAreaName}
        newAreaType={newAreaType}
        setNewAreaType={setNewAreaType}
        newAreaWidthMeter={newAreaWidthMeter}
        setNewAreaWidthMeter={setNewAreaWidthMeter}
        newAreaLengthMeter={newAreaLengthMeter}
        setNewAreaLengthMeter={setNewAreaLengthMeter}
        newAreaXMeter={newAreaXMeter}
        setNewAreaXMeter={setNewAreaXMeter}
        newAreaYMeter={newAreaYMeter}
        setNewAreaYMeter={setNewAreaYMeter}
        onCreateArea={onCreateArea}
      />
    </>
  );
}
