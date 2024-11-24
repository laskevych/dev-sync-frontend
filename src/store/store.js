import { configureStore } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import userReducer from './userSlice';

const config = { key: 'main', storage };
const producer = persistReducer(config, userReducer);
const store = configureStore({ reducer: { user: producer} });

export const persistor = persistStore(store);
export default store;