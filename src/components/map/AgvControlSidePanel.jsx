import React, { useEffect } from "react";
import {
  X,
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
  ShieldAlert,
  ShieldCheck,
  Zap,
  Play,
  Repeat,
  Radio,
  MapPin,
  Layers,
  Truck,
} from "lucide-react";
import { useFleet } from "../../context/FleetContext";
import { getRobotColorTheme, AGV_STATUS } from "../../constants";

export default function AgvControlSidePanel({ agv, onClose, onSelectAgv }) {
  const fleetCtx = useFleet();
  if (!agv) return null;

  const isForklift =
    agv.type === "Forklift AGV" || (!agv.type && agv.id?.startsWith("FL"));
  const isFlatbed =
    agv.type === "Flatbed Payload Carrier AGV" || agv.id?.startsWith("FB");
  const theme = getRobotColorTheme(agv.id);

  const isManualMode =
    agv.status === AGV_STATUS.MANUAL_TELEOP || agv.status === "Manual Teleop";
  const isAutoMode =
    agv.status === AGV_STATUS.AUTO_LOOP ||
    agv.status === "Auto-Pilot (Looping)" ||
    agv.status === "In Mission";

  // Active speed to display
  const activeSpeed = typeof agv.speed === "number" ? agv.speed : 1.2;
  const targetSpeed = agv.cruiseSpeed || (activeSpeed > 0 ? activeSpeed : 1.2);

  // Keyboard navigation listener while side panel is focused/open
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
          fleetCtx?.manualDrive?.("FORWARD", agv.id);
          break;
        case "s":
        case "arrowdown":
          e.preventDefault();
          fleetCtx?.manualDrive?.("REVERSE", agv.id);
          break;
        case "a":
        case "arrowleft":
          e.preventDefault();
          fleetCtx?.manualDrive?.("LEFT", agv.id);
          break;
        case "d":
        case "arrowright":
          e.preventDefault();
          fleetCtx?.manualDrive?.("RIGHT", agv.id);
          break;
        case " ":
          e.preventDefault();
          fleetCtx?.stopAndManual?.(agv.id);
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [fleetCtx, agv.id]);

  const frontDist = agv.proximityRadar?.frontDistMeters ?? 4.8;
  const isDangerRadar = frontDist < 1.0;
  const isWarnRadar = frontDist >= 1.0 && frontDist < 3.0;

  // Handle mode toggle directly for this robot
  const handleToggleMode = (mode) => {
    if (mode === "AUTO") {
      fleetCtx?.handBackToAutopilot?.(agv.id);
    } else {
      fleetCtx?.stopAndManual?.(agv.id);
    }
  };

  const handleSpeedChange = (newSpeed) => {
    fleetCtx?.setAgvSpeed?.(agv.id, newSpeed);
  };

  return (
    <aside
      className="w-84 sm:w-96 max-w-[88vw] h-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-l border-slate-200 dark:border-slate-800 flex flex-col z-30 shadow-2xl transition-all duration-200 shrink-0 select-none overflow-hidden"
      onMouseDown={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
    >
      {/* Panel Header */}
      <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <span
            className="w-3 h-3 rounded-full animate-pulse shrink-0 ring-4"
            style={{
              backgroundColor: theme.hex,
              boxShadow: `0 0 10px ${theme.hex}`,
            }}
          />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span
                className="font-bold font-mono text-sm"
                style={{ color: theme.hex }}
              >
                {agv.id}
              </span>
              <span className="text-xs text-slate-700 dark:text-slate-300 font-semibold truncate">
                {agv.name}
              </span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
              {agv.type || "Industrial AGV"}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          title="Deselect robot (preserves current operating state)"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Scrollable Body Content */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5 text-xs">
        {/* Seamless Navigation Mode Toggle: [ Auto-Pilot (Looping) | Manual Drive ] */}
        <div className="bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-1">
          <button
            type="button"
            onClick={() => handleToggleMode("AUTO")}
            className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              isAutoMode
                ? "bg-cyan-500 text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Repeat className="w-3.5 h-3.5" />
            <span>Auto-Pilot (Loop)</span>
          </button>
          <button
            type="button"
            onClick={() => handleToggleMode("MANUAL")}
            className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              isManualMode
                ? "bg-amber-500 text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Manual Drive</span>
          </button>
        </div>

        {/* Live Telemetry Card */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Status & Sensors
            </span>
            <span
              className="text-[11px] font-bold px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: `${theme.hex}20`,
                color: theme.hex,
                border: `1px solid ${theme.hex}40`,
              }}
            >
              {agv.status}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2 p-2 rounded-lg bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/50">
              <Compass className="w-4 h-4 text-blue-500 shrink-0" />
              <div>
                <div className="text-[10px] text-slate-400">Heading</div>
                <div className="font-semibold text-slate-800 dark:text-slate-100">
                  {agv.position?.headingDeg ?? agv.heading ?? 0}°
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 rounded-lg bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/50">
              <Battery className="w-4 h-4 text-emerald-500 shrink-0" />
              <div>
                <div className="text-[10px] text-slate-400">Battery</div>
                <div className="font-semibold text-emerald-600 dark:text-emerald-400">
                  {Math.round(agv.battery || 100)}%
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 rounded-lg bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/50">
              <Gauge className="w-4 h-4 text-cyan-500 shrink-0" />
              <div>
                <div className="text-[10px] text-slate-400">Live Speed</div>
                <div className="font-semibold text-slate-800 dark:text-slate-100">
                  {activeSpeed.toFixed(1)} m/s
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 rounded-lg bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/50">
              <ShieldAlert
                className={`w-4 h-4 shrink-0 ${
                  isDangerRadar
                    ? "text-red-500 animate-bounce"
                    : isWarnRadar
                    ? "text-amber-500"
                    : "text-emerald-500"
                }`}
              />
              <div>
                <div className="text-[10px] text-slate-400">LiDAR Proximity</div>
                <div
                  className={`font-mono font-bold ${
                    isDangerRadar
                      ? "text-red-500"
                      : isWarnRadar
                      ? "text-amber-500"
                      : "text-emerald-500"
                  }`}
                >
                  {frontDist}m
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 pt-1 text-[11px] text-slate-500 dark:text-slate-400">
            <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            <span className="truncate">{agv.location || "Ground Floor Floor Grid"}</span>
          </div>
        </div>

        {/* Remote Cockpit Steering with Prominent STOP Button */}
        <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 rounded-xl flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-2.5">
            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
              Remote Control & Brakes
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              [WASD / Space]
            </span>
          </div>

          {/* D-Pad with Central STOP Button */}
          <div className="grid grid-cols-3 gap-2 w-48">
            <div />
            <button
              type="button"
              onClick={() => fleetCtx?.manualDrive?.("FORWARD", agv.id)}
              className="p-3 rounded-xl bg-white dark:bg-slate-800 hover:bg-blue-600 dark:hover:bg-blue-600 text-slate-800 dark:text-slate-100 hover:text-white dark:hover:text-white font-bold flex flex-col items-center justify-center shadow-xs border border-slate-200 dark:border-slate-700 active:scale-95 transition-all"
              title="Drive Forward (W / Up)"
            >
              <ArrowUp className="w-4 h-4" />
              <span className="text-[9px] mt-0.5">W</span>
            </button>
            <div />

            <button
              type="button"
              onClick={() => fleetCtx?.manualDrive?.("LEFT", agv.id)}
              className="p-3 rounded-xl bg-white dark:bg-slate-800 hover:bg-blue-600 dark:hover:bg-blue-600 text-slate-800 dark:text-slate-100 hover:text-white dark:hover:text-white font-bold flex flex-col items-center justify-center shadow-xs border border-slate-200 dark:border-slate-700 active:scale-95 transition-all"
              title="Steer Left (A / Left)"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-[9px] mt-0.5">A</span>
            </button>

            {/* BIG PROMINENT STOP / BRAKE BUTTON */}
            <button
              type="button"
              onClick={() => fleetCtx?.stopAndManual?.(agv.id)}
              className="p-2.5 rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-black flex flex-col items-center justify-center shadow-md active:scale-95 transition-all ring-2 ring-red-400/50"
              title="STOP / BRAKE: Halts vehicle immediately (0.0 m/s) and switches to Manual mode"
            >
              <Octagon className="w-4 h-4 animate-pulse" />
              <span className="text-[8.5px] mt-0.5 tracking-wider uppercase font-black">
                STOP
              </span>
            </button>

            <button
              type="button"
              onClick={() => fleetCtx?.manualDrive?.("RIGHT", agv.id)}
              className="p-3 rounded-xl bg-white dark:bg-slate-800 hover:bg-blue-600 dark:hover:bg-blue-600 text-slate-800 dark:text-slate-100 hover:text-white dark:hover:text-white font-bold flex flex-col items-center justify-center shadow-xs border border-slate-200 dark:border-slate-700 active:scale-95 transition-all"
              title="Steer Right (D / Right)"
            >
              <ArrowRight className="w-4 h-4" />
              <span className="text-[9px] mt-0.5">D</span>
            </button>

            <div />
            <button
              type="button"
              onClick={() => fleetCtx?.manualDrive?.("REVERSE", agv.id)}
              className="p-3 rounded-xl bg-white dark:bg-slate-800 hover:bg-blue-600 dark:hover:bg-blue-600 text-slate-800 dark:text-slate-100 hover:text-white dark:hover:text-white font-bold flex flex-col items-center justify-center shadow-xs border border-slate-200 dark:border-slate-700 active:scale-95 transition-all"
              title="Reverse (S / Down)"
            >
              <ArrowDown className="w-4 h-4" />
              <span className="text-[9px] mt-0.5">S</span>
            </button>
            <div />
          </div>

          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-2 text-center">
            Click <strong className="text-red-500">STOP</strong> or press <kbd className="px-1 py-0.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded font-mono text-[9px]">Space</kbd> to halt and switch to manual mode.
          </p>
        </div>

        {/* Live Robot Speed Adjustment (presets + slider) */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 rounded-xl space-y-2.5">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 dark:text-slate-300">
            <span className="flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5 text-blue-500" />
              <span>Speed Control (Remote)</span>
            </span>
            <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 rounded-md border border-blue-200 dark:border-blue-800">
              {targetSpeed.toFixed(1)} m/s
            </span>
          </div>

          {/* Speed Presets */}
          <div className="grid grid-cols-3 gap-1.5">
            {[
              { label: "Creep (0.4m/s)", speed: 0.4 },
              { label: "Normal (1.2m/s)", speed: 1.2 },
              { label: "Sprint (2.0m/s)", speed: 2.0 },
            ].map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => handleSpeedChange(p.speed)}
                className={`py-1.5 px-1 rounded-lg text-[11px] font-semibold transition-all ${
                  Math.abs(targetSpeed - p.speed) < 0.1
                    ? "bg-blue-600 text-white font-bold shadow-xs"
                    : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Speed Slider */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>0.2 m/s</span>
              <span>Slide to adjust live speed</span>
              <span>3.0 m/s</span>
            </div>
            <input
              type="range"
              min="0.2"
              max="3.0"
              step="0.1"
              value={targetSpeed}
              onChange={(e) => handleSpeedChange(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>
        </div>

        {/* Actuator Controls (Forklift vs Flatbed) */}
        {isForklift && (
          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 rounded-xl space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-blue-500" />
                <span>Fork Mast Height</span>
              </span>
              <span className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400">
                {agv.fork?.heightMeters?.toFixed(2) ?? "0.00"}m
              </span>
            </div>

            <div className="grid grid-cols-3 gap-1.5 text-[11px]">
              <button
                type="button"
                onClick={() => fleetCtx?.setForkHeight?.(0.0)}
                className="py-1 px-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-medium transition-colors"
              >
                Floor (0m)
              </button>
              <button
                type="button"
                onClick={() => fleetCtx?.setForkHeight?.(0.4)}
                className="py-1 px-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-medium transition-colors"
              >
                Transit (0.4m)
              </button>
              <button
                type="button"
                onClick={() => fleetCtx?.setForkHeight?.(2.2)}
                className="py-1 px-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-medium transition-colors"
              >
                Rack (2.2m)
              </button>
            </div>

            <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Package
                  className={`w-3.5 h-3.5 ${
                    agv.cargo ? "text-amber-500" : "text-slate-400"
                  }`}
                />
                <span className="text-[11px] text-slate-600 dark:text-slate-300 truncate max-w-[130px]">
                  {agv.cargo
                    ? `${agv.cargo.palletId} (${agv.cargo.weightKg}kg)`
                    : "Forks Empty"}
                </span>
              </div>

              <button
                type="button"
                onClick={() => fleetCtx?.togglePalletClamp?.()}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors shadow-xs ${
                  agv.fork?.isClamped
                    ? "bg-amber-600 hover:bg-amber-500 text-white"
                    : "bg-blue-600 hover:bg-blue-500 text-white"
                }`}
              >
                {agv.fork?.isClamped ? "Release" : "Clamp"}
              </button>
            </div>
          </div>
        )}

        {isFlatbed && (
          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-purple-500" />
                <span>Heavy Duty Deck Cargo</span>
              </span>
              <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">
                Deck Active
              </span>
            </div>
            <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200 dark:border-slate-700">
              <span className="text-slate-500">Payload:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {agv.cargo
                  ? `${agv.cargo.palletId} (${agv.cargo.weightKg}kg)`
                  : agv.payload || "1,200 kg Max Deck"}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Footer Quick Actions */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 space-y-2 shrink-0 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => fleetCtx?.sendToCharger?.()}
            className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-colors flex items-center justify-center gap-1.5"
            title="Send robot to nearest charging pad"
          >
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>To Charger</span>
          </button>
          <button
            type="button"
            onClick={() => fleetCtx?.handBackToAutopilot?.(agv.id)}
            className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
            title="Resume autonomous looping path and route operations"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Resume Route</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
