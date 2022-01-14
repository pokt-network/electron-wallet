import * as uuid from 'uuid';

export const timeout = (length = 0) => {
  return new Promise(resolve => setTimeout(resolve, length))
};

export const makePassword = (): string => {
  return uuid.v4().replace(/-/g, '');
};

export const splitString = (str: string, len1: number, len2: number) => {
  return str.slice(0, len1) + '...' + str.slice(len2 * -1);
}

export const splitAddress = (hash: string) => {
  return splitString(hash, 11, 12);
};

export const splitHash = (hash: string) => {
  return hash.slice(0, 16) + '...' + hash.slice(-18);
};
