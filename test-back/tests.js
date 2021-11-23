require('should');
const API = require('../src-back/modules/api');
const FakeIPCMain = require('./fake-ipc-main');

const packageJson = {
  version: '1.2.3',
};

describe('API class tests', function() {

  let api;

  beforeEach(function() {
    const fakeIPCMain = new FakeIPCMain();
    api = new API(fakeIPCMain, packageJson);
  });

  describe('getVersion()', function() {
    it('should set e.returnValue to the version', function() {
      const e = {};
      api.getVersion(e);
      e.returnValue.should.equal(packageJson.version);
    })
  });

  describe('getEndpoint()', function() {
    it('should set e.returnValue to the endpoint', function() {
      const e = {};
      api.getEndpoint(e);
      e.returnValue.should.be.a.String();
    })
  });

  describe('logInfo()', function() {
    it('should save a message to the log', function() {
      let logged = '';
      api._logger = {
        info(infoMessage) {
          logged = infoMessage;
        }
      };
      const message = 'some message';
      api.logInfo(null, message);
      logged.should.equal(message);
    });
  });

  describe('logError()', function() {
    it('should save an error message to the log', function() {
      let logged = '';
      api._logger = {
        error(errorMessage) {
          logged = errorMessage;
        }
      };
      const message = 'some error';
      api.logError(null, message);
      logged.should.equal(message);
    });
  });

});
