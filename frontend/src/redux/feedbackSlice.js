import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  feedbacks: [],
};

const feedbackSlice = createSlice({
  name: "feedback",
  initialState,
  reducers: {
    setFeedbacks: (state, action) => {
      state.feedbacks = action.payload;
    },
  },
});

export const { setFeedbacks } = feedbackSlice.actions;
export default feedbackSlice.reducer;