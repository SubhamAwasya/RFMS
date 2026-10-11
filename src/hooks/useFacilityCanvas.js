import { useState, useRef, useEffect, useMemo } from "react";
import { getSvgCoordinates } from "../utils/svg";
import { optimizeBlueprintImage } from "../utils/imageOptimizer";
import { getZoneConfig } from "../utils/zoneConfig";

/**
 * Custom hook to manage all CAD canvas interactions, viewport transformations,
 * tool modes, station/zone creation, dragging, resizing, and keyboard controls.
 */
export function useFacilityCanvas({
  currentFloor,
  addStationToFloor,
  removeStationFromFloor,
  updateFloor,
  addRestrictedZoneToFloor,
  removeRestrictedZoneFromFloor,
  uploadFloorMap,
  clearFloorMap,
}) {
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

  // Blueprint Hidden Input Reference
  const blueprintInputRef = useRef(null);

  // Convert map pixels to meters (10px = 1.0m)
  const pxToMeters = (px) => Number((px / 10).toFixed(1));
  const metersToPx = (m) => Math.round(m * 10);

  // Selected Object Resolver
  const selectedObjectData = useMemo(() => {
    if (!selectedItem) return null;
    if (selectedItem.type === "station") {
      const stn = (currentFloor?.stations || []).find((s) => s.id === selectedItem.id);
      return stn ? { ...stn, kind: "station" } : null;
    }
    if (selectedItem.type === "zone") {
      const z = (currentFloor?.restrictedZones || []).find((z) => z.id === selectedItem.id);
      return z ? { ...z, kind: "zone" } : null;
    }
    return null;
  }, [selectedItem, currentFloor]);

  // Delete currently selected object
  const handleDeleteSelectedItem = () => {
    if (!selectedItem || !currentFloor) return;
    if (selectedItem.type === "station") {
      removeStationFromFloor(currentFloor.id, selectedItem.id);
    } else if (selectedItem.type === "zone") {
      removeRestrictedZoneFromFloor(currentFloor.id, selectedItem.id);
    }
    setSelectedItem(null);
  };

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
      if (
        e.target.tagName === "INPUT" ||
        e.target.tagName === "TEXTAREA" ||
        e.target.tagName === "SELECT"
      ) {
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
    const isInsideSvg =
      svgRef.current && (svgRef.current.contains(e.target) || e.target === svgRef.current);
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
      const count = (currentFloor?.stations || []).length + 1;
      const newStation = {
        id: `stn-${Date.now()}`,
        name: `${stnTitles[stationTypeToAdd] || "Station"} ${count}`,
        type: stationTypeToAdd,
        x: coords.x,
        y: coords.y,
        hasPallet: stationTypeToAdd === "dock",
        palletId:
          stationTypeToAdd === "dock"
            ? `PLT-${Math.floor(Math.random() * 900) + 100}`
            : null,
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
      const count = (currentFloor?.restrictedZones || []).length + 1;
      let finalBox = null;

      if (currentDrawZone && currentDrawZone.w > 15 && currentDrawZone.h > 15) {
        finalBox = currentDrawZone;
      } else {
        // Only place default area if click released on SVG canvas
        const isTargetSvg =
          svgRef.current && (svgRef.current.contains(e.target) || e.target === svgRef.current);
        if (isTargetSvg) {
          const defaultW = 220; // 22 meters
          const defaultH = 150; // 15 meters
          const x = Math.max(20, Math.min(980 - defaultW, drawZoneStart.x - defaultW / 2));
          const y = Math.max(20, Math.min(630 - defaultH, drawZoneStart.y - defaultH / 2));
          finalBox = { x, y, w: defaultW, h: defaultH };
        }
      }

      if (finalBox && currentFloor) {
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
  }, [
    isDrawingZone,
    drawZoneStart,
    currentDrawZone,
    activeTool,
    zoneTypeToAdd,
    currentFloor,
    addRestrictedZoneToFloor,
  ]);

  // Dragging existing station
  const handleStationMouseDown = (e, stnId) => {
    e.stopPropagation();
    if (activeTool === "delete") {
      if (currentFloor) removeStationFromFloor(currentFloor.id, stnId);
      if (selectedItem?.id === stnId) setSelectedItem(null);
      return;
    }
    setSelectedItem({ type: "station", id: stnId });
    setDraggingStationId(stnId);
    dragStartCoordsRef.current = { x: e.clientX, y: e.clientY };
  };

  // Handle Station Drag Global Move
  useEffect(() => {
    if (!draggingStationId || !currentFloor) return;

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
      if (currentFloor) removeRestrictedZoneFromFloor(currentFloor.id, zoneId);
      if (selectedItem?.id === zoneId) setSelectedItem(null);
      return;
    }
    setSelectedItem({ type: "zone", id: zoneId });
  };

  // Handle Zone MouseDown (start moving zone)
  const handleZoneMouseDown = (e, zoneId) => {
    e.stopPropagation();
    if (activeTool === "delete") {
      if (currentFloor) removeRestrictedZoneFromFloor(currentFloor.id, zoneId);
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
    const zone = (currentFloor?.restrictedZones || []).find((z) => z.id === zoneId);
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
    const zone = (currentFloor?.restrictedZones || []).find((z) => z.id === zoneId);
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
    if (!draggingZoneId || !currentFloor) return;

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
    if (!resizingZoneId || !currentFloor) return;

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
    if (!file || !currentFloor) return;

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
    if (currentFloor) clearFloorMap(currentFloor.id);
  };

  // Inspector Updates for Selected Station
  const handleUpdateSelectedStation = (field, val) => {
    if (!selectedObjectData || selectedObjectData.kind !== "station" || !currentFloor) return;
    const updated = (currentFloor.stations || []).map((s) => {
      if (s.id !== selectedObjectData.id) return s;
      return { ...s, [field]: val };
    });
    updateFloor(currentFloor.id, { stations: updated });
  };

  // Inspector Updates for Selected Zone
  const handleUpdateSelectedZone = (field, val) => {
    if (!selectedObjectData || selectedObjectData.kind !== "zone" || !currentFloor) return;
    const updated = (currentFloor.restrictedZones || []).map((z) => {
      if (z.id !== selectedObjectData.id) return z;
      return { ...z, [field]: val };
    });
    updateFloor(currentFloor.id, { restrictedZones: updated });
  };

  return {
    activeTool,
    setActiveTool,
    stationTypeToAdd,
    setStationTypeToAdd,
    zoneTypeToAdd,
    setZoneTypeToAdd,
    blueprintOpacity,
    setBlueprintOpacity,
    zoom,
    setZoom,
    pan,
    setPan,
    isPanning,
    viewportRef,
    svgRef,
    cursorCoords,
    selectedItem,
    setSelectedItem,
    showElementsDrawer,
    setShowElementsDrawer,
    isDrawingZone,
    setIsDrawingZone,
    currentDrawZone,
    blueprintInputRef,
    pxToMeters,
    metersToPx,
    selectedObjectData,
    handleCanvasMouseDown,
    handleCanvasMouseMove,
    handleZoneClick,
    handleZoneMouseDown,
    handleZoneResizeMouseDown,
    handleStationMouseDown,
    handleImageUpload,
    handleClearBlueprintImage,
    handleUpdateSelectedStation,
    handleUpdateSelectedZone,
    handleDeleteSelectedItem,
  };
}
