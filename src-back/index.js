const { app, BrowserWindow, screen } = require('electron');
const electronContextMenu = require('electron-context-menu');
const isDev = require('electron-is-dev');

// Add a default system context menu on right click anywhere in the application
electronContextMenu();

const init = async function() {
  const { height, width } = screen.getPrimaryDisplay().workAreaSize;
  const defaultWidth = 1440;
  const defaultHeight = 900;

  const appWindow = new BrowserWindow({
    backgroundColor: '#262A34',
    width: width > defaultWidth ? defaultWidth : width - 200,
    minWidth: 1280,
    height: height > defaultHeight ? defaultHeight : height - 200,
    minHeight: 720,
    // show: false,
    webPreferences: {
      // preload: path.join(__dirname, 'public', 'api.js'),
    }
  });
  await appWindow.loadURL('http://localhost:3000');
  appWindow.once('ready-to-show', () => {
    appWindow.show();
  });
  if(isDev) appWindow.toggleDevTools();
};

app.on('window-all-closed', () => {
  app.quit();
});

app.on('ready', init);
