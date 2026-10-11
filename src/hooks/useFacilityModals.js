import { useState } from "react";
import { getZoneConfig } from "../utils/zoneConfig";

/**
 * Custom hook to manage all modal states, form data, and submission handlers
 * for the Facilities Management CAD view.
 */
export function useFacilityModals({
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
  setSelectedItem,
  zoneTypeToAdd,
  metersToPx,
}) {
  // Manual Coordinates Modal State
  const [showManualCoordModal, setShowManualCoordModal] = useState(false);
  const [manualXMeter, setManualXMeter] = useState(45.0);
  const [manualYMeter, setManualYMeter] = useState(25.0);
  const [manualStnName, setManualStnName] = useState("");
  const [manualStnType, setManualStnType] = useState("dock");

  // New Area Modal State
  const [showNewAreaModal, setShowNewAreaModal] = useState(false);
  const [newAreaName, setNewAreaName] = useState("");
  const [newAreaType, setNewAreaType] = useState("receiving");
  const [newAreaWidthMeter, setNewAreaWidthMeter] = useState(25);
  const [newAreaLengthMeter, setNewAreaLengthMeter] = useState(15);
  const [newAreaXMeter, setNewAreaXMeter] = useState(15);
  const [newAreaYMeter, setNewAreaYMeter] = useState(15);

  // New Building Modal State
  const [showNewBuildingModal, setShowNewBuildingModal] = useState(false);
  const [newBldgName, setNewBldgName] = useState("");
  const [newBldgCode, setNewBldgCode] = useState("");
  const [newBldgAddress, setNewBldgAddress] = useState("");

  // Edit & Delete Building Modal State
  const [showEditBuildingModal, setShowEditBuildingModal] = useState(false);
  const [editBldgName, setEditBldgName] = useState("");
  const [editBldgCode, setEditBldgCode] = useState("");
  const [editBldgAddress, setEditBldgAddress] = useState("");
  const [editBldgLevels, setEditBldgLevels] = useState(1);
  const [showDeleteBuildingModal, setShowDeleteBuildingModal] = useState(false);

  // New Floor Modal State
  const [showNewFloorModal, setShowNewFloorModal] = useState(false);
  const [newFloorName, setNewFloorName] = useState("");
  const [newFloorWidth, setNewFloorWidth] = useState(100);
  const [newFloorLength, setNewFloorLength] = useState(65);

  // Edit & Delete Floor Modal State
  const [showEditFloorModal, setShowEditFloorModal] = useState(false);
  const [editFloorName, setEditFloorName] = useState("");
  const [editFloorWidth, setEditFloorWidth] = useState(100);
  const [editFloorLength, setEditFloorLength] = useState(65);
  const [editFloorLevel, setEditFloorLevel] = useState(0);
  const [editFloorCapacity, setEditFloorCapacity] = useState(6);
  const [showDeleteFloorModal, setShowDeleteFloorModal] = useState(false);

  // Manual Coordinates Place Submit
  const handleManualDropStation = (e) => {
    e.preventDefault();
    const xPx = metersToPx(Number(manualXMeter) || 45);
    const yPx = metersToPx(Number(manualYMeter) || 25);
    const count = (currentFloor.stations || []).length + 1;
    const newStation = {
      id: `stn-${Date.now()}`,
      name: manualStnName.trim() || `Station ${count}`,
      type: manualStnType,
      x: Math.max(20, Math.min(980, xPx)),
      y: Math.max(20, Math.min(630, yPx)),
      hasPallet: manualStnType === "dock",
      palletId:
        manualStnType === "dock"
          ? `PLT-${Math.floor(Math.random() * 900) + 100}`
          : null,
      palletWeightKg: manualStnType === "dock" ? 450 : 0,
      cargoType: manualStnType === "dock" ? "Standard Pallet" : "",
    };
    addStationToFloor(currentFloor.id, newStation);
    setSelectedItem({ type: "station", id: newStation.id });
    setShowManualCoordModal(false);
    setManualStnName("");
  };

  // Create Area Modal Handlers
  const handleOpenNewAreaModal = () => {
    const config = getZoneConfig(zoneTypeToAdd || "receiving");
    const count = (currentFloor.restrictedZones || []).length + 1;
    setNewAreaName(`${config.name} ${count}`);
    setNewAreaType(zoneTypeToAdd || "receiving");
    setNewAreaWidthMeter(25);
    setNewAreaLengthMeter(15);
    setNewAreaXMeter(15);
    setNewAreaYMeter(15);
    setShowNewAreaModal(true);
  };

  const handleCreateAreaSubmit = (e) => {
    e.preventDefault();
    if (!newAreaName.trim()) return;
    const w = metersToPx(Number(newAreaWidthMeter) || 25);
    const h = metersToPx(Number(newAreaLengthMeter) || 15);
    const x = metersToPx(Number(newAreaXMeter) || 15);
    const y = metersToPx(Number(newAreaYMeter) || 15);

    const newZone = {
      id: `zone-${Date.now()}`,
      name: newAreaName.trim(),
      type: newAreaType,
      x: Math.max(10, Math.min(990 - w, x)),
      y: Math.max(10, Math.min(640 - h, y)),
      w,
      h,
      maxSpeed: newAreaType === "slow" ? 0.4 : 0.0,
    };
    addRestrictedZoneToFloor(currentFloor.id, newZone);
    setSelectedItem({ type: "zone", id: newZone.id });
    setShowNewAreaModal(false);
  };

  // Create Building Modal Handler
  const handleCreateBuildingSubmit = (e) => {
    e.preventDefault();
    if (!newBldgName.trim()) return;
    const newB = {
      id: `bldg-${Date.now()}`,
      name: newBldgName,
      facilityCode: newBldgCode || `FAC-${Math.floor(Math.random() * 900) + 100}`,
      totalLevels: 1,
      address: newBldgAddress || "Facility Campus",
    };
    addBuilding(newB);
    setActiveBuildingId(newB.id);
    setNewBldgName("");
    setNewBldgCode("");
    setNewBldgAddress("");
    setShowNewBuildingModal(false);
  };

  // Edit Building Handlers
  const handleOpenEditBuilding = () => {
    if (selectedBuilding) {
      setEditBldgName(selectedBuilding.name || "");
      setEditBldgCode(selectedBuilding.facilityCode || "");
      setEditBldgAddress(selectedBuilding.address || "");
      setEditBldgLevels(selectedBuilding.totalLevels || 1);
      setShowEditBuildingModal(true);
    }
  };

  const handleUpdateBuildingSubmit = (e) => {
    e.preventDefault();
    if (!selectedBuilding || !editBldgName.trim()) return;
    updateBuilding(selectedBuilding.id, {
      name: editBldgName.trim(),
      facilityCode: editBldgCode.trim(),
      address: editBldgAddress.trim(),
      totalLevels: Number(editBldgLevels) || 1,
    });
    setShowEditBuildingModal(false);
  };

  const handleDeleteBuildingSubmit = () => {
    if (!selectedBuilding) return;
    deleteBuilding(selectedBuilding.id);
    setShowDeleteBuildingModal(false);
  };

  // Create Floor Modal Handler
  const handleCreateFloorSubmit = (e) => {
    e.preventDefault();
    if (!newFloorName.trim()) return;
    const w = Number(newFloorWidth) || 100;
    const l = Number(newFloorLength) || 65;
    const newF = {
      id: `floor-${Date.now()}`,
      buildingId: selectedBuilding.id,
      name: newFloorName,
      levelNumber: (floors || []).filter((f) => f.buildingId === selectedBuilding.id).length,
      widthMeters: w,
      lengthMeters: l,
      areaSqM: w * l,
      maxCapacity: 6,
      customMapImage: null,
      scalePixelsPerMeter: 10,
      stations: [
        {
          id: `stn-chg-${Date.now()}`,
          name: "Fast-Charger Bay",
          type: "charger",
          x: 880,
          y: 140,
          powerKw: 30,
        },
      ],
      restrictedZones: [],
    };
    addFloor(newF);
    setActiveFloorId(newF.id);
    setNewFloorName("");
    setShowNewFloorModal(false);
  };

  // Edit Floor Handlers
  const handleOpenEditFloor = () => {
    if (currentFloor) {
      setEditFloorName(currentFloor.name || "");
      setEditFloorWidth(currentFloor.widthMeters || 100);
      setEditFloorLength(currentFloor.lengthMeters || 65);
      setEditFloorLevel(currentFloor.levelNumber || 0);
      setEditFloorCapacity(currentFloor.maxCapacity || 6);
      setShowEditFloorModal(true);
    }
  };

  const handleUpdateFloorSubmit = (e) => {
    e.preventDefault();
    if (!currentFloor || !editFloorName.trim()) return;
    const w = Number(editFloorWidth) || 100;
    const l = Number(editFloorLength) || 65;
    updateFloor(currentFloor.id, {
      name: editFloorName.trim(),
      widthMeters: w,
      lengthMeters: l,
      areaSqM: w * l,
      levelNumber: Number(editFloorLevel) || 0,
      maxCapacity: Number(editFloorCapacity) || 6,
    });
    setShowEditFloorModal(false);
  };

  const handleDeleteFloorSubmit = () => {
    if (!currentFloor) return;
    deleteFloor(currentFloor.id);
    setShowDeleteFloorModal(false);
  };

  return {
    // Manual Coordinate Modal
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
    handleManualDropStation,

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
    handleOpenNewAreaModal,
    handleCreateAreaSubmit,

    // Building Modals
    showNewBuildingModal,
    setShowNewBuildingModal,
    newBldgName,
    setNewBldgName,
    newBldgCode,
    setNewBldgCode,
    newBldgAddress,
    setNewBldgAddress,
    handleCreateBuildingSubmit,

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
    handleOpenEditBuilding,
    handleUpdateBuildingSubmit,

    showDeleteBuildingModal,
    setShowDeleteBuildingModal,
    handleDeleteBuildingSubmit,

    // Floor Modals
    showNewFloorModal,
    setShowNewFloorModal,
    newFloorName,
    setNewFloorName,
    newFloorWidth,
    setNewFloorWidth,
    newFloorLength,
    setNewFloorLength,
    handleCreateFloorSubmit,

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
    handleOpenEditFloor,
    handleUpdateFloorSubmit,

    showDeleteFloorModal,
    setShowDeleteFloorModal,
    handleDeleteFloorSubmit,
  };
}
