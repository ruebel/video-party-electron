const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipc = electron.ipcMain;
const path = require('path');
const url = require('url');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let windows = [];

const htmlPath = path.join(__dirname, '/../../build/index.html');

function start() {
  ipc.on('state-update', function(event, arg) {
    // do child process or other data manipulation and name it manData
    event.sender.send('updated-state', arg);
  });
  // init
  createWindows();
}

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

function createWindow(display, id) {
  // Create the browser window.
  const newWindow = new BrowserWindow({
    width: display.bounds.width || 800,
    height: display.bounds.height || 600,
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
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    windows = windows.filter(w => w !== newWindow);
    if (display.primary) {
      mainWindow = null;
      app.quit();
    }
  });
  if (display.primary) {
    mainWindow = newWindow;
  }
  return newWindow;
}

function createWindows() {
  const displayInfo = getDisplays();
  displayInfo.displays.push({ bounds: {} });
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
