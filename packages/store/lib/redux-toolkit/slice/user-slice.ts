import { IRoleType, IUserProps, ROLE } from '@/abstracts/user/user';
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

export const userSlice = createSlice({
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