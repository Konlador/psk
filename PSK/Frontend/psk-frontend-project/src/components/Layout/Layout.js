import React from "react";
import PropTypes from "prop-types";
import { Navbar } from "./Navbar/Navbar";
import Footer from "./Footer/Footer";
import "./layout.scss";

export const Layout = (props) => {
  return (
    <div className="layout">
      <Navbar name={props.name} className="layout__nav" />
      <main className="layout__main"> {props.children}</main>
      <Footer className="layout__footer"></Footer>
    </div>
  );
};
Layout.propTypes = { children: PropTypes.node, name: PropTypes.string };

// <div className="main-container">
//   {/* <Navbar /> */}
//   <div className="wrapper">
//     {/* <Header />
//     <main className="content-container">{children}</main>
//     <Footer /> */}
//   </div>
// </div>
