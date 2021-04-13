import React, { Component } from "react";
import LinearProgress from "@material-ui/core/LinearProgress";
import {
  Box,
  Typography,
  Button,
  ListItem,
  withStyles,
} from "@material-ui/core";
import "./uploadFiles.scss";
import UploadService from "../../services/upload-files.service";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import FileCopyRoundedIcon from "@material-ui/icons/FileCopyRounded";
//------------LINEAR PROGRESS-------------------------------
const BorderLinearProgress = withStyles((theme) => ({
  root: {
    height: 15,
    borderRadius: 5,
  },
  colorPrimary: {
    backgroundColor: "#EEEEEE",
  },
  bar: {
    borderRadius: 5,
    backgroundColor: "#1a90ff",
  },
}))(LinearProgress);
//-----------------------------------------------------------

export default class UploadFiles extends Component {
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
      fileInfos: [],
    };
  }

  // componentDidMount() {
  //   UploadService.getFiles().then((response) => {
  //     this.setState({
  //       fileInfos: response.data,
  //     });
  //   });
  // }

  selectFile(event) {
    this.setState({
      selectedFiles: event.target.files,
    });
  }
  //---------------------UPLOAD---------------------------

  upload() {
    let currentFile = this.state.selectedFiles[0];

    this.setState({
      progress: 0,
      currentFile: currentFile,
    });

    var transaction;

    UploadService.upload(currentFile)
      .then((response) => {
        console.log("Responsas ", response);
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
        UploadService.uploadFile(response.data, currentFile);
        this.setState({
          message: response.data.message,
          isError: false,
        });
      })
      // .then((files) => {
      //   this.setState({
      //     fileInfos: files.data,
      //   });
      // })

      .then((response) => {
        UploadService.commitUpload(transaction.id);
        this.setState({
          message: ` ${response} File uploaded successfully `,
        });
      })
      .catch((error) => {
        console.log(error.response);
        this.setState({
          progress: 0,
          message: `Could not upload the file! error msg: ${error}`,
          currentFile: undefined,
          isError: true,
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
      fileInfos,
      isError,
    } = this.state;

    return (
      <div className="mg20">
        {currentFile && (
          <Box className="mb25" display="flex" alignItems="center">
            <Box width="100%" mr={1}>
              <BorderLinearProgress
                variant="buffer"
                value={progress}
                valueBuffer={1}
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

        <label htmlFor="btn-upload">
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
        </label>
        <div className="file-name">
          {selectedFiles && selectedFiles.length > 0
            ? selectedFiles[0].name
            : null}
        </div>
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

        <Typography
          variant="subtitle2"
          className={`upload-message ${isError ? "error" : ""}`}
        >
          {message}
        </Typography>

        <Typography variant="h6" className="list-header">
          Your File
        </Typography>
        {/* <ul className="list-group">
          {fileInfos &&
            fileInfos.map((file, index) => (
              <ListItem divider key={index}>
                <a href={file.url}>{file.name}</a>
              </ListItem>
            ))}
        </ul> */}
      </div>
    );
  }
}
