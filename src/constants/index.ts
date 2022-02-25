export const activeViews = {
  START: 'START',
  CREATE_PASSWORD: 'CREATE_PASSWORD',
  WALLET_OVERVIEW: 'WALLET_OVERVIEW',
  WALLET_DETAIL: 'WALLET_DETAIL',
  IMPORT_ACCOUNT: 'IMPORT_ACCOUNT',
  WATCH_ACCOUNT: 'WATCH_ACCOUNT',
  TRANSACTION_SUMMARY: 'TRANSACTION_SUMMARY',
};

export const actions = {
  SET_WALLETS: 'SET_WALLETS',
  SET_WINDOW_SIZE: 'SET_WINDOW_SIZE',
};

export const accountTypes = {
  NODE: 'NODE',
  APP: 'NODE',
};

export const accountStatus = {
  NOT_STAKED: 'NOT_STAKED',
  STAKING: 'STAKING',
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
};

export const links = {
  BUY_POCKET: 'https://www.pokt.network/',
  HELP: 'https://www.pokt.network/',
};
