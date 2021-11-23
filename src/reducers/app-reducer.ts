import { actions } from '../constants';
import { Wallet } from '../modules/wallet';

interface AppReducerData {
  wallets: Wallet[],
  windowWidth: number,
  windowHeight: number,
}

const getInitialState = (): AppReducerData => ({
  wallets: [],
  windowWidth: window.innerWidth,
  windowHeight: window.innerHeight,
});

const appReducer = (state = getInitialState(), data: {type: string, payload: any}): AppReducerData => {
  const { type, payload } = data;
  switch(type) {
    case actions.SET_WALLETS:
      return {
        ...state,
        wallets: payload.wallets
      };
    case actions.SET_WINDOW_SIZE:
      return {
        ...state,
        windowWidth: payload.innerWidth,
        windowHeight: payload.innerHeight,
      };
    default:
      return state;
  }
};

export default appReducer;
