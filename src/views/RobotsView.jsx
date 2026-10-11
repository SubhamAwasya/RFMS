import React, { useState } from "react";
import { Search, MoreVertical, Bot, Pencil, Trash2, Zap } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import AddRobotModal from "../components/robots/AddRobotModal";
import EditRobotModal from "../components/robots/EditRobotModal";
import StatusBadge from "../components/common/StatusBadge";
import { useFleet } from "../context/FleetContext";
import { useNavigation } from "../context/NavigationContext";
import { getRobotColorTheme } from "../constants";

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
  const onSelectAgv = propOnSelectAgv ?? navCtx?.selectAgv;
  const onAddAgv = propOnAddAgv ?? fleetCtx?.addAgv;

  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [editingRobot, setEditingRobot] = useState(null);

  const handleSaveRobot = (id, updates) => {
    fleetCtx?.updateAgv?.(id, updates);
  };

  const handleDeleteRobot = (id) => {
    fleetCtx?.deleteAgv?.(id);
  };

  const filtered = agvs.filter((a) => {
    const matchesSearch =
      a.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.type.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === "ALL" || a.type === typeFilter;
    const matchesStatus = statusFilter === "ALL" || a.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto p-4 sm:p-6 space-y-5">

      {/* Top Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
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
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="flex-1 sm:flex-none bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none shadow-sm"
          >
            <option value="ALL">All Types</option>
            <option value="Forklift AGV">Forklift AGV</option>
            <option value="Flatbed Payload Carrier AGV">Flatbed Payload Carrier AGV</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="flex-1 sm:flex-none bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none shadow-sm"
          >
            <option value="ALL">All States</option>
            <option value="In Mission">In Mission</option>
            <option value="Charging">Charging</option>
            <option value="Idle">Idle</option>
            <option value="Waiting">Waiting</option>
          </select>

          {/* Add AGV Modal Component */}
          <AddRobotModal agvCount={agvs.length} onAddAgv={onAddAgv} />
        </div>
      </div>

      {/* Modern SaaS Table Container */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-semibold">
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
                <td colSpan="9" className="text-center py-12 text-slate-500 dark:text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No AGVs currently registered in the fleet</p>
                    <p className="text-xs text-slate-400">Click <span className="font-semibold text-blue-600 dark:text-blue-400">+ Add AGV</span> above, or click <span className="font-semibold text-emerald-600 dark:text-emerald-400">Demo (10 AGVs)</span> in the top navbar to load rich fleet data.</p>
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((robot) => (
              <tr
                key={robot.id}
                onClick={() => onSelectAgv?.(robot.id)}
                className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 cursor-pointer transition-colors"
              >
                <td className="p-3.5" onClick={(e) => e.stopPropagation()}>
                  <input type="checkbox" className="rounded accent-blue-600" />
                </td>

                <td className="p-3.5 font-bold text-slate-900 dark:text-white">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0 ring-1 ring-white dark:ring-slate-900"
                      style={{ backgroundColor: getRobotColorTheme(robot.id).hex }}
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
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {robot.battery}%
                    </span>
                  </div>
                </td>

                <td className="p-3.5 text-slate-600 dark:text-slate-400">
                  {robot.location}
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
                      title="Edit AGV Specifications"
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
                            onClick={() => setEditingRobot(robot)}
                            className="px-3 py-2 rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 outline-none transition-colors flex items-center gap-2 font-semibold text-blue-600 dark:text-blue-400"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                            <span>Edit AGV / Robot</span>
                          </DropdownMenu.Item>
                          <DropdownMenu.Item
                            onClick={() => onSelectAgv?.(robot.id)}
                            className="px-3 py-2 rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 outline-none transition-colors"
                          >
                            View Detail & Control
                          </DropdownMenu.Item>
                          <DropdownMenu.Item
                            onClick={() => {
                              if (robot.id === "FL-01") fleetCtx?.sendToCharger();
                              else fleetCtx?.updateAgv(robot.id, { status: "Charging" });
                            }}
                            className="px-3 py-2 rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 outline-none transition-colors flex items-center gap-2"
                          >
                            <Zap className="w-3.5 h-3.5 text-amber-500" />
                            <span>Send to Charger</span>
                          </DropdownMenu.Item>
                          <DropdownMenu.Separator className="h-px bg-slate-100 dark:bg-slate-800 my-1" />
                          <DropdownMenu.Item
                            onClick={() => fleetCtx?.deleteAgv(robot.id)}
                            className="px-3 py-2 rounded-lg cursor-pointer text-red-600 hover:bg-red-50 dark:hover:bg-red-500/15 outline-none transition-colors font-semibold flex items-center gap-2"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete AGV</span>
                          </DropdownMenu.Item>
                          <DropdownMenu.Separator className="h-px bg-slate-100 dark:bg-slate-800 my-1" />
                          <DropdownMenu.Item
                            onClick={() => fleetCtx?.updateAgv(robot.id, { status: "Idle", speed: 0 })}
                            className="px-3 py-2 rounded-lg cursor-pointer text-red-600 hover:bg-red-50 dark:hover:bg-red-500/15 outline-none transition-colors font-semibold"
                          >
                            Stop AGV
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

        {/* Pagination Footer */}
        <div className="p-3.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400 font-medium">
          <div className="flex items-center gap-1">
            <button className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-white dark:hover:bg-slate-800 disabled:opacity-40">
              ‹
            </button>
            <button className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center shadow-sm">
              1
            </button>
            <button className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-white dark:hover:bg-slate-800">
              2
            </button>
            <button className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-white dark:hover:bg-slate-800">
              3
            </button>
            <button className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-white dark:hover:bg-slate-800">
              ›
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div>Show 10 per page</div>
            <div>1-6 of {agvs.length}</div>
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
