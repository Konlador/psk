import React from "react";
import {
  Box,
  Typography,
} from "@material-ui/core";
import { useSelector } from "react-redux";

const withUploadLoader = (Component) => () => {
    const isUploading = useSelector((state) => state.upload.isUploading);
    const progress = useSelector((state) => state.upload.progress);

    if(isUploading) {
      return  (<Box className="mb25" display="flex" alignItems="center">
      <Box width="100%" mr={1}>
        <Component variant="buffer" value={progress} valueBuffer={0} />
      </Box>
      <Box minWidth={35}>
        <Typography
          variant="body2"
          color="textSecondary"
        >{`${progress}%`}</Typography>
      </Box>
    </Box>)
    }

    return null;
  };

export default withUploadLoader;

