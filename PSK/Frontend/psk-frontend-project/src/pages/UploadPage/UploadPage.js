import React from "react";
import { Layout } from "../../components/Layout/Layout";
import { UploadFile } from "../../features/Upload/UploadFile";
import "./uploadPage.scss";

function UploadPage() {
  return (
    <>
      <Layout name="UPLOAD FILES">
        <UploadFile></UploadFile>
      </Layout>
    </>
  );
}

export default UploadPage;
