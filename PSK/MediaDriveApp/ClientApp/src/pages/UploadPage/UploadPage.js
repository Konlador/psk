import React from "react";
import { Layout } from "../../components/Layout/Layout";
import UploadFiles from "../../components/UploadFiles/UploadFiles.component";
import "./uploadPage.scss";

function UploadPage() {
  return (
    <>
      <Layout name="UPLOAD FILES">
        <UploadFiles></UploadFiles>
      </Layout>
    </>
  );
}

export default UploadPage;
