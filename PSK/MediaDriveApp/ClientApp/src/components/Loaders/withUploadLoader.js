import React from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

const withUploadLoader = (Component) => () => {
    const location = useLocation();
    const isUploading = useSelector((state) => state.upload.isUploading);
    const progress = useSelector((state) => state.upload.progress);

    if(isUploading && location.pathname !== "/upload") {
      return <Component variant="buffer" value={progress} valueBuffer={0} />;
    }

    return null;
  };

export default withUploadLoader;

