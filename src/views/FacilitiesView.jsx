import React, { useState, useRef, useEffect, useMemo } from "react";
import { useFleet } from "../context/FleetContext";
import { useNavigation } from "../context/NavigationContext";
import { VIEWS } from "../constants";
import { getSvgCoordinates } from "../utils/svg";

import FacilityHeader from "../components/facilities/FacilityHeader";
import FacilityCanvas from "../components/facilities/FacilityCanvas";
import FacilityInspectorDrawer from "../components/facilities/FacilityInspectorDrawer";
import FacilityModals from "../components/facilities/FacilityModals";

export default function FacilitiesView() {
  const {
    buildings,
    floors,
    activeBuildingId,
    setActiveBuildingId,
    activeFloorId,
    setActiveFloorId,
    activeFloor,
    addBuilding,
    addFloor,
    uploadFloorMap,
    clearFloorMap,
    addStationToFloor,
    removeStationFromFloor,
    addRestrictedZoneToFloor,
    removeRestrictedZoneFromFloor,
    updateFloor,
  } = useFleet();

  const navCtx = useNavigation();

  // Active Tool Mode: "pan" | "station" | "draw-zone" | "delete"
  const [activeTool, setActiveTool] = useState("pan");

  // Sub-options
  const [stationTypeToAdd, setStationTypeToAdd] = useState("dock");
  const [zoneTypeToAdd, setZoneTypeToAdd] = useState("no-go");
  const [blueprintOpacity, setBlueprintOpacity] = useState(85);

  // Canvas Viewport Pan & Zoom
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const viewportRef = useRef(null);
  const svgRef = useRef(null);
  const panStartRef = useRef({ x: 0, y: 0, panX: 0, panY: 0, hasDragged: false });

  // Mouse Live Coordinates
  const [cursorCoords, setCursorCoords] = useState({ x: 0, y: 0, meterX: 0, meterY: 0 });

  // Selection & Inspector
  const [selectedItem, setSelectedItem] = useState(null); // { type: "station"|"zone", id: string }
  const [showElementsDrawer, setShowElementsDrawer] = useState(false);
  const [draggingStationId, setDraggingStationId] = useState(null);
  const dragStartCoordsRef = useRef({ x: 0, y: 0 });

  // Drawing Zone State (MouseDown -> Drag -> MouseUp)
  const [isDrawingZone, setIsDrawingZone] = useState(false);
  const [drawZoneStart, setDrawZoneStart] = useState(null);
  const [currentDrawZone, setCurrentDrawZone] = useState(null); // { x, y, w, h }

  // Manual Coordinates Input Form Modal
  const [showManualCoordModal, setShowManualCoordModal] = useState(false);
  const [manualXMeter, setManualXMeter] = useState(45.0);
  const [manualYMeter, setManualYMeter] = useState(25.0);
  const [manualStnName, setManualStnName] = useState("");
  const [manualStnType, setManualStnType] = useState("dock");

  // Floor Dimensions & Specs Modal
  const [showFloorSpecsModal, setShowFloorSpecsModal] = useState(false);

  // Modals for Building & Floor creation
  const [showNewBuildingModal, setShowNewBuildingModal] = useState(false);
  const [showNewFloorModal, setShowNewFloorModal] = useState(false);
  const [newBldgName, setNewBldgName] = useState("");
  const [newBldgCode, setNewBldgCode] = useState("");
  const [newBldgAddress, setNewBldgAddress] = useState("");
  const [newFloorName, setNewFloorName] = useState("");
  const [newFloorWidth, setNewFloorWidth] = useState(100);
  const [newFloorLength, setNewFloorLength] = useState(65);

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

  // Convert map pixels to meters (10px = 1.0m)
  const pxToMeters = (px) => Number((px / 10).toFixed(1));
  const metersToPx = (m) => Math.round(m * 10);

  // Selected Object Resolver
  const selectedObjectData = useMemo(() => {
    if (!selectedItem) return null;
    if (selectedItem.type === "station") {
      const stn = (currentFloor.stations || []).find((s) => s.id === selectedItem.id);
      return stn ? { ...stn, kind: "station" } : null;
    }
    if (selectedItem.type === "zone") {
      const z = (currentFloor.restrictedZones || []).find((z) => z.id === selectedItem.id);
      return z ? { ...z, kind: "zone" } : null;
    }
    return null;
  }, [selectedItem, currentFloor]);

  // Mouse Wheel & Trackpad Zoom
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    const handleWheel = (e) => {
      e.preventDefault();
      if (e.ctrlKey || e.metaKey) {
        const zoomFactor = -e.deltaY * 0.015;
        setZoom((prev) => Math.min(Math.max(Number((prev + zoomFactor).toFixed(3)), 0.5), 3.0));
        return;
      }
      if (Math.abs(e.deltaX) > 0 || e.shiftKey) {
        const dx = e.shiftKey ? e.deltaY : e.deltaX;
        setPan((prev) => ({ x: prev.x - dx, y: prev.y - e.deltaY }));
      } else {
        const zoomFactor = -e.deltaY * 0.0015;
        setZoom((prev) => Math.min(Math.max(Number((prev + zoomFactor).toFixed(3)), 0.5), 3.0));
      }
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, []);

  // Keyboard shortcut listener (Delete key to delete selected item)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA" || e.target.tagName === "SELECT") {
        return;
      }
      if ((e.key === "Delete" || e.key === "Backspace") && selectedItem) {
        e.preventDefault();
        handleDeleteSelectedItem();
      }
      if (e.key === "Escape") {
        setSelectedItem(null);
        setIsDrawingZone(false);
        setCurrentDrawZone(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedItem, currentFloor]);

  // Delete currently selected object
  const handleDeleteSelectedItem = () => {
    if (!selectedItem) return;
    if (selectedItem.type === "station") {
      removeStationFromFloor(currentFloor.id, selectedItem.id);
    } else if (selectedItem.type === "zone") {
      removeRestrictedZoneFromFloor(currentFloor.id, selectedItem.id);
    }
    setSelectedItem(null);
  };

  // Canvas Mouse Down
  const handleCanvasMouseDown = (e) => {
    if (e.button !== 0) return;

    const coords = getSvgCoordinates(svgRef.current, e.clientX, e.clientY, {
      minX: 10,
      maxX: 990,
      minY: 10,
      maxY: 640,
    });
    if (!coords) return;

    if (activeTool === "pan") {
      setIsPanning(true);
      panStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        panX: pan.x,
        panY: pan.y,
        hasDragged: false,
      };
    } else if (activeTool === "station") {
      const stnTitles = {
        dock: "Docking Bay",
        charger: "Fast-Charger Pad",
        rack: "Storage Rack",
        elevator: "Freight Elevator",
      };
      const count = (currentFloor.stations || []).length + 1;
      const newStation = {
        id: `stn-${Date.now()}`,
        name: `${stnTitles[stationTypeToAdd] || "Station"} ${count}`,
        type: stationTypeToAdd,
        x: coords.x,
        y: coords.y,
        hasPallet: stationTypeToAdd === "dock",
        palletId: stationTypeToAdd === "dock" ? `PLT-${Math.floor(Math.random() * 900) + 100}` : null,
        palletWeightKg: stationTypeToAdd === "dock" ? 450 : 0,
        cargoType: stationTypeToAdd === "dock" ? "Standard Pallet" : "",
      };
      addStationToFloor(currentFloor.id, newStation);
      setSelectedItem({ type: "station", id: newStation.id });
    } else if (activeTool === "draw-zone") {
      setIsDrawingZone(true);
      setDrawZoneStart(coords);
      setCurrentDrawZone({ x: coords.x, y: coords.y, w: 0, h: 0 });
    }
  };

  // Canvas Mouse Move
  const handleCanvasMouseMove = (e) => {
    const coords = getSvgCoordinates(svgRef.current, e.clientX, e.clientY, {
      minX: 10,
      maxX: 990,
      minY: 10,
      maxY: 640,
    });
    if (coords) {
      setCursorCoords({
        x: coords.x,
        y: coords.y,
        meterX: pxToMeters(coords.x),
        meterY: pxToMeters(coords.y),
      });
    }

    if (isPanning && activeTool === "pan") {
      const dx = e.clientX - panStartRef.current.x;
      const dy = e.clientY - panStartRef.current.y;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
        panStartRef.current.hasDragged = true;
      }
      setPan({
        x: panStartRef.current.panX + dx,
        y: panStartRef.current.panY + dy,
      });
    } else if (isDrawingZone && drawZoneStart && coords) {
      const minX = Math.min(drawZoneStart.x, coords.x);
      const minY = Math.min(drawZoneStart.y, coords.y);
      const width = Math.abs(coords.x - drawZoneStart.x);
      const height = Math.abs(coords.y - drawZoneStart.y);
      setCurrentDrawZone({ x: minX, y: minY, w: width, h: height });
    }
  };

  // Canvas Mouse Up
  const handleCanvasMouseUp = () => {
    if (isPanning) {
      setIsPanning(false);
    }

    if (isDrawingZone && currentDrawZone) {
      setIsDrawingZone(false);
      if (currentDrawZone.w > 15 && currentDrawZone.h > 15) {
        const zoneTitles = {
          "no-go": "No-Go Safety Keep-Out",
          slow: "Slow Zone (0.4m/s)",
          staging: "Staging Buffer",
        };
        const count = (currentFloor.restrictedZones || []).length + 1;
        const newZone = {
          id: `zone-${Date.now()}`,
          name: `${zoneTitles[zoneTypeToAdd] || "Zone"} ${count}`,
          type: zoneTypeToAdd,
          x: currentDrawZone.x,
          y: currentDrawZone.y,
          w: currentDrawZone.w,
          h: currentDrawZone.h,
          maxSpeed: zoneTypeToAdd === "slow" ? 0.4 : 0.0,
        };
        addRestrictedZoneToFloor(currentFloor.id, newZone);
        setSelectedItem({ type: "zone", id: newZone.id });
      }
      setDrawZoneStart(null);
      setCurrentDrawZone(null);
    }
  };

  // Dragging existing station
  const handleStationMouseDown = (e, stnId) => {
    e.stopPropagation();
    if (activeTool === "delete") {
      removeStationFromFloor(currentFloor.id, stnId);
      if (selectedItem?.id === stnId) setSelectedItem(null);
      return;
    }
    setSelectedItem({ type: "station", id: stnId });
    setDraggingStationId(stnId);
    dragStartCoordsRef.current = { x: e.clientX, y: e.clientY };
  };

  // Handle Station Drag Global Move
  useEffect(() => {
    if (!draggingStationId) return;

    const handleStationDragMove = (e) => {
      const coords = getSvgCoordinates(svgRef.current, e.clientX, e.clientY, {
        minX: 20,
        maxX: 980,
        minY: 20,
        maxY: 630,
      });
      if (!coords) return;

      const updatedStations = (currentFloor.stations || []).map((s) =>
        s.id === draggingStationId ? { ...s, x: coords.x, y: coords.y } : s
      );
      updateFloor(currentFloor.id, { stations: updatedStations });
    };

    const handleStationDragEnd = () => {
      setDraggingStationId(null);
    };

    window.addEventListener("mousemove", handleStationDragMove);
    window.addEventListener("mouseup", handleStationDragEnd);
    return () => {
      window.removeEventListener("mousemove", handleStationDragMove);
      window.removeEventListener("mouseup", handleStationDragEnd);
    };
  }, [draggingStationId, currentFloor, updateFloor]);

  // Handle Zone Click
  const handleZoneClick = (e, zoneId) => {
    e.stopPropagation();
    if (activeTool === "delete") {
      removeRestrictedZoneFromFloor(currentFloor.id, zoneId);
      if (selectedItem?.id === zoneId) setSelectedItem(null);
      return;
    }
    setSelectedItem({ type: "zone", id: zoneId });
  };

  // Blueprint Image Upload
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result;
      if (base64) {
        uploadFloorMap(currentFloor.id, base64);
      }
    };
    reader.readAsDataURL(file);
  };

  // Blueprint Image Clear Action
  const handleClearBlueprintImage = () => {
    clearFloorMap(currentFloor.id);
  };

  // Manual Coordinates Place Button
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
      palletId: manualStnType === "dock" ? `PLT-${Math.floor(Math.random() * 900) + 100}` : null,
      palletWeightKg: manualStnType === "dock" ? 450 : 0,
      cargoType: manualStnType === "dock" ? "Standard Pallet" : "",
    };
    addStationToFloor(currentFloor.id, newStation);
    setSelectedItem({ type: "station", id: newStation.id });
    setShowManualCoordModal(false);
    setManualStnName("");
  };

  // Inspector Updates for Selected Station
  const handleUpdateSelectedStation = (field, val) => {
    if (!selectedObjectData || selectedObjectData.kind !== "station") return;
    const updated = (currentFloor.stations || []).map((s) => {
      if (s.id !== selectedObjectData.id) return s;
      return { ...s, [field]: val };
    });
    updateFloor(currentFloor.id, { stations: updated });
  };

  // Inspector Updates for Selected Zone
  const handleUpdateSelectedZone = (field, val) => {
    if (!selectedObjectData || selectedObjectData.kind !== "zone") return;
    const updated = (currentFloor.restrictedZones || []).map((z) => {
      if (z.id !== selectedObjectData.id) return z;
      return { ...z, [field]: val };
    });
    updateFloor(currentFloor.id, { restrictedZones: updated });
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

  const isDrawerOpen = Boolean(selectedItem || showElementsDrawer);

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 select-none overflow-hidden relative transition-colors duration-150">
      {/* 1. Header Bar */}
      <FacilityHeader
        selectedBuilding={selectedBuilding}
        buildings={buildings}
        activeBuildingId={activeBuildingId}
        setActiveBuildingId={setActiveBuildingId}
        setShowNewBuildingModal={setShowNewBuildingModal}
        currentFloor={currentFloor}
        floors={floors}
        activeFloorId={activeFloorId}
        setActiveFloorId={setActiveFloorId}
        setSelectedItem={setSelectedItem}
        setShowNewFloorModal={setShowNewFloorModal}
        setShowFloorSpecsModal={setShowFloorSpecsModal}
        handleImageUpload={handleImageUpload}
        blueprintOpacity={blueprintOpacity}
        setBlueprintOpacity={setBlueprintOpacity}
        handleClearBlueprintImage={handleClearBlueprintImage}
        showElementsDrawer={showElementsDrawer}
        setShowElementsDrawer={setShowElementsDrawer}
        selectedItem={selectedItem}
        onNavigateLiveMap={() => navCtx?.navigateTo?.(VIEWS.MAP)}
      />

      {/* 2. Main CAD Workspace with Canvas & Contextual Drawer */}
      <div className="flex-1 flex overflow-hidden relative">
        <FacilityCanvas
          viewportRef={viewportRef}
          svgRef={svgRef}
          pan={pan}
          zoom={zoom}
          isPanning={isPanning}
          activeTool={activeTool}
          setActiveTool={setActiveTool}
          stationTypeToAdd={stationTypeToAdd}
          setStationTypeToAdd={setStationTypeToAdd}
          zoneTypeToAdd={zoneTypeToAdd}
          setZoneTypeToAdd={setZoneTypeToAdd}
          setIsDrawingZone={setIsDrawingZone}
          setSelectedItem={setSelectedItem}
          setShowManualCoordModal={setShowManualCoordModal}
          cursorCoords={cursorCoords}
          currentFloor={currentFloor}
          blueprintOpacity={blueprintOpacity}
          selectedItem={selectedItem}
          isDrawingZone={isDrawingZone}
          currentDrawZone={currentDrawZone}
          pxToMeters={pxToMeters}
          handleCanvasMouseDown={handleCanvasMouseDown}
          handleCanvasMouseMove={handleCanvasMouseMove}
          handleCanvasMouseUp={handleCanvasMouseUp}
          handleZoneClick={handleZoneClick}
          handleStationMouseDown={handleStationMouseDown}
        />

        <FacilityInspectorDrawer
          isDrawerOpen={isDrawerOpen}
          selectedObjectData={selectedObjectData}
          setSelectedItem={setSelectedItem}
          currentFloor={currentFloor}
          pxToMeters={pxToMeters}
          metersToPx={metersToPx}
          handleUpdateSelectedStation={handleUpdateSelectedStation}
          handleUpdateSelectedZone={handleUpdateSelectedZone}
          handleDeleteSelectedItem={handleDeleteSelectedItem}
          showElementsDrawer={showElementsDrawer}
          setShowElementsDrawer={setShowElementsDrawer}
          setShowManualCoordModal={setShowManualCoordModal}
          removeStationFromFloor={removeStationFromFloor}
          removeRestrictedZoneFromFloor={removeRestrictedZoneFromFloor}
        />
      </div>

      {/* 3. Facility Modals */}
      <FacilityModals
        showManualCoordModal={showManualCoordModal}
        setShowManualCoordModal={setShowManualCoordModal}
        manualStnName={manualStnName}
        setManualStnName={setManualStnName}
        manualStnType={manualStnType}
        setManualStnType={setManualStnType}
        manualXMeter={manualXMeter}
        setManualXMeter={setManualXMeter}
        manualYMeter={manualYMeter}
        setManualYMeter={setManualYMeter}
        onManualDropStation={handleManualDropStation}
        showFloorSpecsModal={showFloorSpecsModal}
        setShowFloorSpecsModal={setShowFloorSpecsModal}
        currentFloor={currentFloor}
        selectedBuilding={selectedBuilding}
        showNewBuildingModal={showNewBuildingModal}
        setShowNewBuildingModal={setShowNewBuildingModal}
        newBldgName={newBldgName}
        setNewBldgName={setNewBldgName}
        newBldgCode={newBldgCode}
        setNewBldgCode={setNewBldgCode}
        newBldgAddress={newBldgAddress}
        setNewBldgAddress={setNewBldgAddress}
        onCreateBuilding={handleCreateBuildingSubmit}
        showNewFloorModal={showNewFloorModal}
        setShowNewFloorModal={setShowNewFloorModal}
        newFloorName={newFloorName}
        setNewFloorName={setNewFloorName}
        newFloorWidth={newFloorWidth}
        setNewFloorWidth={setNewFloorWidth}
        newFloorLength={newFloorLength}
        setNewFloorLength={setNewFloorLength}
        onCreateFloor={handleCreateFloorSubmit}
      />
    </div>
  );
}
