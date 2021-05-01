import { useDispatch } from 'react-redux';
import { restoreVideo, updateRestore } from '../videosSlice';

const useRestoreVideo = () => { 
  const dispatch = useDispatch();

  const restore = async (video) => {
    //TODO: not working when error happens
    dispatch(restoreVideo(video.id))
        .then(dispatch(updateRestore(video.id)));
    
  }

  return restore;
}

export default useRestoreVideo;