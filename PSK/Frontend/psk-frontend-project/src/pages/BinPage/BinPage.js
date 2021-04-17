import React from "react";
import { Layout } from "../../components/Layout/Layout";
import { DisplayVideos } from "../../features/DisplayVideos/DisplayVideos";
import "./binPage.scss";

function BinPage() {
  return (
    <>
      <Layout>
        <DisplayVideos fileStatus={[2]}></DisplayVideos>
      </Layout>
    </>
  );
}

export default BinPage;
