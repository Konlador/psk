import React, { Component } from "react";
import { Box, Typography, Button } from "@material-ui/core";
import "./uploadFiles.scss";
import UploadService from "../../services/upload-files.service";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import BorderLinearProgress from "../Loaders/BorderLinearProgress";
import { connect } from "react-redux";
import {
  start,
  increaseProgress,
  reset as resetUpload,
} from "../../Redux/uploadSlice";
import { getVideo } from "../../Redux/videosSlice";
import { reset as resetLimiters } from "../../Redux/limitersSlice";
import { DropzoneAreaBase } from "material-ui-dropzone";
class UploadFiles extends Component {
  constructor(props) {
    super(props);
    this.selectFile = this.selectFile.bind(this);
    this.upload = this.upload.bind(this);

    this.state = {
      selectedFiles: undefined,
      currentFile: undefined,
      progress: 0,
      message: "",
      isError: false,
      fileAdded: false,
    };
  }

  selectFile(file) {
    this.setState({
      selectedFiles: file,
      // fileAdded: true,
    });
  }

  // async
  upload() {
    let currentFile = this.state.selectedFiles[0];

    this.setState({
      progress: 0,
      currentFile: currentFile,
      fileInfos: currentFile.name,
      message: "Initiating upload",
    });

    this.props.start();

    var transaction;
    let newFileId;

    UploadService.startTransaction(currentFile.file)
      .then((response) => {
        newFileId = response.data.storageItemId;
        this.setState({
          progress: 33,
        });

        this.props.increaseProgress(33);
        transaction = response.data;
        return UploadService.uploadFile(response.data, currentFile.file);
      })
      .then((response) => {
        this.setState({
          message: "Uploading started",
          isError: false,
          progress: 66,
        });

        this.props.increaseProgress(66);

        return UploadService.commitUpload(transaction.id);
      })
      .then((response) => {
        this.props.increaseProgress(100);
        this.props.resetLimiters();

        this.setState({
          message: "Your file has been successfully uploaded",
          isError: false,
          progress: 100,
        });

        if (window.location.pathname === "/videos") {
          this.props.getVideo(newFileId);
        }
      })
      .catch((error) => {
        console.log(error.response);
        this.props.resetUpload();
        this.setState({
          progress: 0,
          message: `Could not upload the file! error msg: ${error}`,
          currentFile: undefined,
          isError: true,
          fileInfos: "",
          selectedFiles: undefined,
        });
      });

    this.setState({
      selectedFiles: undefined,
    });
  }

  //------------------------------------------------------
  render() {
    const {
      selectedFiles,
      currentFile,
      progress,
      message,
      isError,
      fileAdded,
    } = this.state;

    return (
      <div className="mg20">
        {currentFile && (
          <Box className="mb25" display="flex" alignItems="center">
            <Box width="100%" mr={1}>
              <BorderLinearProgress
                variant="buffer"
                value={progress}
                valueBuffer={0}
              />
            </Box>
            <Box minWidth={35}>
              <Typography
                variant="body2"
                color="textSecondary"
              >{`${progress}%`}</Typography>
            </Box>
          </Box>
        )}
        {/* {!fileAdded && ( */}
        <DropzoneAreaBase
          acceptedFiles={["video/*"]}
          dropzoneText={"Drag and drop a video here or click"}
          filesLimit={1}
          onAdd={this.selectFile}
          maxFileSize={1024 * 1024 * 100}
          showFileNames={true}
          showFileNamesInPreview={true}
          alertSnackbarProps={{
            anchorOrigin: { vertical: "bottom", horizontal: "right" },
          }}
        />
        {/* )} */}
        <br />
        <br />
        {/* {!fileAdded && ( */}
        <button
          className="btn-upload"
          disabled={!selectedFiles}
          onClick={this.upload}
        >
          Upload
        </button>
        {/* )} */}

        <div className="file-name">
          {selectedFiles && selectedFiles.length > 0
            ? selectedFiles[0].file.name
            : null}
        </div>

        <Typography
          variant="subtitle2"
          className={`upload-message ${isError ? "error" : ""}`}
        >
          {message}
        </Typography>
      </div>
    );
  }
}

const mapDispatchToProps = {
  start,
  increaseProgress,
  resetUpload,
  resetLimiters,
  getVideo,
};

export default connect(null, mapDispatchToProps)(UploadFiles);
