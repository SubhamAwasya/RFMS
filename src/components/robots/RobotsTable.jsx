import React from "react";
import {
  Bot,
  MoreVertical,
  Sliders,
  MapPin,
  Pencil,
  Zap,
  Battery,
  AlertTriangle,
  Trash2,
} from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import StatusBadge from "../common/StatusBadge";
import { getRobotColorTheme } from "../../constants";

export default function RobotsTable({
  filtered = [],
  paginatedRobots = [],
  buildings = [],
  onSelectAgv,
  onTrackOnMap,
  onEditRobot,
  onSendToCharger,
  onSimulateLowBattery,
  onSimulateFault,
  onDeleteRobot,
}) {
  return (
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
                      in the top navbar to reload the fleet.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedRobots.map((robot) => {
                const theme = getRobotColorTheme(robot.id);
                const batt = Math.round(
                  typeof robot.battery === "number" ? robot.battery : 100
                );
                const isCharging = robot.status === "Charging";
                const drainRatePerSec = (robot.batteryDrainRate || 0.014) * 20;

                return (
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
                          style={{ backgroundColor: theme.hex }}
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
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2.5">
                          <div className="w-16 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-300 ${
                                batt < 25
                                  ? "bg-red-500"
                                  : batt < 50
                                  ? "bg-amber-500"
                                  : "bg-emerald-500"
                              }`}
                              style={{ width: `${batt}%` }}
                            />
                          </div>
                          <span className="font-semibold text-slate-700 dark:text-slate-300 font-mono text-xs">
                            {batt}%
                          </span>
                        </div>
                        <div className="text-[10px] font-mono leading-none">
                          {isCharging ? (
                            <span className="text-emerald-500 dark:text-emerald-400 font-semibold">
                              ⚡ +{(0.55 * 20).toFixed(0)}%/s charge
                            </span>
                          ) : (
                            <span className="text-slate-400 dark:text-slate-500">
                              ⚡ ~{drainRatePerSec.toFixed(2)}%/s drain
                            </span>
                          )}
                        </div>
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
                      <div className="flex items-center justify-end">
                        <DropdownMenu.Root>
                          <DropdownMenu.Trigger asChild>
                            <button className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer">
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
                                onClick={() => onTrackOnMap?.(robot)}
                                className="px-2.5 py-1.5 rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 outline-none transition-colors flex items-center gap-2"
                              >
                                <MapPin className="w-3.5 h-3.5 text-blue-500" />
                                <span>Track on Live Map</span>
                              </DropdownMenu.Item>
                              <DropdownMenu.Item
                                onClick={() => onEditRobot?.(robot)}
                                className="px-2.5 py-1.5 rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 outline-none transition-colors flex items-center gap-2"
                              >
                                <Pencil className="w-3.5 h-3.5 text-slate-400" />
                                <span>Edit AGV</span>
                              </DropdownMenu.Item>
                              <DropdownMenu.Item
                                onClick={() => onSendToCharger?.(robot.id)}
                                className="px-2.5 py-1.5 rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 outline-none transition-colors flex items-center gap-2"
                              >
                                <Zap className="w-3.5 h-3.5 text-amber-500" />
                                <span>Send to Charger</span>
                              </DropdownMenu.Item>
                              <DropdownMenu.Item
                                onClick={() => onSimulateLowBattery?.(robot.id)}
                                className="px-2.5 py-1.5 rounded-lg cursor-pointer hover:bg-amber-50 dark:hover:bg-amber-950/30 text-amber-600 dark:text-amber-400 outline-none transition-colors flex items-center gap-2"
                              >
                                <Battery className="w-3.5 h-3.5 text-amber-500" />
                                <span>Simulate Low Battery (&lt;10%)</span>
                              </DropdownMenu.Item>
                              <DropdownMenu.Item
                                onClick={() => onSimulateFault?.(robot.id)}
                                className="px-2.5 py-1.5 rounded-lg cursor-pointer hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600 dark:text-red-400 outline-none transition-colors flex items-center gap-2"
                              >
                                <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                                <span>Simulate Fault &amp; Auto-Fix</span>
                              </DropdownMenu.Item>
                              <DropdownMenu.Separator className="h-px bg-slate-100 dark:bg-slate-800 my-1" />
                              <DropdownMenu.Item
                                onClick={() => onDeleteRobot?.(robot.id)}
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
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
