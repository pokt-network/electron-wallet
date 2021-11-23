import React from 'react';
import './App.scss';
import { WalletController } from './modules/wallet-controller';

interface AppProps {
  version: string;
  walletController: WalletController;
}
function App({ version, walletController }: AppProps) {
  return (
    <div>
      <h1 className={'text-center'}>Wallet v{version}</h1>
    </div>
  );
}

export default App;
