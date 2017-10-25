const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipc = electron.ipcMain;
const path = require('path');
const actions = require('../actions.json');
const htmlPath = path.join(__dirname, './../../build/index.html');

// Keep a global reference of the window object
let mainWindow;
let windows = [];

process.on('uncaughtException', function (err) {
  console.log(err);
});
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', start);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    start();
  }
});
/**
 * Create a window instance
 */
function createWindow(display = {}, id) {
  // Create the browser window.
  const newWindow = new BrowserWindow({
    height: display.bounds ? display.bounds.height : null || 600,
    icon: path.join(__dirname, './../../public/icon/icon32x32.png'),
    webPreferences: {
      webSecurity: false
    },
    width: display.bounds ? display.bounds.width : null || 800
  });
  const params = `?${display.primary ? 'main' : id}`;
  // and load the index.html of the app.
  const startUrl =
    (process.env.ELECTRON_DEV
      ? process.env.ELECTRON_START_URL
      : `file://${htmlPath}`) + params;

  newWindow.loadURL(startUrl);
  if (process.env.ELECTRON_DEV) {
    // Open the DevTools.
    newWindow.webContents.openDevTools();
  }

  // Emitted when the window is closed.
  newWindow.on('closed', function () {
    windows = windows.filter(w => w.id !== id);
    if (display.primary) {
      mainWindow = null;
      app.quit();
    } else {
      mainWindow.webContents.send(actions.CLOSE_WINDOW, id);
    }
  });
  if (display.primary) {
    mainWindow = newWindow;
  }
  return { id, window: newWindow };
}

function createWindows() {
  // Create a window for each display attached
  const displays = getDisplays();
  // Assign to global to keep reference
  windows = displays.map((d, i) => createWindow(d, i));
}
/**
 * Get all displays and mark the primary
 */
function getDisplays() {
  const displays = electron.screen.getAllDisplays();
  return displays.map(d =>
    Object.assign(d, {
      primary: d.bounds.x === 0 && d.bounds.y === 0
    })
  );
}

function registerEventEmitter(action) {
  ipc.on(action, function (event, arg) {
    // Bradcast the event to all windows
    windows.forEach(w => w.window.webContents.send(action, arg));
  });
}
/**
 * Main entry point of electron
 */
function start() {
  // Register all of our event emitters that will broadcast events
  // to all registerd windows
  registerEventEmitter(actions.STATE_UPDATE);
  registerEventEmitter(actions.REGISTER);
  ipc.on(actions.ADD_WINDOW, function (event, arg) {
    // Create the new window (when it is ready it will register itself)
    const newWindow = createWindow({}, Math.max(...windows.map(w => w.id)) + 1);
    // Add it to the global window ref list
    windows = [...windows, newWindow];
  });
  // Create all default windows
  createWindows();
}
