import { configureStore } from '@reduxjs/toolkit'

import { authenticationSlice } from './slices/AuthenticationSlice'

export const store = configureStore({
  reducer: {
    authentication: authenticationSlice,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})