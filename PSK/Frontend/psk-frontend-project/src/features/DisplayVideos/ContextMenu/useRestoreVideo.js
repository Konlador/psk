import { useDispatch } from 'react-redux';
import { restoreVideo, resetRestore } from '../videosSlice';

const useRestoreVideo = () => { 
  const dispatch = useDispatch();

  const restore = async (video) => {
    dispatch(resetRestore());
    dispatch(restoreVideo(video.id));
  }

  return restore;
}

export default useRestoreVideo;