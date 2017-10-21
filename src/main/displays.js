const BrowserWindow = require('electron').BrowserWindow;
const path = require('path');
const url = require('url');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let windows = [];

const htmlPath = path.join(__dirname, '/../../build/index.html');

function createWindow(display) {
  // Create the browser window.
  const newWindow = new BrowserWindow({
    width: display.bounds.width,
    height: display.bounds.height,
    // frame: false,
    // width: 800,
    // height: 600,
    webPreferences: {
      webSecurity: false
    }
  });
  // and load the index.html of the app.
  const startUrl =
    process.env.ELECTRON_START_URL ||
    url.format({
      pathname: htmlPath, // + `?main=${display.primary}`,
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
  console.log('create Windows');
  const displayInfo = getDisplays();
  console.log('displayInfo', displayInfo);
  windows = displayInfo.displays.map(d => createWindow(d));
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

module.exports = {
  createWindows
};
