export { makeStore } from './store';
export type { AppStore, RootState, AppDispatch } from './store';
export { useAppDispatch, useAppSelector, useAppStore } from './hooks';
export { default as StoreProvider } from './store-provider';

// Slices
export { setUserRole, setUser } from './slice/user-slice';
export { setSiteSlug, setSiteId, updateWebSite, clearWebSite, setWebsites, addWebsite, onChangeSite } from './slice/site-slice';
export { setLanguages, setSelectedLang } from './slice/language-slice';
export { updateDesign } from './slice/design-slice';
export { dtRefresh, dtSetPayload } from './slice/datatable-slice';
export { changeModalState } from './slice/modal-slice';
export { setLoading } from './slice/ui-slice';

// Slice types
export type { InDesignCustum } from './slice/design-slice';
export type { DtState } from './slice/datatable-slice';
export type { ModalState } from './slice/modal-slice';
