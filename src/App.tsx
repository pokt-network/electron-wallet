import React from 'react';
import { WalletController } from './modules/wallet-controller';
import { textStyle } from './styles';

interface AppProps {
  version: string;
  walletController: WalletController;
}
function App({ version, walletController }: AppProps) {
  return (
    <div>
      <h1 className={'text-center'} style={textStyle('title1')}>Wallet v{version}</h1>
      <h2 className={'text-center'} style={textStyle('title2')}>Wallet v{version}</h2>
      <h3 className={'text-center'} style={textStyle('title3')}>Wallet v{version}</h3>
      <h4 className={'text-center'} style={textStyle('title4')}>Wallet v{version}</h4>
    </div>
  );
}

export default App;
