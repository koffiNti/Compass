const { app, BrowserWindow, ipcMain, Tray, Menu, globalShortcut, dialog } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const http = require('http');

let mainWindow = null;
let tray = null;
let backendProcess = null;
let isBackendReady = false;

// 1. Global Uncaught Exception Handler (Prevents raw Error Dialog Popups)
process.on('uncaughtException', (error) => {
  console.error('[Compass Main Process Uncaught Exception]:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('[Compass Main Process Unhandled Rejection]:', reason);
});

// 2. Single Instance Lock
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.show();
      mainWindow.focus();
    }
  });
}

// 3. Spawn Python FastAPI Backend Process with Fallbacks & Error Handlers
function startBackendServer() {
  const isWin = process.platform === 'win32';
  const backendPath = path.join(__dirname, '../backend');

  // Build clean environment with explicit SystemRoot and ComSpec for Windows
  const systemRoot = process.env.SystemRoot || 'C:\\Windows';
  const comSpec = process.env.ComSpec || path.join(systemRoot, 'System32', 'cmd.exe');
  
  const env = {
    ...process.env,
    SystemRoot: systemRoot,
    ComSpec: comSpec,
    PYTHONPATH: backendPath,
    PATH: process.env.PATH || `${path.join(systemRoot, 'System32')};${systemRoot}`
  };

  const args = ['-m', 'uvicorn', 'app.main:app', '--host', '127.0.0.1', '--port', '8000'];

  // List of python command candidates for Windows / Unix
  const pythonCandidates = isWin ? ['python', 'py', 'python3', 'python.exe'] : ['python3', 'python'];

  function trySpawnCandidate(index) {
    if (index >= pythonCandidates.length) {
      console.warn('[Compass Backend]: All python executable candidates exhausted. Will rely on active background server or manual launch.');
      return;
    }

    const cmd = pythonCandidates[index];
    console.log(`[Compass Backend]: Attempting to spawn backend with candidate '${cmd}'...`);

    try {
      backendProcess = spawn(cmd, args, {
        cwd: backendPath,
        shell: false, // Avoid forcing cmd.exe ENOENT
        env: env
      });

      backendProcess.on('error', (err) => {
        console.warn(`[Compass Backend]: Candidate '${cmd}' failed with error: ${err.message}. Trying next candidate...`);
        trySpawnCandidate(index + 1);
      });

      if (backendProcess.stdout) {
        backendProcess.stdout.on('data', (data) => {
          console.log(`[Backend STDOUT]: ${data}`);
        });
      }

      if (backendProcess.stderr) {
        backendProcess.stderr.on('data', (data) => {
          console.error(`[Backend STDERR]: ${data}`);
        });
      }

      backendProcess.on('close', (code) => {
        console.log(`[Backend Process]: Exited with code ${code}`);
      });

    } catch (e) {
      console.warn(`[Compass Backend]: Exception spawning candidate '${cmd}': ${e.message}`);
      trySpawnCandidate(index + 1);
    }
  }

  trySpawnCandidate(0);
}

// 4. Health Check Poller
function waitForBackend(callback, retries = 20) {
  if (retries <= 0) {
    console.warn('[Compass Backend]: Health check timed out. Proceeding to launch UI...');
    callback(false);
    return;
  }

  http.get('http://127.0.0.1:8000/health', (res) => {
    if (res.statusCode === 200) {
      isBackendReady = true;
      console.log('[Compass Backend]: Server is healthy & responding on http://127.0.0.1:8000/health');
      callback(true);
    } else {
      setTimeout(() => waitForBackend(callback, retries - 1), 500);
    }
  }).on('error', () => {
    setTimeout(() => waitForBackend(callback, retries - 1), 500);
  });
}

// 5. Create Main Electron Window
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 920,
    minWidth: 1024,
    minHeight: 700,
    title: 'Compass AI Personal Operating System',
    backgroundColor: '#09090b',
    show: false,
    frame: true,
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
    icon: path.join(__dirname, 'icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  const isDev = process.env.NODE_ENV === 'development';
  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
  } else {
    mainWindow.loadFile(path.join(__dirname, '../frontend/dist/index.html'));
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow.focus();
  });

  mainWindow.on('close', (event) => {
    if (!app.isQuitting) {
      event.preventDefault();
      mainWindow.hide();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// 6. System Tray Menu
function createTray() {
  try {
    const iconPath = path.join(__dirname, 'icon.png');
    tray = new Tray(iconPath);
    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Open Compass OS',
        click: () => {
          if (mainWindow) {
            mainWindow.show();
            mainWindow.focus();
          }
        },
      },
      {
        label: 'System Status: Active',
        enabled: false,
      },
      { type: 'separator' },
      {
        label: 'Quit Compass',
        click: () => {
          app.isQuitting = true;
          app.quit();
        },
      },
    ]);
    tray.setToolTip('Compass AI Personal Operating System');
    tray.setContextMenu(contextMenu);
  } catch (e) {
    console.log('Tray creation bypassed or icon missing.');
  }
}

// 7. IPC Handlers
ipcMain.on('window-minimize', () => {
  if (mainWindow) mainWindow.minimize();
});

ipcMain.on('window-maximize', () => {
  if (mainWindow) {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  }
});

ipcMain.on('window-close', () => {
  if (mainWindow) mainWindow.hide();
});

ipcMain.handle('get-backend-status', () => {
  return { isReady: isBackendReady };
});

// 8. App Lifecycle Events
app.whenReady().then(() => {
  startBackendServer();
  createTray();

  waitForBackend(() => {
    createWindow();
  });

  // Global Quick Launcher Shortcut (Alt + Space)
  try {
    globalShortcut.register('Alt+Space', () => {
      if (mainWindow) {
        if (mainWindow.isVisible() && mainWindow.isFocused()) {
          mainWindow.hide();
        } else {
          mainWindow.show();
          mainWindow.focus();
        }
      }
    });
  } catch (e) {
    console.warn('Could not register Alt+Space shortcut:', e);
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('will-quit', () => {
  try {
    globalShortcut.unregisterAll();
  } catch (e) {}

  if (backendProcess) {
    console.log('Terminating Python backend process...');
    try {
      backendProcess.kill();
    } catch (e) {}
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.isQuitting = true;
    app.quit();
  }
});
