const { bindAll } = require('lodash');

class API {

  _ipcMain = {};
  _packageJson = {};
  _logger = null;
  _shell = {};

  keys = {
    // General listeners
    GET_ENDPOINT: 'GET_ENDPOINT',
    GET_VERSION: 'GET_VERSION',
    OPEN_EXTERNAL: 'OPEN_EXTERNAL',
    LOG_INFO: 'LOG_INFO',
    LOG_ERROR: 'LOG_ERROR',
  };

  /**
   * Constructs an API instance
   * @param {Electron.IpcMain} ipcMain:
   * @param {{version: string}} packageJson
   * @param {Logger} logger
   * @param {Electron.Shell} shell:
   */
  constructor(ipcMain, packageJson, logger, shell) {
    this._ipcMain = ipcMain;
    this._packageJson = packageJson;
    this._logger = logger;
    this._shell = shell;
    ipcMain
      .on(this.keys.GET_ENDPOINT, this.getEndpoint)
      .on(this.keys.GET_VERSION, this.getVersion.bind(this))
      .on(this.keys.OPEN_EXTERNAL, this.openExternal.bind(this))
      .on(this.keys.LOG_INFO, this.logInfo.bind(this))
      .on(this.keys.LOG_ERROR, this.logError.bind(this))
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
