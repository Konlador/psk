import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const driveId = '88b4b3af-0d4b-448f-8d69-fddd823adbb0';
const resource = `StorageItems/${driveId}`;

const initialState = {
  items: [],
  status: 'idle',
  error: null
}

export const getAllVideos = createAsyncThunk('videos/getAllVideos', async (params) => {
  const response = await axios.get(`${resource}`, {params});
  return response.data;
})

export const videosSlice = createSlice({
  name: 'videos',
  initialState,
  reducers: {
    requestMoreVideos(state, action) {
      state.status = 'idle';
    },
  },
  extraReducers: {
    [getAllVideos.pending]: (state, action) => {
      state.status = 'loading'
    },
    [getAllVideos.fulfilled]: (state, action) => {
      state.status = 'succeeded'
      state.items = action.payload;
    },
    [getAllVideos.rejected]: (state, action) => {
      state.status = 'failed'
      state.error = action.error.message
    }
  }
})

export const { requestMoreVideos } = videosSlice.actions;

export default videosSlice.reducer;