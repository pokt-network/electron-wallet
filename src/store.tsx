import { configureStore } from '@reduxjs/toolkit';
import appReducer from './reducers/app-reducer';

export const store = configureStore({
  reducer: {
    appState: appReducer
  },
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
