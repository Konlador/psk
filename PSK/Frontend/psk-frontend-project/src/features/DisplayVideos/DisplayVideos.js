import { React, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import MuiAlert from "@material-ui/lab/Alert";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useSelector, useDispatch } from "react-redux";
import { getAllVideos } from "./videosSlice";
import { COLUMNS } from "./VideoConstants";
import { VideoRow } from "./VideoRow";
import { REQUEST_STATUS } from "../../common/constants";
import PropTypes from "prop-types";
import "./displayVideos.scss";

const useStyles = makeStyles({
  // root: {
  //   width: '100%',
  // },
  container: {
    maxHeight: "60vh",
  },
});

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export const DisplayVideos = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const videos = useSelector((state) => state.videos.items);
  const videoStatus = useSelector((state) => state.videos.status);
  const error = useSelector((state) => state.videos.error);

  useEffect(() => {
    if (videoStatus === REQUEST_STATUS.idle) {
      dispatch(getAllVideos({ states: props.fileStatus }));
    }
  }, [dispatch, videoStatus, props.fileStatus]);

  let isLoading = false;
  let rows;

  if (videoStatus === REQUEST_STATUS.loading) {
    isLoading = true;
  } else if (videoStatus === REQUEST_STATUS.succeded) {
    rows = videos.map((video) => <VideoRow video={video} />);
  }

  return (
    <div className="display-videos-table">
      <div className={classes.root}>
        {error && <Alert severity="error">{error}</Alert>}
        {!isLoading && !error ? (
          <div>
            <TableContainer className={classes.container}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    {COLUMNS.map((column) => (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        style={{
                          minWidth: column.minWidth,
                          display: column.display,
                        }}
                      >
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>{rows}</TableBody>
              </Table>
            </TableContainer>
          </div>
        ) : isLoading ? (
          <CircularProgress />
        ) : null}
      </div>
    </div>
  );
};
DisplayVideos.propTypes = { fileStatus: PropTypes.array };
DisplayVideos.defaultProps = {
  fileStatus: [0, 1],
};
