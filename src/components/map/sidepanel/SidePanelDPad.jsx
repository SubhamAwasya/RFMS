import React from "react";
import {
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Octagon,
  Gauge,
} from "lucide-react";

export default function SidePanelDPad({
  agv,
  targetSpeed,
  onManualDrive,
  onStopAndManual,
  onSpeedChange,
}) {
  return (
    <div className="space-y-3.5">
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
            onClick={() => onManualDrive("FORWARD", agv.id)}
            className="p-3 rounded-xl bg-white dark:bg-slate-800 hover:bg-blue-600 dark:hover:bg-blue-600 text-slate-800 dark:text-slate-100 hover:text-white dark:hover:text-white font-bold flex flex-col items-center justify-center shadow-xs border border-slate-200 dark:border-slate-700 active:scale-95 transition-all cursor-pointer"
            title="Drive Forward (W / Up)"
          >
            <ArrowUp className="w-4 h-4" />
            <span className="text-[9px] mt-0.5">W</span>
          </button>
          <div />

          <button
            type="button"
            onClick={() => onManualDrive("LEFT", agv.id)}
            className="p-3 rounded-xl bg-white dark:bg-slate-800 hover:bg-blue-600 dark:hover:bg-blue-600 text-slate-800 dark:text-slate-100 hover:text-white dark:hover:text-white font-bold flex flex-col items-center justify-center shadow-xs border border-slate-200 dark:border-slate-700 active:scale-95 transition-all cursor-pointer"
            title="Steer Left (A / Left)"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-[9px] mt-0.5">A</span>
          </button>

          {/* BIG PROMINENT STOP / BRAKE BUTTON */}
          <button
            type="button"
            onClick={() => onStopAndManual(agv.id)}
            className="p-2.5 rounded-xl bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-black flex flex-col items-center justify-center shadow-md active:scale-95 transition-all ring-2 ring-red-400/50 cursor-pointer"
            title="STOP / BRAKE: Halts vehicle immediately (0.0 m/s) and switches to Manual mode"
          >
            <Octagon className="w-4 h-4 animate-pulse" />
            <span className="text-[8.5px] mt-0.5 tracking-wider uppercase font-black">
              STOP
            </span>
          </button>

          <button
            type="button"
            onClick={() => onManualDrive("RIGHT", agv.id)}
            className="p-3 rounded-xl bg-white dark:bg-slate-800 hover:bg-blue-600 dark:hover:bg-blue-600 text-slate-800 dark:text-slate-100 hover:text-white dark:hover:text-white font-bold flex flex-col items-center justify-center shadow-xs border border-slate-200 dark:border-slate-700 active:scale-95 transition-all cursor-pointer"
            title="Steer Right (D / Right)"
          >
            <ArrowRight className="w-4 h-4" />
            <span className="text-[9px] mt-0.5">D</span>
          </button>

          <div />
          <button
            type="button"
            onClick={() => onManualDrive("REVERSE", agv.id)}
            className="p-3 rounded-xl bg-white dark:bg-slate-800 hover:bg-blue-600 dark:hover:bg-blue-600 text-slate-800 dark:text-slate-100 hover:text-white dark:hover:text-white font-bold flex flex-col items-center justify-center shadow-xs border border-slate-200 dark:border-slate-700 active:scale-95 transition-all cursor-pointer"
            title="Reverse (S / Down)"
          >
            <ArrowDown className="w-4 h-4" />
            <span className="text-[9px] mt-0.5">S</span>
          </button>
          <div />
        </div>

        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-2 text-center">
          Click <strong className="text-red-500">STOP</strong> or press{" "}
          <kbd className="px-1 py-0.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded font-mono text-[9px]">
            Space
          </kbd>{" "}
          to halt and switch to manual mode.
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
              onClick={() => onSpeedChange(p.speed)}
              className={`py-1.5 px-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
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
            onChange={(e) => onSpeedChange(Number(e.target.value))}
            className="w-full accent-blue-600 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
