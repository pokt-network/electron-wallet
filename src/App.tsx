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
import { useDispatch, useSelector } from 'react-redux';
import { CreatePassword } from './components/views/create-password';
import { masterPasswordContext } from './hooks/master-password-hook';
import { MasterPasswordUtils, masterPasswordIsSet } from './modules/master-password';
import { activeViews, localStorageKeys } from './constants';
import { WalletOverview } from './components/views/wallet-overview';
import { setWallets } from './reducers/app-reducer';
import { WalletControllerContext } from './hooks/wallet-hook';
import { WalletDetail } from './components/views/wallet-detail';
import { WalletData } from './modules/wallet';
import { Pricing } from './modules/pricing';
import { PricingContext } from './hooks/pricing-hook';
import { ImportAccount } from "./components/views/import-account";
import { TransactionSummary } from "./components/views/transaction-summary";
import { WatchAccount } from "./components/views/watch-account";

const App = () => {

  const dispatch = useDispatch();
  const { activeView, locale } = useSelector(({ appState }: RootState) => appState);
  const [ localize, setLocalize ] = useState(new Localize(locale, {}));
  const [ masterPassword, setMasterPassword ] = useState<MasterPasswordUtils|null>(null);
  const [ walletController, setWalletController ] = useState<WalletController|null>(null);
  const [ pricingData, setPricingData ] = useState({});

  useEffect(() => {
    setLocalize(new Localize(locale, {}));
  }, [locale]);

  useEffect(() => {
    const updatePricingData = () => {
      Pricing.getPricingData()
        .then(pricingData => {
          setPricingData(pricingData);
        })
        .catch(console.error);
    }
    setInterval(updatePricingData, 60000);
    updatePricingData();
  }, []);

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
        const configuration = new Configuration(5, 1000, 0, 40000, undefined, undefined, undefined, undefined, undefined, undefined, false);
        const pocket = new Pocket([dispatcher], new HttpRpcProvider(dispatcher), configuration);

        const keyUtils = new KeyUtils(pocket);
        const rpcController = new RPCController(pocket);

        const walletController = new WalletController(keyUtils, rpcController, pocket);

        walletController.events.error.subscribe(errStr => {
          api.logError(errStr);
        });
        walletController.events.walletCreated.subscribe(wallet => {
          const walletsFromStorage: WalletData[] = JSON.parse(localStorage.getItem(localStorageKeys.WALLETS) || '[]');
          localStorage.setItem(localStorageKeys.WALLETS, JSON.stringify([
            ...walletsFromStorage,
            wallet.toObject(),
          ]));
          api.logInfo(`Wallet created with address ${wallet.address} and public key ${wallet.publicKey}`);
        });
        walletController.events.walletDeleted.subscribe(address => {
          const walletsFromStorage: WalletData[] = JSON.parse(localStorage.getItem(localStorageKeys.WALLETS) || '[]');
          localStorage.setItem(localStorageKeys.WALLETS, JSON.stringify(walletsFromStorage.filter(w => w.address !== address)));
          api.logInfo(`Wallet deleted with address ${address}`);
        });
        walletController.events.walletUpdated.subscribe(wallet => {
          const walletsFromStorage: WalletData[] = JSON.parse(localStorage.getItem(localStorageKeys.WALLETS) || '[]');
          const idx = walletsFromStorage.findIndex(w => w.address === wallet.address);
          if(idx < 0)
            return;
          localStorage.setItem(localStorageKeys.WALLETS, JSON.stringify([
            ...walletsFromStorage.slice(0, idx),
            wallet.toObject(),
            ...walletsFromStorage.slice(idx + 1),
          ]));
          api.logInfo(`Wallet updated with address ${wallet.address} and public key ${wallet.publicKey}`);
        });
        walletController.events.walletsChanged.subscribe(wallets => {
          console.log('walletsChanged', wallets);
          dispatch(setWallets({wallets}));
        });

        // ToDo get from DB
        const walletsFromStorage: WalletData[] = JSON.parse(localStorage.getItem(localStorageKeys.WALLETS) || '[]');
        walletsFromStorage.forEach(w => {
          walletController.addWallet(w)
        });

        const updateAllBalances = async () => {
          const wallets = walletController.getWallets();
          for(const w of wallets) {
            try {
              await w.updateBalance();
            } catch(err) {
              // nothing to do, already logged
            }
          }
        };
        setInterval(updateAllBalances, 10000);
        updateAllBalances()
          .catch();
        const updateAllTransactions = async () => {
          const wallets = walletController.getWallets();
          for(const w of wallets) {
            try {
              await w.updateTransactions();
            } catch(err) {
              // nothing to do, already logged
            }
          }
        };
        setInterval(updateAllTransactions, 30000);
        updateAllTransactions()
          .catch();
        const updateAllAccountInfo = async () => {
          const wallets = walletController.getWallets();
          for(const w of wallets) {
            try {
              await w.updateAccountInfo();
            } catch(err) {
              // nothing to do, already logged
            }
          }
        };
        setInterval(updateAllAccountInfo, 30000);
        updateAllAccountInfo()
          .catch();

        setWalletController(walletController);

      } catch({ message = '', stack = '' }) {
        api.logError(message + '\n' + stack);
      }
    })();
  }, [api]);

  return (
    <localizeContext.Provider value={localize}>
      <masterPasswordContext.Provider value={{masterPassword, setMasterPassword}}>
        {walletController ?
          <WalletControllerContext.Provider value={walletController}>
            <PricingContext.Provider value={new Pricing(pricingData)}>
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
                      activeView === activeViews.WALLET_DETAIL ?
                        <WalletDetail />
                        :
                        activeView === activeViews.IMPORT_ACCOUNT ?
                          <ImportAccount />
                          :
                          activeView === activeViews.WATCH_ACCOUNT ?
                            <WatchAccount />
                            :
                            activeView === activeViews.TRANSACTION_SUMMARY ?
                              <TransactionSummary />
                              :
                              null
                }
              </AppContainer>
            </PricingContext.Provider>
          </WalletControllerContext.Provider>
          :
          null
        }
      </masterPasswordContext.Provider>
    </localizeContext.Provider>
  );
}

export default App;
