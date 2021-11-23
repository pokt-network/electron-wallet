import { actions } from '../constants';
import { Wallet } from '../modules/wallet';

export const setWallets = (wallets: Wallet[]) => ({
  type: actions.SET_WALLETS,
  payload: {
    wallets,
  },
});

export const setWindowSize = (innerWidth: number, innerHeight: number) => ({
  type: actions.SET_WINDOW_SIZE,
  payload: {
    innerWidth,
    innerHeight,
  },
});
