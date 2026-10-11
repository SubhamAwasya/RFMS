# 📘 RFMS Operator Manual & User Guide
### Easy, Step-by-Step Guide for Factory Operators and Supervisors

Welcome to the **Robotics Fleet Management System (RFMS)**! 

Think of this software as an **Air Traffic Control Tower** for your warehouse or factory floor. Instead of airplanes, you are supervising intelligent self-driving robots (**AGVs & AMRs**) that carry pallets, tow carts, transport materials, and dock at automated charging bays.

You **do not need any coding or programming knowledge** to use this software. This guide explains everything in simple, everyday language.

---

## 🧭 1. Understanding Your Screen Layout

When you open RFMS, the screen is organized into three clean zones:

```
+-----------------------------------------------------------------------------------------+
|  [RFMS]      TOP BAR: Search | Building Filter | [E-STOP] | Alerts Bell | Theme | User  |
+--------------+--------------------------------------------------------------------------+
|              |                                                                          |
|  LEFT MENU:  |                        MAIN WORK AREA                                    |
|              |                                                                          |
|  • Dashboard |   This large central area changes based on what you select:              |
|  • Live Map  |                                                                          |
|  • Maps &    |   - Executive Operational Dashboard                                      |
|    Facilties |   - Digital Twin Floor Map (Zoom, Pan, Real-Time AGV Movement)           |
|  • AGVs /    |   - Vehicle Cockpit (Live ROS 2 Logs, Mini-Map, WASD Drive)              |
|    Robots    |   - Interactive Waypoint Route Planner                                   |
|  • Alerts    |   - Safety Alerts & Preventive Maintenance                               |
|  • Settings  |                                                                          |
|              |                                                                          |
+--------------+--------------------------------------------------------------------------+
```

1. **Left Sidebar Menu**: Your primary navigation remote control.
   - **Collapse Sidebar**: Click the small arrow button at the bottom of the sidebar or press `Ctrl + B` (or `Cmd + B` on Mac) to collapse the sidebar into a slim icon rail, giving you maximum screen space for maps!
2. **Top Header Bar**: 
   - **Search Box**: Quickly look up any robot by ID (e.g., `FL-01`, `AMR-01`) or location.
   - **Live Indicator**: Pulsing green badge confirming real-time telemetry is running.
   - **Big Red E-Stop Button**: Instant fleet safety stop.
   - **Alerts Bell**: Shows current unread warnings.
   - **Theme Switcher**: One-click toggle between Dark Mode and Light Mode.
3. **Main Work Area**: Where your operational dashboards, maps, and vehicle controls appear.

---

## 🚨 2. Emergency Safety: The Global E-Stop Button

At the top right of your screen is a prominent red button labeled **E-Stop**.

### When to use it:
* If an unexpected obstacle appears (e.g., a person walking into an aisle, a dropped pallet, or an unmapped obstruction), click **E-Stop**.
* A confirmation dialog will pop up: click **Engage Global E-Stop**.
* **Instantly, all active robots across the entire facility will apply mechanical brakes and freeze to 0.0 m/s**. All missions and teleoperation loops are immediately locked.

### How to resume operations:
* Once the floor is inspected and clear, look at the top bar: the button will now display in gold as **Resume Fleet**.
* Click **Resume Fleet** to release the safety interlocks and return vehicles to their scheduled guide routines.

---

## 📊 3. The Dashboard (Your Operational Command Center)

Click **Dashboard** in the left menu. This screen is engineered to give you high-level intelligence and highlight **only what needs your attention**:

### A. 4 Key Metric Cards
1. **Total Fleet**: Total units in the facility, broken down into active, charging, and idle counts.
2. **Cruising Velocity**: Fleet average speed in meters per second ($m/s$) and kilometers per hour ($km/h$).
3. **Active Payload**: Total cargo weight ($kg$) and count of loaded pallets currently in transit.
4. **Fleet Battery**: Overall average battery percentage and charging status.

### B. Fleet Distribution & Energy Hub
* **AGV Fleet Status Donut**: A color-coded circular breakdown showing how many units are Auto-Looping (cyan), Charging (amber), Idle (emerald), or in Fault (red).
* **Charging & Energy Dynamics**: Shows battery distribution brackets ($\ge 75\%$ Nominal, $50-74\%$ Cruising, $20-49\%$ Low, and $<20\%$ Critical) alongside the number of active charging bays.

### C. Fleet Health & Exceptions Watchdog
* **If everything is normal**: Displays a clean green badge: **"All Fleet Units Operating Nominally"** with floor deployment counts. Healthy robots do not clutter your dashboard!
* **If a robot has an issue** (e.g., collision fault, obstacle block, or critical battery $<20\%$): Surfaces **only that specific vehicle** with an immediate **"Quick Fix"** button to restore operation.
* **Facility Filter & Export**: Use the dropdown at the top to filter the dashboard by facility, or click **"Export"** to download an instant telemetry report as a JSON file.

---

## 🗺️ 4. Using the Live Map (Digital Twin)

Click **Live Map** in the left menu to view the bird's-eye blueprint of your facility.

### Navigating the Map:
* **Zoom**: Roll your mouse wheel up/down, pinch your trackpad, or click the **`+`** and **`-`** buttons on the floating map toolbar.
* **Pan**: Click and drag anywhere on the map floor to slide around.
* **Reset**: Click the zoom percentage button (e.g., `100%`) or the reset icon to re-center the blueprint instantly.
* **Switch Floors**: Use the floor selector bar at the top to view Ground Floor, Floor 1, or Basement decks.

### Understanding Robot Markers on the Map:
* **Vehicle Shapes**: Each robot appears as its actual vehicle model:
  * 🚜 **Forklifts** have front forks and lifting masts.
  * 🤖 **AMRs** appear as sleek rounded pucks with laser bands.
  * 🚚 **Flatbeds** have wide cargo decks with rollers.
  * 🚛 **Tuggers** have tractor cabs with rear hitches.
* **Vehicle Status Tag**: Clean, compact pill below each vehicle showing:
  `ID • Status • Battery%` (e.g., **`AMR-01 • Auto-Pilot • 36%`**).
* **Status LED Dot**:
  * 🟢 **Green**: Active on guide path (Auto-Pilot).
  * 🔵 **Cyan**: Connected to charging pad (Charging).
  * 🟡 **Amber**: Low battery, returning to dock (Docking).
  * 🔴 **Red**: Collision obstacle or system fault (Stopped).

---

## 🤖 5. Managing & Teleoperating Robots (AGVs / Robots)

Click **AGVs / Robots** in the left menu. This is your comprehensive fleet registry.

### Adding & Editing Robots:
* **Add Robot**: Click **+ Add AGV** in the top right. Select the vehicle type (Forklift, AMR, Flatbed, Tugger), name, and assigned floor.
* **Edit Robot**: Click the **Pencil icon** on any robot card to edit its payload capacity or rename it.

### Opening the Robot Cockpit (Robot Detail View):
Click on any robot card to enter its dedicated cockpit:

1. **3D/Vector Model Illustration**: Displays an accurate rendering of the robot's physical model (Forklift with pallet, AMR puck, Tugger, or Flatbed) highlighted in its custom theme color.
2. **Live Telemetry Grid**: Real-time readouts for battery percentage, dynamic discharge rate, speed, payload weight, assigned floor, and uptime.
3. **Live ROS 2 Logs Console**:
   * Generates realistic telemetry events (odometry `/odom`, laser scans, battery cell voltages) automatically every few seconds.
   * Color-coded tags: `INFO` (blue), `WARN` (amber), `DEBUG` (purple), `ERROR` (red).
   * Click **"+ Add Log"** to immediately trigger a test log entry, or **"Clear"** to reset the console.
4. **Current Position Mini-Map**:
   * A dynamic vector mini-map rendering the robot's real guide path and waypoints.
   * The robot marker moves smoothly across the mini-map in real time with an arrow pointing in its heading direction.
   * Displays exact millimetric CAD coordinates (`X: mm`, `Y: mm`, `θ: °`) and the closest warehouse station (`Near Docking Bay 01`).
   * Click **"View on Map"** to jump directly to this robot on the full Live Map.
5. **Manual Teleoperation (Drive [WASD])**:
   * Click the blue **"Drive [WASD]"** button to open the teleop drawer.
   * Use your keyboard:
     * **`W`** = Drive Forward
     * **`S`** = Drive Reverse
     * **`A`** = Steer Left
     * **`D`** = Steer Right
   * The robot switches to Manual Teleop mode and responds instantly.
   * Click **"Release Control"** or press E-Stop at any time to return to autonomous guide looping.
6. **Training Simulations (Dropdown Menu)**:
   * Click the three dots (`...`) in the top right to test safety protocols:
     * **Send to Charger**: Manually routes the vehicle to the nearest charging station.
     * **Simulate Low Battery (<10%)**: Forces the robot to trigger its low-battery docking routine.
     * **Simulate Fault & Auto-Fix**: Triggers a simulated obstacle halt, tests alert broadcasting, and demonstrates the auto-recovery watchdog.

---

## 🗺️ 6. Waypoint Route Planner

Need to plot or modify a robot's navigation path?

1. Open **Maps & Facilities** or the **Route Planner**.
2. **Click anywhere on the floor plan** to drop a new numbered checkpoint pin.
3. **Drag and drop** existing waypoint pins along aisles to avoid obstacles.
4. The system calculates total travel distance ($meters$) and transit ETA ($minutes$) automatically using Euclidean geometry.
5. Click **"Save Route"** to dispatch the path to the vehicle.

---

## 🔔 7. Alerts & Safety Notifications

Click **Alerts** in the left menu to view the real-time safety log:
* **Danger (Red)**: Critical hardware faults or E-Stop halts requiring operator inspection.
* **Warning (Amber)**: Low battery reserve notifications ($<20\%$) or path clearance warnings.
* **Info (Blue)**: Routine charging undock events and mission completions.
* Click **"Resolve"** on any alert once cleared, or click **"Generate Test Alert"** to practice triage drills.

---

## 💡 Quick Tips for Daily Shift Supervisors

* **Shift Start**: Check the Dashboard. If **Fleet Health & Exceptions** displays green, all robots are running nominally.
* **Monitoring Batteries**: Check the **Charging Dynamics** card on the dashboard. Units below $20\%$ will automatically dock and undock when fully charged.
* **Quick Tracking**: Clicking any robot's **"Map"** button automatically switches to that robot's floor and centers it on the Live Map.
* **Keyboard Shortcut**: Press `Ctrl + B` (or `Cmd + B`) at any time to collapse the sidebar for wide-screen monitoring.
