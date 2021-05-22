import React, { useState } from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import MuiAlert from '@material-ui/lab/Alert';
import CloseIcon from '@material-ui/icons/Close';
import PropTypes from "prop-types";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function PositionedSnackbar({ open, message, severity, vertical, horizontal, reset }) {
  const [state, setState] = useState({ open });

  const handleClose = () => {
    if (reset !== null) {
      reset();
    }
    setState({ open: false });
  };

  return (
    <div>
      <Snackbar
        autoHideDuration={3000}
        anchorOrigin={{ vertical, horizontal }}
        open={state.open}
        onClose={handleClose}
        key={vertical + horizontal}
        action={
          <React.Fragment>
            <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </React.Fragment>
        }
      >
        <Alert onClose={handleClose} severity={severity}>
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
}

PositionedSnackbar.propTypes = { 
  open: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired,
  severity: PropTypes.string.isRequired,
  reset: PropTypes.func,
  vertical: PropTypes.string,
  horizontal: PropTypes.string,
};

PositionedSnackbar.defaultProps = {
  vertical: 'bottom',
  horizontal: 'right',
  reset: null,
};