import React, { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import {
  Bot,
  Building2,
  Save,
  Trash2,
  Lock,
  MapPin,
  X,
} from "lucide-react";
import { useFleet } from "../../context/FleetContext";

export default function EditRobotModal({
  robot,
  isOpen,
  onClose,
  onSave,
  onDelete,
}) {
  let fleetCtx = null;
  try {
    fleetCtx = useFleet();
  } catch (e) {}

  const buildings = fleetCtx?.buildings || [];
  const floors = fleetCtx?.floors || [];

  // Form State
  const [name, setName] = useState("");
  const [type, setType] = useState("Forklift AGV");
  const [buildingId, setBuildingId] = useState("bldg-1");
  const [floorId, setFloorId] = useState("floor-g");
  const [location, setLocation] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Sync form state ONLY when modal opens or target robot id changes
  useEffect(() => {
    if (isOpen && robot) {
      setName(robot.name || "");
      setType(robot.type || "Forklift AGV");
      setBuildingId(robot.buildingId || "bldg-1");
      setFloorId(robot.floorId || "floor-g");
      setLocation(robot.location || "");
      setShowDeleteConfirm(false);
    }
  }, [isOpen, robot?.id]);

  if (!robot) return null;

  const availableFloors = floors.filter(
    (f) => !buildingId || f.buildingId === buildingId
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const chosenFloor = floors.find((f) => f.id === floorId);
    let resolvedLocation = location;
    if (chosenFloor && !location.includes(chosenFloor.name)) {
      resolvedLocation = location ? `${chosenFloor.name} - ${location}` : chosenFloor.name;
    }

    const updates = {
      name: name.trim(),
      type,
      buildingId,
      floorId,
      location: resolvedLocation,
    };

    if (onSave) {
      onSave(robot.id, updates);
    }
    onClose?.();
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(robot.id);
    }
    onClose?.();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose?.()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[94vw] max-w-lg max-h-[92vh] overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl text-slate-900 dark:text-white focus:outline-none animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="flex items-start justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <Dialog.Title className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Edit AGV:</span>
                  <span className="font-mono text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 rounded-md text-sm">
                    {robot.id}
                  </span>
                </Dialog.Title>
                <Dialog.Description className="text-xs text-slate-500 dark:text-slate-400">
                  Update vehicle assignment and staging location.
                </Dialog.Description>
              </div>
            </div>

            <Dialog.Close asChild>
              <button
                type="button"
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
            {/* Identification Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Robot Identifier
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={robot.id}
                    disabled
                    className="w-full bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-lg pl-8 pr-3 py-2 text-slate-500 dark:text-slate-400 font-mono cursor-not-allowed select-none"
                  />
                  <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Hardware MAC & fleet identifier is fixed.
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Robot Name / Call-Sign
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Atlas Forklift v2"
                  required
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Vehicle Type */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Vehicle Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none"
              >
                <option value="Forklift AGV">Forklift AGV</option>
                <option value="Flatbed Payload Carrier AGV">Flatbed Payload Carrier AGV</option>
              </select>
            </div>

            {/* Facility & Floor Level Assignment */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 rounded-xl space-y-3">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-blue-500" />
                <span>Facility & Floor Assignment</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Building / Facility
                  </label>
                  <select
                    value={buildingId}
                    onChange={(e) => {
                      const newBldgId = e.target.value;
                      setBuildingId(newBldgId);
                      const matchingFloors = floors.filter(
                        (f) => f.buildingId === newBldgId
                      );
                      if (matchingFloors.length > 0) {
                        setFloorId(matchingFloors[0].id);
                      }
                    }}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-800 dark:text-slate-200 focus:outline-none"
                  >
                    {buildings.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Floor Level
                  </label>
                  <select
                    value={floorId}
                    onChange={(e) => setFloorId(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-800 dark:text-slate-200 focus:outline-none"
                  >
                    {availableFloors.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Location / Staging Description
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Charging Pad Alpha, Inbound Staging"
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-slate-800 dark:text-slate-200 focus:outline-none"
                  />
                  <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>

            {/* Delete Confirmation Box (if toggled) */}
            {showDeleteConfirm && (
              <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 rounded-xl space-y-2 animate-in fade-in">
                <p className="text-xs font-semibold text-red-700 dark:text-red-400">
                  Are you sure you want to de-register AGV {robot.id}?
                </p>
                <p className="text-[11px] text-red-600/80 dark:text-red-400/80">
                  This robot will be removed from the fleet roster and live navigation map.
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs rounded-lg transition-colors"
                  >
                    Confirm Delete
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs rounded-lg hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Footer Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <div>
                {!showDeleteConfirm && (
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg font-medium transition-colors flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete AGV</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Dialog.Close asChild>
                  <button
                    type="button"
                    className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium"
                  >
                    Cancel
                  </button>
                </Dialog.Close>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </button>
              </div>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
