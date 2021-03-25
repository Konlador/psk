import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import { Layout } from "../../components/Layout/Layout";
import { DisplayVideos } from "../../features/DisplayVideos/DisplayVideos";
import "./videosPage.scss";

function VideosPage() {
  return (
    <>
      <React.Fragment>
        <CssBaseline />
        <Container maxWidth="lg">
          <Layout name="VIDEOS">
            <DisplayVideos></DisplayVideos>
          </Layout>
        </Container>
      </React.Fragment>
    </>
  );
}

export default VideosPage;