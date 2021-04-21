import React from "react";
import PropTypes from "prop-types";
import { Navbar } from "./Navbar/Navbar";
import Footer from "./Footer/Footer";
import "./layout.scss";
import { LeftSidebar } from "./Sidebars/LeftSidebar";
import { RightSidebar } from "./Sidebars/RightSidebar";
export const Layout = (props) => {
  return (
    <div className="layout">
      <Navbar name={props.name} className="layout__nav" />
      <LeftSidebar></LeftSidebar>
      {/* <RightSidebar></RightSidebar> */}
      <main className="layout__main"> {props.children}</main>
      {/* <Footer className="layout__footer"></Footer> */}
    </div>
  );
};
Layout.propTypes = { children: PropTypes.node, name: PropTypes.string };
