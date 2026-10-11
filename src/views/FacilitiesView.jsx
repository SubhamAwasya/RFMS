import React, { useState, useRef, useEffect, useMemo } from "react";
import { useFleet } from "../context/FleetContext";
import { useNavigation } from "../context/NavigationContext";
import { VIEWS } from "../constants";
import { getSvgCoordinates } from "../utils/svg";
import { optimizeBlueprintImage } from "../utils/imageOptimizer";
import { getZoneConfig } from "../utils/zoneConfig";

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
  const [draggingZoneId, setDraggingZoneId] = useState(null);
  const [resizingZoneId, setResizingZoneId] = useState(null);
  const zoneDragOffsetRef = useRef({ offsetX: 0, offsetY: 0, startW: 0, startH: 0, startX: 0, startY: 0 });

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

  // Blueprint Hidden Input Reference
  const blueprintInputRef = useRef(null);

  // New Area Modal State
  const [showNewAreaModal, setShowNewAreaModal] = useState(false);
  const [newAreaName, setNewAreaName] = useState("");
  const [newAreaType, setNewAreaType] = useState("receiving");
  const [newAreaWidthMeter, setNewAreaWidthMeter] = useState(25);
  const [newAreaLengthMeter, setNewAreaLengthMeter] = useState(15);
  const [newAreaXMeter, setNewAreaXMeter] = useState(15);
  const [newAreaYMeter, setNewAreaYMeter] = useState(15);

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

  // Modals for Building & Floor Edit and Delete
  const [showEditBuildingModal, setShowEditBuildingModal] = useState(false);
  const [editBldgName, setEditBldgName] = useState("");
  const [editBldgCode, setEditBldgCode] = useState("");
  const [editBldgAddress, setEditBldgAddress] = useState("");
  const [editBldgLevels, setEditBldgLevels] = useState(1);
  const [showDeleteBuildingModal, setShowDeleteBuildingModal] = useState(false);

  const [showEditFloorModal, setShowEditFloorModal] = useState(false);
  const [editFloorName, setEditFloorName] = useState("");
  const [editFloorWidth, setEditFloorWidth] = useState(100);
  const [editFloorLength, setEditFloorLength] = useState(65);
  const [editFloorLevel, setEditFloorLevel] = useState(0);
  const [editFloorCapacity, setEditFloorCapacity] = useState(6);
  const [showDeleteFloorModal, setShowDeleteFloorModal] = useState(false);

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

  // Clear in-progress drawing or panning state whenever active tool changes
  useEffect(() => {
    setIsDrawingZone(false);
    setDrawZoneStart(null);
    setCurrentDrawZone(null);
    setIsPanning(false);
  }, [activeTool]);

  // Canvas Mouse Down
  const handleCanvasMouseDown = (e) => {
    if (e.button !== 0) return;

    // Check if the click is actually on or inside the SVG canvas element
    const isInsideSvg = svgRef.current && (svgRef.current.contains(e.target) || e.target === svgRef.current);
    if (!isInsideSvg) {
      if (activeTool === "pan") {
        setIsPanning(true);
        panStartRef.current = {
          x: e.clientX,
          y: e.clientY,
          panX: pan.x,
          panY: pan.y,
          hasDragged: false,
        };
      }
      return;
    }

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

  // Canvas Mouse Move (Coordinate Tracking)
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
  };

  // Global Panning Listeners
  useEffect(() => {
    if (!isPanning) return;

    const handleWindowMouseMove = (e) => {
      const dx = e.clientX - panStartRef.current.x;
      const dy = e.clientY - panStartRef.current.y;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
        panStartRef.current.hasDragged = true;
      }
      setPan({
        x: panStartRef.current.panX + dx,
        y: panStartRef.current.panY + dy,
      });
    };

    const handleWindowMouseUp = () => {
      setIsPanning(false);
    };

    window.addEventListener("mousemove", handleWindowMouseMove);
    window.addEventListener("mouseup", handleWindowMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleWindowMouseMove);
      window.removeEventListener("mouseup", handleWindowMouseUp);
    };
  }, [isPanning]);

  // Global Area / Zone Drawing Listeners (100% Reliable Drag & Click)
  useEffect(() => {
    if (!isDrawingZone) return;

    const handleWindowMouseMove = (e) => {
      const coords = getSvgCoordinates(svgRef.current, e.clientX, e.clientY, {
        minX: 10,
        maxX: 990,
        minY: 10,
        maxY: 640,
      });
      if (coords && drawZoneStart) {
        const minX = Math.min(drawZoneStart.x, coords.x);
        const minY = Math.min(drawZoneStart.y, coords.y);
        const width = Math.abs(coords.x - drawZoneStart.x);
        const height = Math.abs(coords.y - drawZoneStart.y);
        setCurrentDrawZone({ x: minX, y: minY, w: width, h: height });
      }
    };

    const handleWindowMouseUp = (e) => {
      setIsDrawingZone(false);
      if (activeTool !== "draw-zone" || !drawZoneStart) {
        setDrawZoneStart(null);
        setCurrentDrawZone(null);
        return;
      }

      const config = getZoneConfig(zoneTypeToAdd);
      const count = (currentFloor.restrictedZones || []).length + 1;
      let finalBox = null;

      if (currentDrawZone && currentDrawZone.w > 15 && currentDrawZone.h > 15) {
        finalBox = currentDrawZone;
      } else {
        // Only place default area if click released on SVG canvas
        const isTargetSvg = svgRef.current && (svgRef.current.contains(e.target) || e.target === svgRef.current);
        if (isTargetSvg) {
          const defaultW = 220; // 22 meters
          const defaultH = 150; // 15 meters
          const x = Math.max(20, Math.min(980 - defaultW, drawZoneStart.x - defaultW / 2));
          const y = Math.max(20, Math.min(630 - defaultH, drawZoneStart.y - defaultH / 2));
          finalBox = { x, y, w: defaultW, h: defaultH };
        }
      }

      if (finalBox) {
        const newZone = {
          id: `zone-${Date.now()}`,
          name: `${config.name} ${count}`,
          type: zoneTypeToAdd,
          x: Math.round(finalBox.x),
          y: Math.round(finalBox.y),
          w: Math.round(finalBox.w),
          h: Math.round(finalBox.h),
          maxSpeed: zoneTypeToAdd === "slow" ? 0.4 : 0.0,
        };
        addRestrictedZoneToFloor(currentFloor.id, newZone);
        setSelectedItem({ type: "zone", id: newZone.id });
      }

      setDrawZoneStart(null);
      setCurrentDrawZone(null);
    };

    window.addEventListener("mousemove", handleWindowMouseMove);
    window.addEventListener("mouseup", handleWindowMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleWindowMouseMove);
      window.removeEventListener("mouseup", handleWindowMouseUp);
    };
  }, [isDrawingZone, drawZoneStart, currentDrawZone, activeTool, zoneTypeToAdd, currentFloor, addRestrictedZoneToFloor]);

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

  // Handle Zone MouseDown (start moving zone)
  const handleZoneMouseDown = (e, zoneId) => {
    e.stopPropagation();
    if (activeTool === "delete") {
      removeRestrictedZoneFromFloor(currentFloor.id, zoneId);
      if (selectedItem?.id === zoneId) setSelectedItem(null);
      return;
    }
    if (activeTool === "draw-zone") return;

    const coords = getSvgCoordinates(svgRef.current, e.clientX, e.clientY, {
      minX: 10,
      maxX: 990,
      minY: 10,
      maxY: 640,
    });
    const zone = (currentFloor.restrictedZones || []).find((z) => z.id === zoneId);
    if (!zone || !coords) return;

    setSelectedItem({ type: "zone", id: zoneId });
    setDraggingZoneId(zoneId);
    zoneDragOffsetRef.current = {
      offsetX: coords.x - zone.x,
      offsetY: coords.y - zone.y,
      startW: zone.w,
      startH: zone.h,
      startX: zone.x,
      startY: zone.y,
    };
  };

  // Handle Zone Corner Resize MouseDown
  const handleZoneResizeMouseDown = (e, zoneId) => {
    e.stopPropagation();
    if (activeTool === "delete" || activeTool === "draw-zone") return;

    const coords = getSvgCoordinates(svgRef.current, e.clientX, e.clientY, {
      minX: 10,
      maxX: 990,
      minY: 10,
      maxY: 640,
    });
    const zone = (currentFloor.restrictedZones || []).find((z) => z.id === zoneId);
    if (!zone || !coords) return;

    setSelectedItem({ type: "zone", id: zoneId });
    setResizingZoneId(zoneId);
    zoneDragOffsetRef.current = {
      offsetX: coords.x,
      offsetY: coords.y,
      startW: zone.w,
      startH: zone.h,
      startX: zone.x,
      startY: zone.y,
    };
  };

  // Global Drag listeners for Moving a Zone
  useEffect(() => {
    if (!draggingZoneId) return;

    const handleZoneDragMove = (e) => {
      const coords = getSvgCoordinates(svgRef.current, e.clientX, e.clientY, {
        minX: 10,
        maxX: 990,
        minY: 10,
        maxY: 640,
      });
      if (!coords) return;

      const zone = (currentFloor.restrictedZones || []).find((z) => z.id === draggingZoneId);
      if (!zone) return;

      const newX = coords.x - zoneDragOffsetRef.current.offsetX;
      const newY = coords.y - zoneDragOffsetRef.current.offsetY;
      const clampedX = Math.max(10, Math.min(990 - zone.w, newX));
      const clampedY = Math.max(10, Math.min(640 - zone.h, newY));

      const updatedZones = (currentFloor.restrictedZones || []).map((z) =>
        z.id === draggingZoneId
          ? { ...z, x: Math.round(clampedX), y: Math.round(clampedY) }
          : z
      );
      updateFloor(currentFloor.id, { restrictedZones: updatedZones });
    };

    const handleZoneDragEnd = () => {
      setDraggingZoneId(null);
    };

    window.addEventListener("mousemove", handleZoneDragMove);
    window.addEventListener("mouseup", handleZoneDragEnd);
    return () => {
      window.removeEventListener("mousemove", handleZoneDragMove);
      window.removeEventListener("mouseup", handleZoneDragEnd);
    };
  }, [draggingZoneId, currentFloor, updateFloor]);

  // Global Drag listeners for Resizing a Zone
  useEffect(() => {
    if (!resizingZoneId) return;

    const handleZoneResizeMove = (e) => {
      const coords = getSvgCoordinates(svgRef.current, e.clientX, e.clientY, {
        minX: 10,
        maxX: 990,
        minY: 10,
        maxY: 640,
      });
      if (!coords) return;

      const { startX, startY } = zoneDragOffsetRef.current;
      const newW = Math.max(30, Math.min(990 - startX, coords.x - startX));
      const newH = Math.max(20, Math.min(640 - startY, coords.y - startY));

      const updatedZones = (currentFloor.restrictedZones || []).map((z) =>
        z.id === resizingZoneId
          ? { ...z, w: Math.round(newW), h: Math.round(newH) }
          : z
      );
      updateFloor(currentFloor.id, { restrictedZones: updatedZones });
    };

    const handleZoneResizeEnd = () => {
      setResizingZoneId(null);
    };

    window.addEventListener("mousemove", handleZoneResizeMove);
    window.addEventListener("mouseup", handleZoneResizeEnd);
    return () => {
      window.removeEventListener("mousemove", handleZoneResizeMove);
      window.removeEventListener("mouseup", handleZoneResizeEnd);
    };
  }, [resizingZoneId, currentFloor, updateFloor]);

  // Blueprint Image Upload with Automatic Optimization
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const optimizedBase64 = await optimizeBlueprintImage(file);
      if (optimizedBase64) {
        uploadFloorMap(currentFloor.id, optimizedBase64);
      }
    } catch (err) {
      console.error("Failed to load blueprint:", err);
    } finally {
      if (e.target) e.target.value = "";
    }
  };

  // Blueprint Image Clear Action
  const handleClearBlueprintImage = () => {
    clearFloorMap(currentFloor.id);
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

  const isDrawerOpen = Boolean(selectedItem || showElementsDrawer);

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 select-none overflow-hidden relative transition-colors duration-150">
      {/* Hidden File Input for Blueprint Uploading */}
      <input
        ref={blueprintInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/svg+xml,image/webp"
        className="hidden"
        onChange={handleImageUpload}
      />

      {/* 1. Header Bar */}
      <FacilityHeader
        selectedBuilding={selectedBuilding}
        buildings={buildings}
        activeBuildingId={activeBuildingId}
        setActiveBuildingId={setActiveBuildingId}
        onSelectBuilding={(id) => selectBuilding ? selectBuilding(id) : setActiveBuildingId(id)}
        setShowNewBuildingModal={setShowNewBuildingModal}
        setShowEditBuildingModal={handleOpenEditBuilding}
        setShowDeleteBuildingModal={() => setShowDeleteBuildingModal(true)}
        currentFloor={currentFloor}
        floors={floors}
        activeFloorId={activeFloorId}
        setActiveFloorId={setActiveFloorId}
        setSelectedItem={setSelectedItem}
        setShowNewFloorModal={setShowNewFloorModal}
        setShowEditFloorModal={handleOpenEditFloor}
        setShowDeleteFloorModal={() => setShowDeleteFloorModal(true)}
        setShowFloorSpecsModal={setShowFloorSpecsModal}
        handleImageUpload={handleImageUpload}
        onTriggerUploadBlueprint={() => blueprintInputRef.current?.click()}
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
          handleCanvasMouseUp={() => {}}
          handleZoneClick={handleZoneClick}
          handleZoneMouseDown={handleZoneMouseDown}
          handleZoneResizeMouseDown={handleZoneResizeMouseDown}
          handleStationMouseDown={handleStationMouseDown}
          onOpenNewAreaModal={handleOpenNewAreaModal}
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
        onOpenEditFloor={handleOpenEditFloor}
        showNewBuildingModal={showNewBuildingModal}
        setShowNewBuildingModal={setShowNewBuildingModal}
        newBldgName={newBldgName}
        setNewBldgName={setNewBldgName}
        newBldgCode={newBldgCode}
        setNewBldgCode={setNewBldgCode}
        newBldgAddress={newBldgAddress}
        setNewBldgAddress={setNewBldgAddress}
        onCreateBuilding={handleCreateBuildingSubmit}
        showEditBuildingModal={showEditBuildingModal}
        setShowEditBuildingModal={setShowEditBuildingModal}
        editBldgName={editBldgName}
        setEditBldgName={setEditBldgName}
        editBldgCode={editBldgCode}
        setEditBldgCode={setEditBldgCode}
        editBldgAddress={editBldgAddress}
        setEditBldgAddress={setEditBldgAddress}
        editBldgLevels={editBldgLevels}
        setEditBldgLevels={setEditBldgLevels}
        onUpdateBuilding={handleUpdateBuildingSubmit}
        showDeleteBuildingModal={showDeleteBuildingModal}
        setShowDeleteBuildingModal={setShowDeleteBuildingModal}
        onDeleteBuilding={handleDeleteBuildingSubmit}
        showNewFloorModal={showNewFloorModal}
        setShowNewFloorModal={setShowNewFloorModal}
        newFloorName={newFloorName}
        setNewFloorName={setNewFloorName}
        newFloorWidth={newFloorWidth}
        setNewFloorWidth={setNewFloorWidth}
        newFloorLength={newFloorLength}
        setNewFloorLength={setNewFloorLength}
        onCreateFloor={handleCreateFloorSubmit}
        showEditFloorModal={showEditFloorModal}
        setShowEditFloorModal={setShowEditFloorModal}
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
        onUpdateFloor={handleUpdateFloorSubmit}
        showDeleteFloorModal={showDeleteFloorModal}
        setShowDeleteFloorModal={setShowDeleteFloorModal}
        onDeleteFloor={handleDeleteFloorSubmit}

        showNewAreaModal={showNewAreaModal}
        setShowNewAreaModal={setShowNewAreaModal}
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
        onCreateArea={handleCreateAreaSubmit}
      />
    </div>
  );
}
