import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import VideoPlayer from './Stream/VideoPlayer';

const styles = (theme) => ({
    root: {
      margin: 0,
      padding: theme.spacing(2),
    },
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});
  
const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);
 

const PlayMenuItem = ({itemId, name, onClick}) => { 
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    onClick();
  };


  return (
    <div>
      <MenuItem onClick={handleOpen}>Play</MenuItem>
      <Dialog onClose={handleClose} 
      aria-labelledby="customized-dialog-title" open={open} fullWidth={true} maxWidth="sm">
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          {name}
        </DialogTitle>
        <DialogContent dividers>
          <VideoPlayer name={name} itemId={itemId}/>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default PlayMenuItem;