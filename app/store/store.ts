import {configureStore, combineReducers} from '@reduxjs/toolkit';
import {persistStore, persistReducer} from 'redux-persist';
// import {reduxStorage} from './storage';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// Slices
import tasksSlice from './tasksSlice';
import userSlice from './userSlice';
import dummyNetwokSlice from './dummyNetwork';
import thunk from 'redux-thunk';
import KeychainStorage from './KeychainStorage';

const rootReducer = combineReducers({
  todos: tasksSlice,
  user: userSlice,
  dummyNetwork: dummyNetwokSlice,
});

const persistConfig = {
  key: 'root',
  // storage: reduxStorage,
  // storage: AsyncStorage,
  storage: KeychainStorage,
  blacklist: ['user'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const middleware: any = [
  /* other middlewares */
  thunk,
];

if (__DEV__) {
  const createDebugger = require('redux-flipper').default;
  middleware.push(createDebugger());
}

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      // https://github.com/reduxjs/redux-toolkit/issues/415
      immutableCheck: false,
      serializableCheck: false,
    }).concat(middleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
