import { configureStore } from '@reduxjs/toolkit';
import apiSlice from './apiSlice';
import authSlice from './authSlice';
import filterSlice from './filterSlice';
import { loadState } from './localStorage';

const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    filter: filterSlice.reducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  preloadedState: loadState(),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
