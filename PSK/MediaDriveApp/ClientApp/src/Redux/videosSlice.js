import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { REQUEST_STATUS } from "../common/constants";
import http from "../http-common";
import ErrorParser from "../common/ErrorParser";

// TODO: get drive id after authentication
const driveId = "982ecb26-309b-451a-973d-2d6f6e1b2e34";

const initialState = {
  items: [],
  status: REQUEST_STATUS.idle,
  error: null,

  userAction: null,
  userActionItem: null,

  itemStatus: null,

  binItem: null,
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

      if (!error.response) {
        throw err;
      }

      return rejectWithValue(err.response);
    }
  }
);

export const getVideo = createAsyncThunk(
  "videos/getVideo",
  async (fileId, { rejectWithValue }) => {
    try {
      const response = await http.get(`/api/drive/${driveId}/files/${fileId}`);
      return response.data;
    } catch (err) {
      const error = err;

      if (!error.response) {
        throw err;
      }

      return rejectWithValue(err.response);
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

      return rejectWithValue(err.response);
    }
  }
);

export const renameVideo = createAsyncThunk(
  "videos/renameVideo",
  async (params, { rejectWithValue }) => {
    const itemId = params.itemId;
    const newName = params.newName;
    const rowVersion = params.rowVersion;

    try {
      const response = await http.patch(
        `/api/drive/${driveId}/files/${itemId}/rename?newName=${newName}&rowVersion=${rowVersion}`
      );
      return response.data;
    } catch (err) {
      const error = err;

      if (!error.response) {
        throw err;
      }

      return rejectWithValue(err.response);
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

      if (!error.response) {
        throw err;
      }

      return rejectWithValue(err.response);
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

      if (!error.response) {
        throw err;
      }

      return rejectWithValue(err.response);
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

      if (!error.response) {
        throw err;
      }

      return rejectWithValue(err.response);
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
    //update items after restore or delete -> remove element from list
    updateItems: (state, action) => {
      const id = action.payload;
      const itemToRemoveIndex = state.items.findIndex((item) => item.id === id);
      state.items.splice(itemToRemoveIndex, 1);
    },
    resetRestore: (state) => {
      state.restoreVideoError = "";
      state.restoreVideoStatus = REQUEST_STATUS.idle;
    },
    resetDelete: (state) => {
      state.deleteVideoError = "";
      state.deleteVideoStatus = REQUEST_STATUS.idle;
    },
    resetItem: (state) => {
      state.itemStatus = null;
    },
    setUserAction: (state, action) => {
      state.userAction = action.payload.userAction;
      state.userActionItem = action.payload.userActionItem;
    },
  },
  extraReducers: {
    [getAllVideos.pending]: (state) => {
      state.status = REQUEST_STATUS.loading;
    },
    [getAllVideos.fulfilled]: (state, action) => {
      state.items = action.payload.items;
      state.status = REQUEST_STATUS.success;
    },
    [getAllVideos.rejected]: (state, action) => {
      state.error = ErrorParser.parseError(action);
      state.status = REQUEST_STATUS.failed;
    },

    [getVideo.fulfilled]: (state, action) => {
      const id = action.payload.id;
      const itemToUpdateIndex = state.items.findIndex((item) => item.id === id);
      if (itemToUpdateIndex !== -1) {
        state.items[itemToUpdateIndex] = action.payload;
      } else {
        state.items.push(action.payload);
      }

      state.itemStatus = REQUEST_STATUS.success;
    },

    [binVideo.pending]: (state) => {
      state.binVideoError = "";
      state.binVideoStatus = REQUEST_STATUS.loading;
    },
    [binVideo.fulfilled]: (state) => {
      if (state.userAction === "bin" && window.location.pathname === "/bin") {
        const found = state.items.findIndex(
          (item) => item.id === state.userActionItem.id
        );

        if (found === -1) {
          state.items.push(state.userActionItem);
        }
      }

      state.userAction = null;
      state.userActionItem = null;
      state.binVideoStatus = REQUEST_STATUS.success;
    },
    [binVideo.rejected]: (state, action) => {
      state.binVideoError = ErrorParser.parseError(action);
      state.binVideoStatus = REQUEST_STATUS.failed;
      state.userAction = null;
      state.userActionItem = null;
    },

    [restoreVideo.fulfilled]: (state) => {
      if (
        state.userAction === "restore" &&
        window.location.pathname === "/videos"
      ) {
        const found = state.items.findIndex(
          (item) => item.id === state.userActionItem.id
        );

        if (found === -1) {
          state.items.push(state.userActionItem);
        }
      }

      state.userAction = null;
      state.userActionItem = null;
      state.restoreVideoStatus = REQUEST_STATUS.success;
    },
    [restoreVideo.rejected]: (state, action) => {
      state.restoreVideoError = ErrorParser.parseError(action);
      state.restoreVideoStatus = REQUEST_STATUS.failed;
      state.userAction = null;
      state.userActionItem = null;
    },

    [deleteVideo.fulfilled]: (state) => {
      state.deleteVideoStatus = REQUEST_STATUS.success;
    },
    [deleteVideo.rejected]: (state, action) => {
      state.deleteVideoError = ErrorParser.parseError(action);
      state.deleteVideoStatus = REQUEST_STATUS.failed;
    },
  },
});

export const {
  updateName,
  updateItems,
  resetBin,
  resetRestore,
  resetDelete,
  resetItem,
  setUserAction,
} = videosSlice.actions;

export default videosSlice.reducer;
