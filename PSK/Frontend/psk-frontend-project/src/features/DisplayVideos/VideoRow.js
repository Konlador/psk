import React, { useState } from 'react';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import GetAppSharpIcon from '@material-ui/icons/GetAppSharp';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import { COLUMNS } from './VideoConstants';

const initialState = {
  mouseX: null,
  mouseY: null,
};

export const VideoRow = (props) => { 
  const [state, setState] = useState(initialState);
  const handleRightClick = (event) => {
    event.preventDefault();
    setState({
      mouseX: event.clientX - 2,
      mouseY: event.clientY - 4,
    });
  };

  const handleClose = () => {
    setState(initialState);
  };
    return (
        <TableRow onContextMenu = {handleRightClick} hover role="checkbox" tabIndex={-1} key={props.video.id}>
          {COLUMNS.map((column) => {
            const value = props.video[column.id];
            return (
              <TableCell key={column.id} align={column.align} style={{display: column.display}}>
                {column.format != null ? column.format(value) : value}
              </TableCell>
            );
          })}
           <TableCell>
                <Button variant="contained"><GetAppSharpIcon/></Button>
            </TableCell>
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
        <MenuItem onClick={handleClose}>Play</MenuItem>
        <MenuItem onClick={handleClose}>Rename</MenuItem>
        <MenuItem onClick={handleClose}>Download</MenuItem>
        <MenuItem onClick={handleClose}>Delete</MenuItem>
      </Menu>
        </TableRow>)
  }