import React from "react";
import {
  Box,
  Typography,
} from "@material-ui/core";
import { useSelector } from "react-redux";

const withUploadLoader = (Component) => () => {
    const isUploading = useSelector((state) => state.upload.isUploading);
    const progress = useSelector((state) => state.upload.progress);
    const message = useSelector((state) => state.upload.message);

    if(isUploading) {
      return (
        <Box
          className="mb25"
          display="flex"
          alignItems="center"
          style={{ marginTop: "-1vw", marginRight: "5px", marginLeft: "5px" }}
        >
          <Box width="100%">
            <Typography
              variant="body2"
              color="textSecondary"
              align="center"
            >{`${message} ${progress}%`}</Typography>
            <Component variant="buffer" value={progress} valueBuffer={0} />
          </Box>
        </Box>
      );
    }

    return null;
  };

export default withUploadLoader;

