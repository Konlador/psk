import React from "react";
import PropTypes from "prop-types";
import "./leftsidebar.scss";
import { Limiter } from "./Limiter";
import DeleteIcon from "@material-ui/icons/Delete";
export const LeftSidebar = (props) => {
  return (
    <div className="left-sidebar">
      <div className="left-sidebar__content">
        <Limiter value={89}></Limiter>
        <br />
        <span className="left-sidebar__nof">69420mb/100000mb</span>
        <br />
        <span className="left-sidebar__nof">Number of Files: 69420</span>

        <a href="/bin" className="left-sidebar__link">
          <figure>
            <DeleteIcon />
            <figcaption>Deleted Files</figcaption>
          </figure>
        </a>
      </div>
    </div>
  );
};
