import React from "react";
import { Layout } from "../../components/Layout/Layout";
import { VideosList } from "../../features/DisplayVideos/VideosList";
import "./videosPage.scss";

function VideosPage() {
  return (
    <>
      <Layout name="VIDEOS">
        <VideosList />
      </Layout>
    </>
  );
}

export default VideosPage;