import React, { useState, useEffect } from 'react';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import { useDispatch } from 'react-redux';
import { renameVideo, updateName } from '../../../Redux/videosSlice';
import CircularProgress from '@material-ui/core/CircularProgress';
import { unwrapResult } from '@reduxjs/toolkit';
import { REQUEST_STATUS } from '../../../common/constants';

const RenameMenuItem = ({ video, isOpen, close }) => { 
  const [open, setOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const dispatch = useDispatch();
  const [renameStatus, setRenameStatus] = useState(REQUEST_STATUS.idle);
  const [errorText, setErrorText] = useState('');

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);


  const handleClose = (status = false) => {
    setOpen(false);
    setErrorText('');

    if(status === true) {
      dispatch(updateName({ id: video.id, newName }));
    }

    close();
  };

  const onNameChanged = (e) => {
    setNewName(e.target.value);
  }

  const handleUpdate = (e) => {
    if(newName === ''){
      setErrorText("Name field is required");
    }
    else if(newName !== video.name) {
      setRenameStatus(REQUEST_STATUS.loading);

      dispatch(renameVideo({itemId: video.id, newName}))
        .then(unwrapResult)
        .then(() => {
          setRenameStatus(REQUEST_STATUS.success);
          handleClose(true);
        }) 
        .catch((error) => {
          if(error.message){
            setErrorText(error.message)
          }
          else {
            setErrorText(error)
          }

          setRenameStatus(REQUEST_STATUS.failed);
        });
    }
    else {
      setErrorText('Nothing to update');
    }
    
    e.preventDefault();
  }

  return (
    <div>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <form onSubmit={handleUpdate}>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Name"
              id="name"
              type="text"
              defaultValue={video.name}
              onChange={onNameChanged}
              error={errorText !== ""}
              helperText={errorText}
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