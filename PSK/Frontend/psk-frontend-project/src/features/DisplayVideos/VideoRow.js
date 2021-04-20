import React, { useState } from 'react';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import DownloadMenuItem from './DownloadMenuItem';
import PlayMenuItem from './PlayMenuItem';
import RenameMenuItem from './RenameMenuItem';
import CheckIcon from '@material-ui/icons/Check';
import AutorenewIcon from '@material-ui/icons/Autorenew';
import DeleteIcon from '@material-ui/icons/Delete';
import { COLUMNS } from './VideoConstants';

const initialState = {
  mouseX: null,
  mouseY: null,
};

export const VideoRow = ({video}) => { 
  const [state, setState] = useState(initialState);
  const [contextOpen, setContextOpen] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(video);

  const handleRightClick = (event) => {
    event.preventDefault();
    setContextOpen(!contextOpen);
    if(contextOpen){
      setState(initialState);
    }
    else{
      setState({
        mouseX: event.clientX - 2,
        mouseY: event.clientY - 4,
      });
    }
  };

  const handleClose = () => {
    setContextOpen(false);
    setState(initialState);
  };

  const handleCloseRename = (newName) => {
    handleClose();
    if(newName){
      let updatedVideo = Object.assign({}, currentVideo);
      updatedVideo.name = newName;
      setCurrentVideo(updatedVideo);
    }
  }
    return (
        <TableRow onContextMenu = {handleRightClick} hover role="checkbox" 
        tabIndex={-1} key={currentVideo.id}>
          <TableCell>{currentVideo.state === 0 ? <AutorenewIcon /> : 
                currentVideo.state === 1 ? <CheckIcon /> :  <DeleteIcon />}</TableCell>
          {COLUMNS.map((column) => {
            const value = currentVideo[column.id];
            return (
              <TableCell key={column.id} align={column.align} style={{display: column.display}}>
                {column.format != null ? column.format(value) : value}
              </TableCell>
            );
          })}
          <Menu
              keepMounted
              open={state.mouseY !== null}
              onClose={handleClose}
              anchorReference="anchorPosition"
              anchorPosition={
                state.mouseY !== null && state.mouseX !== null
                  ? { top: state.mouseY, left: state.mouseX }
                  : undefined
              }
           >
            {currentVideo.state === 1 && <PlayMenuItem onClick={handleClose} itemId={currentVideo.id} name={currentVideo.name} />}
            <RenameMenuItem onClick={handleCloseRename} itemId={currentVideo.id} name={currentVideo.name} > Rename </RenameMenuItem>
            {currentVideo.state === 1 && <DownloadMenuItem onClick={handleClose} itemId={currentVideo.id} name={currentVideo.name} />}
            <MenuItem onClick={handleClose}> Bin </MenuItem>
          </Menu>
        </TableRow>)
  }