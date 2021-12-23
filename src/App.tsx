import React, { useContext, useEffect, useState } from 'react';
import { WalletController } from './modules/wallet-controller';
import { AppContainer } from './components/ui/app-container';
import { Start } from './components/views/start';
import { APIContext } from './hooks/api-hook';
import { RootState, store } from './store';
import swal from 'sweetalert';
import { Configuration, HttpRpcProvider, Pocket } from '@pokt-network/pocket-js';
import { KeyUtils } from './modules/key-utils';
import { RPCController } from './modules/rpc-controller';
import { Localize } from './modules/localize';
import { localizeContext } from './hooks/localize-hook';
import { useSelector } from 'react-redux';
import { CreatePassword } from './components/views/create-password';
import { masterPasswordContext } from './hooks/master-password-hook';
import { MasterPasswordUtils, masterPasswordIsSet } from './modules/master-password';
import { activeViews } from './constants';
import { WalletOverview } from './components/views/wallet-overview';

const App = () => {

  const { activeView, locale } = useSelector(({ appState }: RootState) => appState);
  const [ localize, setLocalize ] = useState(new Localize(locale, {}));
  const [ masterPassword, setMasterPassword ] = useState<MasterPasswordUtils|null>(null);

  useEffect(() => {
    setLocalize(new Localize(locale, {}));
  }, [locale]);

  const api = useContext(APIContext);

  useEffect(() => {
    (async function() {
      try {

        store.subscribe(() => {
          const state = store.getState();
          console.log('state', state.appState);
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
          // store.dispatch(appActions.setWallets(wallets));
        });
      } catch({ message = '', stack = '' }) {
        api.logError(message + '\n' + stack);
      }
    })();
  }, [api]);

  console.log('masterPassword', masterPassword);

  return (
    <localizeContext.Provider value={localize}>
      <masterPasswordContext.Provider value={{masterPassword, setMasterPassword}}>
        <AppContainer>
          {activeView === activeViews.START ?
            <Start />
            :
            activeView === activeViews.CREATE_PASSWORD ?
              <CreatePassword />
              :
              activeView === activeViews.WALLET_OVERVIEW ?
                <WalletOverview />
                :
                null
          }
        </AppContainer>
      </masterPasswordContext.Provider>
    </localizeContext.Provider>
  );
}

export default App;
