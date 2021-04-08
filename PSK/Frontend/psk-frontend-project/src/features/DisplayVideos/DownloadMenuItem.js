import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import DownloadLink from "react-download-link";
import { useDispatch } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit'
import { downloadVideo } from './videosSlice';

const DownloadMenuItem = ({itemId, name, onClick}) => { 
  const dispatch = useDispatch();

  const getDownloadUri = async () => {
    try {
      const resultAction = await dispatch(downloadVideo(itemId));
      const downloadUri = unwrapResult(resultAction);
      return downloadUri;
    } catch (err) {
      // TODO, show errors if download uri is not returned
    }
  }

  return (<MenuItem onClick={onClick}><DownloadLink
    label="Download"
    filename={name}
    exportFile={() => getDownloadUri()}
    /></MenuItem>);
}

export default DownloadMenuItem;