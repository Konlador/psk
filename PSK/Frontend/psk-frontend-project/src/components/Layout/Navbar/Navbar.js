import React from "react";
import PropTypes from "prop-types";
import { Toolbar, AppBar } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import BackupRoundedIcon from "@material-ui/icons/BackupRounded";
import VideoLibraryIcon from "@material-ui/icons/VideoLibrary";
import "./navbar.scss";

export const Navbar = (props) => {
  return (
    <div className="navbar">
      <AppBar position="static" className="navbar__appbar">
        <Toolbar className="navbar__toolbar">
          <a href="/videos" className="navbar__link">
            <figure>
              <VideoLibraryIcon />
              <figcaption>Your videos</figcaption>
            </figure>
          </a>

          <a href="/upload" className="navbar__link">
            <figure>
              <BackupRoundedIcon />
              <figcaption>Upload</figcaption>
            </figure>
          </a>

          <a href="/bin" className="navbar__link">
            <figure>
              <DeleteIcon />
              <figcaption>Bin</figcaption>
            </figure>
          </a>
        </Toolbar>
      </AppBar>
    </div>
  );
};
Navbar.propTypes = { name: PropTypes.string };
