import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import API from './modules/API';
import { WalletController } from './modules/wallet-controller';
import { Configuration, HttpRpcProvider, Pocket } from '@pokt-network/pocket-js';
import { KeyUtils } from './modules/key-utils';
import { RPCController } from './modules/rpc-controller';
import swal from 'sweetalert';
import { combineReducers, createStore } from 'redux';
import appReducer from './reducers/app-reducer';
import * as appActions from './actions/app-actions';
import { Provider } from 'react-redux';

// @ts-ignore
const api = new API(window.ipcRenderer);

(async function() {
  try {

    const combinedReducers = combineReducers({
      appState: appReducer,
    });
    const store = createStore(combinedReducers);
    console.log('state', store.getState());
    store.subscribe(() => {
      const state = store.getState();
      console.log('state', state.appState);
    });

    window.addEventListener('resize', e => {
      if(!e.target)
        return;
      const { innerWidth, innerHeight } = e.target as Window;
      store.dispatch(appActions.setWindowSize(innerWidth, innerHeight));
    });

    const version = api.getVersion();
    api.logInfo(`Launch Pocket Wallet v${version}`);

    const endpoint = api.getEndpoint();
    api.logInfo(`RPC endpoint: ${endpoint}`);

    if(!endpoint) {
      const message = 'ENDPOINT is not defined';
      await swal({
        icon: 'error',
        title: 'Oops!',
        text: message
      });
      throw new Error(message);
    }

    const dispatcher = new URL(endpoint);
    const configuration = new Configuration(5, 1000, 0, 40000);
    const pocket = new Pocket([dispatcher], new HttpRpcProvider(dispatcher), configuration);

    const keyUtils = new KeyUtils(pocket);
    const rpcController = new RPCController(pocket);

    const walletController = new WalletController(keyUtils, rpcController);

    walletController.events.error.subscribe(errStr => {
      api.logError(errStr);
    });
    walletController.events.walletCreated.subscribe(wallet => {
      // ToDo add to database
      api.logInfo(`Wallet created with address ${wallet.address} and public key ${wallet.publicKey}`);
    });
    walletController.events.walletDeleted.subscribe(publicKey => {
      // ToDo delete to from database
      api.logInfo(`Wallet deleted with public key ${publicKey}`);
    });
    walletController.events.walletUpdated.subscribe(wallet => {
      // ToDo update in database
      api.logInfo(`Wallet updated with address ${wallet.address} and public key ${wallet.publicKey}`);
    });
    walletController.events.walletsChanged.subscribe(wallets => {
      store.dispatch(appActions.setWallets(wallets));
    });

    ReactDOM.render(
      <React.StrictMode>
        <Provider store={store}>
          <App version={version} walletController={walletController} />
        </Provider>
      </React.StrictMode>,
      document.getElementById('root')
    );
  } catch({ message = '', stack = '' }) {
    api.logError(message + '\n' + stack);
  }
})();
