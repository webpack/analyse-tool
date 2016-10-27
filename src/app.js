/* eslint global-require: 0 */
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import { syncHistoryWithStore } from 'react-router-redux';
import debug from 'debug';
import { addLocaleData } from 'react-intl';
import en from 'react-intl/locale-data/en';
import es from 'react-intl/locale-data/es';
import pl from 'react-intl/locale-data/pl';
import configureStore from './redux/configure-store';
import routes from './routes';
import Root from './containers/Root';
import Redbox from 'redbox-react';

addLocaleData(en);
addLocaleData(es);
addLocaleData(pl);

if (__DEBUG__) {
  debug.enable('app:*');
}

const initialState = window.__INITIAL_STATE__;
const store = configureStore(initialState, browserHistory);
const history = syncHistoryWithStore(browserHistory, store);
const rootElement = document.getElementById('root');

if (__DEBUG__) {
  const { AppContainer } = require('react-hot-loader');

  const render = () => {
    ReactDOM.render(
      <AppContainer documentTitle={ 'React-Hot-Loader' } language={ 'english' } errorReporter={ Redbox }>
        <Root
          store={ store }
          routes={ routes }
          history={ history }
        />
      </AppContainer>,
      rootElement
    );
  };
  render();

  if (module.hot) {
    module.hot.accept('./containers/Root', () => {
      const NextApp = require('./containers/Root').default;
      render(
        <AppContainer documentTitle={ 'React-Hot-Loader' } language={ 'english' } errorReporter={ Redbox }>
          <Provider store={ store }>
            <NextApp
              store={ store }
              routes={ routes }
              history={ history }
            />
          </Provider>
        </AppContainer>,
        rootElement
      );
    });
  }

} else {
  ReactDOM.render(
    <Provider store={ store }>
      <Router
        store={ store }
        routes={ routes }
        history={ history }
      />
    </Provider>,
    rootElement
  );
}
