import React, { useEffect } from "react";
import {
  LayoutDashboard,
  Bot,
  Map,
  Activity,
  Bell,
  Layers,
  Settings,
  LogOut,
  Boxes,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import * as Tooltip from "@radix-ui/react-tooltip";
import { useNavigation } from "../context/NavigationContext";
import { useFleet } from "../context/FleetContext";
import { useAuth } from "../context/AuthContext";

export default function Sidebar({
  currentView: propCurrentView,
  setCurrentView: propSetCurrentView,
  alertCount: propAlertCount,
  onLogout: propOnLogout,
  onCloseMobile,
  isCollapsed: propIsCollapsed,
  onToggleCollapse: propOnToggleCollapse,
}) {
  // Gracefully fallback to context when props are not explicitly provided
  let navCtx = null;
  let fleetCtx = null;
  let authCtx = null;

  try {
    navCtx = useNavigation();
  } catch (e) {}

  try {
    fleetCtx = useFleet();
  } catch (e) {}

  try {
    authCtx = useAuth();
  } catch (e) {}

  const currentView = propCurrentView ?? navCtx?.currentView ?? "dashboard";
  const setCurrentView = propSetCurrentView ?? navCtx?.setCurrentView;
  const alertCount = propAlertCount ?? fleetCtx?.alerts?.length ?? 0;
  const onLogout = propOnLogout ?? authCtx?.logout;

  // On mobile drawer, sidebar is always expanded; on desktop/tablet, respects collapse state
  const isCollapsed = onCloseMobile
    ? false
    : (propIsCollapsed ?? navCtx?.sidebarCollapsed ?? false);

  const handleToggleCollapse =
    propOnToggleCollapse ?? navCtx?.toggleSidebarCollapse;

  // Keyboard shortcut: Ctrl+B or Cmd+B to toggle collapse
  useEffect(() => {
    if (onCloseMobile) return;
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "b") {
        e.preventDefault();
        handleToggleCollapse?.();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleToggleCollapse, onCloseMobile]);

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "map", label: "Live Map", icon: Map },
    { id: "facilities", label: "Maps & Facilities", icon: Layers },
    { id: "robots", label: "AGVs / Robots", icon: Bot },
    { id: "alerts", label: "Alerts", icon: Bell, badge: alertCount },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const handleSelect = (id) => {
    if (navCtx?.navigateTo) {
      navCtx.navigateTo(id);
    } else if (setCurrentView) {
      setCurrentView(id);
    }
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <aside
      className={`h-full bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 flex flex-col shrink-0 select-none border-r border-slate-200 dark:border-slate-800 transition-all duration-200 ease-in-out ${
        isCollapsed ? "w-[72px]" : "w-64"
      }`}
      aria-label="Sidebar Navigation"
    >
      {/* Brand Header */}
      <div
        className={`h-16 flex items-center border-b border-slate-200 dark:border-slate-800 transition-all duration-200 shrink-0 ${
          isCollapsed ? "justify-center px-2" : "justify-between px-4"
        }`}
      >
        <div className="flex items-center gap-3 min-w-0 overflow-hidden">
          <div
            onClick={isCollapsed ? handleToggleCollapse : undefined}
            className={`w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/25 shrink-0 ${
              isCollapsed
                ? "cursor-pointer hover:bg-blue-500 transition-colors"
                : ""
            }`}
            title={isCollapsed ? "Click to Expand Sidebar (Ctrl+B)" : "RFMS Fleet System"}
          >
            <Boxes className="w-5 h-5" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col min-w-0 transition-opacity duration-200">
              <div className="text-base font-bold text-slate-900 dark:text-white tracking-wide">
                RFMS
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 tracking-wider truncate font-medium">
                Robotics Fleet Management
              </div>
            </div>
          )}
        </div>

        {/* Desktop Collapse Toggle Button */}
        {!onCloseMobile && !isCollapsed && (
          <button
            type="button"
            onClick={handleToggleCollapse}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors flex items-center justify-center"
            title="Collapse to Icon Rail (Ctrl+B)"
            aria-label="Collapse Sidebar"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1 overflow-x-hidden">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;

          const buttonContent = (
            <button
              key={item.id}
              onClick={() => handleSelect(item.id)}
              className={`relative w-full flex items-center rounded-xl text-xs font-semibold transition-all ${
                isCollapsed
                  ? "justify-center p-2.5 h-11"
                  : "justify-between px-3.5 py-2.5"
              } ${
                isActive
                  ? "bg-blue-600 text-white shadow-sm shadow-blue-600/30"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800/60"
              }`}
            >
              <div
                className={`flex items-center min-w-0 ${
                  isCollapsed ? "justify-center" : "gap-3"
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive
                      ? "text-white"
                      : "text-slate-400 group-hover:text-slate-600 dark:text-slate-400 dark:group-hover:text-slate-200"
                  }`}
                />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </div>

              {!isCollapsed && item.badge ? (
                <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                  {item.badge}
                </span>
              ) : null}

              {/* Floating notification dot when collapsed */}
              {isCollapsed && item.badge ? (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-900" />
              ) : null}
            </button>
          );

          if (isCollapsed) {
            return (
              <Tooltip.Root key={item.id} delayDuration={50}>
                <Tooltip.Trigger asChild>{buttonContent}</Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    side="right"
                    sideOffset={14}
                    className="z-50 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 text-white dark:bg-slate-800 dark:text-slate-100 shadow-xl border border-slate-700/60 flex items-center gap-2 animate-in fade-in zoom-in-95 select-none"
                  >
                    <span>{item.label}</span>
                    {item.badge ? (
                      <span className="px-1.5 py-0.2 rounded-full bg-red-500 text-white text-[10px] font-bold">
                        {item.badge}
                      </span>
                    ) : null}
                    <Tooltip.Arrow className="fill-slate-900 dark:fill-slate-800" />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            );
          }

          return buttonContent;
        })}
      </nav>

      {/* Operator User Footer */}
      <div
        className={`border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60 flex items-center transition-all shrink-0 ${
          isCollapsed ? "flex-col justify-center gap-2 p-2.5" : "justify-between p-3.5"
        }`}
      >
        {isCollapsed ? (
          <>
            <Tooltip.Root delayDuration={50}>
              <Tooltip.Trigger asChild>
                <div className="w-9 h-9 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0 shadow-sm shadow-blue-600/20 cursor-pointer">
                  SA
                </div>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  side="right"
                  sideOffset={14}
                  className="z-50 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 text-white dark:bg-slate-800 shadow-xl border border-slate-700/60"
                >
                  <div className="font-bold">Shubham</div>
                  <div className="text-[10px] text-slate-400 font-normal">
                    Fleet Operator
                  </div>
                  <Tooltip.Arrow className="fill-slate-900 dark:fill-slate-800" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>

            {/* Expand Toggle Button in Collapsed Mode */}
            {!onCloseMobile && (
              <Tooltip.Root delayDuration={50}>
                <Tooltip.Trigger asChild>
                  <button
                    type="button"
                    onClick={handleToggleCollapse}
                    className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors flex items-center justify-center"
                    title="Expand Sidebar (Ctrl+B)"
                    aria-label="Expand Sidebar"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    side="right"
                    sideOffset={14}
                    className="z-50 px-2 py-1 text-xs font-semibold rounded-lg bg-slate-900 text-white dark:bg-slate-800 shadow-xl border border-slate-700/60"
                  >
                    Expand Sidebar (Ctrl+B)
                    <Tooltip.Arrow className="fill-slate-900 dark:fill-slate-800" />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            )}
          </>
        ) : (
          <>
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0 shadow-sm shadow-blue-600/20">
                SA
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  Shubham
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  Fleet Operator
                </div>
              </div>
            </div>

            {onLogout && (
              <button
                onClick={onLogout}
                title="Sign Out"
                className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </>
        )}
      </div>
    </aside>
  );
}
