import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import { useDispatch } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit'
import { downloadVideoUri } from './videosSlice';

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
    const link = document.createElement("a");
    link.href = uri;
    link.download = name;
    link.click();
  }

  return (<MenuItem onClick={download}>Download</MenuItem>);
}

export default DownloadMenuItem;