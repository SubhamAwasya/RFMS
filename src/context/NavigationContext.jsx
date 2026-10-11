import React, { createContext, useContext, useState, useCallback } from "react";
import { VIEWS } from "../constants";

export const NavigationContext = createContext(null);

export function NavigationProvider({ children, initialView = VIEWS.DASHBOARD }) {
  const [currentView, setCurrentView] = useState(initialView);
  const [selectedAgvId, setSelectedAgvId] = useState("FL-01");
  const [mapSelectedAgvId, setMapSelectedAgvId] = useState(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const navigateTo = useCallback((view, options = {}) => {
    setCurrentView(view);
    if (options.agvId) {
      setSelectedAgvId(options.agvId);
      if (view === VIEWS.MAP) {
        setMapSelectedAgvId(options.agvId);
      }
    } else if (view === VIEWS.MAP && !options.preserveMapSelection) {
      setMapSelectedAgvId(null);
    }
    if (mobileNavOpen) {
      setMobileNavOpen(false);
    }
  }, [mobileNavOpen]);

  const selectAgv = useCallback((id) => {
    setSelectedAgvId(id);
    setCurrentView(VIEWS.ROBOT_DETAIL);
    if (mobileNavOpen) {
      setMobileNavOpen(false);
    }
  }, [mobileNavOpen]);

  const selectAgvOnMap = useCallback((id) => {
    setSelectedAgvId(id);
    setMapSelectedAgvId(id);
    setCurrentView(VIEWS.MAP);
    if (mobileNavOpen) {
      setMobileNavOpen(false);
    }
  }, [mobileNavOpen]);

  const value = {
    currentView,
    setCurrentView,
    selectedAgvId,
    setSelectedAgvId,
    mapSelectedAgvId,
    setMapSelectedAgvId,
    mobileNavOpen,
    setMobileNavOpen,
    navigateTo,
    selectAgv,
    selectAgvOnMap,
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error("useNavigation must be used within a NavigationProvider");
  }
  return context;
}
