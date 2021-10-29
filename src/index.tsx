import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import API from './modules/API';

// @ts-ignore
const api = new API(window.ipcRenderer);

const version = api.getVersion();

ReactDOM.render(
  <React.StrictMode>
    <App version={version} />
  </React.StrictMode>,
  document.getElementById('root')
);
