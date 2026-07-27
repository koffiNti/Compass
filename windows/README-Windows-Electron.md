# Compass AI OS - Windows Native Electron Implementation & Troubleshooting Guide

Compass includes a fully implemented **Native Desktop Client** built with **Electron v33** for Windows 10/11.

---

## 1. Native Windows Architecture & Features

The Electron client transforms Compass into a native Windows 10/11 application:

* **Integrated Python Sidecar**: Automatically spawns the Python FastAPI server in the background when the app opens and terminates it when the app exits.
* **Single Instance Lock**: Ensures only one instance of Compass runs at a time; double-clicking shortcut restores the active window.
* **System Tray Menu**: Minimizes to system tray with context menu options (*Open Compass OS*, *System Status*, *Quit*).
* **Global Quick Launcher (`Alt + Space`)**: Instantly toggle window visibility from anywhere in Windows.
* **Context Bridge Preload**: Securely exposes system IPC controls (`minimizeWindow`, `maximizeWindow`, `closeWindow`, `getBackendStatus`) to the React web app.
* **Standalone `.exe` Packager**: Configured with `electron-builder` to generate standard NSIS setup installers (`Compass AI OS Setup 1.0.0.exe`) and portable executables.

---

## 2. Troubleshooting & Debugging `npm run dist`

If you encounter an error during `npm run dist`, verify the following 3 common scenarios:

### Case 1: `tsc: not found` or `electron-builder: not found`
* **Cause**: Node dependencies were not installed in both the root/windows and frontend directories.
* **Fix**:
  ```cmd
  cd frontend && npm install
  cd ../windows && npm install
  ```

### Case 2: `wine is required` (Cross-Compiling Windows `.exe` on Linux)
* **Cause**: `electron-builder` is attempting to create a Windows NSIS setup wizard while running on a Linux OS environment.
* **Fix**:
  * **On Windows**: Simply run `npm run dist` directly on Windows (Windows native compiler does NOT require Wine).
  * **On Linux**: Install Wine: `sudo apt-get install -y wine64` or run portable/dir build: `npx electron-builder --win dir`.

---

## 3. Step-by-Step Instructions to Build the `.exe` on Windows

```cmd
# 1. Install Frontend Dependencies
cd frontend
npm install
npm run build

# 2. Install Windows Electron Dependencies
cd ../windows
npm install

# 3. Build Windows Installer & Portable Executable
npm run dist
```

Output executables will be located in `windows/dist/`:
* `Compass AI OS Setup 1.0.0.exe` (NSIS Installer)
* `Compass AI OS 1.0.0.exe` (Portable Executable)
* `win-unpacked/Compass AI OS.exe` (Unpacked Desktop Binary)
