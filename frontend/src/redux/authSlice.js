import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: false,
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
    },
    updateUserMess: (state, action) => {
      if (state.user) {
        state.user.mess = action.payload;
      }
    },
    updateProfilePhoto: (state, action) => {
      if (state.user) {
        state.user.profile = {
          ...state.user.profile,
          profilePhoto: action.payload,
        };
      }
    },
  },
});

export const { setLoading, setUser, clearUser, updateUserMess, updateProfilePhoto } = authSlice.actions;
export default authSlice.reducer;