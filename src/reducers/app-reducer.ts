import { Wallet } from '../modules/wallet';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { activeViews } from '../constants';

export interface AppState {
  activeView: string;
  locale: string
  wallets: Wallet[]
  windowWidth: number
  windowHeight: number
}

const getInitialState = (): AppState => ({
  activeView: activeViews.START,
  locale: 'en-US',
  wallets: [],
  windowWidth: window.innerWidth,
  windowHeight: window.innerHeight,
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
    }
  }
});

export const { setWindowSize, setLocale, setActiveView } = appSlice.actions;

export default appSlice.reducer;
