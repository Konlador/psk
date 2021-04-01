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
import LinearProgress from '@material-ui/core/LinearProgress';
import { useSelector, useDispatch } from 'react-redux';
import { getAllVideos, requestMoreVideos } from './videosSlice';
import { COLUMNS }from './VideoConstants';
import { VideoRow } from './VideoRow';

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  container: {
    maxHeight: '60vh',
  },
});

// for now rows per page has no effect
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
    if (videoStatus === 'idle') {
      dispatch(getAllVideos({page, ROWS_PER_PAGE}));
    }
  }, [dispatch, page, videoStatus]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    dispatch(requestMoreVideos(page, ROWS_PER_PAGE));
  };

  let status;
  let rows;

  if (videoStatus === 'loading') {
    status = <LinearProgress />
  } else if (videoStatus === 'succeeded') {
    rows = videos.map((video) => (<VideoRow video={video}/>));
  } else if (videoStatus === 'failed') {
    status = <Alert severity="error">{error}</Alert>
  }

  return (
    <Paper className={classes.root}>
      {status}
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
              </TableRow>
            </TableHead>
            <TableBody>
              {rows}
            </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[]}
        component="div"
        count={-1}
        rowsPerPage={ROWS_PER_PAGE}
        page={page}
        onChangePage={handleChangePage}
        labelDisplayedRows={({ from, to, count }) => `Displaying videos ${from}-${to}`}
      />
    </Paper>
  );
};