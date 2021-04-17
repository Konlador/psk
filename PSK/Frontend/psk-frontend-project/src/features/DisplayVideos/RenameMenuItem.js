import React, { useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import { useDispatch } from 'react-redux';
import { renameVideo } from './videosSlice';
import MenuItem from '@material-ui/core/MenuItem';
import CircularProgress from '@material-ui/core/CircularProgress';
import { unwrapResult } from '@reduxjs/toolkit';
import { REQUEST_STATUS } from '../../common/constants';

const RenameMenuItem = ({itemId, name, onClick}) => { 
  const [open, setOpen] = React.useState(false);
  const [newName, setNewName] = React.useState(name);
  const dispatch = useDispatch();
  const [renameStatus, setRenameStatus] = useState(REQUEST_STATUS.idle);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    onClick(newName);
  };

  const onNameChanged = (e) => {
    setNewName(e.target.value);
  }

  const handleUpdate = (e) => {
    if(newName !== name) {
      setRenameStatus(REQUEST_STATUS.loading);

      dispatch(renameVideo({itemId, newName}))
        .then(unwrapResult)
        .then(() => setRenameStatus(REQUEST_STATUS.success))
        .catch(() => {
          //TODO show errros
          setRenameStatus(REQUEST_STATUS.failed);
        })
        .finally(() => handleClose());
    }
    
    e.preventDefault();
  }

  return (
    <div>
      <MenuItem onClick={handleOpen}>Rename</MenuItem>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <form onSubmit={handleUpdate}>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Name"
              id="name"
              type="text"
              required
              defaultValue={name}
              onChange={onNameChanged}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
          {renameStatus !== REQUEST_STATUS.loading &&
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
          }
            <Button type="submit" color="primary" disabled={renameStatus === REQUEST_STATUS.loading}>
              {renameStatus === REQUEST_STATUS.loading ? <CircularProgress /> : 'Update'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}

export default RenameMenuItem;