import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isUploading: false,
    progress: null,
};

export const uploadSlice = createSlice({
  name: "upload",
  initialState,
  reducers: {
    start: (state) => {
        state.progress = 0;
        state.isUploading = true;

    },
    increaseProgress: (state, action) => {
        state.progress = action.payload;

        if(state.progress === 100) {
            state.isUploading = false;
        }
    },
    reset: (state) => {
      console.log('reseting upload');
      state.isUploading = false;
      state.progress = null;
    },
  },
});

export const { start, increaseProgress, reset } = uploadSlice.actions

export default uploadSlice.reducer;