class API {

  _ipcRenderer: any;

  keys = {
    // General listeners
    GET_VERSION: 'GET_VERSION',
    LOG_INFO: 'LOG_INFO',
    LOG_ERROR: 'LOG_ERROR',
  };

  constructor(ipcRenderer: any) {
    this._ipcRenderer = ipcRenderer;
  }

  /**
   * Gets the version from package.json
   */
  getVersion(): string {
    // @ts-ignore
    return this._ipcRenderer.sendSync(this.keys.GET_VERSION);
  }

  logInfo(message: string): void {
    this._ipcRenderer.send(this.keys.LOG_INFO, message);
  }

  logError(message: string): void {
    this._ipcRenderer.send(this.keys.LOG_ERROR, message);
  }

}

export default API;
