export { makeStore } from './store';
export type { AppStore, RootState, AppDispatch } from './store';
export { useAppDispatch, useAppSelector, useAppStore } from './hooks';
export { default as StoreProvider } from './store-provider';

// Slices
export { userSlice, setUserRole, setUser } from './slice/user-slice';
export { siteSlice, setSiteSlug, setSiteId, updateWebSite, clearWebSite, setWebsites, addWebsite, onChangeSite } from './slice/site-slice';
export { languageSlice, setLanguages, setSelectedLang } from './slice/language-slice';
export { designSlice, updateDesign } from './slice/design-slice';
export { datatableSlice, dtRefresh, dtSetPayload } from './slice/datatable-slice';
export { modalSlice, changeModalState } from './slice/modal-slice';
export { setLoading } from './slice/ui-slice';

// Slice types
export type { InDesignCustum } from './slice/design-slice';
export type { DtState } from './slice/datatable-slice';
export type { ModalState } from './slice/modal-slice';
