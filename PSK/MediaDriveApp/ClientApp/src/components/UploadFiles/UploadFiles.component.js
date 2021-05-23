import React, { Component } from "react";
import { Box, Typography, Button } from "@material-ui/core";
import "./uploadFiles.scss";
import UploadService from "../../services/upload-files.service";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import FileCopyRoundedIcon from "@material-ui/icons/FileCopyRounded";
import { Snackbars } from "../Layout/Snackbars/Snackbars";
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
      fileName: "",
      uploadedLink: "",
      showSnackbar: false,
    };
  }

  selectFile(file) {
    this.setState({
      selectedFiles: file,
    });
  }
  // selectFile(event) {
  //   console.log(event);
  //   this.setState({
  //     selectedFiles: event.target.files,
  //   });
  // }
  //---------------------UPLOAD---------------------------

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

    UploadService.startTransaction(currentFile)
      .then((response) => {
        newFileId = response.data.storageItemId;
        this.setState({
          progress: 33,
        });

        this.props.increaseProgress(33);
        // UploadService.uploadToURI(
        //   response.data.uploadUri,
        //   currentFile,
        //   (event) => {
        //     this.setState({
        //       progress: Math.round((100 * event.loaded) / event.total),
        //     });
        //   }
        // );
        transaction = response.data;
        return UploadService.uploadFile(response.data, currentFile);
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
      fileName,
      isError,
      uploadedLink,
      //  showSnackbar,
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
        {/* <label htmlFor="btn-upload">
          <input
            id="btn-upload"
            name="btn-upload"
            style={{ display: "none" }}
            type="file"
            onChange={this.selectFile}
            accept="video/*"
          />
          <Button
            className="btn-choose"
            variant="outlined"
            component="span"
            startIcon={<FileCopyRoundedIcon />}
          >
            Choose Video File
          </Button>
        </label> */}
        {/*   
        <br></br>
        <br></br> */}
        <DropzoneAreaBase
          acceptedFiles={["video/*"]}
          dropzoneText={"Drag and drop a video here or click"}
          filesLimit={1}
          // Icon={<CloudUploadIcon />}
          onAdd={this.selectFile}
          maxFileSize={1024 * 1024 * 100}
          showFileNames={true}
          showFileNamesInPreview={true}
          alertSnackbarProps={{
            anchorOrigin: { vertical: "bottom", horizontal: "right" },
          }}
        />
        <br />
        <br />
        <Button
          className="btn-upload"
          color="primary"
          variant="contained"
          component="span"
          disabled={!selectedFiles}
          onClick={this.upload}
          startIcon={<CloudUploadIcon />}
        >
          Upload
        </Button>
        <div className="file-name">
          {selectedFiles && selectedFiles.length > 0
            ? selectedFiles[0].name
            : null}
        </div>
        <Typography
          variant="subtitle2"
          className={`upload-message ${isError ? "error" : ""}`}
        >
          {message}
        </Typography>
        <br></br>
        <a href="/videos" className="link_to_videos">
          {uploadedLink}
        </a>
        <Typography variant="h6" className="list-header">
          {fileName}
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
