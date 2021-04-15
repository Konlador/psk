import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import VideoParser from '../../helpers/parser';
import { COLUMNS_NAMES } from './VideoConstants';
import { REQUEST_STATUS } from '../../common/constants';

// TODO: get drive id after authentication
const driveId = '982ecb26-309b-451a-973d-2d6f6e1b2e34';

const initialState = {
  items: [],
  status: REQUEST_STATUS.idle,
  error: null
}

export const getAllVideos = createAsyncThunk('videos/getAllVideos', async (params, {rejectWithValue}) => {
  try {
    const response = await axios.get(`/api/drive/${driveId}/files`, {params});
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
})


export const downloadVideoUri = createAsyncThunk('videos/downloadVideoUri', async (itemId, {rejectWithValue}) => {
  try {
    const response = await axios.get(`/api/drive/${driveId}/files/${itemId}/download`);
    return response.data;
  } catch (err) {
    const error = err;

    if (!error.response) {
      throw err;
    }

    return rejectWithValue(err.response.status);
  }
})

export const downloadVideo = createAsyncThunk('videos/downloadVideo', async (url, {rejectWithValue}) => {
  try {
    const response = await axios.get(url, {responseType: "arraybuffer"});
    return response.data;
  } catch (err) {
    const error = err;

    if (!error.response) {
      throw err;
    }

    return rejectWithValue(err.response.status);
  }
})

export const videosSlice = createSlice({
  name: 'videos',
  initialState,
  reducers: {
  },
  extraReducers: {
    [getAllVideos.pending]: (state, action) => {
      state.status = REQUEST_STATUS.loading;
    },
    [getAllVideos.fulfilled]: (state, action) => {
      state.items = VideoParser.parseArray(COLUMNS_NAMES, action.payload);
      state.status = REQUEST_STATUS.succeeded;
    },
    [getAllVideos.rejected]: (state, action) => {
       // get errors from payload if response was returned
       if (action.payload) {
        state.error =`Failed with status: ${action.payload}`;
      } else {
        state.error = action.error.message;
      }
      state.status = REQUEST_STATUS.failed;
    },
  }
})

export default videosSlice.reducer;