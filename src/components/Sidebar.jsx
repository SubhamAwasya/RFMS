import React from "react";
import {
  LayoutDashboard,
  Bot,
  Map,
  Activity,
  Bell,
  Layers,
  Users,
  Settings,
  LogOut,
  Boxes,
} from "lucide-react";
import { useNavigation } from "../context/NavigationContext";
import { useFleet } from "../context/FleetContext";
import { useAuth } from "../context/AuthContext";

export default function Sidebar({
  currentView: propCurrentView,
  setCurrentView: propSetCurrentView,
  alertCount: propAlertCount,
  onLogout: propOnLogout,
  onCloseMobile,
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

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "map", label: "Live Map", icon: Map },
    { id: "facilities", label: "Maps & Facilities", icon: Layers },
    { id: "robots", label: "AGVs / Robots", icon: Bot },
    { id: "analytics", label: "Fleet Analytics", icon: Activity },
    { id: "alerts", label: "Alerts", icon: Bell, badge: alertCount },
    { id: "users", label: "Users", icon: Users },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const handleSelect = (id) => {
    if (setCurrentView) {
      setCurrentView(id);
    }
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <aside className="w-64 h-full bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 flex flex-col shrink-0 select-none border-r border-slate-200 dark:border-slate-800 transition-colors duration-150">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-5 gap-3 border-b border-slate-200 dark:border-slate-800">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/25">
          <Boxes className="w-5 h-5" />
        </div>
        <div className="flex flex-col min-w-0">
          <div className="text-base font-bold text-slate-900 dark:text-white tracking-wide flex items-center gap-1.5">
            RFMS
          </div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400 tracking-wider truncate font-medium">
            Robotics Fleet Management System
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleSelect(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? "bg-blue-600 text-white shadow-sm shadow-blue-600/30"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800/60"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive
                      ? "text-white"
                      : "text-slate-400 group-hover:text-slate-600 dark:text-slate-400 dark:group-hover:text-slate-200"
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>

              {item.badge ? (
                <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                  {item.badge}
                </span>
              ) : null}
            </button>
          );
        })}
      </nav>

      {/* Operator User Footer */}
      <div className="p-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0 shadow-sm shadow-blue-600/20">
            SA
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-slate-900 dark:text-white truncate">Shubham</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">Fleet Operator</div>
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
      </div>
    </aside>
  );
}
