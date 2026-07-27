# Compass AI - iOS Native Deployment Guide

This workspace contains full iOS native app support via **Ionic Capacitor**.

---

## Steps to Build & Run Natively on iOS (iPhone / iPad)

### 1. Build Static Frontend Assets
```bash
cd frontend
npm run build
```

### 2. Initialize Capacitor & Add iOS Target
```bash
npm install @capacitor/core @capacitor/cli @capacitor/ios
npx cap init "Compass AI" "ai.compass.os" --web-dir dist
npx cap add ios
```

### 3. Sync Web Dist to Xcode
```bash
npx cap sync ios
```

### 4. Open Project in Xcode
```bash
npx cap open ios
```
* In Xcode, select your connected iPhone or iPad device (or Simulator).
* Press **Cmd + R** to run Compass natively on iOS!

---

## Native iOS UI Optimizations
* **Dark Mode Status Bar**: Integrated with `#09090b` status bar styling.
* **Haptic Micro-Interactions**: Smooth touch gestures and Framer Motion spring physics.
* **Safe Area Support**: Auto-padded top notch and bottom home indicator bar.
