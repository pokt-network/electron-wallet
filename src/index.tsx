import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Provider } from 'react-redux';
import { Main } from '@pokt-foundation/ui';
import './index.scss';
import { store } from './store';
import "@fontsource/manrope";

(async function() {
  try {
    ReactDOM.render(
        <Provider store={store}>
          <Main theme={'dark'}>
            <App />
          </Main>
        </Provider>,
      document.getElementById('root')
    );
  } catch({ message = '', stack = '' }) {
    // api.logError(message + '\n' + stack);
    console.error(message);
  }
})();
