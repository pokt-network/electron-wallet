const { bindAll } = require('lodash');

class API {

  _ipcMain = {};
  _packageJson = {};
  _logger = null;

  keys = {
    // General listeners
    GET_VERSION: 'GET_VERSION',
    LOG_INFO: 'LOG_INFO',
    LOG_ERROR: 'LOG_ERROR',
  };

  /**
   * Constructs an API instance
   * @param {electron.ipcMain} ipcMain:
   * @param {{version: string}} packageJson
   * @param {Logger} logger
   */
  constructor(ipcMain, packageJson, logger) {
    this._ipcMain = ipcMain;
    this._packageJson = packageJson;
    this.logger = logger;
    ipcMain
      .on(this.keys.GET_VERSION, this.getVersion.bind(this))
      .on(this.keys.LOG_INFO, this.logInfo)
      .on(this.keys.LOG_ERROR, this.logError)
  }

  /**
   *  Gets the application version from package.json
   *  @returns void
   */
  getVersion(e) {
    e.returnValue = this._packageJson.version;
  }

  logInfo(message) {
    if(message) {
      this._logger.info(message);
    }
  }

  logError(message) {
    if(message) {
      this._logger.error(message);
    }
  }

}

module.exports = API;
