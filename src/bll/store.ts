import {combineReducers, configureStore, ThunkDispatch} from '@reduxjs/toolkit';
import {persistReducer, persistStore, Storage} from 'redux-persist';
import {ActionsTypeForUserReducer, userReducer} from './reducers/user-reducer';
import {ActionsTypeForAppReducer, appReducer} from './reducers/app-reducer';
import {
  ActionsTypeForFiltersReducer,
  filtersReducer,
} from './reducers/filters-Reducer';
import {
  ActionsTypeForBuildingsReducer,
  buildingsReducer,
} from './reducers/buildings-reducer';
import {
  ActionsTypeForNewAssetReducer,
  newAssetReducer,
} from './reducers/newAsset-reducer';
import {ActionsTypeForPlanReducer, planReducer} from './reducers/plan-Reducer';
import {
  ActionsTypeForNotesReducer,
  notesReducer,
} from './reducers/notes-Reducer';
import {
  ActionsTypeForAssetsReducer,
  assetsReducer,
} from './reducers/assets-reducer';
import {ActionsTypeForWOReducer, woReducer} from './reducers/wo-Reducer';
import {
  ActionsTypeForEmergencyReducer,
  emergencyReducer,
} from './reducers/emergency-Reducer';
import {
  ActionsTypeForCreateNewEmergencyPlanReducer,
  createNewEmergencyPlanReducer,
} from './reducers/createNewEmergencyPlan';
import {
  ActionsTypeForNewPointsReducer,
  newPointReducer,
} from './reducers/point-reducer';
import {
  ActionsTypeForLocalReducer,
  localReducer,
} from './reducers/local-reducer';
import {createNewEmergencyReportReducer} from './reducers/createNewEmergencyReport';
import {
  ActionsTypeForOfflineReducer,
  offlineReducer,
} from './reducers/offline-reducer';
import {MMKV} from 'react-native-mmkv';
import {
  ActionsTypeForNotificationsReducer,
  notificationsReducer,
} from './reducers/notifications-Reducer';
import {
  ActionsTypeForRoomsReducer,
  roomsReducer,
} from './reducers/rooms-reducer';

const storage = new MMKV();

export const mmkvStorage: Storage = {
  setItem: (key, value) => {
    storage.delete(key);
    storage.set(key, value);
    return Promise.resolve(true);
  },
  getItem: key => {
    const value = storage.getString(key);
    return Promise.resolve(value);
  },
  removeItem: key => {
    storage.delete(key);
    return Promise.resolve();
  },
};

const persistConfig = {
  storage: mmkvStorage,
  key: 'root',
  whitelist: ['app', 'user', 'offline', 'local'],
};

const rootReducer = combineReducers({
  user: userReducer,
  wo: woReducer,
  filters: filtersReducer,
  buildings: buildingsReducer,
  rooms: roomsReducer,
  plan: planReducer,
  assets: assetsReducer,
  newAsset: newAssetReducer,
  notes: notesReducer,
  createNewEmergencyPlan: createNewEmergencyPlanReducer,
  createNewEmergencyResport: createNewEmergencyReportReducer,
  emergency: emergencyReducer,
  app: appReducer,
  points: newPointReducer,
  local: localReducer,
  offline: offlineReducer,
  notifications: notificationsReducer,
});

export const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
      // {
      //   ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      // },
    }),
});

export const persistor = persistStore(store);

export type ActionsType =
  | ActionsTypeForEmergencyReducer
  | ActionsTypeForWOReducer
  | ActionsTypeForBuildingsReducer
  | ActionsTypeForUserReducer
  | ActionsTypeForAppReducer
  | ActionsTypeForFiltersReducer
  | ActionsTypeForPlanReducer
  | ActionsTypeForAssetsReducer
  | ActionsTypeForNotesReducer
  | ActionsTypeForNewAssetReducer
  | ActionsTypeForNewPointsReducer
  | ActionsTypeForLocalReducer
  | ActionsTypeForOfflineReducer
  | ActionsTypeForNotificationsReducer
  | ActionsTypeForCreateNewEmergencyPlanReducer
  | ActionsTypeForRoomsReducer;

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = ThunkDispatch<RootState, unknown, ActionsType>;
