import { useDispatch } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit'
import { downloadVideoUri } from '../../../Redux/videosSlice';

const useDownloadVideo = () => { 
  const dispatch = useDispatch();

  const download = async (video) => {
    const resultAction = await dispatch(downloadVideoUri(video.id));
    const downloadUri = unwrapResult(resultAction);
    const link = document.createElement("a");
    link.href = downloadUri;
    link.download = video.name;
    link.click();
  }

  return download;
}

export default useDownloadVideo;