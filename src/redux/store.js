import { configureStore } from '@reduxjs/toolkit'

import authenticationReducer from './slices/AuthenticationSlice'

export const store = configureStore({
  reducer: {
    authentication: authenticationReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})