import React, { useState, useRef, useEffect } from "react";
import LiveMapHeader from "../components/map/LiveMapHeader";
import LiveMapCanvas from "../components/map/LiveMapCanvas";
import AgvControlSidePanel from "../components/map/AgvControlSidePanel";
import { useFleet } from "../context/FleetContext";
import { useNavigation } from "../context/NavigationContext";
import { VIEWS, NAVIGATION_MODE } from "../constants";

export default function LiveMapView({
  agvs: propAgvs,
  onSelectAgv: propOnSelectAgv,
}) {
  let fleetCtx = null;
  let navCtx = null;

  try {
    fleetCtx = useFleet();
  } catch (e) {}

  try {
    navCtx = useNavigation();
  } catch (e) {}

  const agvs = propAgvs ?? fleetCtx?.agvs ?? [];
  const onSelectAgv = propOnSelectAgv ?? navCtx?.selectAgv;

  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [selectedAgvId, setSelectedAgvId] = useState(null);

  const viewportRef = useRef(null);
  const dragStartRef = useRef({
    startX: 0,
    startY: 0,
    panX: 0,
    panY: 0,
    hasDragged: false,
  });
  const touchRef = useRef({ dist: 0, startZoom: 1 });

  // Boundary clamping for pan coordinates: prevents floor CAD blueprint from being lost in empty space
  const clampPan = (rawX, rawY, currentZoom = zoom) => {
    const maxOffsetX = Math.max(180, Math.round(350 * currentZoom));
    const maxOffsetY = Math.max(140, Math.round(240 * currentZoom));
    return {
      x: Math.max(-maxOffsetX, Math.min(maxOffsetX, rawX)),
      y: Math.max(-maxOffsetY, Math.min(maxOffsetY, rawY)),
    };
  };

  // Layer Visibility (paths hidden by default per user specification)
  const [layers, setLayers] = useState({
    showAreas: true,
    showPaths: false,
    showStations: true,
    showAgvs: true,
    showTraffic: true,
    showZones: true,
  });

  // Multi-Robot All-Paths Toggle (false by default)
  const [showAllPaths, setShowAllPaths] = useState(false);

  const toggleLayer = (layerId) => {
    if (layerId === "paths") {
      setShowAllPaths((prev) => {
        const next = !prev;
        setLayers((l) => ({ ...l, showPaths: next }));
        return next;
      });
      setSelectedAgvId(null);
      return;
    }
    if (layerId === "agvs") {
      setLayers((l) => ({ ...l, showAgvs: !l.showAgvs }));
      return;
    }
  };

  const handleToggleAllPaths = () => {
    setShowAllPaths((prev) => {
      const next = !prev;
      setLayers((l) => ({ ...l, showPaths: next }));
      return next;
    });
    setSelectedAgvId(null);
  };

  const handleCanvasClick = () => {
    if (dragStartRef.current?.hasDragged) {
      dragStartRef.current.hasDragged = false;
      return;
    }
    setSelectedAgvId(null);
  };

  const selectedAgv = agvs.find((a) => a.id === selectedAgvId);

  // Mouse Wheel & Trackpad Zoom & Pan
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    const handleWheel = (e) => {
      e.preventDefault();

      if (e.ctrlKey || e.metaKey) {
        const zoomFactor = -e.deltaY * 0.015;
        setZoom((prev) => {
          const next = Math.min(Math.max(prev + zoomFactor, 0.4), 3.5);
          const finalZoom = Number(next.toFixed(3));
          setPan((p) => clampPan(p.x, p.y, finalZoom));
          return finalZoom;
        });
        return;
      }

      if (Math.abs(e.deltaX) > 0 || e.shiftKey) {
        const dx = e.shiftKey ? e.deltaY : e.deltaX;
        setPan((prev) => clampPan(prev.x - dx, prev.y - e.deltaY));
      } else {
        const zoomFactor = -e.deltaY * 0.0015;
        setZoom((prev) => {
          const next = Math.min(Math.max(prev + zoomFactor, 0.4), 3.5);
          const finalZoom = Number(next.toFixed(3));
          setPan((p) => clampPan(p.x, p.y, finalZoom));
          return finalZoom;
        });
      }
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, []);

  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      panX: pan.x,
      panY: pan.y,
      hasDragged: false,
    };
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.startX;
    const dy = e.clientY - dragStartRef.current.startY;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
      dragStartRef.current.hasDragged = true;
    }
    setPan(clampPan(dragStartRef.current.panX + dx, dragStartRef.current.panY + dy));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      dragStartRef.current = {
        startX: e.touches[0].clientX,
        startY: e.touches[0].clientY,
        panX: pan.x,
        panY: pan.y,
        hasDragged: false,
      };
    } else if (e.touches.length === 2) {
      setIsDragging(false);
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      touchRef.current = { dist, startZoom: zoom };
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 1 && isDragging) {
      const dx = e.touches[0].clientX - dragStartRef.current.startX;
      const dy = e.touches[0].clientY - dragStartRef.current.startY;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
        dragStartRef.current.hasDragged = true;
      }
      setPan(clampPan(dragStartRef.current.panX + dx, dragStartRef.current.panY + dy));
    } else if (e.touches.length === 2 && touchRef.current.dist > 0) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const scale = dist / touchRef.current.dist;
      const nextZoom = Math.min(
        Math.max(touchRef.current.startZoom * scale, 0.4),
        3.5
      );
      const finalZoom = Number(nextZoom.toFixed(3));
      setZoom(finalZoom);
      setPan((p) => clampPan(p.x, p.y, finalZoom));
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    touchRef.current.dist = 0;
  };

  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const activeFloor = fleetCtx?.activeFloor || {
    id: "floor-g",
    name: "Ground Floor",
    stations: [],
    restrictedZones: [],
  };

  const forklift = fleetCtx?.forklift;
  const isForkliftOnActiveFloor = forklift && forklift.floorId === activeFloor.id;
  const activeRoute = fleetCtx?.activeRoute || [];

  // Ensure any active obstacle from previous sessions is cleared
  useEffect(() => {
    if (fleetCtx?.simulatedObstacle) {
      fleetCtx.removeObstacle();
    }
  }, [fleetCtx]);

  const isDriving = Boolean(
    fleetCtx?.navigationMode === NAVIGATION_MODE.MANUAL ||
    fleetCtx?.teleopOpen ||
    agvs.some((a) => a.status === "Manual Teleop")
  );
  const targetAgvToDrive =
    selectedAgv ||
    agvs.find((a) => a.id === fleetCtx?.drivingAgvId) ||
    forklift ||
    agvs[0];
  const driveRobotLabel = targetAgvToDrive ? targetAgvToDrive.id : "AGV";

  const handleSelectMode = (mode) => {
    if (mode === NAVIGATION_MODE.AUTONOMOUS) {
      fleetCtx?.handBackToAutopilot?.(selectedAgvId);
    } else {
      const idToDrive = selectedAgvId || targetAgvToDrive?.id;
      fleetCtx?.takeManualControl?.(idToDrive);
      if (idToDrive) setSelectedAgvId(idToDrive);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 select-none overflow-hidden relative transition-colors duration-150">
      <LiveMapHeader
        activeFloor={activeFloor}
        buildings={fleetCtx?.buildings}
        activeBuildingId={fleetCtx?.activeBuildingId}
        onSelectBuilding={(id) => fleetCtx?.setActiveBuildingId(id)}
        floors={fleetCtx?.floors}
        activeFloorId={fleetCtx?.activeFloorId}
        onSelectFloor={(id) => fleetCtx?.setActiveFloorId(id)}
      />

      <div className="flex-1 flex overflow-hidden relative min-h-0">
        <LiveMapCanvas
          viewportRef={viewportRef}
          pan={pan}
          zoom={zoom}
          setZoom={(newZoomOrFn) => {
            setZoom((prev) => {
              const next = typeof newZoomOrFn === "function" ? newZoomOrFn(prev) : newZoomOrFn;
              setPan((p) => clampPan(p.x, p.y, next));
              return next;
            });
          }}
          isDragging={isDragging}
          handleMouseDown={handleMouseDown}
          handleMouseMove={handleMouseMove}
          handleMouseUp={handleMouseUp}
          handleTouchStart={handleTouchStart}
          handleTouchMove={handleTouchMove}
          handleTouchEnd={handleTouchEnd}
          handleResetView={handleResetView}
          layers={layers}
          toggleLayer={toggleLayer}
          selectedAgv={selectedAgv}
          setSelectedAgvId={setSelectedAgvId}
          onSelectAgv={onSelectAgv}
          activeFloor={activeFloor}
          forklift={forklift}
          isForkliftOnActiveFloor={isForkliftOnActiveFloor}
          activeRoute={activeRoute}
          agvs={agvs}
          showAllPaths={showAllPaths}
          onCanvasClick={handleCanvasClick}
        />

        {/* Unified AGV Control Side Panel (Teleop Remote + Live Telemetry + Diagnostics) */}
        {selectedAgv && (
          <AgvControlSidePanel
            agv={selectedAgv}
            onClose={() => setSelectedAgvId(null)}
            onSelectAgv={onSelectAgv}
          />
        )}
      </div>
    </div>
  );
}
