# 📘 RFMS Operator Manual & User Guide
### Easy, Step-by-Step Guide for Factory Operators and Supervisors

Welcome to the **Robotics Fleet Management System (RFMS)**! 

Think of this software as an **Air Traffic Control Tower** for your warehouse or factory floor. Instead of airplanes, you are supervising intelligent self-driving robots (AGVs) that carry pallets, pull carts, inspect machinery, and transport materials between stations.

You **do not need any coding or programming knowledge** to use this software. This guide explains everything in simple, everyday language.

---

## 🧭 1. Understanding Your Screen Layout

When you open RFMS, the screen is split into three main areas:

```
+-----------------------------------------------------------------------------------+
|  [RFMS Logo]      TOP BAR: Search | Clock | [E-STOP] | Alerts Bell | Theme | Avatar|
+--------------+--------------------------------------------------------------------+
|              |                                                                    |
|  LEFT MENU:  |                      MAIN WORK AREA                                |
|              |                                                                    |
|  • Dashboard |   This large central area changes based on what you click          |
|  • AGVs      |   on the left menu:                                                |
|  • Missions  |                                                                    |
|  • Live Map  |   - Interactive Floor Map                                          |
|  • Schedules |   - Robot Lists & Batteries                                        |
|  • Alerts    |   - Route Planners                                                 |
|  • Settings  |                                                                    |
|              |                                                                    |
+--------------+--------------------------------------------------------------------+
```

1. **Left Sidebar Menu**: Your main remote control. Click any item here to switch screens (Dashboard, Live Map, Robots, Missions, etc.).
2. **Top Header Bar**: 
   - **Search Box**: Quickly find any robot by ID (e.g., `AGV-01`) or location (e.g., `Aisle 2`).
   - **Live Pulse**: Shows the green "Live" badge indicating real-time communication is active.
   - **Red E-Stop Button**: Emergency safety freeze button.
   - **Bell Icon**: Shows how many unread safety warnings exist.
   - **Sun / Moon Icon**: Switches between Dark Mode (modern dark gray) and Light Mode (clean daylight white).
3. **Main Work Area**: Where you view maps, supervise robots, and dispatch tasks.

---

## 🚦 2. The Big Red Safety Button: Emergency Stop (E-Stop)

At the top right of your screen is a red button labeled **E-Stop**.

### What it does:
* In an emergency (e.g., someone steps into an aisle, an unexpected spill, or a blocked corridor), click **E-Stop**.
* A confirmation box will pop up: click **Engage Global E-Stop**.
* **Instantly, all active robots will brake and freeze to a complete stop (0.0 m/s)**. Their missions will be paused.

### How to resume normal operations:
* Once the floor is clear and safe, look at the top right: the button has now turned gold and says **Resume Fleet**.
* Click **Resume Fleet** to release the brakes and return the robots to their normal schedules.

---

## 📊 3. The Dashboard (Your Morning Overview)

Click **Dashboard** in the left menu. This is your command center overview:

* **Top 6 Stat Cards**:
  * **Total AGVs**: Total number of robots in the building (e.g., 18).
  * **Active**: How many robots are currently working or moving.
  * **In Mission**: Robots actively delivering materials right now.
  * **Charging**: Robots parked at charging docks replenishing battery.
  * **Idle**: Robots waiting for their next assignment.
  * **Fault / Offline**: Should normally be `0`. If greater than 0, check the Alerts tab immediately.
* **AGV Status Donut Wheel**: A colored pie chart showing fleet distribution at a glance.
* **Mission Activity Graph**: Shows how many deliveries were completed today vs. ongoing.
* **Quick Lists (Bottom)**: See the last 3 deliveries, active warnings, and upcoming maintenance deadlines.

---

## 🗺️ 4. Using the Live Map (Digital Twin)

Click **Live Map** in the left menu. This displays a bird's-eye view of your entire warehouse.

### How to Move Around the Map:
* **Zoom In & Out**:
  * **Mouse**: Roll your mouse wheel up or down.
  * **Trackpad**: Pinch with two fingers to zoom in or spread to zoom out.
  * **On-Screen Buttons**: Click the **`+`** and **`-`** buttons floating on the top-left of the map.
  * **Reset View**: Click the percentage button (e.g., `100%`) or the circular reset arrow to immediately re-center the map.
* **Pan (Slide Around)**:
  * Click and hold anywhere on the map, then drag your mouse to pan around.
  * On a trackpad, slide with two fingers.

### What the Colors Mean:
* 🟢 **Green Moving Circle**: Robot actively transporting cargo.
* 🟡 **Amber Circle**: Robot parked in a charging dock.
* 🔵 **Blue Line**: The active corridor path the robot is currently following.
* 🟠 **Dashed Line**: The planned return path for outbound delivery.

### Inspecting a Robot:
* **Click on any robot pin** on the map (for example, `AGV-01 Transporting`).
* A card pops up on the right showing:
  * Exact current speed (e.g., `1.2 m/s`).
  * Battery charge percentage (e.g., `78%`).
  * Current room/aisle location.
  * A blue **Control AGV** button to jump straight into its detailed cockpit.

---

## 🤖 5. Checking & Controlling Your Robots (AGVs)

### Viewing the Fleet List:
Click **AGVs / Robots** in the left menu:
* You will see a clean table listing every robot in your fleet.
* You can filter by type (**Pallet Mover**, **Tugger**, **Shelf Carrier**, or **Inspection**) or by status (**In Mission**, **Charging**, **Idle**).
* **Adding a New Robot**: Click the blue **+ Add AGV** button in the top right. Enter an ID (e.g., `AGV-07`), choose its type, and hit **Save AGV**.

### Robot Cockpit & Live Camera Feed:
Click on any robot row in the table (or click its pin on the map):
* **3D Robot Illustration**: Displays the robot's physical model, LiDAR sensor dome, and payload deck.
* **Live Telemetry Grid**: Shows real-time Battery, Speed, Current Mission, and Hours of Uptime.
* **Live Video Feed**: The **Live Camera** tab shows the real-time forward optical camera from the robot so you can see what is in front of it!
* **Quick Action Controls**:
  * **Start Mission**: Dispatch the robot on its pending task.
  * **Pause**: Temporarily pause the robot in place.
  * **Stop**: Immediately stop the robot.
  * **Return to Dock**: Send the robot back to the charging bay to charge its battery.
* **Current Position Mini-Map**: Shows a thumbnail of where the robot is located on the plant floor.

---

## 🗺️ 6. Creating a Mission & Drawing Routes

Need to send an AGV from **Assembly Line 1** to the **Packing Area**? Here is how to create a mission in 4 easy steps:

Click **Missions** on the left menu $\rightarrow$ Click the blue **+ Create Mission** button.

### Step 1: Route & Waypoint Planner
On the left side, fill in the basics:
* **Mission Name**: Give it a clear name (e.g., *Pallet delivery to Dock 3*).
* **Priority**: Choose **High**, **Medium**, or **Low**.
* **Pick Up & Drop Off Locations**: e.g., *Station A* $\rightarrow$ *Packing*.

**Using the Interactive Route Planner (Right Side)**:
* **Add a Stop**: Simply **click anywhere on the floor map**! A new numbered checkpoint pin will drop exactly where you clicked.
* **Move a Stop**: Click and **drag any pin** to reposition it along an open aisle corridor.
* **Delete a Stop**: In the chips below the map, click the small **`×`** on any waypoint to remove it.
* **Undo / Reset**: Click **Undo** to remove the last point, or **Reset** to return to start and end pins.
* **1-Click Presets**: Want a standard route? Click one of the preset pills:
  * **Line 1 $\rightarrow$ Packing**
  * **Machining $\rightarrow$ Dispatch**
  * **Full Plant Patrol**
* **Notice the Metrics**: The system automatically measures the total path distance (e.g., `52 meters`) and calculates estimated transit time (e.g., `~3 minutes`).

Click **Next: Settings**.

### Step 2: Safety Settings
* **Speed Ceiling**: Choose standard (`1.2 m/s`) or safety caution for tight corridors (`0.8 m/s`).
* **Obstacle Detection Distance**: Choose how far ahead the LiDAR laser looks for pedestrians or boxes (`2.5 meters`).
* **Warning Sound**: Choose between flashing strobe lights or lights + beeper.
* Click **Next: Assign**.

### Step 3: Assign a Robot
* You will see available AGVs with their current battery percentages.
* Pick a robot with good battery (e.g., `AGV-01` with 78% battery).
* Click **Next: Confirm**.

### Step 4: Review & Dispatch
* Review the summary card (Route, Distance, Travel Time, Assigned AGV).
* Click **Dispatch Mission**.
* The robot immediately receives the route and starts moving!

---

## ⏰ 7. Scheduling Automated Recurring Deliveries

Do you have a regular delivery that needs to happen every 2 hours throughout a shift?

1. Click **Schedules** in the left menu.
2. Click **+ Add Schedule**.
3. Name the schedule (e.g., *Raw Material Replenishment*).
4. Select frequency (e.g., *Every 2 hours*).
5. Set operating hours (e.g., *06:00 - 22:00*).
6. Click **Save Schedule**.
7. You can turn any automated schedule **ON** or **OFF** at any time using the toggle switch in the table.

---

## 🔧 8. Maintenance & Health Checks

Click **Maintenance** in the left menu:
* View scheduled checkups for motors, wheels, battery cells, and LiDAR sensors.
* Tabs:
  * **Upcoming**: Maintenance tasks scheduled for the coming weeks.
  * **Overdue**: Items that need urgent inspection.
  * **History**: Past completed service records.

---

## 🔔 9. Responding to Alerts & Obstacle Warnings

Click **Alerts** in the left menu (or click the Bell icon in the top header):
* **Red Alerts (Danger)**: A robot detected an obstacle in its direct path and had to stop.
  * Click **Locate Unit** to jump to the map and see where it is blocked.
  * Once an operator on the floor clears the box or pallet, click **Acknowledge** to dismiss the alert.
* **Yellow Alerts (Warning)**: Low battery notifications (e.g., below 30%) or transit delays.
* **Blue Alerts (Info)**: Automatic reroutes around congested doorways.

---

## 🎨 10. Switching Dark and Light Mode

* Click the **Sun / Moon icon** in the top navigation bar at any time.
* **Dark Mode**: Uses modern industrial gray and obsidian tones, ideal for low-light control rooms or long shifts.
* **Light Mode**: Clean daylight white and slate surfaces, ideal for brightly lit factory offices.
* Your preference is automatically saved on your computer and remembered next time you open the app.

---

## 💡 Quick Tips & Best Practices

| Task | Tip |
| :--- | :--- |
| **Lost on the Map?** | Click the reset percentage button (`100%`) on the map toolbar to immediately center your view. |
| **Robot Battery Low?** | Click on the robot in the list or map, and click **Return to Dock**. It will drive itself to the charging bay. |
| **Aisle Blocked?** | In the Waypoint Route Planner, simply drag the route pin into an alternate corridor to route around construction or spills. |
| **Immediate Floor Freeze?** | Hit the red **E-Stop** button at the top-right of your screen. |
