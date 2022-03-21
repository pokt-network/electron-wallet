export const activeViews = {
  START: 'START',
  CREATE_PASSWORD: 'CREATE_PASSWORD',
  WALLET_OVERVIEW: 'WALLET_OVERVIEW',
  WALLET_DETAIL: 'WALLET_DETAIL',
  IMPORT_ACCOUNT: 'IMPORT_ACCOUNT',
  WATCH_ACCOUNT: 'WATCH_ACCOUNT',
  TRANSACTION_SUMMARY: 'TRANSACTION_SUMMARY',
  ADDRESS_BOOK: 'ADDRESS_BOOK',
  SEND: 'SEND',
};

export const actions = {
  SET_WALLETS: 'SET_WALLETS',
  SET_WINDOW_SIZE: 'SET_WINDOW_SIZE',
};

export const accountTypes = {
  WALLET: 'WALLET',
  NODE: 'NODE',
  APP: 'APP',
};

export const accountStatus = {
  NOT_STAKED: 'NOT_STAKED',
  UNSTAKING: 'UNSTAKING',
  STAKED: 'STAKED',
};

export const DEFAULT_REQUEST_TIMEOUT = 10000;

export const PRIMARY_TEXT = '#212121';
export const PRIMARY_TEXT_RGB = {
  r: 33,
  g: 33,
  b: 33,
};
export const PRIMARY_TEXT_INVERTED = '#fafafa';

export const localStorageKeys = {
  MASTER_PASSWORD_HASHED: 'MASTER_PASSWORD_HASHED',
  MASTER_PASSWORD_SALT: 'MASTER_PASSWORD_SALT',
  WALLETS: 'WALLETS',
  ADDRESSES: 'ADDRESSES',
};

export const links = {
  BUY_POCKET: 'https://www.pokt.network/',
  HELP: 'https://www.pokt.network/',
};

export const TRANSACTION_FEE_UPOKT = '10000'; // in uPOKT
export const TRANSACTION_FEE = (Number(TRANSACTION_FEE_UPOKT) / 1000000).toString(10); // in POKT

export const TRANSACTION_CHAIN_ID = 'testnet';
