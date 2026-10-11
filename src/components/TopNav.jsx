import React from "react";
import {
  Menu,
  Search,
  Bell,
  Sun,
  Moon,
  ShieldAlert,
  RotateCcw,
  Trash2,
  Sparkles,
} from "lucide-react";
import { useNavigation } from "../context/NavigationContext";
import { useTheme } from "../context/ThemeContext";
import { useFleet } from "../context/FleetContext";

export default function TopNav({
  onToggleMobileNav: propOnToggleMobileNav,
  currentView: propCurrentView,
  setCurrentView: propSetCurrentView,
  theme: propTheme,
  toggleTheme: propToggleTheme,
  isEStopped: propIsEStopped,
  onTriggerEStop: propOnTriggerEStop,
  onResetEStop: propOnResetEStop,
  alertCount: propAlertCount,
}) {
  let navCtx = null;
  let themeCtx = null;
  let fleetCtx = null;

  try {
    navCtx = useNavigation();
  } catch (e) {}

  try {
    themeCtx = useTheme();
  } catch (e) {}

  try {
    fleetCtx = useFleet();
  } catch (e) {}

  const currentView = propCurrentView ?? navCtx?.currentView ?? "dashboard";
  const setCurrentView = propSetCurrentView ?? navCtx?.setCurrentView;
  const onToggleMobileNav =
    propOnToggleMobileNav ?? (() => navCtx?.setMobileNavOpen?.(true));
  const theme = propTheme ?? themeCtx?.theme ?? "dark";
  const toggleTheme = propToggleTheme ?? themeCtx?.toggleTheme;
  const isEStopped = propIsEStopped ?? fleetCtx?.isEStopped ?? false;
  const onTriggerEStop =
    propOnTriggerEStop ?? (() => fleetCtx?.triggerEStop?.());
  const onResetEStop = propOnResetEStop ?? (() => fleetCtx?.resetEStop?.());
  const alertCount = propAlertCount ?? fleetCtx?.alerts?.length ?? 0;

  const getViewTitle = () => {
    switch (currentView) {
      case "dashboard":
        return "Dashboard";
      case "robots":
        return "AGVs / Robots";
      case "robot-detail":
        return "AGV Detail";
      case "map":
        return "Live Map";
      case "analytics":
        return "Fleet Analytics";
      case "maintenance":
        return "Maintenance";
      case "alerts":
        return "Alerts";
      case "facilities":
        return "Maps & Facilities";
      case "users":
        return "Users";
      case "settings":
        return "Settings";
      default:
        return "RFMS";
    }
  };

  const title = getViewTitle();

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-3 sm:px-6 shrink-0 transition-colors">
      {/* Left Title & Mobile Hamburger */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <button
          onClick={onToggleMobileNav}
          className="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          title="Open Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate">
            {title}
          </h1>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        {/* Search Bar */}
        <div className="relative hidden xl:block w-56">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>



        {/* Global E-Stop Button */}
        {isEStopped ? (
          <button
            onClick={onResetEStop}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500 text-black hover:bg-amber-400 flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Resume Fleet</span>
          </button>
        ) : (
          <button
            onClick={onTriggerEStop}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 dark:bg-red-500/15 dark:border-red-500/30 dark:text-red-400 flex items-center gap-1.5 transition-colors"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">E-Stop</span>
          </button>
        )}

        {/* Notifications Bell */}
        <button
          onClick={() => setCurrentView?.("alerts")}
          className="relative p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          title="Active Alerts"
        >
          <Bell className="w-4 h-4" />
          {alertCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-900" />
          )}
        </button>

        {/* Theme Toggle (Light / Dark) */}
        <button
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
          title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
          className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
        >
          {theme === "dark" ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-slate-600" />
          )}
        </button>

        {/* Dataset Quick Presets (Clear All | Reset Defaults | Rich Demo 10 AGVs) */}
        <div className="flex items-center gap-0.5 bg-slate-100 dark:bg-slate-800/80 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700/60 shadow-2xs">
          {/* 1. Clear All Data */}
          <button
            onClick={() => fleetCtx?.clearAllData?.()}
            title="Clear All Data"
            aria-label="Clear All Data"
            className="p-1.5 sm:px-2 sm:py-1 rounded-md text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 hover:bg-white dark:hover:bg-slate-900 transition-colors flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5 text-red-500" />
            <span className="hidden xl:inline text-xs font-semibold">Clear All</span>
          </button>

          {/* 2. Reset Defaults */}
          <button
            onClick={() => fleetCtx?.resetAllData?.()}
            title="Reset to Defaults"
            aria-label="Reset to Defaults"
            className="p-1.5 sm:px-2 sm:py-1 rounded-md text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-slate-900 transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5 text-blue-500" />
            <span className="hidden xl:inline text-xs font-semibold">Reset</span>
          </button>

          {/* 3. Load Demo Fleet */}
          <button
            onClick={() => fleetCtx?.loadRichDemoData?.()}
            title="Load Multi-Building Demo Fleet"
            aria-label="Load Multi-Building Demo Fleet"
            className="p-1.5 sm:px-2 sm:py-1 rounded-md text-slate-600 hover:text-emerald-600 dark:text-slate-300 dark:hover:text-emerald-400 hover:bg-white dark:hover:bg-slate-900 transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
            <span className="hidden xl:inline text-xs font-semibold">Demo Fleet</span>
          </button>
        </div>

        {/* User Avatar Circle */}
        <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm shadow-blue-600/20">
          SA
        </div>
      </div>
    </header>
  );
}
