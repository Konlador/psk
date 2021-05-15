import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";

// import "./uploadFile.scss";
const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  input: {
    display: "none",
  },
}));

export const UploadFile = () => {
  const classes = useStyles();

  return (
    <div className="upload-file">
      <input
        accept="video/*"
        className={classes.input}
        id="upload-file-button"
        // multiple
        type="file"
      />
      <label htmlFor="upload-file-button">
        <Button
          variant="contained"
          color="default"
          component="span"
          startIcon={<CloudUploadIcon />}
        >
          Upload video
        </Button>
      </label>
    </div>
  );
};
