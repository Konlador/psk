import React from "react";
import PropTypes from "prop-types";
import { LeftSidebar } from "./Sidebars/LeftSidebar";
import BorderLinearProgress from "../Loaders/BorderLinearProgress";
import withUploadLoader from "../Loaders/withUploadLoader";
import "./layout.scss";

const UploadLoader = withUploadLoader(BorderLinearProgress);

export const Layout = (props) => {
  return (
    <div className="layout">
      <LeftSidebar />
      <div className="layout__loader">
        <UploadLoader />
      </div>
      <main className="layout__main">{props.children}</main>
    </div>
  );
};

Layout.propTypes = { children: PropTypes.node, name: PropTypes.string };
