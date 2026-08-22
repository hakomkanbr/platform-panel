import { IRoleType, IUserProps, ROLE } from '@repo/shared-types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';


// Define the initial state using that type
const initialState: IUserProps = {
  username: "",
  email: "",
  siteId: "",
  userId: "",
  siteSlug: "",
  role: null,
  image: "",
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserRole: (state, action: PayloadAction<IRoleType>) => {
      state.role = action.payload;
    },
    setUser: (state, action: PayloadAction<IUserProps>) => {
      const payload = action.payload;
      if (!payload) return;

      state.username = payload.username;
      state.email = payload.email;
      state.siteId = payload.siteId;
      state.userId = payload.userId;
      state.siteSlug = payload.siteSlug;
      state.image = payload.image;
      state.role = payload[ROLE] as IRoleType;
    }

  }
});

export const { setUserRole, setUser } = userSlice.actions

export default userSlice.reducer