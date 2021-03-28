import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import { Layout } from "../../components/Layout/Layout";
import { DisplayVideos } from "../../features/DisplayVideos/DisplayVideos";
import "./videosPage.scss";

function VideosPage() {
  return (
    <>
      <Layout name="VIDEOS">
        <DisplayVideos></DisplayVideos>
      </Layout>
    </>
  );
}

export default VideosPage;