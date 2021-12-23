import { localStorageKeys } from '../constants';
import pbkdf2 from 'pbkdf2';
import * as uuid from 'uuid';

const generateSalt = () => {
  return uuid.v4().replace(/-/g, '');
};

export const masterPasswordIsSet = (ls = localStorage) => {
  return !!ls.getItem(localStorageKeys.MASTER_PASSWORD_HASHED);
};

export interface MasterPasswordUtils {
  set: () => void
  verify: () => boolean
}

export function MasterPassword(password: string, ls = localStorage): MasterPasswordUtils {
  let hashed = ls.getItem(localStorageKeys.MASTER_PASSWORD_HASHED);
  let isSet = !!hashed;
  let salt = ls.getItem(localStorageKeys.MASTER_PASSWORD_SALT) || generateSalt();
  const newHashed = pbkdf2.pbkdf2Sync(password, salt, 1000, 32, 'sha512').toString('hex');

  return {
    set() {
      if(isSet)
        throw new Error('Password is already set');
      ls.setItem(localStorageKeys.MASTER_PASSWORD_HASHED, newHashed);
      ls.setItem(localStorageKeys.MASTER_PASSWORD_SALT, salt);
      hashed = newHashed;
      isSet = true;
    },
    verify() {
      if(!isSet)
        throw new Error('Password has not been set yet');
      return hashed === newHashed;
    },
  };
}
