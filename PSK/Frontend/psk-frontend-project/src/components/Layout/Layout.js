import React from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { Navbar } from "./Navbar/Navbar";
import { LeftSidebar } from "./Sidebars/LeftSidebar";
import BorderLinearProgress from "../UploadFiles/BorderLinearProgress";
import "./layout.scss";

export const Layout = (props) => {
  const location = useLocation();
  const isUploading = useSelector((state) => state.upload.isUploading);
  const progress = useSelector((state) => state.upload.progress);

  return (
    <div className="layout">
      <Navbar name={props.name} className="layout__nav" />
      <LeftSidebar />
      {isUploading && location.pathname !== "/upload" ? (
        <BorderLinearProgress
          variant="buffer"
          value={progress}
          valueBuffer={0}
        />
      ) : null}
      <main className="layout__main"> {props.children}</main>
    </div>
  );
};

Layout.propTypes = { children: PropTypes.node, name: PropTypes.string };
