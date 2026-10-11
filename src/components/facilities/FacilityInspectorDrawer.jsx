import React from "react";
import InspectorStationDetails from "./inspector/InspectorStationDetails";
import InspectorZoneDetails from "./inspector/InspectorZoneDetails";
import InspectorElementsList from "./inspector/InspectorElementsList";

export default function FacilityInspectorDrawer({
  isDrawerOpen,
  selectedObjectData,
  setSelectedItem,
  currentFloor,
  pxToMeters,
  metersToPx,
  handleUpdateSelectedStation,
  handleUpdateSelectedZone,
  handleDeleteSelectedItem,
  showElementsDrawer,
  setShowElementsDrawer,
  setShowManualCoordModal,
  removeStationFromFloor,
  removeRestrictedZoneFromFloor,
}) {
  if (!isDrawerOpen) return null;

  return (
    <div className="w-80 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex flex-col p-4 overflow-y-auto shrink-0 z-20 space-y-4 shadow-xl animate-in slide-in-from-right duration-150">
      {/* CASE A: Station Inspector */}
      {selectedObjectData && selectedObjectData.kind === "station" && (
        <InspectorStationDetails
          selectedObjectData={selectedObjectData}
          currentFloor={currentFloor}
          pxToMeters={pxToMeters}
          metersToPx={metersToPx}
          handleUpdateSelectedStation={handleUpdateSelectedStation}
          handleDeleteSelectedItem={handleDeleteSelectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}

      {/* CASE B: Zone Inspector */}
      {selectedObjectData && selectedObjectData.kind === "zone" && (
        <InspectorZoneDetails
          selectedObjectData={selectedObjectData}
          pxToMeters={pxToMeters}
          metersToPx={metersToPx}
          handleUpdateSelectedZone={handleUpdateSelectedZone}
          handleDeleteSelectedItem={handleDeleteSelectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}

      {/* CASE C: Floor Elements List (When no item is specifically selected) */}
      {!selectedObjectData && showElementsDrawer && (
        <InspectorElementsList
          currentFloor={currentFloor}
          pxToMeters={pxToMeters}
          setSelectedItem={setSelectedItem}
          setShowManualCoordModal={setShowManualCoordModal}
          removeStationFromFloor={removeStationFromFloor}
          removeRestrictedZoneFromFloor={removeRestrictedZoneFromFloor}
          onClose={() => setShowElementsDrawer(false)}
        />
      )}
    </div>
  );
}
