import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { REQUEST_STATUS } from "../../../common/constants";
import http from "../../../http-common";

// TODO: get drive id after authentication
const driveId = "982ecb26-309b-451a-973d-2d6f6e1b2e34";
const NETWORK_ERROR = "Something went wrong. Try again later."

const initialState = {
  limiters: {},
  status: REQUEST_STATUS.idle,
  error: null,
};

export const getLimiters = createAsyncThunk(
  "limiters/getLimiters",
  async (params, { rejectWithValue }) => {
    try {
      const response = await http.get(`/api/drives/${driveId}`);
      return response.data;
    } catch (err) {
      const error = err;

      // response was not returned - return err to rejected promise
      if (!error.response) {
        throw err;
      }
      // response was returned - return validation errors from server to rejected promise
      return rejectWithValue(err.response.status);
    }
  }
);

export const limitersSlice = createSlice({
  name: "limiters",
  initialState,
  reducers: {
    reset: (state) => {
      state.status = REQUEST_STATUS.idle;
    },
  },
  extraReducers: {
    [getLimiters.pending]: (state,) => {
      state.status = REQUEST_STATUS.loading;
    },
    [getLimiters.fulfilled]: (state, action) => {
      state.limiters = action.payload;
      state.status = REQUEST_STATUS.success;
    },
    [getLimiters.rejected]: (state, action) => {
      // get errors from payload if response was returned
      if (action.payload) {
        state.error = action.payload;
      } else {
        state.error = NETWORK_ERROR;
      }
      state.status = REQUEST_STATUS.failed;
    },
  },
});

export const { reset } = limitersSlice.actions;

export const selectLimiters = (state) => state.limiters;

export default limitersSlice.reducer;
