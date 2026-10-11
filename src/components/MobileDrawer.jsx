import React from "react";
import { X } from "lucide-react";
import Sidebar from "./Sidebar";
import { useNavigation } from "../context/NavigationContext";
import { useFleet } from "../context/FleetContext";
import { useAuth } from "../context/AuthContext";

export default function MobileDrawer({
  isOpen: propIsOpen,
  onClose: propOnClose,
  currentView: propCurrentView,
  setCurrentView: propSetCurrentView,
  alertCount: propAlertCount,
  onLogout: propOnLogout,
}) {
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

  const isOpen = propIsOpen ?? navCtx?.mobileNavOpen ?? false;
  const onClose = propOnClose ?? (() => navCtx?.setMobileNavOpen?.(false));
  const currentView = propCurrentView ?? navCtx?.currentView;
  const setCurrentView = propSetCurrentView ?? navCtx?.setCurrentView;
  const alertCount = propAlertCount ?? fleetCtx?.alerts?.length;
  const onLogout = propOnLogout ?? authCtx?.logout;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Body */}
      <div className="relative w-64 max-w-[80vw] h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-10 shadow-2xl flex flex-col animate-in slide-in-from-left duration-200">
        <div className="absolute top-3 right-3 z-20">
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <Sidebar
          currentView={currentView}
          setCurrentView={setCurrentView}
          alertCount={alertCount}
          onLogout={onLogout}
          onCloseMobile={onClose}
        />
      </div>
    </div>
  );
}
