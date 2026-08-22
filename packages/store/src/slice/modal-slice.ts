import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// Define a type for the slice state
export interface ModalState {
  open : boolean,
  data? : any
}

// Define the initial state using that type
const initialState: ModalState = {
  open: false,
  data:{}
}

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    changeModalState: (state, action: PayloadAction<ModalState>) => {
      state.open = action.payload.open;

      if(action.payload.open == false){
        state.data = null;
      }else{
        state.data = action.payload.data;
      }
      
    }
  }
})

export const { changeModalState } = modalSlice.actions

export default modalSlice.reducer