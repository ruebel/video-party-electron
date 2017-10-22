const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipc = electron.ipcMain;
const path = require('path');
const url = require('url');
const actions = require('../actions.json');
const htmlPath = path.join(__dirname, '/../../build/index.html');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let windows = [];

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', start);

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function() {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    start();
  }
});

function createWindow(display = {}, id) {
  // Create the browser window.
  const newWindow = new BrowserWindow({
    width: display.bounds ? display.bounds.width : null || 800,
    height: display.bounds ? display.bounds.height : null || 600,
    // frame: false,
    webPreferences: {
      webSecurity: false
    }
  });
  const params = `?${display.primary ? 'main' : id}`;
  // and load the index.html of the app.
  const startUrl =
    process.env.ELECTRON_START_URL + params ||
    url.format({
      pathname: htmlPath + params,
      protocol: 'file:',
      slashes: true
    });
  newWindow.loadURL(startUrl);
  // Open the DevTools.
  newWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  newWindow.on('closed', function() {
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
  const displayInfo = getDisplays();
  displayInfo.displays.push({});
  windows = displayInfo.displays.map((d, i) => createWindow(d, i));
}

function getDisplays() {
  const displays = electron.screen.getAllDisplays();
  const bounds = displays.reduce(
    (total, display) => {
      return {
        height: total.height + display.bounds.height,
        width: total.width + display.bounds.width
      };
    },
    { height: 0, width: 0 }
  );
  return {
    bounds,
    displays: displays.map(d =>
      Object.assign(d, {
        primary: d.bounds.x === 0 && d.bounds.y === 0
      })
    )
  };
}

function registerEventEmitter(action) {
  ipc.on(action, function(event, arg) {
    windows.forEach(w => w.window.webContents.send(action, arg));
  });
}

function start() {
  // Register all of our event emitters that will broadcast events
  // to all registerd windows
  registerEventEmitter(actions.STATE_UPDATE);
  registerEventEmitter(actions.REGISTER);
  ipc.on(actions.ADD_WINDOW, function(event, arg) {
    const newWindow = createWindow({}, Math.max(...windows.map(w => w.id)) + 1);
    windows = [...windows, newWindow];
  });
  // Create all of our windows
  createWindows();
}
