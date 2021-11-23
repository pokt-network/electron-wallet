import API from './API';

class FakeIPCRenderer {

  syncReturnValues: {[key: string]: string} = {};

  sendSync(listener: string) {
    return this.syncReturnValues[listener];
  }

  sendCalledWithListener = '';
  sendCalledWithPayload: any;

  send(listener: string, body: any) {
    this.sendCalledWithListener = listener;
    this.sendCalledWithPayload = body;
  }

}

describe('API class tests', () => {

  let api: API;
  let fakeIPCRenderer: FakeIPCRenderer;

  beforeEach(() => {
    fakeIPCRenderer = new FakeIPCRenderer();
    api = new API(fakeIPCRenderer);
  });

  test('API.getVersion() should get the version from package.json', () => {
    const version = '1.2.3';
    fakeIPCRenderer.syncReturnValues[api.keys.GET_VERSION] = version;
    expect(api.getVersion()).toEqual(version);
  });

  test('API.logInfo() should emit an info log event to the main process', () => {
    const message = 'some message';
    api.logInfo(message);
    expect(fakeIPCRenderer.sendCalledWithListener).toEqual(api.keys.LOG_INFO);
    expect(fakeIPCRenderer.sendCalledWithPayload).toEqual(message);
  });

  test('API.logError() should emit an error log event to the main process', () => {
    const errorMessage = 'some error message';
    api.logError(errorMessage);
    expect(fakeIPCRenderer.sendCalledWithListener).toEqual(api.keys.LOG_ERROR);
    expect(fakeIPCRenderer.sendCalledWithPayload).toEqual(errorMessage);
  });

});
