const { app, BrowserWindow, ipcMain, screen } = require('electron');
const electronContextMenu = require('electron-context-menu');
const isDev = require('electron-is-dev');
const path = require('path');
const { getPackageJson } = require('./util');
const API = require('./modules/api');

// Add a default system context menu on right click anywhere in the application
electronContextMenu();

const init = async function() {
  const { height, width } = screen.getPrimaryDisplay().workAreaSize;
  const defaultWidth = 1440;
  const defaultHeight = 900;

  const packageJson = await getPackageJson();
  const api = new API(ipcMain, packageJson);

  const appWindow = new BrowserWindow({
    backgroundColor: '#262A34',
    width: width > defaultWidth ? defaultWidth : width - 200,
    minWidth: 1280,
    height: height > defaultHeight ? defaultHeight : height - 200,
    minHeight: 720,
    show: false,
    webPreferences: {
      preload: path.resolve(__dirname, '../public/api.js'),
    }
  });
  appWindow.once('ready-to-show', () => {
    appWindow.show();
  });
  await appWindow.loadURL('http://localhost:3000');
  if(isDev) appWindow.toggleDevTools();
};

app.on('window-all-closed', () => {
  app.quit();
});

app.on('ready', init);
