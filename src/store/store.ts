import { configureStore } from "@reduxjs/toolkit";
import userInfoSlice from "./slice/userInfoSlice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web

// Define persist config for userInfo slice
const persistConfig = {
  key: "userInfo", // Key to save persisted data
  storage, // Use localStorage to store
};

// Wrap the userInfo reducer with persistReducer
const persistedReducer = persistReducer(persistConfig, userInfoSlice);

// Configure the store with persistedReducer
export const store = configureStore({
  reducer: {
    userInfo: persistedReducer, // Use persisted reducer for userInfo
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Avoid errors with non-serializable values in persist
    }),
});

// Persistor to manage store persistence
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
