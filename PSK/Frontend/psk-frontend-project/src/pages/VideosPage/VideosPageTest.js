import React from "react";
import { Layout } from "../../components/Layout/Layout";
import { DisplayVideosTest } from "../../features/DisplayVideos/DisplayVideosTest";
import "./videosPage.scss";

function VideosPage() {
  return (
    <>
      <Layout name="VIDEOS">
        <DisplayVideosTest></DisplayVideosTest>
      </Layout>
    </>
  );
}

export default VideosPage;