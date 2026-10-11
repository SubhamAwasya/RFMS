# RFMS — Robotics Fleet Management System

A desktop and web fleet management system for supervising, dispatching, and teleoperating Autonomous Guided Vehicles (AGVs) and Autonomous Mobile Robots (AMRs). Built with React 18, Electron 34, Vite 6, and Tailwind CSS.

---

## 📁 Project Structure

```text
RFMS/
├── electron/                   # Electron main & preload scripts
│   ├── main.js                 # Electron window creation & lifecycle
│   └── preload.js              # IPC bridge & context isolation
├── public/                     # Static assets & icons
├── src/
│   ├── components/             # Reusable UI components
│   │   ├── blackbox/           # Blackbox flight recorder & audit drawer
│   │   ├── common/             # Cards, KPI widgets, status badges
│   │   ├── dashboard/          # Fleet KPI summaries & status donut
│   │   ├── facilities/         # Multi-building & floor CAD map editor
│   │   ├── layout/             # Top navigation & side menu layout
│   │   ├── map/                # Live spatial map canvas & AGV markers
│   │   ├── robots/             # Robot cards, models & configuration modals
│   │   ├── route-planner/      # Interactive waypoint route editor
│   │   └── teleop/             # Manual WASD drive & teleoperation drawer
│   ├── constants/              # App constants, routes, AGV states & paths
│   ├── context/                # Global React contexts
│   │   ├── AuthContext.jsx     # User authentication & role state
│   │   ├── FleetContext.jsx    # Fleet telemetry, physics & simulation engine
│   │   ├── NavigationContext.jsx # Active view routing & map selections
│   │   └── ThemeContext.jsx    # Light / dark theme state
│   ├── data/                   # Default simulation dataset & mock blueprints
│   ├── hooks/                  # Custom React hooks (useFleet, useAuth, etc.)
│   ├── utils/                  # Coordinate math, SVG helpers, formatters
│   ├── views/                  # Primary screen views
│   │   ├── AlertsView.jsx      # System warnings & fault notifications
│   │   ├── DashboardView.jsx   # Fleet operations overview & quick fixes
│   │   ├── FacilitiesView.jsx  # Multi-facility management
│   │   ├── LiveMapView.jsx     # Real-time spatial tracking & teleop
│   │   ├── LoginView.jsx       # Operator login screen
│   │   ├── MaintenanceView.jsx # Service schedules & health inspection
│   │   ├── RobotDetailView.jsx # Single robot telemetry & live logs
│   │   ├── RobotsView.jsx      # Fleet directory & robot cards
│   │   ├── SettingsView.jsx    # System preferences & simulator reset
│   │   └── UsersView.jsx       # Operator access management
│   ├── App.jsx                 # Application entry point & router
│   ├── index.css               # Tailwind CSS base & utilities
│   └── main.jsx                # React root mount
├── package.json                # Project dependencies & scripts
├── tailwind.config.js          # Tailwind CSS theme configuration
└── vite.config.js              # Vite build & Electron plugin setup
```

---

## ⚙️ Prerequisites

Ensure you have the following installed on your system:

- **Node.js**: `v18.0.0` or higher ([Download Node.js](https://nodejs.org/))
- **npm**: `v9.0.0` or higher (comes bundled with Node.js)
- **Git**: ([Download Git](https://git-scm.com/))

Verify your installation:

```bash
node -v
npm -v
```

---

## 🚀 Setup & Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/SubhamAwasya/RFMS.git
   cd RFMS
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

---

## 💻 Running the Application

### 1. Development Mode (All Platforms)

Runs Vite with Electron hot-reloading:

```bash
npm run dev
```

### 2. Web Browser Only (No Desktop Window)

If you want to run or test the UI in a standard browser without Electron:

```bash
npm run build
npm run preview
```

Then open the printed localhost URL in your browser (e.g. `http://localhost:4173`).

---

## 🖥️ Running & Building on Different Operating Systems

### macOS (Intel & Apple Silicon)

- **Run in development:**
  ```bash
  npm run dev
  ```
- **Build standalone desktop app (.dmg and .app):**
  ```bash
  npm run build:mac
  ```
  The packaged installer will be generated in the `release/` folder. Double-click the `.dmg` file to install.

---

### Windows (10 / 11)

- **Run in development** (via Command Prompt, PowerShell, or Git Bash):
  ```bash
  npm run dev
  ```
- **Build standalone desktop app (.exe installer & portable):**
  ```bash
  npm run build:win
  ```
  The installer (`.exe`) will be generated in the `release/` directory.

---

### Linux (Ubuntu, Debian, Fedora, Arch)

- **System prerequisites (for Electron GUI rendering):**
  ```bash
  # Debian / Ubuntu
  sudo apt-get update
  sudo apt-get install -y libfuse2 libnss3 libatk1.0-0 libatk-bridge2.0-0 libcups2 libgtk-3-0 libasound2
  ```
- **Run in development:**
  ```bash
  npm run dev
  ```
- **Build standalone desktop package (.AppImage):**
  ```bash
  npm run build:linux
  ```
  The `.AppImage` will be generated in the `release/` directory. Make it executable before running:
  ```bash
  chmod +x release/*.AppImage
  ./release/*.AppImage
  ```

---

## 📜 Available NPM Scripts

| Command               | Description                                                                     |
| :-------------------- | :------------------------------------------------------------------------------ |
| `npm run dev`         | Starts Vite dev server and launches Electron desktop window                     |
| `npm run build`       | Compiles the React UI and Electron main process to `dist/` and `dist-electron/` |
| `npm run preview`     | Serves the production build locally via Vite preview                            |
| `npm run build:mac`   | Packages the application for macOS (`.dmg`)                                     |
| `npm run build:win`   | Packages the application for Windows (`.exe` NSIS installer & portable)         |
| `npm run build:linux` | Packages the application for Linux (`.AppImage`)                                |
| `npm run build:all`   | Packages the application for all platforms simultaneously                       |
