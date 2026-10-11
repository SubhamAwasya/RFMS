import React from "react";
import {
  ArrowLeft,
  Pencil,
  Trash2,
  MoreVertical,
  MapPin,
  Zap,
  Battery,
  AlertTriangle,
} from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import StatusBadge from "../common/StatusBadge";

export default function RobotDetailHeader({
  agv,
  theme,
  agvState,
  onBack,
  onEdit,
  onNavigateMap,
  onSendToCharger,
  onSimulateLowBattery,
  onSimulateFault,
  onDelete,
}) {
  if (!agv) return null;

  return (
    <div className="space-y-3">
      {/* Top Navigation Row & Actions */}
      <div className="flex items-center justify-between pb-1">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to AGVs</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onEdit}
            className="h-8 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Pencil className="w-3.5 h-3.5" />
            <span>Edit AGV</span>
          </button>

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
                className="min-w-[175px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-1 shadow-xl text-xs font-medium z-50 text-slate-800 dark:text-slate-200 focus:outline-none animate-in fade-in zoom-in-95 duration-100"
              >
                <DropdownMenu.Item
                  onClick={onEdit}
                  className="px-2.5 py-1.5 rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 outline-none transition-colors flex items-center gap-2"
                >
                  <Pencil className="w-3.5 h-3.5 text-slate-400" />
                  <span>Edit AGV</span>
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  onClick={onNavigateMap}
                  className="px-2.5 py-1.5 rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 outline-none transition-colors flex items-center gap-2"
                >
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>Locate on Live Map</span>
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  onClick={onSendToCharger}
                  className="px-2.5 py-1.5 rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 outline-none transition-colors flex items-center gap-2"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  <span>Send to Charger</span>
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  onClick={onSimulateLowBattery}
                  className="px-2.5 py-1.5 rounded-lg cursor-pointer hover:bg-amber-50 dark:hover:bg-amber-950/30 text-amber-600 dark:text-amber-400 outline-none transition-colors flex items-center gap-2"
                >
                  <Battery className="w-3.5 h-3.5 text-amber-500" />
                  <span>Simulate Low Battery (&lt;10%)</span>
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  onClick={onSimulateFault}
                  className="px-2.5 py-1.5 rounded-lg cursor-pointer hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600 dark:text-red-400 outline-none transition-colors flex items-center gap-2"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                  <span>Simulate Fault &amp; Auto-Fix</span>
                </DropdownMenu.Item>

                <DropdownMenu.Separator className="h-px bg-slate-100 dark:bg-slate-800 my-1" />
                <DropdownMenu.Item
                  onClick={onDelete}
                  className="px-2.5 py-1.5 rounded-lg cursor-pointer text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 outline-none transition-colors font-medium flex items-center gap-2"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete AGV</span>
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
      </div>

      {/* Title & Status Badge */}
      <div className="flex items-center gap-2.5">
        <span
          className="w-3 h-3 rounded-full ring-2 ring-white dark:ring-slate-900 shrink-0"
          style={{ backgroundColor: theme?.hex || "#06b6d4" }}
        />
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">
          {agv.id} - {agv.type}
        </h1>
        <StatusBadge status={agvState || agv.status} />
      </div>
    </div>
  );
}
