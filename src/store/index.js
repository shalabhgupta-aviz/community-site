import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';
import notificationReducer from './slices/notificationSlice';
import badgeReducer from './slices/badgeSlice';
import profileReducer from './slices/profileSlice';
import {wpApi} from './api/wpApi';
import loggerMiddleware from '../middleware/loggerMiddleware';

const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    notifications: notificationReducer,
    badges: badgeReducer,
    profile: profileReducer,
    [wpApi.reducerPath]: wpApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(wpApi.middleware, loggerMiddleware),
});

export default store;
