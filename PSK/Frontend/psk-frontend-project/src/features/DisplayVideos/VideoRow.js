import React, { useState } from 'react';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import DownloadMenuItem from './DownloadMenuItem';
import PlayMenuItem from './PlayMenuItem';
import { COLUMNS } from './VideoConstants';

const initialState = {
  mouseX: null,
  mouseY: null,
};

export const VideoRow = ({video}) => { 
  const [state, setState] = useState(initialState);
  const [contextOpen, setContextOpen] = useState(false);

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
    return (
        <TableRow onContextMenu = {handleRightClick} hover role="checkbox" 
        tabIndex={-1} key={video.id} style={{backgroundColor: video.state === 1 ? 'white' : '#b6dcde',}}>
          {COLUMNS.map((column) => {
            const value = video[column.id];
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
            {video.state === 1 && <PlayMenuItem onClick={handleClose} itemId={video.id} name={video.name} />}
            <MenuItem onClick={handleClose}> Rename </MenuItem>
            {video.state === 1 && <DownloadMenuItem onClick={handleClose} itemId={video.id} name={video.name} />}
            <MenuItem onClick={handleClose}> Bin </MenuItem>
          </Menu>
        </TableRow>)
  }