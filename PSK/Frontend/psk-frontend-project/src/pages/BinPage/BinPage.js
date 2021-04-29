import React from "react";
import { Layout } from "../../components/Layout/Layout";
import { VideosList } from "../../features/DisplayVideos/VideosList";
import "./binPage.scss";

function BinPage() {
  return (
    <>
      <Layout>
        <VideosList queryParams={{isTrashedExplicitly: true, states:  [0, 1]}} />
      </Layout>
    </>
  );
}

export default BinPage;
