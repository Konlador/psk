import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit'
import { downloadVideoUri } from '../videosSlice';

export default function VideoPlayer({ itemId, name }) {
  const dispatch = useDispatch();
  const [videoUri, setVideoUri] = useState(null);

  useEffect(() => {
    const getVideoUri = async () => {
      try {
        const resultAction = await dispatch(downloadVideoUri(itemId));
        const videoUri = unwrapResult(resultAction);
        setVideoUri(videoUri);
      } catch (err) {
        // TODO, show errors if download uri is not returned
      }
    }

    getVideoUri();
  }, [dispatch, itemId]);

  return (
    <video controls 
           controlsList="nodownload"
           width="100%" 
           src={videoUri}
    />
  );
}