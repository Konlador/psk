import React from "react";
import PropTypes from "prop-types";
import "./leftsidebar.scss";
import { Limiter } from "./Limiter";
export const LeftSidebar = (props) => {
  return (
    <div className="left-sidebar">
      <div className="left-sidebar__content">
        <Limiter value="30"></Limiter>
        <br />
        <span className="left-sidebar__nof">Number of Files: 69420</span>
      </div>
    </div>
  );
};
