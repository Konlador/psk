import { useDispatch } from 'react-redux';
import { restoreVideo, resetRestore, updateItems } from '../../../Redux/videosSlice';

const useRestoreVideo = () => { 
  const dispatch = useDispatch();

  const restore = async (video) => {
    dispatch(resetRestore());
    dispatch(updateItems(video.id));
    dispatch(restoreVideo(video.id));
  }

  return restore;
}

export default useRestoreVideo;