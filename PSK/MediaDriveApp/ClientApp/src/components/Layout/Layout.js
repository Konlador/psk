import React from "react";
import PropTypes from "prop-types";
import { Navbar } from "./Navbar/Navbar";
import { LeftSidebar } from "./Sidebars/LeftSidebar";
import BorderLinearProgress from "../Loaders/BorderLinearProgress";
import withUploadLoader from "../Loaders/withUploadLoader";
import "./layout.scss";
import useSnackbar from "./useSnackbar";

const UploadLoader = withUploadLoader(BorderLinearProgress);

export const Layout = (props) => {
  const snackbar = useSnackbar();

  let renderSnackbar = snackbar();
  return (
    <div className="layout">
      <Navbar name={props.name} className="layout__nav" />
      <LeftSidebar />
      <UploadLoader />
      <main className="layout__main"> {props.children}</main>
      {renderSnackbar}
    </div>
  );
};

Layout.propTypes = { children: PropTypes.node, name: PropTypes.string };