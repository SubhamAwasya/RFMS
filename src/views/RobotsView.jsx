import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  MoreVertical,
  Bot,
  Pencil,
  Trash2,
  Zap,
  Sliders,
  Octagon,
  MapPin,
} from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import AddRobotModal from "../components/robots/AddRobotModal";
import EditRobotModal from "../components/robots/EditRobotModal";
import StatusBadge from "../components/common/StatusBadge";
import { useFleet } from "../context/FleetContext";
import { useNavigation } from "../context/NavigationContext";
import { getRobotColorTheme, VIEWS } from "../constants";

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
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [buildingFilter, setBuildingFilter] = useState("ALL");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingRobot, setEditingRobot] = useState(null);

  // Reset to first page when any search or filter criteria changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, typeFilter, statusFilter, buildingFilter, pageSize]);

  const availableTypes = useMemo(() => {
    const set = new Set();
    agvs.forEach((a) => {
      if (a.type) set.add(a.type);
    });
    return Array.from(set);
  }, [agvs]);

  const availableStatuses = useMemo(() => {
    const set = new Set();
    agvs.forEach((a) => {
      if (a.status) set.add(a.status);
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
      const matchesStatus = statusFilter === "ALL" || a.status === statusFilter;
      const matchesBuilding =
        buildingFilter === "ALL" || a.buildingId === buildingFilter;

      return matchesSearch && matchesType && matchesStatus && matchesBuilding;
    });
  }, [agvs, searchTerm, typeFilter, statusFilter, buildingFilter]);

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

  return (
    <div className="flex-1 flex flex-col h-full min-h-0 overflow-hidden p-3.5 sm:p-5 space-y-3.5 sm:space-y-4">
      {/* Top Filter and Search Bar */}
      <div className="shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search AGV by ID, type, location..."
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm"
          />
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
          {/* Building / Facility Filter */}
          {buildings.length > 0 && (
            <select
              value={buildingFilter}
              onChange={(e) => setBuildingFilter(e.target.value)}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none shadow-sm"
              title="Filter by Facility"
            >
              <option value="ALL">All Facilities</option>
              {buildings.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          )}

          {/* Vehicle Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none shadow-sm"
            title="Filter by Vehicle Type"
          >
            <option value="ALL">All Types</option>
            {availableTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none shadow-sm"
            title="Filter by Operational Status"
          >
            <option value="ALL">All States</option>
            {availableStatuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          {/* Add AGV Modal Component */}
          <AddRobotModal agvCount={agvs.length} onAddAgv={onAddAgv} />
        </div>
      </div>

      {/* Modern SaaS Table Container */}
      <div className="flex-1 min-h-0 flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
        <div className="flex-1 min-h-0 overflow-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[700px]">
            <thead className="sticky top-0 z-10 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-xs">
              <tr className="text-slate-500 dark:text-slate-400 font-semibold">
                <th className="p-3.5 w-10">
                  <input type="checkbox" className="rounded accent-blue-600" />
                </th>
                <th className="p-3.5">ID</th>
                <th className="p-3.5">Image</th>
                <th className="p-3.5">Type</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Battery</th>
                <th className="p-3.5">Location</th>
                <th className="p-3.5">Current Mission</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan="9"
                    className="text-center py-12 text-slate-500 dark:text-slate-400"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        No AGVs found matching criteria
                      </p>
                      <p className="text-xs text-slate-400">
                        Try clearing filters or search term, or click{" "}
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                          Demo Fleet
                        </span>{" "}
                        in the top navbar to reload the multi-building fleet.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedRobots.map((robot) => (
                  <tr
                    key={robot.id}
                    onClick={() => onSelectAgv?.(robot.id)}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 cursor-pointer transition-colors"
                  >
                    <td className="p-3.5" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        className="rounded accent-blue-600"
                      />
                    </td>

                    <td className="p-3.5 font-bold text-slate-900 dark:text-white">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0 ring-1 ring-white dark:ring-slate-900"
                          style={{
                            backgroundColor: getRobotColorTheme(robot.id).hex,
                          }}
                        />
                        <span>{robot.id}</span>
                      </div>
                    </td>

                    <td className="p-3.5">
                      <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300">
                        <Bot className="w-5 h-5 text-blue-600" />
                      </div>
                    </td>

                    <td className="p-3.5 font-medium text-slate-700 dark:text-slate-300">
                      {robot.type}
                    </td>

                    <td className="p-3.5">
                      <StatusBadge status={robot.status} />
                    </td>

                    <td className="p-3.5 min-w-[140px]">
                      <div className="flex items-center gap-2.5">
                        <div className="w-16 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              robot.battery < 25
                                ? "bg-red-500"
                                : robot.battery < 50
                                  ? "bg-amber-500"
                                  : "bg-emerald-500"
                            }`}
                            style={{ width: `${robot.battery}%` }}
                          />
                        </div>
                        <span className="font-semibold text-slate-700 dark:text-slate-300 font-mono">
                          {robot.battery}%
                        </span>
                      </div>
                    </td>

                    <td className="p-3.5 text-slate-600 dark:text-slate-400">
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-800 dark:text-slate-200">
                          {robot.location || "Facility Floor"}
                        </span>
                        {robot.buildingId && (
                          <span className="text-[10px] text-slate-400">
                            {buildings.find((b) => b.id === robot.buildingId)
                              ?.name || robot.buildingId}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="p-3.5 text-slate-800 dark:text-slate-200 font-medium">
                      {robot.currentMission || "—"}
                    </td>

                    {/* Actions Cell */}
                    <td
                      className="p-3.5 text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingRobot(robot);
                          }}
                          className="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                          title="Edit AGV"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>

                        <DropdownMenu.Root>
                          <DropdownMenu.Trigger asChild>
                            <button className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </DropdownMenu.Trigger>
                          <DropdownMenu.Portal>
                            <DropdownMenu.Content
                              align="end"
                              sideOffset={5}
                              collisionPadding={12}
                              className="min-w-[175px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-1 shadow-xl text-xs font-medium z-50 text-slate-800 dark:text-slate-200 focus:outline-none animate-in fade-in zoom-in-95 duration-100"
                            >
                              <DropdownMenu.Item
                                onClick={() => onSelectAgv?.(robot.id)}
                                className="px-2.5 py-1.5 rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 outline-none transition-colors flex items-center gap-2"
                              >
                                <Sliders className="w-3.5 h-3.5 text-slate-400" />
                                <span>View Detail & Control</span>
                              </DropdownMenu.Item>
                              <DropdownMenu.Item
                                onClick={() => {
                                  const targetFloor = (
                                    fleetCtx?.floors || []
                                  ).find((f) => f?.id === robot?.floorId);
                                  const targetBuildingId =
                                    robot?.buildingId ||
                                    targetFloor?.buildingId;
                                  if (
                                    targetBuildingId &&
                                    fleetCtx?.setActiveBuildingId
                                  ) {
                                    fleetCtx.setActiveBuildingId(
                                      targetBuildingId,
                                    );
                                  }
                                  if (
                                    robot?.floorId &&
                                    fleetCtx?.setActiveFloorId
                                  ) {
                                    fleetCtx.setActiveFloorId(robot.floorId);
                                  }
                                  if (navCtx?.selectAgvOnMap) {
                                    navCtx.selectAgvOnMap(robot.id);
                                  } else {
                                    navCtx?.navigateTo(VIEWS.MAP, {
                                      agvId: robot.id,
                                    });
                                  }
                                }}
                                className="px-2.5 py-1.5 rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 outline-none transition-colors flex items-center gap-2"
                              >
                                <MapPin className="w-3.5 h-3.5 text-blue-500" />
                                <span>Track on Live Map</span>
                              </DropdownMenu.Item>
                              <DropdownMenu.Item
                                onClick={() => setEditingRobot(robot)}
                                className="px-2.5 py-1.5 rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 outline-none transition-colors flex items-center gap-2"
                              >
                                <Pencil className="w-3.5 h-3.5 text-slate-400" />
                                <span>Edit AGV</span>
                              </DropdownMenu.Item>
                              <DropdownMenu.Item
                                onClick={() => {
                                  if (robot.id === "FL-01")
                                    fleetCtx?.sendToCharger();
                                  else
                                    fleetCtx?.updateAgv(robot.id, {
                                      status: "Charging",
                                    });
                                }}
                                className="px-2.5 py-1.5 rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 outline-none transition-colors flex items-center gap-2"
                              >
                                <Zap className="w-3.5 h-3.5 text-amber-500" />
                                <span>Send to Charger</span>
                              </DropdownMenu.Item>
                              <DropdownMenu.Separator className="h-px bg-slate-100 dark:bg-slate-800 my-1" />
                              <DropdownMenu.Item
                                onClick={() => {
                                  if (fleetCtx?.stopSpecificAgv)
                                    fleetCtx.stopSpecificAgv(robot.id);
                                  else
                                    fleetCtx?.updateAgv(robot.id, {
                                      status: "Idle",
                                      speed: 0,
                                    });
                                }}
                                className="px-2.5 py-1.5 rounded-lg cursor-pointer text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 outline-none transition-colors font-medium flex items-center gap-2"
                              >
                                <Octagon className="w-3.5 h-3.5" />
                                <span>Stop AGV</span>
                              </DropdownMenu.Item>
                              <DropdownMenu.Item
                                onClick={() => fleetCtx?.deleteAgv(robot.id)}
                                className="px-2.5 py-1.5 rounded-lg cursor-pointer text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 outline-none transition-colors font-medium flex items-center gap-2"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Delete AGV</span>
                              </DropdownMenu.Item>
                            </DropdownMenu.Content>
                          </DropdownMenu.Portal>
                        </DropdownMenu.Root>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Working Pagination Footer */}
        <div className="shrink-0 p-3 sm:p-3.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400 font-medium">
          {/* Left: Page Buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={safeCurrentPage <= 1}
              className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-white dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-base font-semibold"
              title="Previous Page"
              aria-label="Previous Page"
            >
              ‹
            </button>

            {getPageNumbers().map((p, idx) =>
              p === "..." ? (
                <span
                  key={`ellipsis-${idx}`}
                  className="w-8 h-8 flex items-center justify-center text-slate-400 select-none font-bold"
                >
                  …
                </span>
              ) : (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p)}
                  className={`w-8 h-8 rounded-lg font-bold flex items-center justify-center transition-colors ${
                    safeCurrentPage === p
                      ? "bg-blue-600 text-white shadow-sm"
                      : "border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  {p}
                </button>
              ),
            )}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={safeCurrentPage >= totalPages}
              className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-white dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-base font-semibold"
              title="Next Page"
              aria-label="Next Page"
            >
              ›
            </button>
          </div>

          {/* Right: Page Size Selector & Showing Counter */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span>Show</span>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer font-medium"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
              <span>per page</span>
            </div>

            <div className="font-mono text-slate-600 dark:text-slate-400 text-xs">
              {totalItems === 0
                ? "0 of 0 AGVs"
                : `${startIndex + 1}-${endIndex} of ${totalItems} AGVs`}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Robot Modal */}
      <EditRobotModal
        robot={editingRobot}
        isOpen={Boolean(editingRobot)}
        onClose={() => setEditingRobot(null)}
        onSave={handleSaveRobot}
        onDelete={handleDeleteRobot}
      />
    </div>
  );
}
