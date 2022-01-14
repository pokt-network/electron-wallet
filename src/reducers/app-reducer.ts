import { Wallet } from '../modules/wallet';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { activeViews } from '../constants';

export interface AppState {
  activeView: string;
  locale: string
  wallets: Wallet[]
  windowWidth: number
  windowHeight: number
  showCreateModal: boolean,
  selectedWallet: string,
}

const getInitialState = (): AppState => ({
  activeView: activeViews.START,
  locale: 'en-US',
  wallets: [],
  windowWidth: window.innerWidth,
  windowHeight: window.innerHeight,
  showCreateModal: false,
  selectedWallet: '',
});

export const appSlice = createSlice({
  name: 'appState',
  initialState: getInitialState(),
  reducers: {
    setWindowSize: (state, action: PayloadAction<{innerWidth: number, innerHeight: number}>) => {
      state.windowHeight = action.payload.innerHeight;
      state.windowWidth = action.payload.innerWidth;
    },
    setLocale: (state, action: PayloadAction<{locale: string}>) => {
      state.locale = action.payload.locale;
    },
    setActiveView: (state, action: PayloadAction<{activeView: string}>) => {
      state.activeView = action.payload.activeView;
      if(action.payload.activeView === activeViews.WALLET_OVERVIEW)
        state.selectedWallet = '';
    },
    setShowCreateModal: (state, action: PayloadAction<{show: boolean}>) => {
      state.showCreateModal = action.payload.show;
    },
    setWallets: (state, action: PayloadAction<{wallets: Wallet[]}>) => {
      state.wallets = action.payload.wallets;
    },
    setSelectedWallet: (state, action: PayloadAction<{address: string}>) => {
      state.selectedWallet = action.payload.address;
      state.activeView = activeViews.WALLET_DETAIL;
    },
  }
});

export const { setWindowSize, setLocale, setActiveView, setShowCreateModal, setWallets, setSelectedWallet } = appSlice.actions;

export default appSlice.reducer;
