# RFMS - Robotics Fleet Management System (Desktop UI)

Starter template for building a desktop application with **Electron + Vite + React + Tailwind CSS** in **pure JavaScript**.

---

## 🚀 Getting Started

### 1. Development Mode
Run Vite and launch the Electron application with hot reload:
```bash
npm run dev
```

### 2. Production Build
Compile renderer and electron bundles:
```bash
npm run build
```

### 3. Package Executables
```bash
# Build macOS .dmg & .app bundle
npm run build:mac

# Build Windows .exe installer & portable executable
npm run build:win
```

---

## 🗂️ Project Structure

```
RFMS/
├── electron/
│   ├── main.js         # Electron main process
│   └── preload.js      # Context bridge exposing window.electronAPI
├── src/
│   ├── App.jsx         # Hello World root component
│   ├── index.css       # Tailwind CSS base styles
│   └── main.jsx        # React DOM entrypoint
├── index.html          # HTML entrypoint
├── vite.config.js      # Vite + Electron build configuration
├── tailwind.config.js  # Tailwind theme configuration
├── postcss.config.js
└── package.json
```
