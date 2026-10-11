import React from "react";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { NavigationProvider, useNavigation } from "./context/NavigationContext";
import { FleetProvider } from "./context/FleetContext";
import AppLayout from "./components/layout/AppLayout";
import { VIEWS } from "./constants";

// Views
import LoginView from "./views/LoginView";
import DashboardView from "./views/DashboardView";
import LiveMapView from "./views/LiveMapView";
import RobotsView from "./views/RobotsView";
import RobotDetailView from "./views/RobotDetailView";
import MaintenanceView from "./views/MaintenanceView";
import AlertsView from "./views/AlertsView";
import FacilitiesView from "./views/FacilitiesView";
import UsersView from "./views/UsersView";
import SettingsView from "./views/SettingsView";

function AppContent() {
  const { isAuthenticated } = useAuth();
  const { currentView } = useNavigation();

  if (!isAuthenticated) {
    return <LoginView />;
  }

  return (
    <AppLayout>
      {currentView === VIEWS.DASHBOARD && <DashboardView />}
      {currentView === VIEWS.MAP && <LiveMapView />}
      {currentView === VIEWS.ROBOTS && <RobotsView />}
      {currentView === VIEWS.ROBOT_DETAIL && <RobotDetailView />}
      {currentView === VIEWS.MAINTENANCE && <MaintenanceView />}
      {currentView === VIEWS.ALERTS && <AlertsView />}
      {currentView === VIEWS.FACILITIES && <FacilitiesView />}
      {currentView === VIEWS.USERS && <UsersView />}
      {currentView === VIEWS.SETTINGS && <SettingsView />}
    </AppLayout>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <FleetProvider>
          <NavigationProvider>
            <AppContent />
          </NavigationProvider>
        </FleetProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
