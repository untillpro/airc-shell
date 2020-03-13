/*
 * Copyright (c) 2020-present unTill Pro, Ltd.
 */

import { createStore, applyMiddleware } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import ReduxThunk from 'redux-thunk';

import rootReducer from 'reducers';
 
import {
  APPLY_MANIFEST
} from './actions/types';


const persistConfig = {
  key: 'root',
  storage,
  blacklist: [ 'cp', 'ui' ] 
};
 
const persistedReducer = persistReducer(persistConfig, rootReducer);
 
export default () => {
  const store = createStore(persistedReducer, {}, applyMiddleware(ReduxThunk));
  const persistor = persistStore(store, null, (data) => {
    const state = store.getState();

    if (state && state.shell && state.shell.manifest) {
      store.dispatch({
        type: APPLY_MANIFEST,
        payload: state.shell.manifest
      });
    }
  });
  
  return { store, persistor };
};
