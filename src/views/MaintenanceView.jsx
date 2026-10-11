import React, { useState } from "react";
import { Wrench, MoreVertical, Plus } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useFleet } from "../context/FleetContext";

export default function MaintenanceView({
  maintenance: propMaintenance,
  onServiceLogged,
}) {
  let fleetCtx = null;
  try {
    fleetCtx = useFleet();
  } catch (e) {}

  const maintenance = propMaintenance ?? fleetCtx?.maintenance ?? [];

  const [tab, setTab] = useState("UPCOMING");

  const filtered = maintenance.filter((m) => {
    if (tab === "UPCOMING") return m.status !== "Overdue";
    if (tab === "OVERDUE") return m.status === "Overdue";
    return true; // History
  });

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto p-4 sm:p-6 space-y-5">
      {/* Tabs and Top Header */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-px">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setTab("UPCOMING")}
            className={`px-4 py-2.5 text-xs font-semibold whitespace-nowrap transition-colors border-b-2 ${
              tab === "UPCOMING"
                ? "border-blue-600 text-blue-600 dark:text-blue-400"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
            }`}
          >
            Upcoming ({maintenance.filter((m) => m.status !== "Overdue").length})
          </button>
          <button
            onClick={() => setTab("OVERDUE")}
            className={`px-4 py-2.5 text-xs font-semibold whitespace-nowrap transition-colors border-b-2 ${
              tab === "OVERDUE"
                ? "border-blue-600 text-blue-600 dark:text-blue-400"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
            }`}
          >
            Overdue ({maintenance.filter((m) => m.status === "Overdue").length})
          </button>
          <button
            onClick={() => setTab("HISTORY")}
            className={`px-4 py-2.5 text-xs font-semibold whitespace-nowrap transition-colors border-b-2 ${
              tab === "HISTORY"
                ? "border-blue-600 text-blue-600 dark:text-blue-400"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"
            }`}
          >
            History
          </button>
        </div>

        <button
          onClick={() => onServiceLogged?.() || alert("Scheduled maintenance ticket logged.")}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Inspection</span>
        </button>
      </div>

      {/* Maintenance Schedule Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse min-w-[650px]">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-semibold">
              <th className="p-3.5">ID</th>
              <th className="p-3.5">Target AGV</th>
              <th className="p-3.5">Service Procedure</th>
              <th className="p-3.5">Scheduled Due Date</th>
              <th className="p-3.5">Condition Status</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filtered.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
              >
                <td className="p-3.5 font-bold text-slate-900 dark:text-white">
                  {item.id}
                </td>
                <td className="p-3.5 font-semibold text-blue-600 dark:text-blue-400">
                  {item.agv}
                </td>
                <td className="p-3.5 font-medium text-slate-800 dark:text-slate-200">
                  {item.service}
                </td>
                <td className="p-3.5 text-slate-500 dark:text-slate-400">
                  {item.dueDate}
                </td>
                <td className="p-3.5">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                      item.status === "Due Soon"
                        ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/15 dark:text-amber-400 dark:border-amber-500/30"
                        : item.status === "Overdue"
                        ? "bg-red-50 text-red-700 border-red-200 dark:bg-red-500/15 dark:text-red-400 dark:border-red-500/30"
                        : "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/15 dark:text-blue-400 dark:border-blue-500/30"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="p-3.5 text-right">
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
                        className="min-w-[160px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-1 shadow-xl text-xs font-medium z-50 text-slate-800 dark:text-slate-200 focus:outline-none animate-in fade-in zoom-in-95 duration-100"
                      >
                        <DropdownMenu.Item className="px-3 py-2 rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 outline-none transition-colors">
                          Log Inspection
                        </DropdownMenu.Item>
                        <DropdownMenu.Item className="px-3 py-2 rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 outline-none transition-colors">
                          Reschedule Date
                        </DropdownMenu.Item>
                      </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                  </DropdownMenu.Root>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
