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

// @ts-ignore
const api = new API(window.ipcRenderer);

(async function() {
  try {

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
      api.logInfo(`Wallet created with address ${wallet.address} and public key ${wallet.publicKey}`);
    });
    walletController.events.walletDeleted.subscribe(publicKey => {
      api.logInfo(`Wallet deleted with public key ${publicKey}`);
    });
    walletController.events.walletUpdated.subscribe(wallet => {
      api.logInfo(`Wallet updated with address ${wallet.address} and public key ${wallet.publicKey}`);
    });
    walletController.events.walletsChanged.subscribe(wallets => {
      console.log('Wallets updated', wallets);
    });

    ReactDOM.render(
      <React.StrictMode>
        <App version={version} />
      </React.StrictMode>,
      document.getElementById('root')
    );
  } catch({ message = '', stack = '' }) {
    api.logError(message + '\n' + stack);
  }
})();
