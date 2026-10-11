import React, { useState, useMemo } from "react";
import FleetKpiCards from "../components/dashboard/FleetKpiCards";
import FleetStatusDonut from "../components/dashboard/FleetStatusDonut";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import BatteryDistributionCard from "../components/dashboard/BatteryDistributionCard";
import FleetExceptionsCard from "../components/dashboard/FleetExceptionsCard";
import ActiveAlertsCard from "../components/dashboard/ActiveAlertsCard";
import { useFleet } from "../context/FleetContext";
import { useNavigation } from "../context/NavigationContext";
import { VIEWS } from "../constants";

export default function DashboardView({
  agvs: propAgvs,
  alerts: propAlerts,
  maintenance: propMaintenance,
  onNavigate: propOnNavigate,
}) {
  const fleetCtx = useFleet();
  const navCtx = useNavigation();

  const [selectedBldgFilter, setSelectedBldgFilter] = useState("ALL");

  const agvs = propAgvs ?? fleetCtx?.agvs ?? [];
  const floors = fleetCtx?.floors ?? [];
  const buildings = fleetCtx?.buildings ?? [];
  const alerts = propAlerts ?? fleetCtx?.alerts ?? [];
  const onNavigate = propOnNavigate ?? navCtx?.navigateTo;

  // Filter AGVs by facility if selected
  const filteredAgvs = useMemo(() => {
    if (selectedBldgFilter === "ALL") return agvs;
    return agvs.filter((a) => {
      if (a.buildingId === selectedBldgFilter) return true;
      const f = floors.find((fl) => fl.id === a.floorId);
      return f?.buildingId === selectedBldgFilter;
    });
  }, [agvs, selectedBldgFilter, floors]);

  // Aggregate Battery
  const avgBattery = useMemo(() => {
    if (filteredAgvs.length === 0) return 100;
    const sum = filteredAgvs.reduce((acc, a) => acc + (a.battery ?? 100), 0);
    return Number((sum / filteredAgvs.length).toFixed(1));
  }, [filteredAgvs]);

  // Battery Brackets
  const batteryBrackets = useMemo(() => {
    const counts = { high: 0, mid: 0, low: 0, critical: 0 };
    filteredAgvs.forEach((a) => {
      const b = a.battery ?? 100;
      if (b >= 75) counts.high++;
      else if (b >= 50) counts.mid++;
      else if (b >= 20) counts.low++;
      else counts.critical++;
    });
    return counts;
  }, [filteredAgvs]);

  // Charging units
  const chargingAgvs = useMemo(() => {
    return filteredAgvs.filter(
      (a) => a.status === "Charging" || a.status === "Returning to Charger"
    );
  }, [filteredAgvs]);

  // Units needing operator attention (Exceptions only: Fault, Stopped, Obstacle, Low Battery < 20%)
  const exceptionRobots = useMemo(() => {
    return filteredAgvs.filter(
      (a) =>
        a.status === "Fault" ||
        a.status === "Stopped" ||
        a.status === "Obstacle Blocked" ||
        a.status === "Low Battery" ||
        (typeof a.battery === "number" && a.battery < 20)
    );
  }, [filteredAgvs]);

  // Seamless robot selection and navigation to Live Map
  const handleSelectRobot = (agvId) => {
    const robot = agvs.find((a) => a.id === agvId);
    if (robot?.floorId && fleetCtx?.setActiveFloorId) {
      fleetCtx.setActiveFloorId(robot.floorId);
    }
    if (robot?.buildingId && fleetCtx?.setActiveBuildingId) {
      fleetCtx.setActiveBuildingId(robot.buildingId);
    }
    if (navCtx?.selectAgvOnMap) {
      navCtx.selectAgvOnMap(agvId);
    } else {
      onNavigate?.(VIEWS.MAP, { agvId });
    }
  };

  // Export clean telemetry report
  const handleExportData = () => {
    const report = {
      timestamp: new Date().toISOString(),
      facility: selectedBldgFilter,
      totalAgvs: filteredAgvs.length,
      avgBattery: `${avgBattery}%`,
      robots: filteredAgvs.map((a) => ({
        id: a.id,
        name: a.name,
        status: a.status,
        battery: a.battery,
        speed: a.speed,
        payload: a.payload,
        floorId: a.floorId,
      })),
      activeAlerts: alerts,
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `rfms-fleet-report-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
      {/* 1. Header with Controls & Facility Filter */}
      <DashboardHeader
        selectedBldgFilter={selectedBldgFilter}
        setSelectedBldgFilter={setSelectedBldgFilter}
        buildings={buildings}
        onExportData={handleExportData}
      />

      {/* 2. Key Metric KPI Cards */}
      <FleetKpiCards agvs={filteredAgvs} onNavigate={onNavigate} />

      {/* 3. Middle Section: Status Donut & Battery Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <FleetStatusDonut agvs={filteredAgvs} />
        <BatteryDistributionCard
          filteredAgvs={filteredAgvs}
          batteryBrackets={batteryBrackets}
          chargingAgvs={chargingAgvs}
          onNavigate={onNavigate}
        />
      </div>

      {/* 4. Bottom Section: Fleet Exceptions & Safety Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <FleetExceptionsCard
          exceptionRobots={exceptionRobots}
          filteredAgvs={filteredAgvs}
          onNavigate={onNavigate}
          onSelectRobot={handleSelectRobot}
          onFixRobotFault={(id) => fleetCtx?.fixRobotFault?.(id)}
        />
        <ActiveAlertsCard
          alerts={alerts}
          onNavigate={onNavigate}
          onSelectRobot={handleSelectRobot}
          onGenerateRandomAlert={() => fleetCtx?.generateRandomAlert?.()}
        />
      </div>
    </div>
  );
}
