import { configureStore } from '@reduxjs/toolkit';
import videosReducer from '../features/DisplayVideos/videosSlice';
import uploadReducer from '../components/UploadFiles/uploadSlice';
import limiterReducer from '../components/Layout/Sidebars/limiterSlice';

export default configureStore({
  reducer: {
    videos: videosReducer,
    upload: uploadReducer,
    limiters: limiterReducer,
  }
})