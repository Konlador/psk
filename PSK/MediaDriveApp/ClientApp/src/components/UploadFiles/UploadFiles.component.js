import React, { Component } from "react";
import { Box, Typography } from "@material-ui/core";
import "./uploadFiles.scss";
import UploadService from "../../services/upload-files.service";

import { connect } from "react-redux";
import {
  start,
  increaseProgress,
  reset as resetUpload,
  reject as rejectUpload,
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
      selectedFiles: undefined,
    });

    this.props.start(currentFile.file.name);

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
          isError: false,
          progress: 66,
        });

        this.props.increaseProgress(66);

        return UploadService.commitUpload(transaction.id);
      })
      .then((response) => {
        if (window.location.pathname === "/videos") {
          this.props.getVideo(newFileId);
        }

        this.props.increaseProgress(100);
        this.props.resetLimiters();

        this.setState({
          isError: false,
          progress: 100,
          currentFile: undefined,
          selectedFiles: undefined,
        });
      })
      .catch((error) => {
        this.props.rejectUpload();
        this.setState({
          progress: 0,
          currentFile: undefined,
          isError: true,
          fileInfos: "",
          selectedFiles: undefined,
        });
      });
  }

  //------------------------------------------------------
  render() {
    const {
      selectedFiles,
      currentFile,
      progress,
      isError,
      // fileAdded,
    } = this.state;

    return (
      <div className="mg20">
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
        <div className="file-name">
          {selectedFiles && selectedFiles.length > 0
            ? selectedFiles[0].file.name
            : null}
        </div>
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
      </div>
    );
  }
}

const mapDispatchToProps = {
  start,
  increaseProgress,
  resetUpload,
  rejectUpload,
  resetLimiters,
  getVideo,
};

export default connect(null, mapDispatchToProps)(UploadFiles);
