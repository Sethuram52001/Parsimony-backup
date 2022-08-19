import { configureStore } from '@reduxjs/toolkit';
import authSlice from './authSlice';
import { loadState } from './localStorage';

const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
  },
  preloadedState: loadState(),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
