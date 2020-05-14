/*
 * Copyright (c) 2020-present unTill Pro, Ltd.
 */

import { createStore, applyMiddleware, compose } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import ReduxThunk from 'redux-thunk';

import rootReducer from 'reducers';

import {
  APPLY_MANIFEST,
  INIT_STATE
} from 'actions/';


const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['cp', 'ui', 'context', 'auth']
};

export default () => {
  const persistedReducer = persistReducer(persistConfig, rootReducer);
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  const store = createStore(persistedReducer, {}, composeEnhancers(applyMiddleware(ReduxThunk)));
  const persistor = persistStore(store, null, (data) => {
    const state = store.getState();

    store.dispatch({
      type: INIT_STATE
    });

    if (state && state.shell && state.shell.manifest) {
      store.dispatch({
        type: APPLY_MANIFEST,
        payload: state.shell.manifest
      });
    }
  });

  return { store, persistor };
};
