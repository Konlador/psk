import { createSlice } from "@reduxjs/toolkit";
import { REQUEST_STATUS } from "../common/constants";

const initialState = {
  isUploading: false,
  progress: null,
  status: REQUEST_STATUS.idle,
  message: '',
  fileName: '',
};

export const uploadSlice = createSlice({
  name: "upload",
  initialState,
  reducers: {
    start: (state, action) => {
      state.progress = 0;
      state.isUploading = true;
      state.status = REQUEST_STATUS.loading;
      state.fileName = action.payload;
      state.message = `Initiating upload for ${state.fileName} `;
    },
    increaseProgress: (state, action) => {
      state.progress = action.payload;
      state.message = `Uploading is in progress for ${state.fileName} `;

      if (state.progress === 100) {
        state.isUploading = false;
        state.status = REQUEST_STATUS.success;
        state.message = `${state.fileName} has been successfully uploaded`;
      }
    },
    reject: (state) => {
      state.isUploading = false;
      state.progress = null;
      state.message = `Upload failed for ${state.fileName}. Something went wrong.`;
      state.status = REQUEST_STATUS.failed;
      state.fileName = "";
    },
    reset: (state) => {
      state.isUploading = false;
      state.progress = null;
      state.status = REQUEST_STATUS.idle;
      state.message = "";
      state.fileName = "";
    },
  },
});

export const { start, increaseProgress, reset, reject } = uploadSlice.actions;

export default uploadSlice.reducer;
