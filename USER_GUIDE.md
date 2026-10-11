# 📖 RFMS Simple User Guide

Welcome to the **Robotics Fleet Management System (RFMS)**.  
This guide explains how to use the system in simple words.

---

## 🤖 1. The Two Types of Robots

Your fleet has **10 autonomous robots** divided into two types:

1. **Forklift AGV (`FL-01` to `FL-05`)**:
   - Has lifting forks at the front.
   - Moves pallets from receiving docks to storage racks.
2. **Flatbed Payload Carrier AGV (`FB-01` to `FB-05`)**:
   - Has a flat cargo deck.
   - Carries heavy parts and totes across warehouse corridors.

---

## 🧭 2. Main Pages in the App

Use the **left menu** to switch between screens:

| Page | What it does |
| :--- | :--- |
| **📊 Dashboard** | Gives a quick summary of the whole fleet: total robots, average battery, and active alerts. |
| **🗺️ Live Map** | Shows the factory blueprint. You can watch all robots moving in real time. |
| **🏢 Maps & Facilities** | Manage buildings, floors, charging pads, docking bays, and safety zones. |
| **🤖 Robots** | Complete list of all 10 robots. Search, filter by type or building, edit, or track. |
| **🔔 Alerts** | Live notifications if a robot has low battery, an obstacle in front, or needs service. |
| **⚙️ Settings** | Switch light/dark mode and configure system preferences. |

---

## 🚨 3. Emergency Stop (E-Stop)

At the top right of your screen is a big red **E-Stop** button.

- **To STOP all robots**: Click **E-Stop** -> Click **Confirm**. Every robot will immediately stop moving.
- **To RESUME**: Click the gold **Resume Fleet** button once the floor is clear.

---

## 🛠️ 4. Common Tasks (Step-by-Step)

### A. How to watch a robot on the map
1. Go to **Live Map** in the left menu.
2. Select your building and floor from the top dropdowns.
3. Click on any robot to open its control panel and view live speed, battery, and route.

### B. How to drive a robot manually (WASD)
1. Go to **Robots** and click on a robot (or click a robot on the **Live Map**).
2. Click the blue **"Drive [WASD]"** button.
3. Use your keyboard to steer:
   - **W** = Move Forward
   - **S** = Move Backward
   - **A** = Turn Left
   - **D** = Turn Right
4. Click **"Release Control"** when you are done to let the robot resume auto-pilot.

### C. How to switch buildings or floors
1. At the top of the **Live Map** or **Facilities** page, find the two dropdown menus.
2. Choose **Building A** (Logistics Hub) or **Building B** (Fulfillment Center).
3. Choose the floor (e.g. Ground Floor or Level 1).

### D. How to test low battery or charger return
1. Open any robot's detail page.
2. Click the three dots menu (`...`) in the top right.
3. Click **"Send to Charger"** or **"Simulate Low Battery"**.
4. Watch the robot automatically drive itself to the nearest charging pad.

---

## 🎨 5. What Robot Status Colors Mean

| Dot Color | Status | What it means |
| :--- | :--- | :--- |
| 🟢 **Green** | Auto-Pilot | Robot is driving normally along its loop. |
| 🔵 **Blue** | Charging | Robot is parked on a charging pad recharging its battery. |
| 🟡 **Yellow** | Docking / Low Battery | Battery is below 10%; robot is heading to a charger. |
| 🔴 **Red** | Stopped / Obstacle | Robot stopped because something is blocking its path or E-Stop was pressed. |

---

## 💡 Quick Tips

- **Collapse Menu**: Press `Ctrl + B` (or `Cmd + B` on Mac) to hide the left menu and give you more map space.
- **Zoom & Move Map**: Use your mouse wheel to zoom in and out. Click and drag to move around the map.
- **One-Click Tracking**: Click the **Map** button next to any robot in the Robots table to immediately jump to its floor.
