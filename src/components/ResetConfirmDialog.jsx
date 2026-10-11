import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { RotateCcw, AlertTriangle, X } from "lucide-react";
import { useFleet } from "../context/FleetContext";

export default function ResetConfirmDialog() {
  const { resetDialogOpen, setResetDialogOpen, resetAllData } = useFleet();

  if (!resetDialogOpen) return null;

  return (
    <Dialog.Root open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 animate-in fade-in" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 text-slate-900 dark:text-slate-100 z-50 focus:outline-none animate-in zoom-in-95">
          <div className="flex items-start gap-3.5">
            <div className="p-3 rounded-xl bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 shrink-0 border border-red-200 dark:border-red-900/40">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="flex-1 min-w-0">
              <Dialog.Title className="text-base font-bold text-slate-900 dark:text-white">
                Reset All Custom Data?
              </Dialog.Title>
              <Dialog.Description className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                This will clear all your created buildings, custom floor blueprints, added stations, safety zones, and custom routes from local storage.
                <br /><br />
                The system will return to the clean **single-entity baseline** (FL-01 Forklift AGV, Building A, Ground Floor).
              </Dialog.Description>
            </div>

            <Dialog.Close asChild>
              <button
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </Dialog.Close>
          </div>

          <div className="flex items-center justify-end gap-2.5 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setResetDialogOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => resetAllData()}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-red-600 hover:bg-red-500 text-white shadow-sm transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Default Data</span>
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
