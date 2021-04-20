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
import { DataGrid } from "@material-ui/data-grid";

import PropTypes from "prop-types";
import "./displayVideos.scss";

const useStyles = makeStyles({
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
  } 

  const dataColumns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "name", width: 130 },
    { field: "timeCreated", headerName: "timeCreated", width: 260 },
    {
      field: "size",
      headerName: "size",
      type: "number",
      width: 90,
      // format: (value) => {
      //   const divider = 1024;
      //   const metrics = ['B', 'KB', 'MB', 'GB', 'TB'];

      //   let possibleReduceCount = metrics.length-1;
      //   while(value >= divider && possibleReduceCount > 0){
      //     value = value/divider;
      //     possibleReduceCount--;
      //   }

      //   const formattedValue = (value.toString().indexOf('.') !== -1 ? value.toFixed(2) : value) + ' ' + metrics[metrics.length - possibleReduceCount-1];
      //   return formattedValue;
      // }
    },
    // {
    //   field: "fullName",
    //   headerName: "Full name",
    //   description: "This column has a value getter and is not sortable.",
    //   sortable: false,
    //   width: 160,
    //   valueGetter: (params) =>
    //     `${params.getValue("firstName") || ""} ${
    //       params.getValue("lastName") || ""
    //     }`,
    // },
  ];
  
  const dataRows = [
    { id: 1, lastName: "Snow", firstName: "Jon", age: 35 },
    { id: 2, lastName: "Lannister", firstName: "Cersei", age: 42 },
    { id: 3, lastName: "Lannister", firstName: "Jaime", age: 45 },
    { id: 4, lastName: "Stark", firstName: "Arya", age: 16 },
    { id: 5, lastName: "Targaryen", firstName: "Daenerys", age: null },
    { id: 6, lastName: "Melisandre", firstName: null, age: 150 },
    { id: 7, lastName: "Clifford", firstName: "Ferrara", age: 44 },
    { id: 8, lastName: "Frances", firstName: "Rossini", age: 36 },
    { id: 9, lastName: "Roxie", firstName: "Harvey", age: 65 },
  ];
  // susideliot data
  // double click - context menu onRowDoubleClick
function handleClick(e) {
    e.preventDefault();
    console.log('The link was clicked.');
  }
  return (

 <div className="display-videos-table">
      <div className={classes.root}>
        {error && <Alert severity="error">{error}</Alert>}
        {!isLoading && !error ? (
          <div>
                     <div style={{ height: 650, width: '100%' }}>
      <DataGrid rows={videos} columns={dataColumns} pageSize={10} checkboxSelection  onRowDoubleClick={handleClick}/>
        </div>
          </div>
        ) : isLoading ? (
          <CircularProgress />
        ) : null}
      </div>
    </div>);
};
DisplayVideos.propTypes = { fileStatus: PropTypes.array };
DisplayVideos.defaultProps = {
  fileStatus: [0, 1],
};
