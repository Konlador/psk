import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import { Navbar } from "../../components/Layout/Navbar/Navbar";
// import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import { Layout } from "../../components/Layout/Layout";
import { UploadFile } from "../../features/Upload/UploadFile";
import "./uploadPage.scss";

function UploadPage() {
  return (
    <>
      <React.Fragment>
        <CssBaseline />
        <Container maxWidth="lg">
          <Layout name="UPLOAD FILES">
            <UploadFile></UploadFile>
          </Layout>
        </Container>
      </React.Fragment>
    </>
  );
}

export default UploadPage;
