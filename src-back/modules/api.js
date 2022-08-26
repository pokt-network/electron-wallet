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
    GET_POCKET_ENDPOINT: 'GET_POCKET_ENDPOINT',
    GET_POCKET_CHAIN_ID: 'GET_POCKET_CHAIN_ID',
    GET_VERSION: 'GET_VERSION',
    OPEN_EXTERNAL: 'OPEN_EXTERNAL',
    OPEN_FILE_DIALOG: 'OPEN_FILE_DIALOG',
    OPEN_FILE: 'OPEN_FILE',
    OPEN_FILE_SAVE_DIALOG: 'OPEN_FILE_SAVE_DIALOG',
    SAVE_FILE: 'SAVE_FILE',
    COPY_TO_CLIPBOARD: 'COPY_TO_CLIPBOARD',
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
   * @param {Electron.Clipboard} clipboard
   */
  constructor(ipcMain, packageJson, logger, shell, dialog, fs, clipboard) {
    this._ipcMain = ipcMain;
    this._packageJson = packageJson;
    this._logger = logger;
    this._shell = shell;
    this._dialog = dialog;
    this._fs = fs;
    this._clipboard = clipboard;
    ipcMain
      .on(this.keys.GET_POCKET_ENDPOINT, this.getPocketEndpoint)
      .on(this.keys.GET_POCKET_CHAIN_ID, this.getPocketChainId)
      .on(this.keys.GET_VERSION, this.getVersion.bind(this))
      .on(this.keys.OPEN_EXTERNAL, this.openExternal.bind(this))
      .on(this.keys.LOG_INFO, this.logInfo.bind(this))
      .on(this.keys.LOG_ERROR, this.logError.bind(this))
      .on(this.keys.COPY_TO_CLIPBOARD, this.copyToClipboard.bind(this));
    ipcMain
      .handle(this.keys.OPEN_FILE_DIALOG, this.openFileDialog.bind(this));
    ipcMain
      .handle(this.keys.OPEN_FILE, this.openFile.bind(this));
    ipcMain
      .handle(this.keys.OPEN_FILE_SAVE_DIALOG, this.openFileSaveDialog.bind(this));
    ipcMain
      .handle(this.keys.SAVE_FILE, this.saveFile.bind(this));
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

  getPocketEndpoint(e) {
    e.returnValue = process.env.POCKET_WALLET_RPC_ENDPOINT;
  }

  getPocketChainId(e) {
    e.returnValue = process.env.POCKET_WALLET_CHAIN_ID || 'mainnet';
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

  openFileSaveDialog(e, options) {
    return this._dialog.showSaveDialog(options);
  }

  async saveFile(e, {filePath, content}) {
    try {
      await this._fs.writeFile(filePath, content, 'utf8');
    } catch(err) {
      this._logger.error(`api.saveFile() error for ${filePath}. ` + err.message);
      return false;
    }
    return true;
  }

  copyToClipboard(e, text) {
    try {
      this._clipboard.writeText(text);
    } catch(err) {
      this._logger.error(`api.copyToClipboard() error. ` + err.message);
      e.returnValue = false;
    }
    e.returnValue = true;
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
