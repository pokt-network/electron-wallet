import { MasterPassword, masterPasswordIsSet } from './master-password';
import { localStorageKeys } from '../constants';

const fakeLocalStorage = {
  items: {},
  getItem(key: string) {
    // @ts-ignore
    return this.items[key];
  },
  setItem(key: string, val: string) {
    // @ts-ignore
    this.items[key] = val;
  }
};

describe('masterPasswordIsSet() function', () => {
  test('it should return if a master password is set', () => {
    // @ts-ignore
    expect(masterPasswordIsSet(fakeLocalStorage)).toEqual(false);
    // @ts-ignore
    fakeLocalStorage.items[localStorageKeys.MASTER_PASSWORD_HASHED] = 'something';
    // @ts-ignore
    expect(masterPasswordIsSet(fakeLocalStorage)).toEqual(true);
  });
});

describe('MasterPassword()', () => {

  beforeEach(() => {
    fakeLocalStorage.items = {};
  });

  test('masterPassword.set() should set the master password', () => {
    // @ts-ignore
    const masterPassword = MasterPassword('something', fakeLocalStorage);
    masterPassword.set();
    // @ts-ignore
    expect(typeof fakeLocalStorage.items[localStorageKeys.MASTER_PASSWORD_HASHED]).toEqual('string');
    // @ts-ignore
    expect(fakeLocalStorage.items[localStorageKeys.MASTER_PASSWORD_HASHED].length).toBeGreaterThan(0);
    // @ts-ignore
    expect(typeof fakeLocalStorage.items[localStorageKeys.MASTER_PASSWORD_SALT]).toEqual('string');
    // @ts-ignore
    expect(fakeLocalStorage.items[localStorageKeys.MASTER_PASSWORD_SALT].length).toBeGreaterThan(0);
    // after password is set, throw error when trying to set password again
    expect(() => masterPassword.set()).toThrowError();
  });

  test('masterPassword.verify() should verify if a password matches the saved password', () => {
    const password = 'something';
    // @ts-ignore
    const masterPassword1 = MasterPassword(password, fakeLocalStorage);
    // should throw error is password has not been set yet
    expect(() => masterPassword1.verify()).toThrowError();
    masterPassword1.set();
    // @ts-ignore
    const masterPassword2 = MasterPassword(password, fakeLocalStorage);
    expect(masterPassword2.verify()).toEqual(true);
    // @ts-ignore
    const masterPassword3 = MasterPassword('some other password', fakeLocalStorage);
    expect(masterPassword3.verify()).toEqual(false);
  });

});
