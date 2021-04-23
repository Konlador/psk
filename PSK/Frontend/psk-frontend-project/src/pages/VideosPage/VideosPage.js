import React from "react";
import { Layout } from "../../components/Layout/Layout";
import { DisplayVideos } from "../../features/DisplayVideos/DisplayVideos";
import "./videosPage.scss";

function VideosPage() {
  return (
    <>
      <Layout name="VIDEOS">
        <DisplayVideos />
      </Layout>
    </>
  );
}

export default VideosPage;