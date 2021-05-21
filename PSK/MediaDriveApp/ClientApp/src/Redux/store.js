import { configureStore } from '@reduxjs/toolkit';
import videosReducer from './videosSlice';
import uploadReducer from './uploadSlice';
import limiterReducer from './limitersSlice';

export default configureStore({
  reducer: {
    videos: videosReducer,
    upload: uploadReducer,
    limiters: limiterReducer,
  }
})