import { Wallet } from '../modules/wallet';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { activeViews } from '../constants';
import { AddressItem } from "../modules/address-item";

export interface AppState {
  activeView: string;
  locale: string
  wallets: Wallet[]
  addresses: AddressItem[]
  windowWidth: number
  windowHeight: number
  showCreateModal: boolean,
  showPrivateKeyModal: boolean,
  selectedWallet: string,
  selectedTransaction: string,
}

const getInitialState = (): AppState => ({
  activeView: activeViews.START,
  locale: 'en-US',
  wallets: [],
  addresses: [],
  windowWidth: window.innerWidth,
  windowHeight: window.innerHeight,
  showCreateModal: false,
  showPrivateKeyModal: false,
  selectedWallet: '',
  selectedTransaction: '',
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
    setShowPrivateKeyModal: (state, action: PayloadAction<{show: boolean}>) => {
      state.showPrivateKeyModal = action.payload.show;
    },
    setWallets: (state, action: PayloadAction<{wallets: Wallet[]}>) => {
      state.wallets = action.payload.wallets;
    },
    setAddresses: (state, action: PayloadAction<{addresses: AddressItem[]}>) => {
      state.addresses = action.payload.addresses;
    },
    setSelectedWallet: (state, action: PayloadAction<{address: string}>) => {
      state.selectedWallet = action.payload.address;
      state.activeView = activeViews.WALLET_DETAIL;
    },
    setSelectedTransaction: (state, action: PayloadAction<{selectedTransaction: string}>) => {
      state.selectedTransaction = action.payload.selectedTransaction;
    }
  }
});

export const { setWindowSize, setLocale, setActiveView, setShowCreateModal, setShowPrivateKeyModal, setWallets, setAddresses, setSelectedWallet, setSelectedTransaction } = appSlice.actions;

export default appSlice.reducer;
