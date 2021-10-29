require('should');
const API = require('../src-back/modules/api');
const FakeIPCMain = require('./fake-ipc-main');

const packageJson = {
  version: '1.2.3',
};

describe('API', function() {

  let api;

  beforeEach(function() {
    const fakeIPCMain = new FakeIPCMain();
    api = new API(fakeIPCMain, packageJson);
  });

  it('should be a constructor', function() {
    API.should.be.a.Function();
    api.should.be.an.instanceOf(API);
  });

  describe('getVersion', function() {
    it('should set e.returnValue to the version', function() {
      const e = {};
      api.getVersion(e);
      e.returnValue.should.equal(packageJson.version);
    })
  });

});
