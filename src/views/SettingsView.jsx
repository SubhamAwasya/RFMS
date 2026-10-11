import React from "react";
import { Sun, Moon, Check } from "lucide-react";
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
          Settings
        </h2>
      </div>

      <div className="space-y-4">
        {/* Theme Selector Card */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">
                Appearance Theme
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Select dark or light interface theme.
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
              <div className="text-sm font-bold text-white">Dark Theme</div>
              <div className="text-xs text-slate-400 mt-0.5">
                Low-glare dark palette
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
              <div className="text-sm font-bold text-slate-900 dark:text-white">Light Theme</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Clean light palette
              </div>
            </button>
          </div>
        </div>


        {/* Data Persistence & Factory Reset */}
        <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">
                Data & Storage
              </div>
              <div className="text-slate-500 dark:text-slate-400 text-xs mt-1">
                Custom buildings, blueprints, stations, and routes are stored locally.
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="text-[11px] text-slate-400">
              Restore default configuration and sample data.
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
