import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { ShieldAlert } from "lucide-react";
import { useFleet } from "../context/FleetContext";

export default function EStopDialog({
  open: propOpen,
  onOpenChange: propOnOpenChange,
  onConfirm: propOnConfirm,
}) {
  let fleetCtx = null;
  try {
    fleetCtx = useFleet();
  } catch (e) {}

  const open = propOpen ?? fleetCtx?.eStopOpen ?? false;
  const onOpenChange = propOnOpenChange ?? fleetCtx?.setEStopOpen;
  const onConfirm = propOnConfirm ?? fleetCtx?.triggerEStop;

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[92vw] max-w-md max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-2xl text-slate-900 dark:text-white focus:outline-none animate-in fade-in zoom-in-95 duration-150">
          <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 flex items-center justify-center text-red-600 mb-4 shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>

          <Dialog.Title className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2">
            Confirm Global Emergency Stop
          </Dialog.Title>
          <Dialog.Description className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
            This will immediately broadcast an interlock freeze to all active mobile robots. Dynamic mechanical brakes will engage, halting all active material transfers.
          </Dialog.Description>

          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Dialog.Close asChild>
              <button className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                Cancel
              </button>
            </Dialog.Close>
            <button
              onClick={onConfirm}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-500/20 transition-all flex items-center gap-1.5"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Engage Global E-Stop</span>
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
