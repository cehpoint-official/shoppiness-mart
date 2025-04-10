import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage/session"; // Use sessionStorage
import { encryptTransform } from "redux-persist-transform-encrypt";
import userReducer from "./reducer/userReducer";
import businessUserReducer from "./reducer/businessUserReducer";
import ngoUserReducer from "./reducer/ngoUserReducer";

// Combine all reducers with their correct names
const rootReducer = combineReducers({
  userReducer: userReducer, // Explicitly name the slice "userReducer"
  businessUserReducer: businessUserReducer, // Name as "businessUserReducer"
  ngoUserReducer: ngoUserReducer, // Name as "ngoUserReducer"
});

// Persist config with encryption
const persistConfig = {
  key: "root",
  storage,
  transforms: [
    encryptTransform({
      secretKey: import.meta.env.VITE_APP_PERSIST_KEY || "secret-key-here-shoppiness-mart",
      onError: (error) => {
        console.error("Encryption Error:", error);
      },
    }),
  ],
};

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Add PURGE to the list of ignored actions
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/PURGE",
          "persist/FLUSH",
          "persist/PAUSE",
          "persist/REGISTER",
        ],
      },
    }),
});

export const persistor = persistStore(store);
