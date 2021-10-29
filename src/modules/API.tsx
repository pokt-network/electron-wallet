class API {

  _ipcRenderer: any;

  keys = {
    // General listeners
    GET_VERSION: 'GET_VERSION',
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

}

export default API;
