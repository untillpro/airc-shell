/*
 * Copyright (c) 2020-present unTill Pro, Ltd.
 */

import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { 
  Root,
  ApiProvider 
} from 'components';

import configureStore from 'configureStore';

class App extends Component {
  render() {
    const cfg = configureStore();

    return (
      <Provider store={cfg.store}>
        <PersistGate loading={null} persistor={cfg.persistor}>
          <ApiProvider>
            <Root />
          </ApiProvider>
        </PersistGate>
      </Provider>
    );
  }
}

export default App;