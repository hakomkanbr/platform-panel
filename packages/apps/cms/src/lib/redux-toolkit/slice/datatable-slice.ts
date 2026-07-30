import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// Define a type for the slice state
export interface DtState {
  reload: number
}

// Define the initial state using that type
const initialState: DtState = {
  reload: 0,
}

export const datatableSlice = createSlice({
  name: 'datatable',
  initialState,
  reducers: {
    dtRefresh: (state) => {
      state.reload = state.reload++;
    },
    dtSetPayload: (_state, action: PayloadAction<any>) => {
      return action.payload;
    }
  }
});

export const { dtRefresh, dtSetPayload } = datatableSlice.actions

export default datatableSlice.reducer