import React from "react";
import * as Switch from "@radix-ui/react-switch";
import { Sun, Moon, Check, RotateCcw } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useFleet } from "../context/FleetContext";

export default function SettingsView({
  theme: propTheme,
  toggleTheme: propToggleTheme,
}) {
  let themeCtx = null;
  let fleetCtx = null;
  try {
    themeCtx = useTheme();
  } catch (e) {}
  try {
    fleetCtx = useFleet();
  } catch (e) {}

  const theme = propTheme ?? themeCtx?.theme ?? "dark";
  const toggleTheme = propToggleTheme ?? themeCtx?.toggleTheme;

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto p-4 sm:p-6 space-y-5 max-w-3xl">
      <div className="pb-3 border-b border-slate-200 dark:border-slate-800">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          System Settings
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Configure RFMS runtime parameters, ROS2 bridge endpoints, and user appearance preferences
        </p>
      </div>

      <div className="space-y-4">
        {/* Modern Gray Theme Selector Card */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Appearance Theme</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                  Modern Gray Edition
                </span>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Precision-engineered graphite & obsidian tones for dark mode, paired with clean architectural neutral surfaces for light mode.
              </div>
            </div>
          </div>

          {/* Theme Option Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {/* Dark Mode Card */}
            <button
              type="button"
              onClick={() => theme !== "dark" && toggleTheme?.()}
              className={`p-4 rounded-xl border text-left transition-all relative ${
                theme === "dark"
                  ? "border-blue-600 ring-2 ring-blue-500/30 bg-slate-800/80 shadow-md"
                  : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center text-amber-400">
                  <Moon className="w-4 h-4" />
                </div>
                {theme === "dark" && (
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center">
                    <Check className="w-3 h-3" />
                  </span>
                )}
              </div>
              <div className="text-sm font-bold text-white">Modern Gray Dark</div>
              <div className="text-xs text-slate-400 mt-0.5">
                Obsidian #0c0d10 base with slate #1a1c23 cards
              </div>
            </button>

            {/* Light Mode Card */}
            <button
              type="button"
              onClick={() => theme !== "light" && toggleTheme?.()}
              className={`p-4 rounded-xl border text-left transition-all relative ${
                theme === "light"
                  ? "border-blue-600 ring-2 ring-blue-500/30 bg-white shadow-md"
                  : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
                  <Sun className="w-4 h-4" />
                </div>
                {theme === "light" && (
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center">
                    <Check className="w-3 h-3" />
                  </span>
                )}
              </div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">Clean Architectural Light</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Crisp slate #f8fafc with balanced neutral-800 text
              </div>
            </button>
          </div>
        </div>

        {/* ROS2 & Connectivity */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm space-y-4 text-xs">
          <div className="text-sm font-bold text-slate-900 dark:text-white">
            ROS2 Middleware Bridge
          </div>
          <div className="space-y-3">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Zenoh / CycloneDDS Domain ID
              </label>
              <input
                type="number"
                defaultValue={42}
                className="w-full max-w-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Telemetry Push Interval
              </label>
              <select className="w-full max-w-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none">
                <option>50 ms (20 Hz - High Precision)</option>
                <option>100 ms (10 Hz - Standard)</option>
                <option>250 ms (4 Hz - Low Bandwidth)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Safety Interlocks */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm space-y-3 text-xs">
          <div className="text-sm font-bold text-slate-900 dark:text-white">
            Safety Interlocks
          </div>
          <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="font-semibold text-slate-800 dark:text-slate-200">
                Automatic Emergency E-Stop on LiDAR Blindspot
              </div>
              <div className="text-slate-400 text-[11px]">
                Halts rover if LiDAR returns invalid point clouds for &gt; 250ms
              </div>
            </div>
            <Switch.Root
              defaultChecked
              className="w-10 h-5 bg-slate-300 dark:bg-slate-700 rounded-full relative data-[state=checked]:bg-blue-600 outline-none cursor-pointer"
            >
              <Switch.Thumb className="block w-4 h-4 bg-white rounded-full transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[22px]" />
            </Switch.Root>
          </div>
        </div>

        {/* Data Persistence & Factory Reset */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">
                Data Persistence & Factory Reset
              </div>
              <div className="text-slate-500 dark:text-slate-400 text-xs mt-1">
                Your custom buildings, uploaded blueprints, placed stations, and navigation paths are automatically persisted in local storage.
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="text-[11px] text-slate-400">
              Want to start over with a clean single-entity baseline?
            </span>
            <button
              type="button"
              onClick={() => fleetCtx?.setResetDialogOpen?.(true)}
              className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold shadow-xs transition-colors self-start sm:self-auto"
            >
              Reset Data to Defaults
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
