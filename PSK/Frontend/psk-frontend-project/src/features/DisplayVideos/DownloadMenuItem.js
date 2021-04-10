import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import { useDispatch } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit'
import { downloadVideoUri } from './videosSlice';
import { downloadVideo } from './videosSlice';
import axios from 'axios';

const DownloadMenuItem = ({itemId, name, onClick}) => { 
  const dispatch = useDispatch();

  const getDownloadUri = async () => {
    try {
      const resultAction = await dispatch(downloadVideoUri(itemId));
      const downloadUri = unwrapResult(resultAction);
      return downloadUri;
    } catch (err) {
      // TODO, show errors if download uri is not returned
    }
  }

  const download = async () => {
    onClick();
    const uri = await getDownloadUri();
    const video = await dispatch(downloadVideo(uri));
    
    var link = document.createElement("a");
    link.href = window.URL.createObjectURL(
      new Blob([video.data], { type: "application/octet-stream" })
    );
    link.download = name;
    link.click();
  }

  return (<MenuItem onClick={download}>Download</MenuItem>);
}

export default DownloadMenuItem;