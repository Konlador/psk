import React from "react";
import PropTypes from "prop-types";
import CssBaseline from "@material-ui/core/CssBaseline";
import { Navbar } from "./Navbar/Navbar";
// import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import { BottomNavigation } from "@material-ui/core";
import Breadcrumbs from "./Breadcrumbs/Breadcrumbs";

// import { Header } from "./Header/Header";
// import { Footer } from "./Footer/Footer";
import "./layout.scss";

// import { Navbar } from "./Navbar/Navbar";

export const Layout = (props) => {
  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="lg">
        <Navbar name={props.name}></Navbar>
        <main-area>
          {" "}
          <Breadcrumbs></Breadcrumbs>
          {props.children}
        </main-area>
        <BottomNavigation></BottomNavigation>
      </Container>
    </React.Fragment>
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
