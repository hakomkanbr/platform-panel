import type { ILanguage } from '@repo/shared-types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// Define the initial state using that type
const initialState: { list: ILanguage[] , selectedLang:ILanguage | null } = {
  list: [],
  selectedLang : null
};

export const languageSlice = createSlice({
  name: 'languages',
  initialState,
  reducers: {
    setLanguages: (state, action: PayloadAction<ILanguage[]>) => {
      state.list = action.payload;

      if(action.payload.length == 1){
        state.selectedLang = action.payload[0];
      }
    },
    setSelectedLang: (state, action: PayloadAction<ILanguage | null>) => {
      state.selectedLang = action.payload;
    },
  }
});

export const { setLanguages,setSelectedLang } = languageSlice.actions

export default languageSlice.reducer