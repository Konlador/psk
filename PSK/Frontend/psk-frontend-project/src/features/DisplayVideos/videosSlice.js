import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { REQUEST_STATUS } from "../../common/constants";
import http from "../../http-common";

// TODO: get drive id after authentication
const driveId = "982ecb26-309b-451a-973d-2d6f6e1b2e34";
const NETWORK_ERROR = "Something went wrong. Try again later."

const initialState = {
  items: [],
  status: REQUEST_STATUS.idle,
  error: null,
  binVideoStatus: REQUEST_STATUS.idle,
  binVideoError: null,
  restoreVideoStatus: REQUEST_STATUS.idle,
  restoreVideoError: null,
  deleteVideoStatus: REQUEST_STATUS.idle,
  deleteVideoError: null,
};

export const getAllVideos = createAsyncThunk(
  "videos/getAllVideos",
  async (params, { rejectWithValue }) => {
    try {
      const response = await http.get(`/api/drive/${driveId}/files`, {
        params,
      });
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
export const getAllVideoss = createAsyncThunk(
  "videos/getAllVideos",
  async (params, { rejectWithValue }) => {
    try {
      const response = await http.get(`/api/drive/${driveId}/files`, {
        params,
      });
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

export const downloadVideoUri = createAsyncThunk(
  "videos/downloadVideoUri",
  async (itemId, { rejectWithValue }) => {
    try {
      const response = await http.get(
        `/api/drive/${driveId}/files/${itemId}/download`
      );
      return response.data;
    } catch (err) {
      const error = err;

      if (!error.response) {
        throw err;
      }

      return rejectWithValue(err.response.status);
    }
  }
);

export const renameVideo = createAsyncThunk(
  "videos/renameVideo",
  async (params, { rejectWithValue }) => {
    const itemId = params.itemId;
    const newName = params.newName;

    try {
      const response = await http.put(
        `/api/drive/${driveId}/files/${itemId}/rename?newName=${newName}`
      );
      return response.data;
    } catch (err) {
      const error = err;

      // response was not returned - return err to rejected promise
      if (!error.response) {
        throw err;
      }
      // response was returned - return validation errors from server to rejected promise
      return rejectWithValue(err.response.data);
    }
  }
);

export const binVideo = createAsyncThunk(
  "videos/binVideo",
  async (itemId, { rejectWithValue }) => {
    try {
      const response = await http.post(
        `/api/drive/${driveId}/files/${itemId}/trash`
      );
      return response.data;
    } catch (err) {
      const error = err;

      // response was not returned - return err to rejected promise
      if (!error.response) {
        throw err;
      }
      // response was returned - return validation errors from server to rejected promise
      return rejectWithValue(err.response.data);
    }
  }
);

export const restoreVideo = createAsyncThunk(
  "videos/restoreVideo",
  async (itemId, { rejectWithValue }) => {
    try {
      const response = await http.post(
        `/api/drive/${driveId}/files/${itemId}/restore`
      );
      return response.data;
    } catch (err) {
      const error = err;

      // response was not returned - return err to rejected promise
      if (!error.response) {
        throw err;
      }
      // response was returned - return validation errors from server to rejected promise
      return rejectWithValue(err.response.data);
    }
  }
);

export const deleteVideo = createAsyncThunk(
  "videos/deleteVideo",
  async (itemId, { rejectWithValue }) => {
    try {
      const response = await http.delete(
        `/api/drive/${driveId}/files/${itemId}`
      );
      return response.data;
    } catch (err) {
      const error = err;

      // response was not returned - return err to rejected promise
      if (!error.response) {
        throw err;
      }
      // response was returned - return validation errors from server to rejected promise
      return rejectWithValue(err.response.data);
    }
  }
);

export const videosSlice = createSlice({
  name: "videos",
  initialState,
  reducers: {
    updateName: (state, action) => {
      const { id, newName } = action.payload;
      const itemToUpdateIndex = state.items.findIndex((item) => item.id === id);
      state.items[itemToUpdateIndex].name = newName;
    },
    resetBin: (state) => {
      state.binVideoError = "";
      state.binVideoStatus = REQUEST_STATUS.idle;
    },
    updateItems: (state, action) => {
      const id = action.payload;
      const itemToRestoreIndex = state.items.findIndex((item) => item.id === id);
      state.restoreVideoError = null;
      state.restoreVideoStatus = REQUEST_STATUS.idle;
      state.deleteVideoError = null;
      state.deleteVideoStatus = REQUEST_STATUS.idle;
      state.binVideoError = null;
      state.binVideoStatus = REQUEST_STATUS.idle;
      state.items.splice(itemToRestoreIndex, 1);
    },
    resetRestore: (state) => {
      state.restoreVideoError = "";
      state.restoreVideoStatus = REQUEST_STATUS.idle;
    },
    resetDelete: (state) => {
      state.deleteVideoError = "";
      state.deleteVideoStatus = REQUEST_STATUS.idle;
    }
  },
  extraReducers: {
    [getAllVideos.pending]: (state,) => {
      state.status = REQUEST_STATUS.loading;
    },
    [getAllVideos.fulfilled]: (state, action) => {
      state.items = action.payload.items;
      state.status = REQUEST_STATUS.succees;
    },
    [getAllVideos.rejected]: (state, action) => {
      // get errors from payload if response was returned
      if (action.payload) {
        state.error = action.payload;
      } else {
        state.error = NETWORK_ERROR;
      }
      state.status = REQUEST_STATUS.failed;
    },

    [binVideo.pending]: (state,) => {
      state.binVideoError = "";
      state.binVideoStatus = REQUEST_STATUS.loading;
    },
    [binVideo.fulfilled]: (state) => {
      state.binVideoStatus = REQUEST_STATUS.success;
    },
    [binVideo.rejected]: (state, action) => {
      if (action.payload) {
        state.binVideoError = action.payload;;
      } else {
        state.binVideoError = NETWORK_ERROR;
      }
      state.binVideoStatus = REQUEST_STATUS.failed;
    },
    [restoreVideo.fulfilled]: (state) => {
      state.restoreVideoStatus = REQUEST_STATUS.success;
    },
    [restoreVideo.rejected]: (state, action) => {
      if (action.payload) {
        state.restoreVideoError = action.payload;;
      } else {
        state.restoreVideoError = NETWORK_ERROR;
      }
      state.restoreVideoStatus = REQUEST_STATUS.failed;
    },
    [deleteVideo.fulfilled]: (state) => {
      state.deleteVideoStatus = REQUEST_STATUS.success;
    },
    [deleteVideo.rejected]: (state, action) => {
      if (action.payload) {
        state.deleteVideoError = action.payload;;
      } else {
        state.deleteVideoError = NETWORK_ERROR;
      }
      state.deleteVideoStatus = REQUEST_STATUS.failed;
    },
  },
});

export const { updateName, updateItems, resetBin, resetRestore, resetDelete } = videosSlice.actions

export default videosSlice.reducer;
