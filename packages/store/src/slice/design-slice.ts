const DesignVaribles = { green: '#F7931E', green_opcity_9: '#FFE0B2' };
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// Define a type for the slice state
export interface InDesignCustum {
    green? : string,
    green_opcity_9? : string,
}

// Define the initial state using that type
const initialState: InDesignCustum = DesignVaribles;

const designSlice = createSlice({
  name: 'design',
  initialState,
  reducers: {
    updateDesign: (state, action: PayloadAction<InDesignCustum>) => {
      state.green = action.payload.green;
    }
  }
})

export const { updateDesign } = designSlice.actions

export default designSlice.reducer