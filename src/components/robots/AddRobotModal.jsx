import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import {
  Plus,
  Building2,
  MapPin,
  Bot,
  X,
} from "lucide-react";
import { useFleet } from "../../context/FleetContext";

export default function AddRobotModal({ agvCount, onAddAgv }) {
  let fleetCtx = null;
  try {
    fleetCtx = useFleet();
  } catch (e) {}

  const buildings = fleetCtx?.buildings || [];
  const floors = fleetCtx?.floors || [];

  const [isOpen, setIsOpen] = useState(false);
  const [newId, setNewId] = useState(`AGV-0${agvCount + 1}`);
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState("Forklift AGV");
  const [buildingId, setBuildingId] = useState(fleetCtx?.activeBuildingId || "bldg-1");
  const [floorId, setFloorId] = useState(fleetCtx?.activeFloorId || "floor-g");
  const [newLocation, setNewLocation] = useState("Inbound Staging Area");

  const availableFloors = floors.filter(
    (f) => !buildingId || f.buildingId === buildingId
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newId || !newName.trim()) return;

    const chosenFloor = floors.find((f) => f.id === floorId);
    let resolvedLocation = newLocation.trim();
    if (chosenFloor && !resolvedLocation.includes(chosenFloor.name)) {
      resolvedLocation = resolvedLocation ? `${chosenFloor.name} - ${resolvedLocation}` : chosenFloor.name;
    }

    if (onAddAgv) {
      onAddAgv({
        id: newId.trim(),
        name: newName.trim(),
        type: newType,
        buildingId: buildingId || "bldg-1",
        floorId: floorId || "floor-g",
        status: "Auto-Pilot (Looping)",
        battery: 100,
        speed: 0.0,
        cruiseSpeed: 1.2,
        payload: newType === "Flatbed Payload Carrier AGV" ? "1,200 kg Max Deck" : "0 kg",
        location: resolvedLocation,
        currentMission: "Continuous Looping Path",
        uptime: "0h 00m",
        coordinates: { x: 220, y: 220 },
        position: { x: 220, y: 220, headingDeg: 0 },
        heading: 0,
        proximityRadar: {
          frontDistMeters: 4.8,
          leftDistMeters: 2.2,
          rightDistMeters: 2.5,
          rearDistMeters: 3.6,
        },
        fork:
          newType === "Forklift AGV"
            ? {
                heightMeters: 0.0,
                targetHeightMeters: 0.0,
                tiltDegrees: 0,
                isClamped: false,
              }
            : undefined,
      });
    }

    setIsOpen(false);
    setNewId(`AGV-0${agvCount + 2}`);
    setNewName("");
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <button className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all">
          <Plus className="w-4 h-4" />
          <span>Add AGV</span>
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[94vw] max-w-lg max-h-[92vh] overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl text-slate-900 dark:text-white focus:outline-none animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-start justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <Dialog.Title className="text-base font-bold text-slate-900 dark:text-white">
                  Register New AGV
                </Dialog.Title>
                <Dialog.Description className="text-xs text-slate-500 dark:text-slate-400">
                  Configure AGV identification, vehicle type, and operational state.
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
                  AGV Identifier
                </label>
                <input
                  type="text"
                  value={newId}
                  onChange={(e) => setNewId(e.target.value)}
                  placeholder="e.g. FL-04"
                  required
                  className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Robot Name / Nickname
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Titan Hauler"
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
                value={newType}
                onChange={(e) => setNewType(e.target.value)}
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
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    placeholder="e.g. Charging Pad Alpha, Inbound Staging"
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-slate-800 dark:text-slate-200 focus:outline-none"
                  />
                  <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
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
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm transition-all flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Save AGV</span>
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
