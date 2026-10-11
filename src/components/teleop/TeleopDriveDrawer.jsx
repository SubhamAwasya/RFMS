import React, { useEffect } from "react";
import {
  Radio,
  X,
  ShieldCheck,
  ShieldAlert,
  Compass,
  Gauge,
  Sliders,
  Package,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Octagon,
  Battery,
} from "lucide-react";
import { useFleet } from "../../context/FleetContext";

export default function TeleopDriveDrawer({ onClose }) {
  const {
    forklift,
    agvs,
    drivingAgvId,
    manualSpeedProfile,
    setManualSpeedProfile,
    handBackToAutopilot,
    manualDrive,
    setForkHeight,
    togglePalletClamp,
  } = useFleet();

  const activeAgv =
    (agvs || []).find((a) => a.id === drivingAgvId) ||
    forklift ||
    (agvs || [])[0];

  // Keyboard driving listener while drawer is open
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        e.target.tagName === "INPUT" ||
        e.target.tagName === "TEXTAREA" ||
        e.target.tagName === "SELECT"
      ) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case "w":
        case "arrowup":
          e.preventDefault();
          manualDrive("FORWARD");
          break;
        case "s":
        case "arrowdown":
          e.preventDefault();
          manualDrive("REVERSE");
          break;
        case "a":
        case "arrowleft":
          e.preventDefault();
          manualDrive("LEFT");
          break;
        case "d":
        case "arrowright":
          e.preventDefault();
          manualDrive("RIGHT");
          break;
        case " ":
          e.preventDefault();
          manualDrive("BRAKE");
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [manualDrive]);

  const frontDist = activeAgv?.proximityRadar?.frontDistMeters ?? 4.8;
  const isDangerRadar = frontDist < 1.0;
  const isWarnRadar = frontDist >= 1.0 && frontDist < 3.0;

  const handleExit = () => {
    handBackToAutopilot?.();
    onClose?.();
  };

  return (
    <aside className="w-84 sm:w-92 max-w-[85vw] h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex flex-col z-30 shadow-2xl transition-all duration-200 shrink-0 select-none">
      {/* Header */}
      <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-500/15 border border-blue-500/30 text-blue-500 dark:text-blue-400">
            <Radio className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>Drive {activeAgv?.id || "AGV"}</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded-md uppercase font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                Teleop
              </span>
            </h3>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              Live map tracking active • Use WASD
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleExit}
            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-semibold transition-colors flex items-center gap-1 shadow-xs"
            title="Return robot to autopilot and close drive panel"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Autopilot</span>
          </button>
          <button
            onClick={handleExit}
            className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Close Panel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Body Content */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5 text-xs">
        {/* Live Status Card */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-200 font-semibold">
              <Compass className="w-3.5 h-3.5 text-blue-500" />
              <span>Heading: {activeAgv?.position?.headingDeg ?? activeAgv?.heading ?? 180}°</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
              <Battery className="w-3.5 h-3.5" />
              <span>{Math.round(activeAgv?.battery || 100)}%</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-slate-200/70 dark:border-slate-700/50">
            <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
              <Gauge className="w-3.5 h-3.5 text-blue-500" />
              <span>Speed: {activeAgv?.speed?.toFixed(1) || "0.0"} m/s</span>
            </div>

            <div className="flex items-center gap-1.5 text-[11px]">
              <ShieldAlert
                className={`w-3.5 h-3.5 ${
                  isDangerRadar
                    ? "text-red-500 animate-bounce"
                    : isWarnRadar
                    ? "text-amber-500"
                    : "text-emerald-500"
                }`}
              />
              <span className="text-slate-500 dark:text-slate-400">LiDAR:</span>
              <span
                className={`font-mono font-bold ${
                  isDangerRadar
                    ? "text-red-500"
                    : isWarnRadar
                    ? "text-amber-500"
                    : "text-emerald-500"
                }`}
              >
                {frontDist}m
              </span>
            </div>
          </div>
        </div>

        {/* Directional Drive Pad (Tactile D-Pad) */}
        <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-xl flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
              Steering Control
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              [W, A, S, D]
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 w-44">
            <div />
            <button
              type="button"
              onClick={() => manualDrive("FORWARD")}
              className="p-3 rounded-xl bg-white dark:bg-slate-800 hover:bg-blue-600 dark:hover:bg-blue-600 text-slate-800 dark:text-slate-100 hover:text-white dark:hover:text-white font-bold flex flex-col items-center justify-center shadow-xs border border-slate-200 dark:border-slate-700 active:scale-95 transition-all"
              title="Drive Forward (W / Up)"
            >
              <ArrowUp className="w-4 h-4" />
              <span className="text-[9px] mt-0.5">W</span>
            </button>
            <div />

            <button
              type="button"
              onClick={() => manualDrive("LEFT")}
              className="p-3 rounded-xl bg-white dark:bg-slate-800 hover:bg-blue-600 dark:hover:bg-blue-600 text-slate-800 dark:text-slate-100 hover:text-white dark:hover:text-white font-bold flex flex-col items-center justify-center shadow-xs border border-slate-200 dark:border-slate-700 active:scale-95 transition-all"
              title="Steer Left (A / Left)"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-[9px] mt-0.5">A</span>
            </button>

            <button
              type="button"
              onClick={() => manualDrive("BRAKE")}
              className="p-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold flex flex-col items-center justify-center shadow-sm active:scale-95 transition-all"
              title="Brake / Stop (Spacebar)"
            >
              <Octagon className="w-4 h-4" />
              <span className="text-[8px] mt-0.5 font-black tracking-wider">
                BRAKE
              </span>
            </button>

            <button
              type="button"
              onClick={() => manualDrive("RIGHT")}
              className="p-3 rounded-xl bg-white dark:bg-slate-800 hover:bg-blue-600 dark:hover:bg-blue-600 text-slate-800 dark:text-slate-100 hover:text-white dark:hover:text-white font-bold flex flex-col items-center justify-center shadow-xs border border-slate-200 dark:border-slate-700 active:scale-95 transition-all"
              title="Steer Right (D / Right)"
            >
              <ArrowRight className="w-4 h-4" />
              <span className="text-[9px] mt-0.5">D</span>
            </button>

            <div />
            <button
              type="button"
              onClick={() => manualDrive("REVERSE")}
              className="p-3 rounded-xl bg-white dark:bg-slate-800 hover:bg-blue-600 dark:hover:bg-blue-600 text-slate-800 dark:text-slate-100 hover:text-white dark:hover:text-white font-bold flex flex-col items-center justify-center shadow-xs border border-slate-200 dark:border-slate-700 active:scale-95 transition-all"
              title="Reverse (S / Down)"
            >
              <ArrowDown className="w-4 h-4" />
              <span className="text-[9px] mt-0.5">S</span>
            </button>
            <div />
          </div>

          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-2 text-center">
            Press <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded text-[9px] font-mono border border-slate-300 dark:border-slate-600">W</kbd>{" "}
            <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded text-[9px] font-mono border border-slate-300 dark:border-slate-600">A</kbd>{" "}
            <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded text-[9px] font-mono border border-slate-300 dark:border-slate-600">S</kbd>{" "}
            <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded text-[9px] font-mono border border-slate-300 dark:border-slate-600">D</kbd> or Arrow Keys
          </p>
        </div>

        {/* Speed Profiles */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 dark:text-slate-300">
            <span>Speed Limit Profile</span>
            <span className="text-blue-600 dark:text-blue-400 font-mono font-bold">
              {manualSpeedProfile === "CREEP"
                ? "0.3 m/s"
                : manualSpeedProfile === "SPRINT"
                ? "2.2 m/s"
                : "1.2 m/s"}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1.5">
            {[
              { id: "CREEP", label: "Creep" },
              { id: "STANDARD", label: "Normal" },
              { id: "SPRINT", label: "Sprint" },
            ].map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setManualSpeedProfile(p.id)}
                className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition-colors ${
                  manualSpeedProfile === p.id
                    ? "bg-blue-600 text-white shadow-xs font-bold"
                    : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Fork Mast & Pallet Clamp Mechanism */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-xl space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-blue-500" />
              <span>Fork Mast Height</span>
            </span>
            <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
              {activeAgv?.fork?.heightMeters?.toFixed(2) ?? "0.00"}m
            </span>
          </div>

          {/* Quick Height Presets */}
          <div className="grid grid-cols-3 gap-1.5 text-[11px]">
            <button
              type="button"
              onClick={() => setForkHeight(0.0)}
              className="py-1 px-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-medium transition-colors"
            >
              Floor (0m)
            </button>
            <button
              type="button"
              onClick={() => setForkHeight(0.4)}
              className="py-1 px-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-medium transition-colors"
            >
              Transit (0.4m)
            </button>
            <button
              type="button"
              onClick={() => setForkHeight(2.2)}
              className="py-1 px-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-medium transition-colors"
            >
              Rack (2.2m)
            </button>
          </div>

          {/* Pallet Clamp Actuator */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Package
                className={`w-3.5 h-3.5 ${
                  activeAgv?.cargo ? "text-amber-500" : "text-slate-400"
                }`}
              />
              <span className="text-[11px] text-slate-600 dark:text-slate-300 truncate max-w-[130px]">
                {activeAgv?.cargo
                  ? `${activeAgv.cargo.palletId} (${activeAgv.cargo.weightKg}kg)`
                  : "Forks Empty"}
              </span>
            </div>

            <button
              type="button"
              onClick={togglePalletClamp}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors shadow-xs ${
                activeAgv?.fork?.isClamped
                  ? "bg-amber-600 hover:bg-amber-500 text-white"
                  : "bg-blue-600 hover:bg-blue-500 text-white"
              }`}
            >
              {activeAgv?.fork?.isClamped ? "Release" : "Clamp"}
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
