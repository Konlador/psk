import { useDispatch } from 'react-redux';
import { restoreVideo, resetRestore, setUserAction, updateItems } from '../../../Redux/videosSlice';

const useRestoreVideo = () => { 
  const dispatch = useDispatch();

  const restore = async (video) => {
    dispatch(resetRestore());
    dispatch(updateItems(video.id));
    dispatch(setUserAction({ userAction: 'bin', userActionItem: video }));
    dispatch(restoreVideo(video.id));
  }

  return restore;
}

export default useRestoreVideo;