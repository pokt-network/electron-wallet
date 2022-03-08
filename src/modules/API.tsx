interface FileDialogOptions {
  title?: string
  defaultPath?: string
  buttonLabel?: string
  filters?: {name: string, extensions: string[]}[]
  properties?: string[]
}

class API {

  _ipcRenderer: any;

  keys = {
    // General listeners
    GET_ENDPOINT: 'GET_ENDPOINT',
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

  constructor(ipcRenderer: any) {
    this._ipcRenderer = ipcRenderer;
  }

  getEndpoint(): string {
    return this._ipcRenderer.sendSync(this.keys.GET_ENDPOINT);
  }

  /**
   * Gets the version from package.json
   */
  getVersion(): string {
    // @ts-ignore
    return this._ipcRenderer.sendSync(this.keys.GET_VERSION);
  }

  async openFileDialog(options: FileDialogOptions): Promise<{canceled: boolean, filePaths: string[]}> {
    return this._ipcRenderer.invoke(this.keys.OPEN_FILE_DIALOG, options);
  }

  async openFile(filePath: string): Promise<string> {
    return this._ipcRenderer.invoke(this.keys.OPEN_FILE, filePath);
  }

  async openFileSaveDialog(options: FileDialogOptions): Promise<{canceled: boolean, filePath: string}> {
    return this._ipcRenderer.invoke(this.keys.OPEN_FILE_SAVE_DIALOG, options);
  }

  async saveFile(filePath: string, content: string): Promise<boolean> {
    return this._ipcRenderer.invoke(this.keys.SAVE_FILE, {filePath, content});
  }

  openExternal(url: string): void {
    this._ipcRenderer.send(this.keys.OPEN_EXTERNAL, url);
  }

  copyToClipboard(text: string): boolean {
    // @ts-ignore
    return this._ipcRenderer.sendSync(this.keys.COPY_TO_CLIPBOARD, text);
  }

  logInfo(message: string): void {
    this._ipcRenderer.send(this.keys.LOG_INFO, message);
  }

  logError(message: string): void {
    this._ipcRenderer.send(this.keys.LOG_ERROR, message);
  }

}

export default API;
