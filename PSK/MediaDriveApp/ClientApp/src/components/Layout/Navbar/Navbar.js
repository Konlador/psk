import React from "react";
import PropTypes from "prop-types";
import { Toolbar, AppBar } from "@material-ui/core";
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import DeleteIcon from "@material-ui/icons/Delete";
import BackupRoundedIcon from "@material-ui/icons/BackupRounded";
import VideoLibraryIcon from "@material-ui/icons/VideoLibrary";
import "./navbar.scss";

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
    "&:hover": {
      backgroundColor: "#3f51b5"
  }
  },
}));

export const Navbar = (props) => {
  const classes = useStyles();

  return (
    <div className="navbar">
      <AppBar position="static" className="navbar__appbar">
        <Toolbar className="navbar__toolbar">
          <Button color="inherit" className={`navbar__link ${classes.root}`} component={Link} to="/videos">
            <figure>
              <VideoLibraryIcon />
              <figcaption>Your videos</figcaption>
            </figure>
          </Button>

          <Button color="inherit" className={`navbar__link ${classes.root}`} component={Link} to="/upload">
            <figure>
              <BackupRoundedIcon />
              <figcaption>Upload</figcaption>
            </figure>
          </Button>

          <Button color="inherit" className={`navbar__link ${classes.root}`} component={Link} to="/bin">
            <figure>
              <DeleteIcon />
              <figcaption>Bin</figcaption>
            </figure>
          </Button>
        </Toolbar>
      </AppBar>
    </div>
  );
};
Navbar.propTypes = { name: PropTypes.string };