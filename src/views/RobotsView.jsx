import React, { useState, useEffect, useMemo } from "react";
import RobotsToolbar from "../components/robots/RobotsToolbar";
import RobotsTable from "../components/robots/RobotsTable";
import RobotsPagination from "../components/robots/RobotsPagination";
import EditRobotModal from "../components/robots/EditRobotModal";
import { useFleet } from "../context/FleetContext";
import { useNavigation } from "../context/NavigationContext";
import { VIEWS } from "../constants";

export default function RobotsView({
  agvs: propAgvs,
  onSelectAgv: propOnSelectAgv,
  onAddAgv: propOnAddAgv,
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
  const buildings = fleetCtx?.buildings || [];
  const onSelectAgv = propOnSelectAgv ?? navCtx?.selectAgv;
  const onAddAgv = propOnAddAgv ?? fleetCtx?.addAgv;

  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [buildingFilter, setBuildingFilter] = useState("ALL");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingRobot, setEditingRobot] = useState(null);

  // Reset to first page when any search or filter criteria changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, typeFilter, buildingFilter, pageSize]);

  const availableTypes = useMemo(() => {
    const set = new Set();
    agvs.forEach((a) => {
      if (a.type) set.add(a.type);
    });
    return Array.from(set);
  }, [agvs]);

  const handleSaveRobot = (id, updates) => {
    fleetCtx?.updateAgv?.(id, updates);
  };

  const handleDeleteRobot = (id) => {
    fleetCtx?.deleteAgv?.(id);
  };

  const filtered = useMemo(() => {
    return agvs.filter((a) => {
      const q = searchTerm.trim().toLowerCase();
      const matchesSearch =
        !q ||
        (a.id && a.id.toLowerCase().includes(q)) ||
        (a.name && a.name.toLowerCase().includes(q)) ||
        (a.location && a.location.toLowerCase().includes(q)) ||
        (a.type && a.type.toLowerCase().includes(q));

      const matchesType = typeFilter === "ALL" || a.type === typeFilter;
      const matchesBuilding =
        buildingFilter === "ALL" || a.buildingId === buildingFilter;

      return matchesSearch && matchesType && matchesBuilding;
    });
  }, [agvs, searchTerm, typeFilter, buildingFilter]);

  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const paginatedRobots = filtered.slice(startIndex, endIndex);

  const getPageNumbers = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages = [];
    if (safeCurrentPage <= 3) {
      pages.push(1, 2, 3, "...", totalPages);
    } else if (safeCurrentPage >= totalPages - 2) {
      pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, "...", safeCurrentPage, "...", totalPages);
    }
    return pages;
  };

  const handleTrackOnMap = (robot) => {
    const targetFloor = (fleetCtx?.floors || []).find(
      (f) => f?.id === robot?.floorId
    );
    const targetBuildingId = robot?.buildingId || targetFloor?.buildingId;
    if (targetBuildingId && fleetCtx?.setActiveBuildingId) {
      fleetCtx.setActiveBuildingId(targetBuildingId);
    }
    if (robot?.floorId && fleetCtx?.setActiveFloorId) {
      fleetCtx.setActiveFloorId(robot.floorId);
    }
    if (navCtx?.selectAgvOnMap) {
      navCtx.selectAgvOnMap(robot.id);
    } else {
      navCtx?.navigateTo(VIEWS.MAP, { agvId: robot.id });
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full min-h-0 overflow-hidden p-3.5 sm:p-5 space-y-3.5 sm:space-y-4">
      {/* 1. Search and Filters Toolbar */}
      <RobotsToolbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        buildingFilter={buildingFilter}
        setBuildingFilter={setBuildingFilter}
        buildings={buildings}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        availableTypes={availableTypes}
        agvCount={agvs.length}
        onAddAgv={onAddAgv}
      />

      {/* 2. Modern Fleet Table */}
      <RobotsTable
        filtered={filtered}
        paginatedRobots={paginatedRobots}
        buildings={buildings}
        onSelectAgv={onSelectAgv}
        onTrackOnMap={handleTrackOnMap}
        onEditRobot={(robot) => setEditingRobot(robot)}
        onSendToCharger={(id) => fleetCtx?.sendToCharger?.(id)}
        onSimulateLowBattery={(id) => fleetCtx?.simulateLowBattery?.(id)}
        onSimulateFault={(id) => fleetCtx?.simulateRobotFault?.(id)}
        onDeleteRobot={handleDeleteRobot}
      />

      {/* 3. Pagination Controls */}
      <RobotsPagination
        startIndex={startIndex}
        endIndex={endIndex}
        totalItems={totalItems}
        pageSize={pageSize}
        setPageSize={setPageSize}
        safeCurrentPage={safeCurrentPage}
        totalPages={totalPages}
        getPageNumbers={getPageNumbers}
        setCurrentPage={setCurrentPage}
      />

      {/* Edit Robot Modal */}
      {editingRobot && (
        <EditRobotModal
          robot={editingRobot}
          isOpen={!!editingRobot}
          onClose={() => setEditingRobot(null)}
          onSave={handleSaveRobot}
          onDelete={handleDeleteRobot}
        />
      )}
    </div>
  );
}
