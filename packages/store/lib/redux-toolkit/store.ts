import { configureStore } from '@reduxjs/toolkit';
import modalSlice from './slice/modal-slice';
import datatableSlice from './slice/datatable-slice';
import designSlice from './slice/design-slice';
import languageSlice from './slice/language-slice';
import  siteSlice  from './slice/site-slice';
import userSlice from './slice/user-slice';
import uiSlice from './slice/ui-slice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      modal: modalSlice,
      datatable : datatableSlice,
      design : designSlice,
      site : siteSlice,
      languages : languageSlice,
      user : userSlice,
      ui : uiSlice
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];