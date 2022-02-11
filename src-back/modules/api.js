const { bindAll } = require('lodash');

class API {

  _ipcMain = {};
  _packageJson = {};
  _logger = null;
  _shell = {};
  _dialog = {};
  _fs = {};

  keys = {
    // General listeners
    GET_ENDPOINT: 'GET_ENDPOINT',
    GET_VERSION: 'GET_VERSION',
    OPEN_EXTERNAL: 'OPEN_EXTERNAL',
    OPEN_FILE_DIALOG: 'OPEN_FILE_DIALOG',
    OPEN_FILE: 'OPEN_FILE',
    LOG_INFO: 'LOG_INFO',
    LOG_ERROR: 'LOG_ERROR',
  };

  /**
   * Constructs an API instance
   * @param {Electron.IpcMain} ipcMain:
   * @param {{version: string}} packageJson
   * @param {Logger} logger
   * @param {Electron.Shell} shell
   * @param {Electron.Dialog} dialog
   * @param fs
   */
  constructor(ipcMain, packageJson, logger, shell, dialog, fs) {
    this._ipcMain = ipcMain;
    this._packageJson = packageJson;
    this._logger = logger;
    this._shell = shell;
    this._dialog = dialog;
    this._fs = fs;
    ipcMain
      .on(this.keys.GET_ENDPOINT, this.getEndpoint)
      .on(this.keys.GET_VERSION, this.getVersion.bind(this))
      .on(this.keys.OPEN_EXTERNAL, this.openExternal.bind(this))
      .on(this.keys.LOG_INFO, this.logInfo.bind(this))
      .on(this.keys.LOG_ERROR, this.logError.bind(this))
    ipcMain
      .handle(this.keys.OPEN_FILE_DIALOG, this.openFileDialog.bind(this));
    ipcMain
      .handle(this.keys.OPEN_FILE, this.openFile.bind(this));
  }

  /**
   *  Gets the application version from package.json
   *  @returns void
   */
  getVersion(e) {
    e.returnValue = this._packageJson.version;
  }

  openExternal(e, url) {
    console.log('openExternal', url);
    this._shell.openExternal(url);
  }

  getEndpoint(e) {
    e.returnValue = process.env.POCKET_WALLET_RPC_ENDPOINT || 'https://node1.testnet.pokt.network';
  }

  openFileDialog(e, options) {
    return this._dialog.showOpenDialog(options);
  }

  openFile(e, filePath) {
    try {
      return this._fs.readFile(filePath, 'utf8');
    } catch(err) {
      this._logger.error(`api.openFile() error for ${filePath}. ` + err.message);
      return '';
    }
  }

  logInfo(e, message) {
    if(message) {
      this._logger.info(message);
    }
  }

  logError(e, message) {
    if(message) {
      this._logger.error(message);
    }
  }

}

module.exports = API;
