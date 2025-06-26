import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

import authSlice from "./authSlice";
import messSlice from "./messSlice";
import feedbackSlice from "./feedbackSlice"; 

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: ["auth", "mess","feedback"],
};

const rootReducer = combineReducers({
  auth: authSlice,
  mess: messSlice,
  feedback: feedbackSlice, 
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

const persistor = persistStore(store);

export { store, persistor };
