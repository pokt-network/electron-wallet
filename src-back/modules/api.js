const { bindAll } = require('lodash');

class API {

  _ipcMain = {};
  _packageJson = {};
  _logger = null;

  keys = {
    // General listeners
    GET_ENDPOINT: 'GET_ENDPOINT',
    GET_VERSION: 'GET_VERSION',
    LOG_INFO: 'LOG_INFO',
    LOG_ERROR: 'LOG_ERROR',
  };

  /**
   * Constructs an API instance
   * @param {Electron.IpcMain} ipcMain:
   * @param {{version: string}} packageJson
   * @param {Logger} logger
   */
  constructor(ipcMain, packageJson, logger) {
    this._ipcMain = ipcMain;
    this._packageJson = packageJson;
    this._logger = logger;
    ipcMain
      .on(this.keys.GET_ENDPOINT, this.getEndpoint)
      .on(this.keys.GET_VERSION, this.getVersion.bind(this))
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

  getEndpoint(e) {
    e.returnValue = process.env.ENDPOINT || '';
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
