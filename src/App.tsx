import React from 'react';
import './App.scss';

interface AppProps {
  version: string;
}
function App({ version }: AppProps) {
  return (
    <div>
      <h1 className={'text-center'}>Wallet v{version}</h1>
    </div>
  );
}

export default App;
