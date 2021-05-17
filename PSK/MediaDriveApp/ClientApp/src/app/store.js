import { configureStore } from '@reduxjs/toolkit';
import videosReducer from '../features/DisplayVideos/videosSlice';
import uploadReducer from '../components/UploadFiles/uploadSlice';

export default configureStore({
  reducer: {
    videos: videosReducer,
    upload: uploadReducer,
  }
})