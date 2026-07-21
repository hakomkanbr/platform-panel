import type { ISite } from '@repo/shared-types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// تعريف نوع الحالة
interface SiteState extends ISite {
  changeSite: boolean;
  changeCount: number;
  list: ISite[];
}

// الحالة الابتدائية
const initialState: SiteState = {
  slug: "",
  name: "",
  id: -1,
  description: "",
  link: "",
  published: false,
  role: undefined,
  changeSite: false,
  changeCount: 0,
  list: []
};

export const siteSlice = createSlice({
  name: 'site',
  initialState,
  reducers: {
    setSiteSlug: (state, action: PayloadAction<string>) => {
      state.slug = action.payload;
    },
    clearWebSite: (state, action: PayloadAction<string>) => {
      state = initialState;
    },
    setSiteId: (state, action: PayloadAction<number>) => {
      console.info("old site id" , state.id);
      console.info("new site id" , action.payload);
      state.id = action.payload;
    },
    updateWebSite: (state) => {
      state.changeSite = !state.changeSite;
    },
    onChangeSite: (state) => {
      state.changeCount = state.changeCount + 1;
    },
    setWebsites: (state, action: PayloadAction<ISite[]>) => {
      state.list = action.payload;
    },
    addWebsite: (state, action: PayloadAction<ISite>) => {
      state.list.push(action.payload);
    },
  }
});

export const { setSiteSlug, setSiteId, updateWebSite, clearWebSite,setWebsites, addWebsite, onChangeSite } = siteSlice.actions;

export default siteSlice.reducer;
