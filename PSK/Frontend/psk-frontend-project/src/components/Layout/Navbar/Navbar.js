import React from "react";
import PropTypes from "prop-types";

import { Toolbar, AppBar } from "@material-ui/core";

import "./navbar.scss";

export const Navbar = (props) => {
  return (
    <div className="navbar">
      <AppBar position="static" className="navbar__appbar">
        <Toolbar className="navbar__toolbar">
          <a href="/" className="navbar__link">
            Home
          </a>
          <a href="/upload" className="navbar__link">
            Upload
          </a>

          <a href="/videos" className="navbar__link">
            Your videos
          </a>
        </Toolbar>
      </AppBar>
    </div>
  );
};
Navbar.propTypes = { name: PropTypes.string };
