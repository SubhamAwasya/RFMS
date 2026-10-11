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
        return { title: "Dashboard", sub: "Real-time overview of your AGV fleet" };
      case "robots":
        return { title: "AGVs / Robots", sub: "Manage and monitor your AGV fleet" };
      case "robot-detail":
        return { title: "AGV Detail & Control", sub: "Live telemetry and control console" };
      case "map":
        return { title: "Live Map — Main Plant", sub: "Real-time spatial digital twin and autonomous looping paths" };
      case "analytics":
        return { title: "Fleet Analytics", sub: "Performance, utilization and energy metrics" };
      case "maintenance":
        return { title: "Maintenance", sub: "Track service, health and diagnostics" };
      case "alerts":
        return { title: "Fleet Alerts", sub: "Active obstacles and safety notices" };
      case "facilities":
        return { title: "Maps & Facilities", sub: "Zones, docks, and restricted corridors" };
      case "users":
        return { title: "Users", sub: "Operator access and role management" };
      case "settings":
        return { title: "Settings", sub: "System configuration and parameters" };
      default:
        return { title: "RFMS", sub: "Robotics Fleet Management System" };
    }
  };

  const { title, sub } = getViewTitle();

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
          <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block truncate">
            {sub}
          </p>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        {/* Search Bar */}
        <div className="relative hidden xl:block w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search AGVs, facility paths, stations..."
            className="w-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>

        {/* Date / Timestamp */}
        <div className="hidden 2xl:block text-xs font-medium text-slate-500 dark:text-slate-400 px-1">
          Oct 10, 2026 11:32 AM
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
          {/* 1. Clear All Data (No Data) */}
          <button
            onClick={() => fleetCtx?.clearAllData?.()}
            title="Clear All Data (0 Robots, 0 Buildings, 0 Floors)"
            aria-label="Clear All Data"
            className="p-1.5 sm:px-2 sm:py-1 rounded-md text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 hover:bg-white dark:hover:bg-slate-900 transition-colors flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5 text-red-500" />
            <span className="hidden xl:inline text-xs font-semibold">Clear All</span>
          </button>

          {/* 2. Reset Data to Factory Defaults */}
          <button
            onClick={() => fleetCtx?.resetAllData?.()}
            title="Reset to Default Data (4 AGVs, 1 Building, 1 Floor)"
            aria-label="Reset to Default Data"
            className="p-1.5 sm:px-2 sm:py-1 rounded-md text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-slate-900 transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5 text-blue-500" />
            <span className="hidden xl:inline text-xs font-semibold">Reset</span>
          </button>

          {/* 3. Load Rich Demo Data (10 Robots, More Buildings & Floors) */}
          <button
            onClick={() => fleetCtx?.loadRichDemoData?.()}
            title="Load Rich Demo Data (10 Robots, 3 Buildings, 4 Floors)"
            aria-label="Load Rich Demo Data"
            className="p-1.5 sm:px-2 sm:py-1 rounded-md text-slate-600 hover:text-emerald-600 dark:text-slate-300 dark:hover:text-emerald-400 hover:bg-white dark:hover:bg-slate-900 transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
            <span className="hidden xl:inline text-xs font-semibold">Demo (10 AGVs)</span>
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
