import React from "react";
import { Layout } from "../../components/Layout/Layout";
import { DisplayVideos } from "../../features/DisplayVideos/DisplayVideos";
import "./binPage.scss";

function BinPage() {
  return (
    <>
      <Layout>
        <DisplayVideos queryParams={{isTrashedExplicitly: true, states:  [0, 1]}} />
      </Layout>
    </>
  );
}

export default BinPage;
