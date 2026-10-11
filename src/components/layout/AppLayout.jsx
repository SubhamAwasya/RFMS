import React from "react";
import * as Tooltip from "@radix-ui/react-tooltip";
import Sidebar from "../Sidebar";
import TopNav from "../TopNav";
import MobileDrawer from "../MobileDrawer";
import EStopDialog from "../EStopDialog";
import BlackboxDrawer from "../blackbox/BlackboxDrawer";
import ResetConfirmDialog from "../ResetConfirmDialog";

export default function AppLayout({ children }) {
  return (
    <Tooltip.Provider delayDuration={150}>
      <div className="flex h-screen w-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans select-none overflow-hidden transition-colors duration-150">
        {/* Desktop Sidebar (Hidden on Mobile) */}
        <div className="hidden md:flex h-full shrink-0">
          <Sidebar />
        </div>

        {/* Mobile Slide-Out Drawer */}
        <MobileDrawer />

        {/* Main Content Viewport */}
        <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
          {/* Top HUD Nav */}
          <TopNav />

          {/* Dynamic View Container */}
          <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
            {children}
          </main>
        </div>

        {/* Global E-Stop Modal Confirmation */}
        <EStopDialog />

        {/* Global Blackbox Audit Trail Drawer */}
        <BlackboxDrawer />

        {/* Global Reset Data Confirmation Modal */}
        <ResetConfirmDialog />
      </div>
    </Tooltip.Provider>
  );
}
