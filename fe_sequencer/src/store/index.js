
import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from "redux";
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER, } from 'redux-persist';
import patternReducer from '../slice/patternSlice'
import kitReducer from '../slice/kitSlice'

const persistConfig = {
    key: 'root',
    storage,
    transforms: [
    ]
  }

const rootReducer = combineReducers({
    pattern: patternReducer,
    kit: kitReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        })

})

export const persistor = persistStore(store);