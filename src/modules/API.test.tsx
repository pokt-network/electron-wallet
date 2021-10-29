import 'should';
import API from './API';

class FakeIPCRenderer {

  syncReturnValues: {[key: string]: string} = {};

  sendSync(listener: string) {
    return this.syncReturnValues[listener];
  }

}

const fakeIPCRenderer = new FakeIPCRenderer();

test('API should be a constructor', () => {
  API.should.be.a.Function();
  const api = new API(fakeIPCRenderer);
  api.should.be.an.instanceOf(API);
});

test('api.getVersion()', () => {
  const api = new API(fakeIPCRenderer);
  const version = '1.2.3';
  fakeIPCRenderer.syncReturnValues[api.keys.GET_VERSION] = version;
  api.getVersion().should.equal(version);
});
