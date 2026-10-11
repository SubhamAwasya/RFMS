# 🤖 RFMS (Robotics Fleet Management System)
## Complete Software Architecture & System Flow Guide

---

## 1. Executive Overview

The **Robotics Fleet Management System (RFMS)** is an industrial-grade desktop application engineered for supervising, dispatching, and teleoperating autonomous mobile robots (AGVs / AMRs) inside modern factories and logistics warehouses.

The software is constructed on a **two-tier desktop architecture**:
1. **Host Native Runtime (Electron + Node.js)**: Governs the native operating system window, security interlocks, and low-level system integrations.
2. **Frontend Spatial Console (React 18 + Tailwind CSS + Radix UI)**: An industrial HUD interface providing digital-twin plant maps, drag-and-drop waypoint planning, telemetry streaming, and automated dispatching.

---

## 2. High-Level System Architecture

The following diagram illustrates how the complete software system is structured, from the native desktop runtime down to the domain component hierarchy:

```mermaid
flowchart TD
    subgraph OS_LAYER["Operating System & Hardware"]
        OS["macOS / Windows / Linux Host OS"]
        ROS2["ROS2 / DDS Middleware (Robots Fleet)"]
    end

    subgraph ELECTRON_LAYER["Electron Runtime (Desktop Tier)"]
        MAIN["Main Process (electron/main.js)<br/>Node.js Runtime & Window Controller"]
        PRELOAD["Preload Script (electron/preload.cjs)<br/>Context Isolation & contextBridge"]
    end

    subgraph REACT_TIER["Frontend Renderer Tier (React 18)"]
        ROOT["Application Root (src/main.jsx)"]

        subgraph CONTEXT_LAYER["Domain State Management (Contexts & Hooks)"]
            THEME_CTX["ThemeContext<br/>Modern Gray Dark & Light Sync"]
            AUTH_CTX["AuthContext<br/>Operator Session & Permissions"]
            NAV_CTX["NavigationContext<br/>Active View & AGV Routing"]
            FLEET_CTX["FleetContext<br/>Robots, Missions, Schedules, Alerts, E-Stop"]
        end

        subgraph SHELL_LAYER["App Shell & Layout"]
            APP_LAYOUT["AppLayout.jsx"]
            TOPNAV["TopNav (HUD Bar, E-Stop, Alerts)"]
            SIDEBAR["Sidebar (View Selector)"]
            MOBILE_DRAWER["MobileDrawer"]
            ESTOP_MODAL["EStopDialog (Safety Interlock)"]
        end

        subgraph VIEW_LAYER["Active Application Views"]
            DASHBOARD["DashboardView (KPIs & Fleet Donut)"]
            LIVEMAP["LiveMapView (Spatial CAD Digital Twin)"]
            ROBOTS["RobotsView & RobotDetailView"]
            MISSIONS["MissionsView & CreateMissionView"]
            SCHEDULES["SchedulesView (Recurring Dispatch)"]
            MAINTENANCE["MaintenanceView & AlertsView"]
            FACILITIES["FacilitiesView & SettingsView"]
        end
    end

    OS --> MAIN
    ROS2 -.-> MAIN
    MAIN <--> PRELOAD
    PRELOAD <--> ROOT
    ROOT --> CONTEXT_LAYER
    CONTEXT_LAYER --> SHELL_LAYER
    SHELL_LAYER --> VIEW_LAYER
```

---

## 3. Application Lifecycle & Startup Sequence

When the operator launches the application, Electron and Vite cooperate to boot the environment securely:

```mermaid
sequenceDiagram
    autonumber
    participant OS as Operating System
    participant Main as Electron Main Process (main.js)
    participant Preload as Preload Bridge (preload.cjs)
    participant React as React UI (App.jsx)
    participant Storage as LocalStorage & Mock Data

    OS->>Main: Launch application binary
    Note over Main: Configure BrowserWindow with contextIsolation: true
    Main->>Preload: Load preload.cjs into isolated runtime
    Preload->>Preload: Expose safe APIs via contextBridge
    Main->>React: Load dist/index.html (or localhost in dev)
    React->>Storage: Read 'rfms-theme' & Initialize fleet state
    Storage-->>React: Hydrate theme & INITIAL_AGVS
    Note over React: Mount Context Providers (Theme, Auth, Fleet, Navigation)
    React->>React: Render AppLayout with DashboardView
    React-->>OS: Display fully interactive 1440x900 desktop console
```

---

## 4. Waypoint Route Planner: Mathematical Flow

The **Waypoint Route Planner** ([`CreateMissionView.jsx`](file:///Users/shubham/Playground/RFMS/src/views/CreateMissionView.jsx)) lets operators click on the factory floor plan to plot robot navigation paths, drag existing checkpoints, and estimate travel time dynamically.

### Coordinate Projection Challenge & Solution
* **Screen Coordinates** (`clientX`, `clientY`): Depend on monitor size, zoom, DPI, and window dimensions.
* **SVG Floor Plan Space**: A fixed vector canvas with `viewBox="0 0 540 400"`.
* **The Solution**: Use the SVG's **Screen Current Transformation Matrix (CTM)** inverse to project mouse clicks into the exact canvas coordinate system:

$$\begin{pmatrix} X_{\text{svg}} \\ Y_{\text{svg}} \end{pmatrix} = \mathbf{CTM}^{-1} \begin{pmatrix} X_{\text{client}} \\ Y_{\text{client}} \end{pmatrix}$$

```mermaid
flowchart TD
    START(["Operator Clicks Canvas or Drags Waypoint Pin"]) --> COORD_CALC["Extract (clientX, clientY) from Mouse Event"]
    COORD_CALC --> CTM_INVERSE["Compute svg.getScreenCTM().inverse()"]
    CTM_INVERSE --> MATRIX_TRANSFORM["matrixTransform: Map Screen Pixels to 540x400 SVG Space"]
    MATRIX_TRANSFORM --> CLAMP["Clamp Bounds: X in [25, 515], Y in [25, 375]"]
    
    CLAMP --> CHECK_DRAG{"Is Operator Dragging a Pin?"}
    CHECK_DRAG -- "Yes (Drag Mode)" --> UPDATE_PIN["Update Coordinates of Selected Pin in Real-Time"]
    CHECK_DRAG -- "No (Click to Add)" --> INSERT_PIN["Insert New Checkpoint right before Destination Pin"]

    UPDATE_PIN --> METRICS_CALC["Calculate Polyline Euclidean Distance"]
    INSERT_PIN --> METRICS_CALC
    
    METRICS_CALC --> FORMULA["Distance (m) = Total SVG Units * 0.25m/unit<br/>Transit Time = Distance / 1.2 m/s standard speed"]
    FORMULA --> STATE_SYNC["Update React Waypoint State & Synchronize Form Review"]
    STATE_SYNC --> DISPATCH_READY(["Route Rendered with Glowing Path & Direction Chevrons"])
```

---

## 5. Emergency Stop (E-Stop) Interlock Architecture

Safety is paramount in autonomous robotics. RFMS implements a global **Emergency Stop (E-Stop)** protocol that instantly freezes the fleet:

```mermaid
sequenceDiagram
    autonumber
    participant Op as Fleet Operator
    participant TopNav as TopNav HUD
    participant Modal as EStopDialog
    participant Fleet as FleetContext Store
    participant Robots as Active AGV Units (18 Robots)

    Op->>TopNav: Clicks 'E-Stop' Button
    TopNav->>Modal: Open Confirmation Dialog (open=true)
    Op->>Modal: Confirms 'Engage Global E-Stop'
    Modal->>Fleet: triggerEStop() Action Dispatched
    Note over Fleet: isEStopped = true
    Fleet->>Robots: Broadcast freeze: status='Stopped', speed=0.0 m/s
    Note over Robots: Dynamic mechanical brakes engage; missions halt
    Fleet-->>TopNav: TopNav displays golden 'Resume Fleet' indicator
    Note over Op,Robots: System is completely frozen until explicit manual operator clearance
    Op->>TopNav: Clicks 'Resume Fleet'
    TopNav->>Fleet: resetEStop() Dispatched
    Fleet->>Robots: Clear interlocks & restore default fleet state
```

---

## 6. Live Map CAD Digital Twin Engine

The **Live Map** ([`LiveMapView.jsx`](file:///Users/shubham/Playground/RFMS/src/views/LiveMapView.jsx)) provides a spatial digital twin of the factory floor:

```mermaid
flowchart TD
    subgraph INPUTS["Input Controller Events"]
        WHEEL["Mouse Wheel / Trackpad Pinch"]
        DRAG["Left-Click & Drag"]
        LAYER_TOGGLE["Layer Toggle Buttons"]
        PIN_CLICK["Click on AGV Robot Pin"]
    end

    subgraph ENGINE["Viewport Transformation Engine"]
        ZOOM_MATH["Update Zoom Scale [0.4x to 3.5x]"]
        PAN_MATH["Update Translation Offsets (pan.x, pan.y)"]
        LAYER_STATE["Filter Active SVG Layer Groups"]
    end

    subgraph SVG_CANVAS["Composite Vector Canvas (1000x650)"]
        GRID["Industrial Blueprint CAD Grid Pattern"]
        ZONES["Warehouse Floor Plan Zones (Assembly, Machining, Packing)"]
        GUIDES["Dashed Transit Corridors & Stations"]
        PULSE_AGVS["Pulsing AGV Markers with Live Speed & Status Pills"]
    end

    subgraph TELEMETRY["Operator Telemetry HUD"]
        POPUP["AgvPopupCard.jsx: Speed, Battery, Mission, Control Button"]
    end

    WHEEL --> ZOOM_MATH
    DRAG --> PAN_MATH
    LAYER_TOGGLE --> LAYER_STATE
    PIN_CLICK --> POPUP

    ZOOM_MATH --> SVG_CANVAS
    PAN_MATH --> SVG_CANVAS
    LAYER_STATE --> SVG_CANVAS

    SVG_CANVAS --> GRID
    SVG_CANVAS --> ZONES
    SVG_CANVAS --> GUIDES
    SVG_CANVAS --> PULSE_AGVS
```

---

## 7. State Management & Data Architecture

To avoid monolithic code and prop drilling, the frontend uses a **Domain-Driven Context Architecture**:

```mermaid
classDiagram
    class FleetContext {
        +agvs: Array~AGV~
        +missions: Array~Mission~
        +schedules: Array~Schedule~
        +maintenance: Array~ServiceRecord~
        +alerts: Array~Alert~
        +isEStopped: Boolean
        +addAgv(robot)
        +updateAgv(id, updates)
        +createMission(mission)
        +cancelMission(id)
        +toggleSchedule(id)
        +acknowledgeAlert(id)
        +triggerEStop()
        +resetEStop()
    }

    class NavigationContext {
        +currentView: String
        +selectedAgvId: String
        +mobileNavOpen: Boolean
        +navigateTo(view, options)
        +selectAgv(id)
    }

    class ThemeContext {
        +theme: String ("dark" | "light")
        +isDark: Boolean
        +toggleTheme()
        +setTheme(theme)
    }

    class AuthContext {
        +isAuthenticated: Boolean
        +user: Object
        +login()
        +logout()
    }

    FleetContext <-- NavigationContext : Coordinates Selected AGV Detail
    ThemeContext <-- AppLayout : Syncs HTML class and CSS tokens
    AuthContext <-- App : Routes between LoginView and AppLayout
```

---

## 8. Directory Structure & File Map

| Directory | Purpose | Key Files |
| :--- | :--- | :--- |
| `electron/` | Native desktop runtime | `main.js` (Window creation), `preload.cjs` (IPC bridge) |
| `src/context/` | Centralized business state | `FleetContext.jsx`, `NavigationContext.jsx`, `ThemeContext.jsx`, `AuthContext.jsx` |
| `src/hooks/` | Custom consumption hooks | `useFleet.js`, `useNavigation.js`, `useTheme.js`, `useAuth.js` |
| `src/constants/` | System configuration | `index.js` (`VIEWS`, `AGV_STATUS`, `MISSION_STATUS`, `ROUTE_PRESETS`) |
| `src/utils/` | Mathematics & formatting | `svg.js` (CTM projection, distance), `formatters.js` (Battery, speed) |
| `src/components/layout/` | Shell frame | `AppLayout.jsx`, `Sidebar.jsx`, `TopNav.jsx`, `MobileDrawer.jsx`, `EStopDialog.jsx` |
| `src/components/route-planner/` | Route planning domain | `WaypointRoutePlanner.jsx`, `FloorPlanZones.jsx`, `RouteTimeline.jsx` |
| `src/components/map/` | Spatial digital twin | `MapToolbar.jsx`, `AgvPopupCard.jsx`, `MapLegend.jsx` |
| `src/components/robots/` | AGV domain | `AddRobotModal.jsx`, `RobotModelIllustration.jsx` |
| `src/components/dashboard/` | Analytics domain | `FleetKpiCards.jsx`, `FleetStatusDonut.jsx` |
| `src/components/common/` | Reusable primitives | `StatusBadge.jsx`, `KpiCard.jsx`, `Card.jsx` |
| `src/views/` | 13 Dedicated application screens | `DashboardView.jsx`, `LiveMapView.jsx`, `RobotsView.jsx`, `CreateMissionView.jsx`, etc. |
| `src/App.jsx` | Declarative root | Composes providers and loads `AppLayout` |

---

## 9. Developer Quick Reference

### Running the Application in Development
```bash
npm run dev
```
Starts the Vite dev server and launches Electron with live hot-reloading.

### Building for Production
```bash
npm run build
```
Executes two sequential builds:
1. `vite build`: Compiles React 18, Tailwind CSS, and assets into `dist/`.
2. `vite build` (electron config): Bundles `electron/main.js` and `electron/preload.js` into `dist-electron/`.
