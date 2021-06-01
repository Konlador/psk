import React, { useState, useEffect } from 'react';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import { useDispatch, useSelector } from 'react-redux';
import useErrorStyles from "./useErrorStyles";
import { deleteVideo, resetDelete, updateItems } from '../../../Redux/videosSlice';
import CircularProgress from '@material-ui/core/CircularProgress';
import { REQUEST_STATUS } from '../../../common/constants';


const DeleteMenuItem = ({ video, isOpen, close }) => { 
  const classes = useErrorStyles();
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const deleteStatus = useSelector((state) => state.videos.deleteVideoStatus);
  const deleteError = useSelector((state) => state.videos.deleteVideoError);

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);


  const handleClose = () => {
    setOpen(false);
    close();
  };


  const handleDelete = (e) => {
    dispatch(resetDelete());
    dispatch(updateItems(video.id));
    dispatch(deleteVideo(video.id));
    handleClose();
    e.preventDefault();
  }

  return (
    <div>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <form onSubmit={handleDelete}>
          <DialogContent>
            <DialogContentText>
                Do you really want to delete <b>{video.name}</b> permanently?
            </DialogContentText>
            <DialogContentText className={classes.error}>
            {deleteError && deleteError}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
          {deleteStatus !== REQUEST_STATUS.loading &&
            <Button onClick={handleClose} color="primary">
              No
            </Button>
          }
            <Button type="submit" color="primary" disabled={deleteStatus === REQUEST_STATUS.loading}>
              {deleteStatus === REQUEST_STATUS.loading ? <CircularProgress /> : 'Yes'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}

export default DeleteMenuItem;