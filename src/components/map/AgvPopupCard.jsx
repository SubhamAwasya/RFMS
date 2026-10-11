import React from "react";
import { ArrowRight, X, Radio, Zap } from "lucide-react";
import { useFleet } from "../../context/FleetContext";
import { getRobotColorTheme } from "../../constants";

export default function AgvPopupCard({ agv, onClose, onControl }) {
  const fleetCtx = useFleet();
  if (!agv) return null;

  const isForklift = agv.type === "Forklift AGV" || (!agv.type && agv.id?.startsWith("FL"));
  const isFlatbed = agv.type === "Flatbed Payload Carrier AGV" || agv.id?.startsWith("FB");
  const theme = getRobotColorTheme(agv.id);

  return (
    <div
      className="absolute top-4 inset-x-4 sm:inset-x-auto sm:right-5 sm:top-5 z-30 sm:w-80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-700 rounded-2xl p-4 shadow-2xl animate-in fade-in transition-colors pointer-events-auto"
      onMouseDown={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2.5 mb-2.5">
        <div className="flex items-center gap-2">
          <span
            className="w-2.5 h-2.5 rounded-full animate-pulse"
            style={{ backgroundColor: theme.hex }}
          />
          <span
            className="text-sm font-bold"
            style={{ color: theme.hex }}
          >
            {agv.id}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-normal">
            ({agv.name})
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-700 dark:hover:text-white text-sm"
          title="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-1.5 text-xs">
        <div className="flex justify-between">
          <span className="text-slate-500 dark:text-slate-400">Type:</span>
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            {agv.type || "AGV"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500 dark:text-slate-400">Status:</span>
          <span className="font-semibold" style={{ color: theme.hex }}>
            {agv.status}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500 dark:text-slate-400">Speed:</span>
          <span className="text-slate-900 dark:text-white font-medium">
            {agv.speed?.toFixed(1)} m/s
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500 dark:text-slate-400">Battery:</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-bold">
            {Math.round(agv.battery)}%
          </span>
        </div>

        {isForklift && (
          <>
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">Fork Height:</span>
              <span className="font-mono text-cyan-600 dark:text-cyan-400 font-semibold">
                {agv.fork?.heightMeters?.toFixed(2) ?? "0.00"} m
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">Payload:</span>
              <span className="text-slate-900 dark:text-white font-medium">
                {agv.cargo
                  ? `${agv.cargo.palletId} (${agv.cargo.weightKg}kg)`
                  : "Empty Forks"}
              </span>
            </div>
          </>
        )}

        {isFlatbed && (
          <>
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">Platform:</span>
              <span className="font-semibold text-purple-600 dark:text-purple-400">
                Heavy Duty Deck
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">Payload:</span>
              <span className="text-slate-900 dark:text-white font-medium">
                {agv.cargo
                  ? `${agv.cargo.palletId} (${agv.cargo.weightKg}kg)`
                  : agv.payload || "1,200 kg Max Deck"}
              </span>
            </div>
          </>
        )}

        <div className="flex justify-between">
          <span className="text-slate-500 dark:text-slate-400">Location:</span>
          <span className="text-slate-900 dark:text-white font-medium truncate max-w-[160px]">
            {agv.location}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-3.5 space-y-2">
        {(isForklift || isFlatbed) && (
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                fleetCtx?.takeManualControl(agv.id);
                onClose?.();
              }}
              className="py-1.5 px-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white text-[11px] font-semibold shadow-xs transition-colors flex items-center justify-center gap-1"
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Drive Now</span>
            </button>
            <button
              onClick={() => fleetCtx?.sendToCharger()}
              className="py-1.5 px-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg text-slate-800 dark:text-slate-200 text-[11px] font-semibold border border-slate-200 dark:border-slate-700 transition-colors flex items-center justify-center gap-1"
            >
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>To Charger</span>
            </button>
          </div>
        )}

        <button
          onClick={() => onControl(agv.id)}
          className="w-full py-1.5 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg text-white text-xs font-semibold shadow-xs transition-all flex items-center justify-center gap-1.5"
        >
          <span>Detailed Diagnostics</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
