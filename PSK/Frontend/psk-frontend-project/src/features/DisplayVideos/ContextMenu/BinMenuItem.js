import React, { useState, useEffect } from 'react';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import { useDispatch, useSelector } from 'react-redux';
import useErrorStyles from "./useErrorStyles";
import { binVideo, updateBin, resetBin } from '../videosSlice';
import CircularProgress from '@material-ui/core/CircularProgress';
import { REQUEST_STATUS } from '../../../common/constants';


const BinMenuItem = ({ video, isOpen, close }) => { 
  const classes = useErrorStyles();
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const binStatus = useSelector((state) => state.videos.binVideoStatus);
  const binError = useSelector((state) => state.videos.binVideoError);

  useEffect(() => {
    setOpen(isOpen);
    return () => dispatch(resetBin());
  }, [isOpen]);


  const handleClose = () => {
    setOpen(false);
    close();
  };


  const handleBin = (e) => {
    //TODO: not working when error happens
    dispatch(binVideo(video.id))
        .then(dispatch(updateBin(video.id)));
    handleClose();
    e.preventDefault();
  }

  return (
    <div>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <form onSubmit={handleBin}>
          <DialogContent>
            <DialogContentText>
                Do you really want to move {video.name} to bin?
            </DialogContentText>
            <DialogContentText className={classes.error}>
            {binError && binError}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
          {binStatus !== REQUEST_STATUS.loading &&
            <Button onClick={handleClose} color="primary">
              No
            </Button>
          }
            <Button type="submit" color="primary" disabled={binStatus === REQUEST_STATUS.loading}>
              {binStatus === REQUEST_STATUS.loading ? <CircularProgress /> : 'Yes'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}

export default BinMenuItem;