import { configureStore } from '@reduxjs/toolkit'
import videosReducer from '../features/DisplayVideos/videosSlice'

export default configureStore({
  reducer: {
    videos: videosReducer
  }
})