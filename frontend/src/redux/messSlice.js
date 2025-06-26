import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  messes: [],
  searchText: "",
  selectedMess: {},
};

const messSlice = createSlice({
  name: "mess",
  initialState,
  reducers: {
    setMesses: (state, action) => {
      state.messes = action.payload;
    },
    setSearchMessByText: (state, action) => {
      state.searchText = action.payload.toLowerCase();
    },
    setSelectedMess: (state, action) => {
      const { userId, mess } = action.payload;
      state.selectedMess[userId] = mess;
    },
  },
});

export const { setMesses, setSearchMessByText, setSelectedMess } =
  messSlice.actions;

export default messSlice.reducer;

export const selectFilteredMesses = (state) => {
  const { messes, searchText } = state.mess;
  if (!Array.isArray(messes)) return [];
  return messes.filter((mess) => mess.name.toLowerCase().includes(searchText));
};

export const selectSelectedMess = (state, userId) =>
  state.mess.selectedMess[userId];
