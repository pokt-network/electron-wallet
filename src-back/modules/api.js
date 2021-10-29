const { bindAll } = require('lodash');

class API {

  _ipcMain = {};
  _packageJson = {};

  keys = {
    // General listeners
    GET_VERSION: 'GET_VERSION',
  };

  /**
   * Constructs an API instance
   * @param ipcMain: electron.ipcMain
   * @param packageJson {version: string}
   */
  constructor(ipcMain, packageJson) {
    this._ipcMain = ipcMain;
    this._packageJson = packageJson;
    ipcMain
      .on(this.keys.GET_VERSION, this.getVersion.bind(this));
  }

  /**
   *  Gets the application version from package.json
   *  @returns void
   */
  getVersion(e) {
    e.returnValue = this._packageJson.version;
  }

}

module.exports = API;
