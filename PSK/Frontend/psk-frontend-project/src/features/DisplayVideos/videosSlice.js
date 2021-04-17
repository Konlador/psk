import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import VideoParser from '../../helpers/parser';
import { COLUMNS_NAMES } from './VideoConstants';
import { REQUEST_STATUS } from '../../common/constants';

// TODO: get drive id after authentication
const driveId = '88b4b3af-0d4b-448f-8d69-fddd823adbb0';
const resource = `StorageItems/metadata/${driveId}`;

const initialState = {
  items: [],
  status: REQUEST_STATUS.idle,
  error: null
}

export const getAllVideos = createAsyncThunk('videos/getAllVideos', async (params, {rejectWithValue}) => {
  try {
    const response = await axios.get(`${resource}`, {params});
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
    }
  }
})

export default videosSlice.reducer;