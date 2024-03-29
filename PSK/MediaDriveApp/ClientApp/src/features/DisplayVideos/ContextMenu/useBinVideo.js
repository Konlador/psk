
import { useDispatch } from 'react-redux';
import { binVideo, resetBin, setUserAction, updateItems } from '../../../Redux/videosSlice';

const useBinVideo = () => { 
  const dispatch = useDispatch();

  const bin = async (video) => {
    dispatch(resetBin());
    dispatch(updateItems(video.id));
    dispatch(setUserAction({ userAction: 'bin', userActionItem: video }));
    dispatch(binVideo(video.id));
  }

  return bin;
}

export default useBinVideo;