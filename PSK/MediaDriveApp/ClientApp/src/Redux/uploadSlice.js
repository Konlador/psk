import { createSlice } from "@reduxjs/toolkit";
import { REQUEST_STATUS } from "../common/constants";

const initialState = {
  isUploading: false,
  progress: null,
  status: REQUEST_STATUS.idle,
};

export const uploadSlice = createSlice({
  name: "upload",
  initialState,
  reducers: {
    start: (state) => {
      state.progress = 0;
      state.isUploading = true;
      state.status = REQUEST_STATUS.loading;
    },
    increaseProgress: (state, action) => {
      state.progress = action.payload;

      if (state.progress === 100) {
        state.isUploading = false;
        state.status = REQUEST_STATUS.success;
        state.message = "Your file has been successfully uploaded";
      }
    },
    reject: (state) => {
      state.isUploading = false;
      state.progress = null;
      state.message = "Upload failed. Something went wrong.";
      state.status = REQUEST_STATUS.failed;
    },
    reset: (state) => {
      state.isUploading = false;
      state.progress = null;
      state.status = REQUEST_STATUS.idle;
    },
  },
});

export const { start, increaseProgress, reset, reject } = uploadSlice.actions;

export default uploadSlice.reducer;
