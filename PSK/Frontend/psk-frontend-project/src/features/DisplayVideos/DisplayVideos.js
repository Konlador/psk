import { React, useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import MuiAlert from '@material-ui/lab/Alert';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useSelector, useDispatch } from 'react-redux';
import { getAllVideos } from './videosSlice';
import { COLUMNS }from './VideoConstants';
import { VideoRow } from './VideoRow';
import { REQUEST_STATUS } from '../../common/constants';

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  container: {
    maxHeight: '60vh',
  },
});

const ROWS_PER_PAGE = 10;

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export const DisplayVideos = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const videos = useSelector((state) => state.videos.items);
  const videoStatus = useSelector(state => state.videos.status);
  const error = useSelector(state => state.videos.error);
  const [page, setPage] = useState(0);


  useEffect(() => {
    if (videoStatus === REQUEST_STATUS.idle) {
      dispatch(getAllVideos());
    }
  }, [dispatch, videoStatus]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  let isLoading = false;
  let rows;

  if (videoStatus === REQUEST_STATUS.loading) {
    isLoading = true;
  } else if (videoStatus === REQUEST_STATUS.succeded) {
    rows = videos.slice(page * ROWS_PER_PAGE, page * ROWS_PER_PAGE + ROWS_PER_PAGE)
                 .map((video) => (<VideoRow video={video}/>));
  }


  return (
    <div className={classes.root}>
      {error && <Alert severity="error">{error}</Alert>}
      {!isLoading && !error ? 
      <div>
        <TableContainer className={classes.container}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
                <TableRow>
                  {COLUMNS.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth, display: column.display }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                  <TableCell
                  >
                    Download
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows}
              </TableBody>
          </Table>
        </TableContainer>
     `` <TablePagination
          rowsPerPageOptions={[]}
          component="div"
          count={videos.length}
          rowsPerPage={ROWS_PER_PAGE}
          page={page}
          onChangePage={handleChangePage}
          labelDisplayedRows={({ from, to, count }) => `Displaying videos ${from}-${to} of ${count}`}
        />
      </div> : isLoading ? <CircularProgress /> : null}
    </div>
  );
};