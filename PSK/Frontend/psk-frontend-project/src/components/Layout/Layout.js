import React from "react";
import PropTypes from "prop-types";
import { Navbar } from "./Navbar/Navbar";
import "./layout.scss";
import { LeftSidebar } from "./Sidebars/LeftSidebar";
export const Layout = (props) => {
  return (
    <div className="layout">
      <Navbar name={props.name} className="layout__nav" />
      <LeftSidebar></LeftSidebar>
      <main className="layout__main"> {props.children}</main>
    </div>
  );
};
Layout.propTypes = { children: PropTypes.node, name: PropTypes.string };
