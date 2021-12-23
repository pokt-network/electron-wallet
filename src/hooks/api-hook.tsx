import API from '../modules/API';
import { createContext } from 'react';

// @ts-ignore
const api = new API(window.ipcRenderer);

export const APIContext = createContext(api);
