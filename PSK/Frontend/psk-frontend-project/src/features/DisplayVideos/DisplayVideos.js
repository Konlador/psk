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
import { MockVideoApi } from './MockVideoApi';

const columns = [
  {
    id: 'title',
    label: 'Title',
    minWidth: 170,
    align: 'left',
  },
  {
    id: 'size',
    label: 'Size',
    minWidth: 170,
    align: 'left',
  },
  {
    id: 'uploadDate',
    label: 'Upload date',
    minWidth: 170,
    align: 'left'
  }
];

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  container: {
    maxHeight: '70vh',
  },
});

const ROWS_PER_PAGE = 30;
const videoApi = new MockVideoApi();

export const DisplayVideos = () => {
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState([]);

  useEffect(() => {
   setRows(videoApi.getVideos(0, ROWS_PER_PAGE));
  }, []);


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    setRows(videoApi.getVideos(newPage, ROWS_PER_PAGE));
  };

  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
            {rows.map((row) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.title}>
                  {columns.map((column) => {
                    const value = row[column.id];
                    return (
                      <TableCell key={column.id} align={column.align}>
                        {column.format && typeof value === 'number' ? column.format(value) : value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[]}
        component="div"
        count={videoApi.getVideosCount()}
        rowsPerPage={ROWS_PER_PAGE}
        page={page}
        onChangePage={handleChangePage}
        labelDisplayedRows={({ from, to, count }) => `Displaying videos ${from}-${to} of total ${count}`}
      />
    </Paper>
  );
};