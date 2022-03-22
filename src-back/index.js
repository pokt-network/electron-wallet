const { app, BrowserWindow, clipboard, dialog, ipcMain, screen, shell } = require('electron');
const electronContextMenu = require('electron-context-menu');
const isDev = require('electron-is-dev');
const path = require('path');
const serve = require('electron-serve');
const { getPackageJson, createLogger} = require('./util');
const API = require('./modules/api');
const { LOG_FILENAME } = require('./constants');
const fs = require('fs-extra');

const serveDir = !isDev ? serve({directory: path.resolve(__dirname, '../build')}) : null;

// Add a default system context menu on right click anywhere in the application
electronContextMenu();

const init = async function() {

  // ToDo add content security policy

  const { height, width } = screen.getPrimaryDisplay().workAreaSize;
  const defaultWidth = 1440;
  const defaultHeight = 900;

  const appDataDir = app.getPath('userData');

  const packageJson = await getPackageJson();
  const logger = createLogger(path.join(appDataDir, LOG_FILENAME), true);
  const api = new API(
    ipcMain,
    packageJson,
    logger,
    shell,
    dialog,
    fs,
    clipboard,
  );

  const appWindow = new BrowserWindow({
    backgroundColor: '#262A34',
    width: width > defaultWidth ? defaultWidth : width - 200,
    minWidth: 1280,
    height: height > defaultHeight ? defaultHeight : height - 200,
    minHeight: 800,
    show: false,
    webPreferences: {
      webSecurity: false,
      preload: path.resolve(__dirname, '../public/api.js'),
    }
  });
  appWindow.once('ready-to-show', () => {
    appWindow.show();
  });
  if(isDev) {
    appWindow.toggleDevTools();
    await appWindow.loadURL('http://localhost:3000');
  } else {
    serveDir(appWindow)
      .catch(err => {
        logger.error(`'serveDir error: ${err.message} \n ${err.stack}`);
      });
  }
};

app.on('window-all-closed', () => {
  app.quit();
});

app.on('ready', init);
