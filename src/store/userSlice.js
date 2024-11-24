import { createSlice } from '@reduxjs/toolkit';

const initialState = { authToken: null, user: null };
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.authToken = null;
    },
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.authToken = action.payload.authToken;
    },
  },
});

export const { logout, setUser } = userSlice.actions;
export default userSlice.reducer;